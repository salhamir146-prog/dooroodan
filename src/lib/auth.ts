// توابع امنیتی برای لاگین ادمین

const SESSION_TTL = 60 * 60 * 8; // ۸ ساعت

export interface AdminSession {
  phone: string;
  role: "admin";
  createdAt: number;
}

// ساخت JWT ساده (بدون کتابخانه)
async function base64UrlEncode(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(data);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

async function base64UrlDecode(str: string): Promise<string> {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

// امضای HMAC-SHA256
async function hmacSign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  let binary = "";
  const bytes = new Uint8Array(signature);
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

// ساخت JWT
export async function createJWT(
  payload: AdminSession,
  secret: string
): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = await base64UrlEncode(JSON.stringify(header));
  const encodedPayload = await base64UrlEncode(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = await hmacSign(data, secret);
  return `${data}.${signature}`;
}

// بررسی JWT
export async function verifyJWT(
  token: string,
  secret: string
): Promise<AdminSession | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const data = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = await hmacSign(data, secret);

    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(await base64UrlDecode(encodedPayload));

    // بررسی انقضا
    if (payload.exp && payload.exp < Date.now() / 1000) return null;

    return payload as AdminSession;
  } catch {
    return null;
  }
}

// ساخت Session ID
export function generateSessionId(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

// ذخیره Session توی KV
export async function createSession(
  kv: any,
  sessionId: string,
  data: AdminSession
): Promise<void> {
  await kv.put(`session:${sessionId}`, JSON.stringify(data), {
    expirationTtl: SESSION_TTL,
  });
}

// خواندن Session
export async function getSession(
  kv: any,
  sessionId: string
): Promise<AdminSession | null> {
  const data = await kv.get(`session:${sessionId}`);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

// حذف Session
export async function deleteSession(kv: any, sessionId: string): Promise<void> {
  await kv.delete(`session:${sessionId}`);
}

// ============ Rate Limiting ============

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60; // ۱۵ دقیقه

export async function checkRateLimit(
  kv: any,
  ip: string
): Promise<{ allowed: boolean; remaining: number; lockedUntil?: number }> {
  const key = `ratelimit:${ip}`;
  const data = await kv.get(key);

  if (!data) {
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }

  const parsed = JSON.parse(data);

  // اگه قفل شده
  if (parsed.lockedUntil && parsed.lockedUntil > Date.now()) {
    return {
      allowed: false,
      remaining: 0,
      lockedUntil: parsed.lockedUntil,
    };
  }

  // اگه زمان قفل تموم شده، ریست کن
  if (parsed.lockedUntil && parsed.lockedUntil <= Date.now()) {
    await kv.delete(key);
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }

  return { allowed: true, remaining: MAX_ATTEMPTS - parsed.attempts };
}

export async function recordFailedAttempt(
  kv: any,
  ip: string
): Promise<void> {
  const key = `ratelimit:${ip}`;
  const data = await kv.get(key);
  const parsed = data ? JSON.parse(data) : { attempts: 0 };

  parsed.attempts = (parsed.attempts || 0) + 1;

  // اگه به حد رسید، قفل کن
  if (parsed.attempts >= MAX_ATTEMPTS) {
    parsed.lockedUntil = Date.now() + LOCKOUT_DURATION * 1000;
  }

  await kv.put(key, JSON.stringify(parsed), {
    expirationTtl: LOCKOUT_DURATION,
  });
}

export async function clearFailedAttempts(kv: any, ip: string): Promise<void> {
  await kv.delete(`ratelimit:${ip}`);
}

// گرفتن IP کاربر
export function getClientIP(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown"
  );
}
