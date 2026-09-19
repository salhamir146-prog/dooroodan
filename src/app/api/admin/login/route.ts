import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  createJWT,
  createSession,
  generateSessionId,
  getClientIP,
  checkRateLimit,
  recordFailedAttempt,
  clearFailedAttempts,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const ctx = getCloudflareContext();
    const env = ctx.env as any;
    const kv = env.KV;

    if (!kv) {
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    const ip = getClientIP(request);

    // بررسی Rate Limit
    const rateCheck = await checkRateLimit(kv, ip);
    if (!rateCheck.allowed) {
      const minutesLeft = Math.ceil(
        (rateCheck.lockedUntil! - Date.now()) / 1000 / 60
      );
      return NextResponse.json(
        {
          success: false,
          message: `تعداد تلاش‌های ناموفق زیاد است. لطفاً ${minutesLeft} دقیقه دیگر تلاش کنید.`,
        },
        { status: 429 }
      );
    }

    // خواندن body
    const body = await request.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json(
        { success: false, message: "شماره و رمز الزامی است" },
        { status: 400 }
      );
    }

    // بررسی اطلاعات
    const adminPhone = env.ADMIN_PHONE;
    const adminPassword = env.ADMIN_PASSWORD;
    const jwtSecret = env.JWT_SECRET;

    if (!adminPhone || !adminPassword || !jwtSecret) {
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    // مقایسه (timing-safe)
    const phoneMatch = phone.trim() === adminPhone.trim();
    const passwordMatch = password === adminPassword;

    if (!phoneMatch || !passwordMatch) {
      await recordFailedAttempt(kv, ip);
      return NextResponse.json(
        {
          success: false,
          message: "شماره یا رمز عبور نادرست است",
          remaining: rateCheck.remaining - 1,
        },
        { status: 401 }
      );
    }

    // موفق → ریست کن
    await clearFailedAttempts(kv, ip);

    // ساخت Session
    const sessionId = generateSessionId();
    const sessionData = {
      phone: adminPhone,
      role: "admin" as const,
      createdAt: Date.now(),
    };

    await createSession(kv, sessionId, sessionData);

    // ساخت JWT
    const jwt = await createJWT(sessionData, jwtSecret);

    // پاسخ با کوکی
    const response = NextResponse.json({
      success: true,
      message: "ورود موفق",
    });

    response.cookies.set("dooroodan_admin", jwt, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // ۸ ساعت
      path: "/",
    });

    response.cookies.set("dooroodan_session_id", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "خطای سرور" },
      { status: 500 }
    );
  }
}
