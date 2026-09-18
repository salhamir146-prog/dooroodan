import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext();
    
    const db = (ctx.env as any).DB;
    
    if (!db) {
      return NextResponse.json(
        { 
          success: false, 
          message: "DB binding not found",
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
      products_count: result?.count || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error connecting to D1",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
