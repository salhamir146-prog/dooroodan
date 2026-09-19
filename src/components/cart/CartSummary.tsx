"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Tag,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  Clock,
  CheckCircle2,
  CreditCard,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import PriceInquiryModal from "./PriceInquiryModal";

const TAX_RATE = 0.09;

export default function CartSummary() {
  const router = useRouter();
  const { items, inquiry, setInquiry, clearInquiry, getTotalPrice, getTotalItems } =
    useCartStore();

  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [checking, setChecking] = useState(false);

  // وضعیت استعلام در حال بررسی
  const [inquiryData, setInquiryData] = useState<any>(null);
  const [inquiryLoading, setInquiryLoading] = useState(false);

  // بررسی وضعیت استعلام وقتی inquiry وجود داره
  useEffect(() => {
    if (!inquiry) {
      setInquiryData(null);
      return;
    }

    async function checkInquiry() {
      setInquiryLoading(true);
      try {
        const res = await fetch(`/api/inquiries?id=${inquiry.id}`);
        const data = await res.json();

        if (data.success) {
          setInquiryData(data.inquiry);

          // اگه استعلام رد شده، پاک کن
          if (data.inquiry.status === "rejected") {
            clearInquiry();
            setInquiryData(null);
          }
        } else {
          // استعلام پیدا نشد، پاک کن
          clearInquiry();
          setInquiryData(null);
        }
      } catch {
        // ignore
      } finally {
        setInquiryLoading(false);
      }
    }

    checkInquiry();

    // هر ۳۰ ثانیه یک‌بار چک کن
    const interval = setInterval(checkInquiry, 30000);
    return () => clearInterval(interval);
  }, [inquiry, clearInquiry]);

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

  const handleInquirySuccess = (inquiryId: string, phone: string) => {
    setInquiry({
      id: inquiryId,
      phone,
      createdAt: Date.now(),
    });
    setInquiryOpen(false);
  };

  // ====== حالت‌های مختلف دکمه ======

  // ۱. اگه استعلام داده و در انتظار
  const isPending = inquiryData?.status === "pending";
  // ۲. اگه ادمین پاسخ داده
  const isResponded = inquiryData?.status === "responded";
  // ۳. اگه ادمین قیمت جدید داده
  const newTotal = inquiryData?.new_total;
  const priceDiff = newTotal ? newTotal - subtotal : 0;

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

        {/* ============ حالت‌ها ============ */}

        {/* اگر استعلام نداده: دکمه استعلام */}
        {!inquiry && (
          <>
            <div className="inquiry-alert">
              <AlertTriangle size={18} />
              <p>
                به دلیل تغییر قیمت محصولات و نوسانات بازار، لطفاً قیمت را از
                فروشنده استعلام بگیرید.
              </p>
            </div>
            <button
              className="btn-inquiry"
              onClick={() => setInquiryOpen(true)}
              disabled={items.length === 0}
            >
              <AlertTriangle size={18} />
              <span>استعلام قیمت از فروشنده</span>
            </button>
          </>
        )}

        {/* اگر استعلام داده: نمایش وضعیت */}
        {inquiry && (
          <>
            {/* در انتظار تایید */}
            {isPending && (
              <>
                <div className="inquiry-status-box pending">
                  <Clock size={20} />
                  <div>
                    <strong>در انتظار تایید قیمت</strong>
                    <p>
                      استعلام شما ثبت شد. به‌زودی قیمت جدید اطلاع داده می‌شود.
                    </p>
                  </div>
                </div>
                <button className="btn-waiting" disabled>
                  <Clock size={18} />
                  <span>در انتظار تایید قیمت...</span>
                </button>
              </>
            )}

            {/* اگه پاسخ داده شده */}
            {isResponded && newTotal && (
              <>
                {/* نمایش قیمت جدید */}
                <div className="inquiry-status-box success">
                  <CheckCircle2 size={20} />
                  <div>
                    <strong>قیمت جدید آماده است!</strong>
                    <p>می‌توانید قیمت را تایید و به پرداخت بروید.</p>
                  </div>
                </div>

                <div className="price-change-box">
                  <div className="price-change-row">
                    <span>قیمت قبلی:</span>
                    <span className="price-old-line">
                      {formatPrice(subtotal)} تومان
                    </span>
                  </div>
                  <div className="price-change-row price-new">
                    <span>قیمت جدید:</span>
                    <strong>{formatPrice(newTotal)} تومان</strong>
                  </div>
                  {priceDiff !== 0 && (
                    <div className={`price-diff ${priceDiff > 0 ? "up" : "down"}`}>
                      {priceDiff > 0 ? (
                        <>
                          <TrendingUp size={14} />
                          <span>{formatPrice(priceDiff)} تومان افزایش</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown size={14} />
                          <span>{formatPrice(Math.abs(priceDiff))} تومان کاهش</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <button
                  className="btn-checkout"
                  onClick={() => router.push(`/track`)}
                >
                  <CheckCircle2 size={18} />
                  <span>مشاهده و تایید قیمت جدید</span>
                </button>
              </>
            )}

            {/* در حال بارگذاری */}
            {inquiryLoading && !inquiryData && (
              <button className="btn-waiting" disabled>
                <Loader2 size={18} className="spin" />
                <span>در حال بررسی...</span>
              </button>
            )}
          </>
        )}

        <p className="summary-note">
          با ثبت سفارش، <a href="/terms">قوانین و مقررات</a> را می‌پذیرید.
        </p>
      </aside>

      <PriceInquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        onSuccess={handleInquirySuccess}
        items={items}
        total={Math.round(total)}
      />
    </>
  );
}
