import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyJWT } from "@/lib/auth";

async function checkAdmin(request: Request, env: any) {
  const cookies = request.headers.get("cookie") || "";
  const tokenMatch = cookies.match(/dooroodan_admin=([^;]+)/);
  if (!tokenMatch || !env.JWT_SECRET) return null;
  return await verifyJWT(tokenMatch[1], env.JWT_SECRET);
}

// GET: لیست همه استعلام‌ها (برای ادمین)
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

    const { results } = await db
      .prepare(
        `SELECT * FROM price_inquiries 
         ORDER BY 
           CASE status
             WHEN 'pending' THEN 1
             WHEN 'responded' THEN 2
             WHEN 'accepted' THEN 3
             WHEN 'rejected' THEN 4
             ELSE 5
           END,
           created_at DESC
         LIMIT 200`
      )
      .all();

    const inquiries = (results || []).map((r: any) => ({
      ...r,
      items: JSON.parse(r.items),
    }));

    // آمار
    const pendingCount = inquiries.filter(
      (i: any) => i.status === "pending"
    ).length;
    const respondedCount = inquiries.filter(
      (i: any) => i.status === "responded"
    ).length;

    return NextResponse.json({
      success: true,
      count: inquiries.length,
      pendingCount,
      respondedCount,
      inquiries,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
