import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyJWT } from "@/lib/auth";

async function checkAdmin(request: Request, env: any) {
  const cookies = request.headers.get("cookie") || "";
  const tokenMatch = cookies.match(/dooroodan_admin=([^;]+)/);
  if (!tokenMatch || !env.JWT_SECRET) return null;
  return await verifyJWT(tokenMatch[1], env.JWT_SECRET);
}

// PUT: پاسخ ادمین (تغییر قیمت یا رد)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const body = await request.json();
    const { newTotal, status, adminNote } = body;

    if (!status || !["responded", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "وضعیت نامعتبر" },
        { status: 400 }
      );
    }

    if (status === "responded" && !newTotal) {
      return NextResponse.json(
        { success: false, message: "قیمت جدید الزامی است" },
        { status: 400 }
      );
    }

    await db
      .prepare(
        `UPDATE price_inquiries 
         SET status = ?, 
             new_total = ?, 
             admin_note = ?,
             responded_at = unixepoch()
         WHERE id = ?`
      )
      .bind(
        status,
        newTotal ? Number(newTotal) : null,
        adminNote || null,
        id
      )
      .run();

    return NextResponse.json({
      success: true,
      message: status === "responded" ? "قیمت جدید ثبت شد" : "استعلام رد شد",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: حذف استعلام
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    await db
      .prepare("DELETE FROM price_inquiries WHERE id = ?")
      .bind(id)
      .run();

    return NextResponse.json({
      success: true,
      message: "استعلام حذف شد",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
