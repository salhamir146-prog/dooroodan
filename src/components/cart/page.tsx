"use client";

import { ChevronLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { useCartStore } from "@/store/cart";

export default function CartPage() {
  const { items, clearCart } = useCartStore();

  return (
    <>
      <div className="breadcrumb">
        <div className="container-main">
          <Link href="/">خانه</Link>
          <ChevronLeft size={14} />
          <span>سبد خرید</span>
        </div>
      </div>

      <div className="container-main cart-page">
        {items.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag size={80} />
            <h2>سبد خرید شما خالی است</h2>
            <p>می‌توانید از فروشگاه ما محصولات مورد نظر خود را انتخاب کنید.</p>
            <Link href="/products" className="btn-primary-full">
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items-section">
              <div className="cart-items-head">
                <h2>سبد خرید ({items.length} محصول)</h2>
                <button className="clear-cart-btn" onClick={clearCart}>
                  پاک کردن سبد
                </button>
              </div>
              <div className="cart-items-list">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            <CartSummary />
          </div>
        )}
      </div>
    </>
  );
}