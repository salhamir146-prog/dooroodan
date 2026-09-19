"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Package, ShoppingCart, Users, TrendingUp, LogOut } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ phone: string } | null>(null);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/admin/me");
        const data = await res.json();
        if (!data.success) {
          router.push("/admin/login");
        } else {
          setUser(data.user);
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
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <h1>پنل مدیریت دوو رودان</h1>
          <p>خوش آمدید، {user?.phone}</p>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>خروج</span>
        </button>
      </header>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <Package size={28} />
          <div>
            <strong>۳</strong>
            <span>محصولات</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <ShoppingCart size={28} />
          <div>
            <strong>۰</strong>
            <span>سفارشات</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <Users size={28} />
          <div>
            <strong>۱</strong>
            <span>ادمین‌ها</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <TrendingUp size={28} />
          <div>
            <strong>۳</strong>
            <span>بازدید امروز</span>
          </div>
        </div>
      </div>

      <div className="admin-coming-soon">
        <h2>🚧 در حال ساخت</h2>
        <p>به‌زودی این بخش‌ها اضافه می‌شن:</p>
        <ul>
          <li>✅ مدیریت محصولات (افزودن، ویرایش، حذف)</li>
          <li>✅ مدیریت سفارشات</li>
          <li>✅ استعلام‌های قیمت ⭐</li>
          <li>✅ مدیریت کاربران</li>
          <li>✅ گزارشات و آمار</li>
          <li>✅ تنظیمات فروشگاه</li>
        </ul>
      </div>
    </div>
  );
}
