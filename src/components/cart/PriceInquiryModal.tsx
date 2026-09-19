"use client";

import { useState } from "react";
import { X, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import type { CartItemType } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (inquiryId: string, phone: string) => void;
  items: CartItemType[];
  total: number;
}

export default function PriceInquiryModal({
  isOpen,
  onClose,
  onSuccess,
  items,
  total,
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [savedInquiryId, setSavedInquiryId] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          customerPhone: phone.trim(),
          items: items.map((item) => ({
            id: item.id,
            title: item.title,
            brand: item.brand,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSavedInquiryId(data.id);
        setDone(true);
        // بعد از ۲ ثانیه، اطلاعات رو به Parent بده
        setTimeout(() => {
          onSuccess(data.id, phone.trim());
          setDone(false);
          setName("");
          setPhone("");
        }, 2000);
      } else {
        setError(data.message || "خطا در ثبت استعلام");
      }
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {!done ? (
          <>
            <div className="modal-icon">
              <AlertTriangle size={40} />
            </div>

            <h3 className="modal-title">استعلام قیمت</h3>
            <p className="modal-desc">
              قیمت محصولات به دلیل نوسانات بازار ممکن است تغییر کرده باشد.
              شماره تماس خود را وارد کنید تا قیمت جدید تا آخر امروز به شما
              اطلاع داده شود.
            </p>

            <div className="modal-summary">
              <strong>{items.length} محصول در سبد شما</strong>
              <span>جمع فعلی: {formatPrice(total)} تومان</span>
            </div>

            {error && (
              <div className="modal-error">
                <AlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="modal-form">
              <input
                type="text"
                placeholder="نام و نام خانوادگی"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={submitting}
              />
              <input
                type="tel"
                placeholder="شماره تماس (۰۹۱۲...)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                pattern="[0-9]{11}"
                title="شماره موبایل ۱۱ رقمی"
                disabled={submitting}
              />
              <button
                type="submit"
                className="btn-primary-full"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="spin" />
                    <span>در حال ارسال...</span>
                  </>
                ) : (
                  <span>ارسال درخواست استعلام</span>
                )}
              </button>
            </form>

            <p className="modal-note">
            کارشناسان ما تا آخر امروز با شما تماس می‌گیرند.
            </p>
          </>
        ) : (
          <div className="modal-success">
            <CheckCircle2 size={60} />
            <h3>درخواست شما ثبت شد!</h3>
            <p>
              به‌زودی قیمت جدید به شماره <strong>{phone}</strong> اطلاع داده
              می‌شود.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
