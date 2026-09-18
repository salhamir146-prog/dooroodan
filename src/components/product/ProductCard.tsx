"use client";

import { ShoppingCart, Star, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import type { Product } from "@/types";
import { formatPrice, discountPercent, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [isAdded, setIsAdded] = useState(false);
  const [mounted, setMounted] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const wishlistItems = useWishlistStore((state) => state.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isWished =
    mounted && wishlistItems.some((item) => item.id === product.id);

  const discount = product.oldPrice
    ? discountPercent(product.price, product.oldPrice)
    : 0;

  const handleAdd = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      title: product.title,
      brand: product.brand,
      price: product.price,
      image: product.image,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleWishlist = () => {
    toggleWishlist(product);
  };

  return (
    <article className="product-card">
      {discount > 0 && (
        <span className="product-badge badge-sale">{discount}٪ تخفیف</span>
      )}
      {product.tags?.includes("new") && !discount && (
        <span className="product-badge badge-new">جدید</span>
      )}

      <button
        className={cn("wish-btn", isWished && "active")}
        onClick={handleWishlist}
        aria-label="علاقه‌مندی"
      >
        <Heart size={16} fill={isWished ? "currentColor" : "none"} />
      </button>

      <a href={`/products/${product.slug}`} className="product-media">
        <img src={product.image} alt={product.title} loading="lazy" />
      </a>

      <div className="product-body">
        <span className="product-brand">{product.brand}</span>
        <h3 className="product-title">
          <a href={`/products/${product.slug}`}>{product.title}</a>
        </h3>

        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
              color="currentColor"
            />
          ))}
          <span>({product.rating})</span>
        </div>

        <div className="product-price">
          <div className="price-main">
            {formatPrice(product.price)} <small>تومان</small>
          </div>
          {product.oldPrice && (
            <div className="price-old">{formatPrice(product.oldPrice)}</div>
          )}
        </div>

        <button
          className={cn("btn-add-cart", isAdded && "added")}
          onClick={handleAdd}
          disabled={!product.inStock}
        >
          <ShoppingCart size={16} />
          <span>{isAdded ? "اضافه شد" : "افزودن به سبد"}</span>
        </button>
      </div>
    </article>
  );
}