import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: Request) {
  try {
    const ctx = getCloudflareContext();
    const env = ctx.env as any;
    const kv = env.KV;

    const cookies = request.headers.get("cookie") || "";
    const sessionMatch = cookies.match(/dooroodan_user_session=([^;]+)/);

    if (sessionMatch && kv) {
      await kv.delete(`user_session:${sessionMatch[1]}`);
    }

    const response = NextResponse.json({
      success: true,
      message: "خروج موفق",
    });

    response.cookies.delete("dooroodan_user");
    response.cookies.delete("dooroodan_user_session");

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
