import ProductCard from "./ProductCard";
import type { Product } from "@/types";

interface Props {
  products: Product[];
}

export default function RelatedProducts({ products }: Props) {
  return (
    <section className="related-products">
      <h2 className="related-title">محصولات مشابه</h2>
      <div className="products-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}