import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyJWT } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const ctx = getCloudflareContext();
    const env = ctx.env as any;
    const db = env.DB;

    if (!env.JWT_SECRET) {
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    const cookies = request.headers.get("cookie") || "";
    const tokenMatch = cookies.match(/dooroodan_user=([^;]+)/);

    if (!tokenMatch) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const session = await verifyJWT(tokenMatch[1], env.JWT_SECRET);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // گرفتن اطلاعات کامل کاربر
    const user = await db
      .prepare("SELECT id, phone, name, email, role, address, postal_code, created_at FROM users WHERE id = ?")
      .bind((session as any).userId)
      .first();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
