import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// POST: ثبت استعلام
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

    if (!body.customerName || !body.customerPhone || !body.items) {
      return NextResponse.json(
        { success: false, message: "اطلاعات ناقص است" },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();
    const itemsJson = JSON.stringify(body.items);

    const oldTotal = body.items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    // بررسی تکراری بودن
    const tenMinutesAgo = Math.floor(Date.now() / 1000) - 600;
    const recent = await db
      .prepare(
        `SELECT id FROM price_inquiries 
         WHERE customer_phone = ? 
         AND items = ? 
         AND created_at > ?
         AND status = 'pending'`
      )
      .bind(body.customerPhone, itemsJson, tenMinutesAgo)
      .first();

    if (recent) {
      return NextResponse.json({
        success: true,
        id: recent.id,
        message: "استعلام شما قبلاً ثبت شده است",
        alreadyExists: true,
      });
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
      message: "استعلام شما ثبت شد",
      id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET: دو حالت
export async function GET(request: Request) {
  try {
    const ctx = getCloudflareContext();
    const env = ctx.env as any;
    const db = env.DB;

    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const phone = url.searchParams.get("phone");

    // حالت ۱: با ID
    if (id) {
      const inquiry = await db
        .prepare("SELECT * FROM price_inquiries WHERE id = ?")
        .bind(id)
        .first();

      if (!inquiry) {
        return NextResponse.json(
          { success: false, message: "استعلام پیدا نشد" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        inquiry: {
          ...inquiry,
          items: JSON.parse(inquiry.items),
        },
      });
    }

    // حالت ۲: با شماره
    if (phone) {
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
    }

    return NextResponse.json(
      { success: false, message: "پارامتر نامعتبر" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
