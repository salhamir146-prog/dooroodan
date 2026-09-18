"use client";

import { useState } from "react";
import { Tag, AlertTriangle, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import PriceInquiryModal from "./PriceInquiryModal";

const TAX_RATE = 0.09; // ۹٪ مالیات بر ارزش افزوده

export default function CartSummary() {
  const { getTotalPrice, items, getTotalItems } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryDone, setInquiryDone] = useState(false);

  const subtotal = getTotalPrice();
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * TAX_RATE;
  const total = subtotal - discount + tax;

  const applyCoupon = () => {
    if (couponCode.trim().toUpperCase() === "DOOROODAN10") {
      setCouponApplied(true);
    } else {
      alert("کد تخفیف نامعتبر است");
    }
  };

  return (
    <>
      <aside className="cart-summary">
        <h3 className="summary-title">خلاصه سفارش</h3>

        <div className="summary-row">
          <span>جمع کل ({getTotalItems()} کالا)</span>
          <span>{formatPrice(subtotal)} تومان</span>
        </div>

        {couponApplied && (
          <div className="summary-row summary-row-discount">
            <span>تخفیف (کد ۱۰٪)</span>
            <span>- {formatPrice(discount)} تومان</span>
          </div>
        )}

        <div className="summary-row">
          <span>مالیات بر ارزش افزوده (۹٪)</span>
          <span>{formatPrice(Math.round(tax))} تومان</span>
        </div>

        <div className="summary-row summary-row-total">
          <span>مبلغ قابل پرداخت</span>
          <span>{formatPrice(Math.round(total))} تومان</span>
        </div>

        {/* Coupon */}
        <div className="coupon-box">
          <Tag size={16} />
          <input
            type="text"
            placeholder="کد تخفیف (DOOROODAN10)"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={couponApplied}
          />
          <button onClick={applyCoupon} disabled={couponApplied}>
            {couponApplied ? "✓ اعمال شد" : "اعمال"}
          </button>
        </div>

        {/* ⚠️ Price Inquiry Alert */}
        <div className="inquiry-alert">
          <AlertTriangle size={18} />
          <p>
            به دلیل تغییر قیمت محصولات و نوسانات بازار، لطفاً قیمت را از
            فروشنده استعلام بگیرید. حداکثر تا آخر امروز قیمت جدید به شما
            اطلاع داده خواهد شد.
          </p>
        </div>

        {/* Buttons */}
        {!inquiryDone ? (
          <button
            className="btn-inquiry"
            onClick={() => setInquiryOpen(true)}
            disabled={items.length === 0}
          >
            <AlertTriangle size={18} />
            <span>استعلام قیمت از فروشنده</span>
          </button>
        ) : (
          <>
            <div className="inquiry-done-badge">
              ✅ استعلام شما ثبت شد. قیمت جدید به‌زودی اطلاع داده می‌شود.
            </div>
            <button className="btn-checkout" disabled>
              <ArrowLeft size={18} />
              <span>در انتظار تایید قیمت</span>
            </button>
          </>
        )}

        <p className="summary-note">
          با ثبت سفارش، <a href="/terms">قوانین و مقررات</a> را می‌پذیرید.
        </p>
      </aside>

      <PriceInquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        onSuccess={() => {
          setInquiryOpen(false);
          setInquiryDone(true);
        }}
        items={items}
        total={Math.round(total)}
      />
    </>
  );
}