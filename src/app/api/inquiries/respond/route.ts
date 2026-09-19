import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// POST: تایید یا رد استعلام توسط مشتری
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
    const { inquiryId, phone, action } = body;

    // اعتبارسنجی
    if (!inquiryId || !phone || !action) {
      return NextResponse.json(
        { success: false, message: "اطلاعات ناقص است" },
        { status: 400 }
      );
    }

    if (!["accept", "reject"].includes(action)) {
      return NextResponse.json(
        { success: false, message: "عملیات نامعتبر" },
        { status: 400 }
      );
    }

    // بررسی استعلام
    const inquiry = await db
      .prepare(
        "SELECT * FROM price_inquiries WHERE id = ? AND customer_phone = ?"
      )
      .bind(inquiryId, phone.trim())
      .first();

    if (!inquiry) {
      return NextResponse.json(
        { success: false, message: "استعلام پیدا نشد" },
        { status: 404 }
      );
    }

    if (inquiry.status !== "responded") {
      return NextResponse.json(
        {
          success: false,
          message: "این استعلام در وضعیت قابل پاسخ نیست",
        },
        { status: 400 }
      );
    }

    if (action === "reject") {
      // رد استعلام
      await db
        .prepare("UPDATE price_inquiries SET status = 'rejected' WHERE id = ?")
        .bind(inquiryId)
        .run();

      return NextResponse.json({
        success: true,
        message: "استعلام رد شد",
      });
    }

    // === قبول استعلام → تبدیل به سفارش ===
    const orderId = crypto.randomUUID();
    const orderNumber = `DR-${Date.now().toString().slice(-8)}`;

    // ساخت سفارش
    await db
      .prepare(
        `INSERT INTO orders 
        (id, customer_name, customer_phone, customer_address, total_amount, status, payment_status, notes)
        VALUES (?, ?, ?, ?, ?, 'pending', 'unpaid', ?)`
      )
      .bind(
        orderId,
        inquiry.customer_name,
        inquiry.customer_phone,
        "در انتظار دریافت آدرس", // مشتری بعداً آدرس رو وارد می‌کنه
        inquiry.new_total || inquiry.old_total,
        `سفارش از استعلام #${inquiry.id.slice(0, 8)}`
      )
      .run();

    // اضافه کردن آیتم‌ها
    const items = JSON.parse(inquiry.items);
    for (const item of items) {
      const itemId = crypto.randomUUID();
      await db
        .prepare(
          `INSERT INTO order_items 
          (id, order_id, product_id, product_title, product_price, quantity)
          VALUES (?, ?, ?, ?, ?, ?)`
        )
        .bind(
          itemId,
          orderId,
          item.id,
          item.title,
          item.price,
          item.quantity
        )
        .run();
    }

    // آپدیت استعلام
    await db
      .prepare(
        `UPDATE price_inquiries 
         SET status = 'accepted', order_id = ? 
         WHERE id = ?`
      )
      .bind(orderId, inquiryId)
      .run();

    return NextResponse.json({
      success: true,
      message: "سفارش شما ثبت شد",
      orderId,
      orderNumber,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
