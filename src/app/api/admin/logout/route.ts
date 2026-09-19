import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { deleteSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const ctx = getCloudflareContext();
    const env = ctx.env as any;
    const kv = env.KV;

    // خواندن Session ID
    const cookies = request.headers.get("cookie") || "";
    const sessionMatch = cookies.match(/dooroodan_session_id=([^;]+)/);

    if (sessionMatch && kv) {
      await deleteSession(kv, sessionMatch[1]);
    }

    // پاک کردن کوکی‌ها
    const response = NextResponse.json({
      success: true,
      message: "خروج موفق",
    });

    response.cookies.delete("dooroodan_admin");
    response.cookies.delete("dooroodan_session_id");

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
