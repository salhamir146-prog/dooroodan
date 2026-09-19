import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const ctx = getCloudflareContext();
    const db = (ctx.env as any).DB;

    if (!db) {
      return NextResponse.json(
        { success: false, message: "DB not found" },
        { status: 500 }
      );
    }

    const product = await db
      .prepare("SELECT * FROM products WHERE slug = ?")
      .bind(slug)
      .first();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // محصولات مشابه
    const { results: related } = await db
      .prepare(
        "SELECT * FROM products WHERE category = ? AND slug != ? LIMIT 4"
      )
      .bind(product.category, slug)
      .all();

    return NextResponse.json({
      success: true,
      product,
      related: related || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
