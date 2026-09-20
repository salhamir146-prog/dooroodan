import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// تولید کد OTP ۶ رقمی
function generateOTP(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return String(100000 + (array[0] % 900000));
}

// گرفتن IP کاربر
function getClientIP(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown"
  );
}

export async function POST(request: Request) {
  try {
    const ctx = getCloudflareContext();
    const env = ctx.env as any;
    const db = env.DB;
    const kv = env.KV;

    if (!db || !kv) {
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const phone = body.phone?.trim();

    // اعتبارسنجی شماره موبایل
    if (!phone || !/^09\d{9}$/.test(phone)) {
      return NextResponse.json(
        { success: false, message: "شماره موبایل نامعتبر است" },
        { status: 400 }
      );
    }

    const ip = getClientIP(request);

    // Rate Limit برای شماره
    const phoneKey = `otp:phone:${phone}`;
    const phoneData = await kv.get(phoneKey);

    if (phoneData) {
      const parsed = JSON.parse(phoneData);
      if (parsed.lockedUntil && parsed.lockedUntil > Date.now()) {
        const minutesLeft = Math.ceil(
          (parsed.lockedUntil - Date.now()) / 1000 / 60
        );
        return NextResponse.json(
          {
            success: false,
            message: `لطفاً ${minutesLeft} دقیقه دیگر تلاش کنید`,
          },
          { status: 429 }
        );
      }

      // اگه توی ۲ دقیقه گذشته کد فرستاده
      if (parsed.lastSentAt && Date.now() - parsed.lastSentAt < 120000) {
        const secondsLeft = Math.ceil(
          (120000 - (Date.now() - parsed.lastSentAt)) / 1000
        );
        return NextResponse.json(
          {
            success: false,
            message: `لطفاً ${secondsLeft} ثانیه دیگر تلاش کنید`,
          },
          { status: 429 }
        );
      }
    }

    // Rate Limit برای IP (حداکثر ۵ در ۱ ساعت)
    const ipKey = `otp:ip:${ip}`;
    const ipData = await kv.get(ipKey);
    const ipCount = ipData ? JSON.parse(ipData).count || 0 : 0;

    if (ipCount >= 5) {
      return NextResponse.json(
        {
          success: false,
          message: "تعداد درخواست‌های شما زیاد است. لطفاً بعداً تلاش کنید.",
        },
        { status: 429 }
      );
    }

    // تولید کد OTP
    const otp = generateOTP();
    const otpKey = `otp:code:${phone}`;

    // ذخیره کد در KV (اعتبار: ۲ دقیقه)
    await kv.put(
      otpKey,
      JSON.stringify({
        code: otp,
        attempts: 0,
        createdAt: Date.now(),
      }),
      { expirationTtl: 120 }
    );

    // آپدیت Rate Limit شماره
    await kv.put(
      phoneKey,
      JSON.stringify({
        lastSentAt: Date.now(),
        count: (phoneData ? JSON.parse(phoneData).count || 0 : 0) + 1,
      }),
      { expirationTtl: 3600 }
    );

    // آپدیت Rate Limit IP
    await kv.put(
      ipKey,
      JSON.stringify({ count: ipCount + 1 }),
      { expirationTtl: 3600 }
    );

    // ⚠️ حالت تست: کد رو توی Response برمی‌گردونیم
    // بعداً Kavenegar اضافه می‌کنیم
    const isDevMode = !env.KAVENEGAR_API_KEY;

    if (!isDevMode && env.KAVENEGAR_API_KEY) {
      // ارسال پیامک واقعی
      const smsRes = await fetch(
        `https://api.kavenegar.com/v1/${env.KAVENEGAR_API_KEY}/verify/lookup.json`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            receptor: phone,
            token: otp,
            template: "dooroodan-otp",
          }),
        }
      );

      if (!smsRes.ok) {
        console.error("Kavenegar error:", await smsRes.text());
        return NextResponse.json(
          { success: false, message: "خطا در ارسال پیامک" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "کد تایید ارسال شد",
      // ⚠️ فقط توی حالت تست:
      ...(isDevMode && { testOtp: otp, note: "حالت تست - کد در پاسخ" }),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
