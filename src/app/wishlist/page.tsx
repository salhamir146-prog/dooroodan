"use client";

import { ChevronLeft, Heart } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { useWishlistStore } from "@/store/wishlist";

export default function WishlistPage() {
  const { items, clearAll } = useWishlistStore();

  return (
    <>
      <div className="breadcrumb">
        <div className="container-main">
          <Link href="/">خانه</Link>
          <ChevronLeft size={14} />
          <span>علاقه‌مندی‌ها</span>
        </div>
      </div>

      <div className="container-main wishlist-page">
        {items.length === 0 ? (
          <div className="wishlist-empty">
            <Heart size={80} />
            <h2>لیست علاقه‌مندی‌های شما خالی است</h2>
            <p>محصولات مورد علاقه‌ی خود را با کلیک روی آیکون قلب ذخیره کنید.</p>
            <Link href="/products" className="btn-primary-full">
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <>
            <div className="wishlist-head">
              <h2>علاقه‌مندی‌های من ({items.length} محصول)</h2>
              <button className="clear-cart-btn" onClick={clearAll}>
                پاک کردن همه
              </button>
            </div>

            <div className="products-grid">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}