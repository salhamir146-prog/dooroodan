"use client";

import { useState } from "react";
import { Heart, Share2, Star } from "lucide-react";
import type { Product } from "@/types";
import { discountPercent, cn } from "@/lib/utils";

interface Props {
  product: Product;
}

export default function ProductGallery({ product }: Props) {
  const images = product.images?.length
    ? product.images
    : [product.image, product.image, product.image, product.image];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isWished, setIsWished] = useState(false);

  const discount = product.oldPrice
    ? discountPercent(product.price, product.oldPrice)
    : 0;

  return (
    <div className="product-gallery">
      {/* Thumbnails */}
      <div className="gallery-thumbs">
        {images.map((img, i) => (
          <button
            key={i}
            className={cn("thumb", activeIndex === i && "active")}
            onClick={() => setActiveIndex(i)}
          >
            <img src={img} alt={`${product.title} ${i + 1}`} />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="gallery-main">
        {discount > 0 && (
          <span className="gallery-badge badge-sale">{discount}٪ تخفیف</span>
        )}
        {product.tags?.includes("new") && !discount && (
          <span className="gallery-badge badge-new">جدید</span>
        )}

        <div className="gallery-actions">
          <button
            className={cn("gallery-action-btn", isWished && "active")}
            onClick={() => setIsWished(!isWished)}
            aria-label="علاقه‌مندی"
          >
            <Heart size={18} fill={isWished ? "currentColor" : "none"} />
          </button>
          <button className="gallery-action-btn" aria-label="اشتراک">
            <Share2 size={18} />
          </button>
        </div>

        <img src={images[activeIndex]} alt={product.title} />

        <div className="gallery-rating">
          <Star size={14} fill="currentColor" />
          <span>{product.rating}</span>
          <span className="gallery-rating-count">
            ({product.reviewCount} نظر)
          </span>
        </div>
      </div>
    </div>
  );
}