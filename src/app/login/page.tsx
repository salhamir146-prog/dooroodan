"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Phone,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  Mail,
  User,
  RotateCcw,
} from "lucide-react";

type Step = "phone" | "otp" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [testOtp, setTestOtp] = useState("");

  // شمارنده معکوس
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // چک کن اگه لاگینه، برو به صفحه اصلی
  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            router.push("/account");
          }
        }
      } catch {
        // ignore
      }
    }
    check();
  }, [router]);

  // ============ مرحله ۱: ارسال OTP ============
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setStep("otp");
        setCountdown(120); // ۲ دقیقه
        setSuccess("کد تایید ارسال شد");

        // حالت تست: کد رو نشون بده
        if (data.testOtp) {
          setTestOtp(data.testOtp);
        }
      } else {
        setError(data.message || "خطا در ارسال کد");
      }
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  // ============ مرحله ۲: تایید OTP ============
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          code: otp.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.isNewUser) {
          // کاربر جدید → فرم ثبت‌نام
          setStep("register");
          setSuccess("");
        } else {
          // کاربر موجود → برو به حساب کاربری
          router.push("/account");
        }
      } else {
        setError(data.message || "کد نادرست است");
      }
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  // ============ مرحله ۳: تکمیل ثبت‌نام ============
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          code: otp.trim(),
          name: name.trim(),
          email: email.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/account");
      } else {
        setError(data.message || "خطا در ثبت‌نام");
      }
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  // بازگشت به مرحله قبل
  const handleBack = () => {
    setStep("phone");
    setOtp("");
    setError("");
    setSuccess("");
    setTestOtp("");
  };

  return (
    <>
      <div className="breadcrumb">
        <div className="container-main">
          <Link href="/">خانه</Link>
          <ChevronLeft size={14} />
          <span>ورود / ثبت‌نام</span>
        </div>
      </div>

      <div className="login-page">
        <div className="login-card">
          {/* لوگو */}
          <div className="login-logo">
            <div className="brand-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C8 6 4 9 4 14c0 4.4 3.6 8 8 8s8-3.6 8-8c0-5-4-8-8-12z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>

          <h1 className="login-title">
            {step === "phone" && "ورود / ثبت‌نام"}
            {step === "otp" && "کد تایید"}
            {step === "register" && "تکمیل ثبت‌نام"}
          </h1>

          <p className="login-sub">
            {step === "phone" && "با شماره موبایل خود وارد شوید"}
            {step === "otp" && `کد ۶ رقمی ارسال شده به ${phone}`}
            {step === "register" && "برای تکمیل، اطلاعات خود را وارد کنید"}
          </p>

          {/* امنیت */}
          <div className="login-security">
            <ShieldCheck size={14} />
            <span>ورود امن با کد یکبار مصرف</span>
          </div>

          {/* پیام خطا */}
          {error && (
            <div className="login-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* پیام موفقیت */}
          {success && step === "otp" && (
            <div className="login-success">
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </div>
          )}

          {/* ============ مرحله ۱: فرم شماره ============ */}
          {step === "phone" && (
            <form onSubmit={handleSendOTP} className="login-form">
              <div className="login-field">
                <label>شماره موبایل</label>
                <div className="login-input">
                  <Phone size={18} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    pattern="09[0-9]{9}"
                    title="شماره موبایل با ۰۹ شروع شود"
                    required
                    dir="ltr"
                    autoFocus
                  />
                </div>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={18} className="spin" />
                    <span>در حال ارسال...</span>
                  </>
                ) : (
                  <>
                    <span>دریافت کد تایید</span>
                    <ArrowLeft size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ============ مرحله ۲: فرم OTP ============ */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOTP} className="login-form">
              <div className="login-field">
                <label>کد ۶ رقمی</label>
                <div className="login-input">
                  <ShieldCheck size={18} />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="- - - - - -"
                    pattern="[0-9]{6}"
                    title="کد ۶ رقمی"
                    required
                    dir="ltr"
                    autoFocus
                    style={{ letterSpacing: "6px", fontSize: "18px", textAlign: "center" }}
                  />
                </div>
              </div>

              {/* حالت تست */}
              {testOtp && (
                <div className="login-test-otp">
                  <strong>🧪 حالت تست:</strong>
                  <span>کد شما: <code>{testOtp}</code></span>
                  <small>بعداً Kavenegar اضافه می‌شه</small>
                </div>
              )}

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={18} className="spin" />
                    <span>در حال بررسی...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>تایید کد</span>
                  </>
                )}
              </button>

              <div className="login-actions">
                {countdown > 0 ? (
                  <span className="login-countdown">
                    تا ارسال مجدد: {countdown} ثانیه
                  </span>
                ) : (
                  <button
                    type="button"
                    className="login-resend-btn"
                    onClick={handleSendOTP as any}
                  >
                    <RotateCcw size={14} />
                    ارسال مجدد کد
                  </button>
                )}

                <button
                  type="button"
                  className="login-back-btn"
                  onClick={handleBack}
                >
                  تغییر شماره
                </button>
              </div>
            </form>
          )}

          {/* ============ مرحله ۳: فرم ثبت‌نام ============ */}
          {step === "register" && (
            <form onSubmit={handleRegister} className="login-form">
              <div className="login-field">
                <label>نام و نام خانوادگی</label>
                <div className="login-input">
                  <User size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثلاً: علی محمدی"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="login-field">
                <label>ایمیل (اختیاری)</label>
                <div className="login-input">
                  <Mail size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                    dir="ltr"
                  />
                </div>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={18} className="spin" />
                    <span>در حال ثبت‌نام...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>ثبت‌نام</span>
                  </>
                )}
              </button>
            </form>
          )}

          <p className="login-note">
            با ورود، <Link href="/terms">قوانین و مقررات</Link> را می‌پذیرید.
          </p>
        </div>
      </div>
    </>
  );
}
