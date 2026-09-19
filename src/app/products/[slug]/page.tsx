import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import RelatedProducts from "@/components/product/RelatedProducts";
import { getProduct } from "@/lib/api";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const { product, related } = await getProduct(slug);

  if (!product) {
    notFound();
  }

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
