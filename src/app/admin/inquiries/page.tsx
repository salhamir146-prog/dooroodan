"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  MessageSquare,
  Search,
  Home,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  Ticket,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  User,
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

const STATUS_LABELS: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "در انتظار پاسخ", color: "warning", icon: Clock },
  responded: { label: "پاسخ داده شده", color: "success", icon: CheckCircle2 },
  accepted: { label: "پذیرفته شده", color: "success", icon: CheckCircle2 },
  rejected: { label: "رد شده", color: "danger", icon: XCircle },
};

export default function AdminInquiriesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "responded">("all");
  const [search, setSearch] = useState("");

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
          setInquiries(data.inquiries);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  const filtered = inquiries.filter((inq) => {
    if (filter === "pending" && inq.status !== "pending") return false;
    if (filter === "responded" && inq.status !== "responded") return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        inq.customer_name.toLowerCase().includes(q) ||
        inq.customer_phone.includes(q)
      );
    }
    return true;
  });

  const pendingCount = inquiries.filter((i) => i.status === "pending").length;

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

  return (
    <div className="admin-panel">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span>دوو رودان</span>
          <small>پنل مدیریت</small>
        </div>

        <nav className="admin-sidebar-nav">
          <Link href="/admin">
            <Home size={18} />
            <span>داشبورد</span>
          </Link>
          <Link href="/admin/products">
            <Package size={18} />
            <span>محصولات</span>
          </Link>
          <Link href="/admin/orders">
            <ShoppingCart size={18} />
            <span>سفارشات</span>
          </Link>
          <Link href="/admin/inquiries" className="active">
            <MessageSquare size={18} />
            <span>استعلام‌ها</span>
            {pendingCount > 0 && (
              <span className="admin-sidebar-count">{pendingCount}</span>
            )}
          </Link>
          <Link href="/admin/users">
            <Users size={18} />
            <span>کاربران</span>
          </Link>
          <Link href="/admin/coupons">
            <Ticket size={18} />
            <span>کد تخفیف</span>
          </Link>
          <Link href="/admin/reports">
            <BarChart3 size={18} />
            <span>گزارشات</span>
          </Link>
          <Link href="/admin/settings">
            <Settings size={18} />
            <span>تنظیمات</span>
          </Link>
        </nav>

        <Link href="/" className="admin-sidebar-back">
          ← بازگشت به سایت
        </Link>
      </aside>

      {/* Main */}
      <main className="admin-content">
        <header className="admin-page-header">
          <div>
            <h1>استعلام‌های قیمت</h1>
            <p>
              {inquiries.length} استعلام • {pendingCount} در انتظار پاسخ
            </p>
          </div>
        </header>

        {/* Filters */}
        <div className="admin-filters">
          <button
            className={`admin-filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            همه ({inquiries.length})
          </button>
          <button
            className={`admin-filter-btn ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            در انتظار ({pendingCount})
          </button>
          <button
            className={`admin-filter-btn ${filter === "responded" ? "active" : ""}`}
            onClick={() => setFilter("responded")}
          >
            پاسخ داده شده
          </button>
        </div>

        {/* Search */}
        <div className="admin-search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="جستجو بر اساس نام یا شماره..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="admin-empty">
            <MessageSquare size={60} />
            <h2>استعلامی یافت نشد</h2>
            <p>
              {search || filter !== "all"
                ? "نتیجه‌ای برای جستجوی شما پیدا نشد."
                : "هنوز استعلامی ثبت نشده."}
            </p>
          </div>
        ) : (
          <div className="admin-inquiries-list">
            {filtered.map((inq) => {
              const statusInfo = STATUS_LABELS[inq.status] || STATUS_LABELS.pending;
              const StatusIcon = statusInfo.icon;

              return (
                <Link
                  key={inq.id}
                  href={`/admin/inquiries/${inq.id}`}
                  className={`admin-inquiry-card status-${statusInfo.color}`}
                >
                  <div className="admin-inquiry-status-bar"></div>

                  <div className="admin-inquiry-head">
                    <div className="admin-inquiry-customer">
                      <div className="admin-inquiry-avatar">
                        {inq.customer_name.charAt(0)}
                      </div>
                      <div>
                        <strong>{inq.customer_name}</strong>
                        <div className="admin-inquiry-phone">
                          <Phone size={12} />
                          <span dir="ltr">{inq.customer_phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className={`admin-inquiry-status status-${statusInfo.color}`}>
                      <StatusIcon size={14} />
                      <span>{statusInfo.label}</span>
                    </div>
                  </div>

                  <div className="admin-inquiry-body">
                    <div className="admin-inquiry-items">
                      <span>📦 {inq.items.length} محصول</span>
                      <span className="admin-inquiry-items-list">
                        {inq.items
                          .slice(0, 2)
                          .map((it: any) => it.title)
                          .join("، ")}
                        {inq.items.length > 2 && " و ..."}
                      </span>
                    </div>

                    <div className="admin-inquiry-price">
                      <small>مبلغ فعلی</small>
                      <strong>{formatPrice(inq.old_total)} تومان</strong>
                    </div>

                    {inq.new_total && (
                      <div className="admin-inquiry-price admin-inquiry-new-price">
                        <small>قیمت جدید</small>
                        <strong>{formatPrice(inq.new_total)} تومان</strong>
                      </div>
                    )}
                  </div>

                  <div className="admin-inquiry-foot">
                    <span className="admin-inquiry-date">
                      <Clock size={12} />
                      {formatDate(inq.created_at)}
                    </span>
                    <span className="admin-inquiry-view">مشاهده و پاسخ ←</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
