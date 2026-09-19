import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// لیست محصولات
export async function GET() {
  try {
    const ctx = getCloudflareContext();
    const db = (ctx.env as any).DB;

    if (!db) {
      return NextResponse.json(
        { success: false, message: "DB not found" },
        { status: 500 }
      );
    }

    const { results } = await db
      .prepare("SELECT * FROM products ORDER BY created_at DESC")
      .all();

    return NextResponse.json({
      success: true,
      count: results.length,
      products: results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// افزودن محصول جدید
export async function POST(request: Request) {
  try {
    const ctx = getCloudflareContext();
    const db = (ctx.env as any).DB;

    if (!db) {
      return NextResponse.json(
        { success: false, message: "DB not found" },
        { status: 500 }
      );
    }

    const body = await request.json();

    // اعتبارسنجی ساده
    if (!body.title || !body.price || !body.brand) {
      return NextResponse.json(
        {
          success: false,
          message: "title, price, and brand are required",
        },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();
    const slug = body.slug || id.slice(0, 8);

    await db
      .prepare(
        `INSERT INTO products 
        (id, slug, title, brand, price, old_price, image, category, rating, review_count, in_stock, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        slug,
        body.title,
        body.brand,
        body.price,
        body.oldPrice || null,
        body.image || "https://placehold.co/400x400/eaf2f7/0b3b5c?text=Product",
        body.category || "general",
        body.rating || 0,
        body.reviewCount || 0,
        body.inStock !== false ? 1 : 0,
        body.tags ? JSON.stringify(body.tags) : null
      )
      .run();

    return NextResponse.json({
      success: true,
      message: "Product added successfully",
      id,
      slug,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
