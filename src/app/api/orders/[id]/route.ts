import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(
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

    const order = await db
      .prepare("SELECT * FROM orders WHERE id = ?")
      .bind(id)
      .first();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "سفارش پیدا نشد" },
        { status: 404 }
      );
    }

    const { results: items } = await db
      .prepare("SELECT * FROM order_items WHERE order_id = ?")
      .bind(id)
      .all();

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        items: items || [],
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
