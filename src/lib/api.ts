import type { Product } from "@/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://dooroodan.salhamir146.workers.dev";

export interface ProductsResponse {
  success: boolean;
  count: number;
  products: any[];
}

export interface SingleProductResponse {
  success: boolean;
  product: any;
  related: any[];
}

// تبدیل داده‌های D1 به تایپ Product
export function mapDbProduct(dbProduct: any): Product {
  return {
    id: dbProduct.id,
    slug: dbProduct.slug,
    title: dbProduct.title,
    brand: dbProduct.brand,
    price: dbProduct.price,
    oldPrice: dbProduct.old_price || undefined,
    image: dbProduct.image,
    images: dbProduct.images ? JSON.parse(dbProduct.images) : undefined,
    rating: dbProduct.rating || 0,
    reviewCount: dbProduct.review_count || 0,
    category: dbProduct.category,
    tags: dbProduct.tags ? JSON.parse(dbProduct.tags) : [],
    description: dbProduct.description || undefined,
    inStock: dbProduct.in_stock === 1,
  };
}

// گرفتن همه محصولات
export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/products`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch products");

    const data: ProductsResponse = await res.json();
    if (!data.success) throw new Error("API returned error");

    return data.products.map(mapDbProduct);
  } catch (error) {
    console.error("getProducts error:", error);
    return [];
  }
}

// گرفتن یک محصول
export async function getProduct(slug: string): Promise<{
  product: Product | null;
  related: Product[];
}> {
  try {
    const res = await fetch(`${BASE_URL}/api/products/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return { product: null, related: [] };
    }

    const data: SingleProductResponse = await res.json();
    if (!data.success) return { product: null, related: [] };

    return {
      product: mapDbProduct(data.product),
      related: (data.related || []).map(mapDbProduct),
    };
  } catch (error) {
    console.error("getProduct error:", error);
    return { product: null, related: [] };
  }
}
