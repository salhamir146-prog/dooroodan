"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  LogOut,
  Home,
  MessageSquare,
  Settings,
  BarChart3,
  Ticket,
  Bell,
  Tag,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ phone: string } | null>(null);
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    inquiries: 0,
    users: 0,
  });

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/admin/me");
        const data = await res.json();
        if (!data.success) {
          router.push("/admin/login");
          return;
        }
        setUser(data.user);

        // گرفتن آمار
        const statsRes = await fetch("/api/admin/stats");
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.stats);
        }
      } catch {
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    }
    check();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
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
          <Link href="/admin" className="active">
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
          <Link href="/admin/inquiries">
            <MessageSquare size={18} />
            <span>استعلام‌ها</span>
            <span className="admin-sidebar-badge">⭐</span>
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

      {/* Main Content */}
      <main className="admin-content">
        <header className="admin-page-header">
          <div>
            <h1>داشبورد</h1>
            <p>خوش آمدید، {user?.phone}</p>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>خروج</span>
          </button>
        </header>

        {/* Stats */}
        <div className="admin-stats-grid">
          <Link href="/admin/products" className="admin-stat-card">
            <div className="admin-stat-icon blue">
              <Package size={24} />
            </div>
            <div>
              <strong>{stats.products}</strong>
              <span>محصولات</span>
            </div>
          </Link>

          <Link href="/admin/orders" className="admin-stat-card">
            <div className="admin-stat-icon green">
              <ShoppingCart size={24} />
            </div>
            <div>
              <strong>{stats.orders}</strong>
              <span>سفارشات</span>
            </div>
          </Link>

          <Link href="/admin/inquiries" className="admin-stat-card">
            <div className="admin-stat-icon gold">
              <MessageSquare size={24} />
            </div>
            <div>
              <strong>{stats.inquiries}</strong>
              <span>استعلام‌ها</span>
            </div>
          </Link>

          <Link href="/admin/users" className="admin-stat-card">
            <div className="admin-stat-icon purple">
              <Users size={24} />
            </div>
            <div>
              <strong>{stats.users}</strong>
              <span>کاربران</span>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <section className="admin-quick-actions">
          <h2>دسترسی سریع</h2>
          <div className="admin-quick-grid">
            <Link href="/admin/products/new" className="admin-quick-card">
              <div className="admin-quick-icon">
                <Package size={24} />
              </div>
              <div>
                <strong>افزودن محصول</strong>
                <small>محصول جدید به فروشگاه اضافه کن</small>
              </div>
            </Link>

            <Link href="/admin/inquiries" className="admin-quick-card">
              <div className="admin-quick-icon gold">
                <MessageSquare size={24} />
              </div>
              <div>
                <strong>استعلام‌های قیمت</strong>
                <small>پاسخ به درخواست‌های مشتریان</small>
              </div>
            </Link>

            <Link href="/admin/orders" className="admin-quick-card">
              <div className="admin-quick-icon green">
                <ShoppingCart size={24} />
              </div>
              <div>
                <strong>سفارشات جدید</strong>
                <small>مشاهده و مدیریت سفارشات</small>
              </div>
            </Link>

            <Link href="/admin/reports" className="admin-quick-card">
              <div className="admin-quick-icon purple">
                <BarChart3 size={24} />
              </div>
              <div>
                <strong>گزارشات فروش</strong>
                <small>آمار و نمودارهای فروش</small>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
