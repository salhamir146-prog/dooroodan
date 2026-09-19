import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// POST: ثبت استعلام جدید از سمت مشتری
export async function POST(request: Request) {
  try {
    const ctx = getCloudflareContext();
    const env = ctx.env as any;
    const db = env.DB;

    if (!db) {
      return NextResponse.json(
        { success: false, message: "DB not found" },
        { status: 500 }
      );
    }

    const body = await request.json();

    // اعتبارسنجی
    if (!body.customerName || !body.customerPhone || !body.items) {
      return NextResponse.json(
        {
          success: false,
          message: "نام، شماره تماس و لیست محصولات الزامی است",
        },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();

    // ساخت JSON از آیتم‌ها
    const itemsJson = JSON.stringify(body.items);

    // محاسبه‌ی جمع کل فعلی
    const oldTotal = body.items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    // بررسی تکراری بودن (همین شماره، همین محصولات در ۱۰ دقیقه اخیر)
    const tenMinutesAgo = Math.floor(Date.now() / 1000) - 600;
    const recent = await db
      .prepare(
        `SELECT id FROM price_inquiries 
         WHERE customer_phone = ? 
         AND items = ? 
         AND created_at > ?`
      )
      .bind(body.customerPhone, itemsJson, tenMinutesAgo)
      .first();

    if (recent) {
      return NextResponse.json(
        {
          success: false,
          message: "شما قبلاً استعلام ثبت کرده‌اید. لطفاً منتظر پاسخ بمانید.",
        },
        { status: 429 }
      );
    }

    await db
      .prepare(
        `INSERT INTO price_inquiries 
        (id, customer_name, customer_phone, items, old_total, status)
        VALUES (?, ?, ?, ?, ?, 'pending')`
      )
      .bind(
        id,
        body.customerName.trim(),
        body.customerPhone.trim(),
        itemsJson,
        oldTotal
      )
      .run();

    return NextResponse.json({
      success: true,
      message: "استعلام شما ثبت شد. به‌زودی قیمت جدید اطلاع داده می‌شود.",
      id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET: بررسی وضعیت استعلام با شماره تلفن
export async function GET(request: Request) {
  try {
    const ctx = getCloudflareContext();
    const env = ctx.env as any;
    const db = env.DB;

    const url = new URL(request.url);
    const phone = url.searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "شماره تلفن الزامی است" },
        { status: 400 }
      );
    }

    const { results } = await db
      .prepare(
        `SELECT * FROM price_inquiries 
         WHERE customer_phone = ? 
         ORDER BY created_at DESC 
         LIMIT 10`
      )
      .bind(phone)
      .all();

    const inquiries = (results || []).map((r: any) => ({
      ...r,
      items: JSON.parse(r.items),
    }));

    return NextResponse.json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
