"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Phone, AlertCircle, Loader2, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // اگه قبلاً لاگین بود، برو داشبورد
  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/admin/me");
        const data = await res.json();
        if (data.success) {
          router.push("/admin");
        }
      } catch {
        // ignore
      } finally {
        setChecking(false);
      }
    }
    check();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin");
      } else {
        setError(data.message || "ورود ناموفق");
      }
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-loading">
          <Loader2 size={40} className="spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <div className="brand-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C8 6 4 9 4 14c0 4.4 3.6 8 8 8s8-3.6 8-8c0-5-4-8-8-12z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        <h1>پنل مدیریت</h1>
        <p className="admin-login-sub">دوو رودان — ورود ادمین</p>

        <div className="admin-login-security-badge">
          <ShieldCheck size={16} />
          <span>اتصال امن با رمزنگاری</span>
        </div>

        {error && (
          <div className="admin-login-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-field">
            <label>شماره ادمین</label>
            <div className="admin-login-input">
              <Phone size={18} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="۰۹۹۸۱۰۶۴۵۰۵"
                required
                autoComplete="username"
                dir="ltr"
              />
            </div>
          </div>

          <div className="admin-login-field">
            <label>رمز عبور</label>
            <div className="admin-login-input">
              <Lock size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
                dir="ltr"
              />
            </div>
          </div>

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin" />
                <span>در حال ورود...</span>
              </>
            ) : (
              <>
                <Lock size={18} />
                <span>ورود به پنل</span>
              </>
            )}
          </button>
        </form>

        <p className="admin-login-note">
          🔒 این صفحه فقط برای مدیران است. تمام تلاش‌های ورود ثبت می‌شود.
        </p>
      </div>
    </div>
  );
}
