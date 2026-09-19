import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyJWT } from "@/lib/auth";

async function checkAdmin(request: Request, env: any) {
  const cookies = request.headers.get("cookie") || "";
  const tokenMatch = cookies.match(/dooroodan_admin=([^;]+)/);
  if (!tokenMatch || !env.JWT_SECRET) return null;
  return await verifyJWT(tokenMatch[1], env.JWT_SECRET);
}

export async function GET(request: Request) {
  try {
    const ctx = getCloudflareContext();
    const env = ctx.env as any;
    const db = env.DB;

    const admin = await checkAdmin(request, env);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // شمارش محصولات
    const productsResult = await db
      .prepare("SELECT COUNT(*) as count FROM products")
      .first();

    // شمارش سفارشات
    const ordersResult = await db
      .prepare("SELECT COUNT(*) as count FROM orders")
      .first();

    // شمارش استعلام‌ها
    const inquiriesResult = await db
      .prepare("SELECT COUNT(*) as count FROM price_inquiries")
      .first();

    // شمارش کاربران
    const usersResult = await db
      .prepare("SELECT COUNT(*) as count FROM users")
      .first();

    return NextResponse.json({
      success: true,
      stats: {
        products: productsResult?.count || 0,
        orders: ordersResult?.count || 0,
        inquiries: inquiriesResult?.count || 0,
        users: usersResult?.count || 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
