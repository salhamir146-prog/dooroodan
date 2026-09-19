import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyJWT } from "@/lib/auth";

// بررسی ادمین بودن
async function checkAdmin(request: Request, env: any) {
  const cookies = request.headers.get("cookie") || "";
  const tokenMatch = cookies.match(/dooroodan_admin=([^;]+)/);

  if (!tokenMatch) return null;
  if (!env.JWT_SECRET) return null;

  return await verifyJWT(tokenMatch[1], env.JWT_SECRET);
}

// GET: لیست همه محصولات
export async function GET(request: Request) {
  try {
    const ctx = getCloudflareContext();
    const env = ctx.env as any;
    const db = env.DB;

    if (!db) {
      return NextResponse.json(
        { success: false, message: "DB not found" },
        { status: 500 }
      );
    }

    const admin = await checkAdmin(request, env);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
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

// POST: افزودن محصول جدید
export async function POST(request: Request) {
  try {
    const ctx = getCloudflareContext();
    const env = ctx.env as any;
    const db = env.DB;

    if (!db) {
      return NextResponse.json(
        { success: false, message: "DB not found" },
        { status: 500 }
      );
    }

    const admin = await checkAdmin(request, env);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // اعتبارسنجی
    if (!body.title || !body.price || !body.brand || !body.image) {
      return NextResponse.json(
        {
          success: false,
          message: "عنوان، قیمت، برند و تصویر الزامی است",
        },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();

    // ساخت slug از عنوان یا استفاده از عنوان اگلیش
    let slug = body.slug;
    if (!slug) {
      // اگه slug ندادی، از uuid استفاده کن
      slug = id.slice(0, 12);
    }

    // بررسی یونیک بودن slug
    const existing = await db
      .prepare("SELECT id FROM products WHERE slug = ?")
      .bind(slug)
      .first();

    if (existing) {
      slug = `${slug}-${id.slice(0, 4)}`;
    }

    await db
      .prepare(
        `INSERT INTO products 
        (id, slug, title, brand, price, old_price, image, category, rating, review_count, in_stock, tags, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        slug,
        body.title.trim(),
        body.brand.trim(),
        Number(body.price),
        body.oldPrice ? Number(body.oldPrice) : null,
        body.image.trim(),
        body.category || "general",
        body.rating ? Number(body.rating) : 0,
        body.reviewCount ? Number(body.reviewCount) : 0,
        body.inStock !== false ? 1 : 0,
        body.tags ? JSON.stringify(body.tags) : null,
        body.description || null
      )
      .run();

    return NextResponse.json({
      success: true,
      message: "محصول با موفقیت اضافه شد",
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
