import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET() {
  try {
    const ctx = getCloudflareContext();
    const db = (ctx.env as any).DB;

    if (!db) {
      return NextResponse.json(
        {
          success: false,
          message: "DB binding not found",
          available_keys: Object.keys(ctx.env || {}),
        },
        { status: 500 }
      );
    }

    const result = await db
      .prepare("SELECT COUNT(*) as count FROM products")
      .first();

    return NextResponse.json({
      success: true,
      message: "D1 is connected!",
      products_count: result?.count ?? 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error connecting to D1",
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
