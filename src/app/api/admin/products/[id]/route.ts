import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyJWT } from "@/lib/auth";

async function checkAdmin(request: Request, env: any) {
  const cookies = request.headers.get("cookie") || "";
  const tokenMatch = cookies.match(/dooroodan_admin=([^;]+)/);

  if (!tokenMatch) return null;
  if (!env.JWT_SECRET) return null;

  return await verifyJWT(tokenMatch[1], env.JWT_SECRET);
}

// PUT: ویرایش محصول
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

    await db
      .prepare(
        `UPDATE products SET 
        title = ?, brand = ?, price = ?, old_price = ?, image = ?, 
        category = ?, rating = ?, review_count = ?, in_stock = ?, 
        tags = ?, description = ?, updated_at = unixepoch()
        WHERE id = ?`
      )
      .bind(
        body.title,
        body.brand,
        Number(body.price),
        body.oldPrice ? Number(body.oldPrice) : null,
        body.image,
        body.category,
        body.rating || 0,
        body.reviewCount || 0,
        body.inStock !== false ? 1 : 0,
        body.tags ? JSON.stringify(body.tags) : null,
        body.description || null,
        id
      )
      .run();

    return NextResponse.json({
      success: true,
      message: "محصول به‌روزرسانی شد",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: حذف محصول
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

    await db.prepare("DELETE FROM products WHERE id = ?").bind(id).run();

    return NextResponse.json({
      success: true,
      message: "محصول حذف شد",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
