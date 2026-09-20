import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createJWT, createSession, generateSessionId } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const ctx = getCloudflareContext();
    const env = ctx.env as any;
    const db = env.DB;
    const kv = env.KV;

    if (!db || !kv || !env.JWT_SECRET) {
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const phone = body.phone?.trim();
    const code = body.code?.trim();
    const name = body.name?.trim();
    const email = body.email?.trim();

    if (!phone || !code) {
      return NextResponse.json(
        { success: false, message: "اطلاعات ناقص است" },
        { status: 400 }
      );
    }

    // گرفتن کد OTP از KV
    const otpKey = `otp:code:${phone}`;
    const otpData = await kv.get(otpKey);

    if (!otpData) {
      return NextResponse.json(
        { success: false, message: "کد منقضی شده. دوباره درخواست کنید." },
        { status: 400 }
      );
    }

    const parsed = JSON.parse(otpData);

    // بررسی تعداد تلاش‌ها (حداکثر ۵ تلاش)
    if (parsed.attempts >= 5) {
      await kv.delete(otpKey);
      return NextResponse.json(
        { success: false, message: "تعداد تلاش‌ها زیاد است. دوباره درخواست کنید." },
        { status: 400 }
      );
    }

    // بررسی کد
    if (parsed.code !== code) {
      // آپدیت تعداد تلاش
      parsed.attempts = (parsed.attempts || 0) + 1;
      await kv.put(otpKey, JSON.stringify(parsed), { expirationTtl: 120 });

      return NextResponse.json(
        {
          success: false,
          message: "کد نادرست است",
          remaining: 5 - parsed.attempts,
        },
        { status: 400 }
      );
    }

    // کد درست → حذف کن
    await kv.delete(otpKey);

    // بررسی وجود کاربر
    let user = await db
      .prepare("SELECT * FROM users WHERE phone = ?")
      .bind(phone)
      .first();

    // اگه کاربر جدیده، بساز
    if (!user) {
      // اگه نام داده نشده، برنگردون (نیاز به تکمیل اطلاعات)
      if (!name) {
        return NextResponse.json({
          success: true,
          isNewUser: true,
          message: "لطفاً اطلاعات خود را کامل کنید",
        });
      }

      const userId = crypto.randomUUID();
      await db
        .prepare(
          `INSERT INTO users (id, phone, name, email, role, created_at, last_login)
           VALUES (?, ?, ?, ?, 'user', unixepoch(), unixepoch())`
        )
        .bind(userId, phone, name, email || null)
        .run();

      user = {
        id: userId,
        phone,
        name,
        email: email || null,
        role: "user",
      };
    } else {
      // آپدیت last_login
      await db
        .prepare("UPDATE users SET last_login = unixepoch() WHERE id = ?")
        .bind(user.id)
        .run();
    }

    // ساخت Session
    const sessionId = generateSessionId();
    const sessionData = {
      phone: user.phone,
      role: user.role || "user",
      userId: user.id,
      createdAt: Date.now(),
    };

    // ذخیره در KV (۷ روز)
    await kv.put(`user_session:${sessionId}`, JSON.stringify(sessionData), {
      expirationTtl: 60 * 60 * 24 * 7,
    });

    // ساخت JWT
    const jwt = await createJWT(sessionData as any, env.JWT_SECRET);

    // پاسخ با کوکی
    const response = NextResponse.json({
      success: true,
      message: "ورود موفق",
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
      },
    });

    response.cookies.set("dooroodan_user", jwt, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // ۷ روز
      path: "/",
    });

    response.cookies.set("dooroodan_user_session", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
