"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ArrowRight,
  Phone,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  Save,
  Trash2,
  AlertCircle,
  Package,
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

export default function InquiryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [newTotal, setNewTotal] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const meRes = await fetch("/api/admin/me");
        const meData = await meRes.json();
        if (!meData.success) {
          router.push("/admin/login");
          return;
        }

        const res = await fetch("/api/admin/inquiries");
        const data = await res.json();
        if (data.success) {
          const inq = data.inquiries.find((i: any) => i.id === id);
          if (inq) {
            setInquiry(inq);
            setNewTotal(inq.new_total ? String(inq.new_total) : "");
            setAdminNote(inq.admin_note || "");
          } else {
            setError("استعلام پیدا نشد");
          }
        }
      } catch {
        setError("خطا در بارگذاری");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  const handleResponse = async (status: "responded" | "rejected") => {
    if (status === "responded" && !newTotal) {
      setError("قیمت جدید را وارد کنید");
      return;
    }

    setError("");
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          newTotal: status === "responded" ? Number(newTotal) : null,
          adminNote,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/inquiries");
        }, 1500);
      } else {
        setError(data.message || "خطا در ذخیره");
      }
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("مطمئنی می‌خوای این استعلام رو حذف کنی؟")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/inquiries");
      }
    } catch {
      setError("خطا در حذف");
      setDeleting(false);
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

  if (loading) {
    return (
      <div className="admin-loading-full">
        <Loader2 size={40} className="spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="admin-panel">
        <main className="admin-content admin-content-full">
          <div className="admin-success-box">
            <div className="success-icon-large">
              <CheckCircle2 size={60} />
            </div>
            <h1>پاسخ با موفقیت ثبت شد!</h1>
            <p>در حال بازگشت...</p>
            <Loader2 size={24} className="spin" />
          </div>
        </main>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="admin-panel">
        <main className="admin-content admin-content-full">
          <div className="admin-error-box">
            <AlertCircle size={18} />
            <span>استعلام پیدا نشد</span>
          </div>
          <Link href="/admin/inquiries" className="admin-back-link">
            <ArrowRight size={16} />
            بازگشت
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <main className="admin-content admin-content-full">
        <header className="admin-page-header">
          <div>
            <Link href="/admin/inquiries" className="admin-back-link">
              <ArrowRight size={16} />
              بازگشت به استعلام‌ها
            </Link>
            <h1>جزئیات استعلام</h1>
            <p>ثبت شده در {formatDate(inquiry.created_at)}</p>
          </div>
          <button
            className="admin-delete-btn"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <Loader2 size={16} className="spin" />
            ) : (
              <Trash2 size={16} />
            )}
            حذف
          </button>
        </header>

        {error && (
          <div className="admin-error-box">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Customer Info */}
        <section className="admin-inquiry-section">
          <h2>اطلاعات مشتری</h2>
          <div className="admin-customer-info">
            <div className="admin-info-row">
              <User size={16} />
              <span className="admin-info-label">نام:</span>
              <span className="admin-info-value">{inquiry.customer_name}</span>
            </div>
            <div className="admin-info-row">
              <Phone size={16} />
              <span className="admin-info-label">تلفن:</span>
              <a
                href={`tel:${inquiry.customer_phone}`}
                className="admin-info-value admin-info-link"
                dir="ltr"
              >
                {inquiry.customer_phone}
              </a>
            </div>
          </div>
        </section>

        {/* Items */}
        <section className="admin-inquiry-section">
          <h2>محصولات درخواستی</h2>
          <div className="admin-items-list">
            {inquiry.items.map((item: any, i: number) => (
              <div key={i} className="admin-item-row">
                <div className="admin-item-img">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="admin-item-info">
                  <strong>{item.title}</strong>
                  <small>
                    {item.brand} × {toPersianNumber(item.quantity)}
                  </small>
                </div>
                <div className="admin-item-price">
                  {formatPrice(item.price * item.quantity)} تومان
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Total */}
        <section className="admin-inquiry-section admin-inquiry-total-section">
          <div className="admin-total-row">
            <span>جمع کل فعلی:</span>
            <strong>{formatPrice(inquiry.old_total)} تومان</strong>
          </div>

          {inquiry.new_total && (
            <div className="admin-total-row admin-total-new">
              <span>قیمت جدید (ثبت شده):</span>
              <strong>{formatPrice(inquiry.new_total)} تومان</strong>
            </div>
          )}
        </section>

        {/* Response Form */}
        <section className="admin-inquiry-section admin-response-section">
          <h2>پاسخ به مشتری</h2>
          <p className="admin-section-hint">
            قیمت جدید را وارد کنید. بعد از ذخیره، مشتری می‌تواند قیمت را
            ببیند.
          </p>

          <div className="admin-form-field">
            <label>قیمت جدید (تومان) *</label>
            <input
              type="number"
              value={newTotal}
              onChange={(e) => setNewTotal(e.target.value)}
              placeholder={String(inquiry.old_total)}
              dir="ltr"
            />
            {newTotal && (
              <div className="admin-price-comparison">
                {Number(newTotal) > inquiry.old_total && (
                  <span className="admin-price-up">
                    ↑ {formatPrice(Number(newTotal) - inquiry.old_total)} تومان
                    افزایش
                  </span>
                )}
                {Number(newTotal) < inquiry.old_total && (
                  <span className="admin-price-down">
                    ↓{" "}
                    {formatPrice(inquiry.old_total - Number(newTotal))} تومان
                    کاهش
                  </span>
                )}
                {Number(newTotal) === inquiry.old_total && (
                  <span className="admin-price-same">بدون تغییر</span>
                )}
              </div>
            )}
          </div>

          <div className="admin-form-field">
            <label>یادداشت برای مشتری (اختیاری)</label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={3}
              placeholder="مثلاً: به دلیل نوسان بازار، قیمت به‌روزرسانی شد."
            />
          </div>

          <div className="admin-response-actions">
            <button
              className="admin-save-btn"
              onClick={() => handleResponse("responded")}
              disabled={saving || !newTotal}
            >
              {saving ? (
                <Loader2 size={18} className="spin" />
              ) : (
                <CheckCircle2 size={18} />
              )}
              ثبت قیمت جدید
            </button>

            <button
              className="admin-reject-btn"
              onClick={() => handleResponse("rejected")}
              disabled={saving}
            >
              <XCircle size={18} />
              رد استعلام
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
