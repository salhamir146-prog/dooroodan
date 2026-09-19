import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import RelatedProducts from "@/components/product/RelatedProducts";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { Product } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

function mapProduct(dbProduct: any): Product {
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

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const ctx = getCloudflareContext();
  const db = (ctx.env as any).DB;

  if (!db) {
    notFound();
  }

  const dbProduct = await db
    .prepare("SELECT * FROM products WHERE slug = ?")
    .bind(slug)
    .first();

  if (!dbProduct) {
    notFound();
  }

  const product = mapProduct(dbProduct);

  const { results: dbRelated } = await db
    .prepare("SELECT * FROM products WHERE category = ? AND slug != ? LIMIT 4")
    .bind(product.category, slug)
    .all();

  const related = (dbRelated || []).map(mapProduct);

  return (
    <>
      <div className="breadcrumb">
        <div className="container-main">
          <a href="/">خانه</a>
          <ChevronLeft size={14} />
          <a href="/products">محصولات</a>
          <ChevronLeft size={14} />
          <span className="breadcrumb-current">{product.title}</span>
        </div>
      </div>

      <div className="container-main product-detail-page">
        <div className="product-detail-top">
          <ProductGallery product={product} />
          <ProductInfo product={product} />
        </div>

        <ProductTabs product={product} />

        {related.length > 0 && <RelatedProducts products={related} />}
      </div>
    </>
  );
}
