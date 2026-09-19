import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyJWT } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const ctx = getCloudflareContext();
    const env = ctx.env as any;
    const jwtSecret = env.JWT_SECRET;

    if (!jwtSecret) {
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    // خواندن کوکی
    const cookies = request.headers.get("cookie") || "";
    const tokenMatch = cookies.match(/dooroodan_admin=([^;]+)/);

    if (!tokenMatch) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const session = await verifyJWT(tokenMatch[1], jwtSecret);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        phone: session.phone,
        role: session.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
