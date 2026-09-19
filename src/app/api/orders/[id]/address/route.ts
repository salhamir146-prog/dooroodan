import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// PUT: ذخیره آدرس سفارش
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    if (
      !body.customer_name ||
      !body.customer_phone ||
      !body.customer_address ||
      !body.customer_postal_code
    ) {
      return NextResponse.json(
        { success: false, message: "همه‌ی فیلدها الزامی است" },
        { status: 400 }
      );
    }

    // بررسی سفارش
    const order = await db
      .prepare("SELECT id, status FROM orders WHERE id = ?")
      .bind(id)
      .first();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "سفارش پیدا نشد" },
        { status: 404 }
      );
    }

    // آپدیت آدرس
    await db
      .prepare(
        `UPDATE orders SET 
         customer_name = ?, 
         customer_phone = ?, 
         customer_address = ?, 
         customer_postal_code = ?,
         updated_at = unixepoch()
         WHERE id = ?`
      )
      .bind(
        body.customer_name.trim(),
        body.customer_phone.trim(),
        body.customer_address.trim(),
        body.customer_postal_code.trim(),
        id
      )
      .run();

    return NextResponse.json({
      success: true,
      message: "آدرس ذخیره شد",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
