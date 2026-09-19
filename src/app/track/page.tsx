"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Phone,
  Package,
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
} from "lucide-react";
import { formatPrice, toPersianNumber } from "@/lib/utils";

interface Inquiry {
  id: string;
  customer_name: string;
  customer_phone: string;
  items: any[];
  old_total: number;
  new_total: number | null;
  status: string;
  admin_note: string | null;
  created_at: number;
  responded_at: number | null;
}

const STATUS_INFO: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "در انتظار بررسی", color: "warning", icon: Clock },
  responded: { label: "قیمت جدید آماده است", color: "success", icon: CheckCircle2 },
  accepted: { label: "پذیرفته شده", color: "success", icon: CheckCircle2 },
  rejected: { label: "رد شده", color: "danger", icon: XCircle },
};

export default function TrackPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setInquiries([]);

    try {
      const res = await fetch(
        `/api/inquiries?phone=${encodeURIComponent(phone.trim())}`
      );
      const data = await res.json();

      if (data.success) {
        setInquiries(data.inquiries);
        setSearched(true);
      } else {
        setError(data.message || "خطا در جستجو");
      }
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (inquiryId: string, action: "accept" | "reject") => {
    if (action === "reject" && !confirm("مطمئنی می‌خوای این استعلام رو رد کنی؟")) {
      return;
    }
    if (
      action === "accept" &&
      !confirm("با قبول این قیمت، سفارش ثبت می‌شه. مطمئنی؟")
    ) {
      return;
    }

    setProcessing(inquiryId);
    try {
      const res = await fetch("/api/inquiries/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId,
          phone: phone.trim(),
          action,
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (action === "accept") {
          alert("سفارش شما با موفقیت ثبت شد!");
          router.push(`/checkout/${data.orderId}`);
        } else {
          alert("استعلام رد شد");
          // رفرش لیست
          handleSearch(new Event("submit") as any);
        }
      } else {
        setError(data.message || "خطا");
      }
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <>
      <div className="breadcrumb">
        <div className="container-main">
          <Link href="/">خانه</Link>
          <ChevronLeft size={14} />
          <span>پیگیری استعلام</span>
        </div>
      </div>

      <div className="container-main track-page">
        <div className="track-hero">
          <h1>پیگیری استعلام قیمت</h1>
          <p>
            شماره موبایلی که هنگام استعلام وارد کردید را وارد کنید تا وضعیت
            استعلام خود را ببینید.
          </p>

          <form onSubmit={handleSearch} className="track-search">
            <Phone size={20} />
            <input
              type="tel"
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              pattern="[0-9]{11}"
              title="شماره موبایل ۱۱ رقمی"
              dir="ltr"
            />
            <button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 size={18} className="spin" />
              ) : (
                <>
                  <Search size={16} />
                  <span>جستجو</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="track-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {searched && inquiries.length === 0 && (
          <div className="track-empty">
            <Search size={60} />
            <h2>استعلامی یافت نشد</h2>
            <p>
              با این شماره موبایل، هیچ استعلامی ثبت نشده است.
            </p>
          </div>
        )}

        {inquiries.length > 0 && (
          <div className="track-list">
            <h2>استعلام‌های شما</h2>
            {inquiries.map((inq) => {
              const statusInfo = STATUS_INFO[inq.status] || STATUS_INFO.pending;
              const StatusIcon = statusInfo.icon;
              const priceDiff = inq.new_total
                ? inq.new_total - inq.old_total
                : 0;

              return (
                <div key={inq.id} className={`track-card status-${statusInfo.color}`}>
                  <div className="track-card-head">
                    <div className="track-card-id">
                      شناسه: <strong>#{inq.id.slice(0, 8)}</strong>
                    </div>
                    <div className={`track-status status-${statusInfo.color}`}>
                      <StatusIcon size={14} />
                      <span>{statusInfo.label}</span>
                    </div>
                  </div>

                  <div className="track-card-date">
                    <Clock size={12} />
                    {formatDate(inq.created_at)}
                  </div>

                  <div className="track-card-items">
                    <h4>
                      <Package size={14} /> {inq.items.length} محصول
                    </h4>
                    <ul>
                      {inq.items.map((it: any, i: number) => (
                        <li key={i}>
                          <span>{it.title}</span>
                          <span>× {toPersianNumber(it.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="track-card-prices">
                    <div className="track-price-row">
                      <span>قیمت قبلی:</span>
                      <span className="track-price-old">
                        {formatPrice(inq.old_total)} تومان
                      </span>
                    </div>

                    {inq.new_total && (
                      <div className="track-price-row track-price-row-new">
                        <span>قیمت جدید:</span>
                        <span className="track-price-new">
                          {formatPrice(inq.new_total)} تومان
                        </span>
                      </div>
                    )}
                  </div>

                  {inq.admin_note && (
                    <div className="track-note">
                      <strong>یادداشت فروشنده:</strong>
                      <p>{inq.admin_note}</p>
                    </div>
                  )}

                  {inq.status === "responded" && inq.new_total && (
                    <div className="track-actions">
                      {priceDiff > 0 && (
                        <div className="track-diff up">
                          <TrendingUp size={14} />
                          <span>
                            {formatPrice(priceDiff)} تومان افزایش
                          </span>
                        </div>
                      )}
                      {priceDiff < 0 && (
                        <div className="track-diff down">
                          <TrendingDown size={14} />
                          <span>
                            {formatPrice(Math.abs(priceDiff))} تومان کاهش
                          </span>
                        </div>
                      )}
                      {priceDiff === 0 && (
                        <div className="track-diff same">
                          <span>بدون تغییر</span>
                        </div>
                      )}

                      <div className="track-buttons">
                        <button
                          className="track-accept-btn"
                          onClick={() => handleAction(inq.id, "accept")}
                          disabled={processing === inq.id}
                        >
                          {processing === inq.id ? (
                            <Loader2 size={16} className="spin" />
                          ) : (
                            <ShoppingCart size={16} />
                          )}
                          <span>قبول قیمت و ادامه خرید</span>
                        </button>
                        <button
                          className="track-reject-btn"
                          onClick={() => handleAction(inq.id, "reject")}
                          disabled={processing === inq.id}
                        >
                          <XCircle size={16} />
                          <span>رد</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {inq.status === "accepted" && (
                    <div className="track-accepted">
                      <CheckCircle2 size={16} />
                      <span>این استعلام به سفارش تبدیل شد</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
