"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import type { Product } from "@/types";

interface Props {
  products: Product[];
  title: string;
  subtitle?: string;
  viewAllLink?: string;
}

export default function ProductsShowcase({
  products,
  title,
  subtitle,
  viewAllLink = "/products",
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <section className="section section-alt">
      <div className="container-main">
        <div className="showcase-head">
          <div>
            <h2 className="section-title">{title}</h2>
            {subtitle && <p className="section-sub">{subtitle}</p>}
          </div>
          <div className="showcase-actions">
            <button
              className="scroll-btn"
              onClick={() => scroll("right")}
              aria-label="قبلی"
            >
              <ChevronRight size={20} />
            </button>
            <button
              className="scroll-btn"
              onClick={() => scroll("left")}
              aria-label="بعدی"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        </div>

        <div className="products-scroll" ref={scrollRef}>
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="product-scroll-card"
            >
              <div className="product-scroll-media">
                <img src={product.image} alt={product.title} loading="lazy" />
                {product.oldPrice && (
                  <span className="product-scroll-badge">تخفیف</span>
                )}
              </div>
              <div className="product-scroll-body">
                <span className="product-scroll-brand">{product.brand}</span>
                <h3>{product.title}</h3>
                <div className="product-scroll-price">
                  {product.price.toLocaleString("fa-IR")}{" "}
                  <small>تومان</small>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="center-btn">
          <Link href={viewAllLink} className="btn btn-outline">
            مشاهده همه <ArrowLeft size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
