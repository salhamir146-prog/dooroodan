"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ArrowLeft,
  User,
  Phone,
  MapPin,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_postal_code: string;
  total_amount: number;
  status: string;
  payment_status: string;
  items?: any[];
}

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"address" | "payment">("address");

  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    customer_postal_code: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();

        if (data.success) {
          setOrder(data.order);
          setForm({
            customer_name: data.order.customer_name || "",
            customer_phone: data.order.customer_phone || "",
            customer_address:
              data.order.customer_address === "در انتظار دریافت آدرس"
                ? ""
                : data.order.customer_address || "",
            customer_postal_code: data.order.customer_postal_code || "",
          });
        } else {
          setError("سفارش پیدا نشد");
        }
      } catch {
        setError("خطا در بارگذاری");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch(`/api/orders/${orderId}/address`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setStep("payment");
      } else {
        setError(data.message || "خطا در ذخیره آدرس");
      }
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setSaving(false);
    }
  };

  const handlePayment = () => {
    alert(
      "🚧 درگاه پرداخت به‌زودی فعال می‌شود.\n\nسفارش شما ثبت شد و کارشناسان با شما تماس خواهند گرفت."
    );
    router.push("/");
  };

  if (loading) {
    return (
      <div className="checkout-loading">
        <Loader2 size={40} className="spin" />
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="container-main">
        <div className="checkout-error">
          <AlertCircle size={60} />
          <h1>سفارش پیدا نشد</h1>
          <p>{error}</p>
          <Link href="/" className="btn-primary-full">
            بازگشت به خانه
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="breadcrumb">
        <div className="container-main">
          <Link href="/">خانه</Link>
          <ChevronLeft size={14} />
          <Link href="/cart">سبد خرید</Link>
          <ChevronLeft size={14} />
          <span>تکمیل سفارش</span>
        </div>
      </div>

      <div className="container-main checkout-page">
        <div className="checkout-progress">
          <div className={`checkout-step ${step === "address" ? "active" : "done"}`}>
            <div className="checkout-step-num">۱</div>
            <span>آدرس تحویل</span>
          </div>
          <div className="checkout-step-line" />
          <div className={`checkout-step ${step === "payment" ? "active" : ""}`}>
            <div className="checkout-step-num">۲</div>
            <span>پرداخت</span>
          </div>
        </div>

        <div className="checkout-grid">
          <div className="checkout-main">
            {step === "address" ? (
              <div className="checkout-card">
                <h2>
                  <MapPin size={20} />
                  اطلاعات تحویل سفارش
                </h2>

                {error && (
                  <div className="checkout-error-box">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSaveAddress} className="checkout-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <User size={14} /> نام گیرنده *
                      </label>
                      <input
                        type="text"
                        name="customer_name"
                        value={form.customer_name}
                        onChange={handleChange}
                        placeholder="نام و نام خانوادگی گیرنده"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <Phone size={14} /> شماره تماس *
                      </label>
                      <input
                        type="tel"
                        name="customer_phone"
                        value={form.customer_phone}
                        onChange={handleChange}
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        pattern="[0-9]{11}"
                        required
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>
                      <MapPin size={14} /> آدرس کامل *
                    </label>
                    <textarea
                      name="customer_address"
                      value={form.customer_address}
                      onChange={handleChange}
                      placeholder="استان، شهر، خیابان، کوچه، پلاک، واحد"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>کد پستی *</label>
                    <input
                      type="text"
                      name="customer_postal_code"
                      value={form.customer_postal_code}
                      onChange={handleChange}
                      placeholder="۱۰ رقم بدون خط تیره"
                      pattern="[0-9]{10}"
                      title="کد پستی ۱۰ رقمی"
                      required
                      dir="ltr"
                    />
                  </div>

                  <button
                    type="submit"
                    className="checkout-submit-btn"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 size={18} className="spin" />
                        <span>در حال ذخیره...</span>
                      </>
                    ) : (
                      <>
                        <span>ادامه به پرداخت</span>
                        <ArrowLeft size={18} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="checkout-card">
                <h2>
                  <CreditCard size={20} />
                  پرداخت نهایی
                </h2>

                <div className="checkout-address-summary">
                  <div className="checkout-address-row">
                    <User size={14} />
                    <span>{form.customer_name}</span>
                  </div>
                  <div className="checkout-address-row">
                    <Phone size={14} />
                    <span dir="ltr">{form.customer_phone}</span>
                  </div>
                  <div className="checkout-address-row">
                    <MapPin size={14} />
                    <span>{form.customer_address}</span>
                  </div>
                  <div className="checkout-address-row">
                    <span>کد پستی: {form.customer_postal_code}</span>
                  </div>
                  <button
                    className="checkout-edit-btn"
                    onClick={() => setStep("address")}
                  >
                    ویرایش آدرس
                  </button>
                </div>

                <div className="checkout-payment-info">
                  <AlertCircle size={20} />
                  <p>
                    برای پرداخت، روی دکمه‌ی زیر کلیک کنید. پس از تکمیل پرداخت،
                    کد رهگیری برای شما پیامک خواهد شد.
                  </p>
                </div>

                <button
                  className="checkout-payment-btn"
                  onClick={handlePayment}
                >
                  <CreditCard size={20} />
                  <span>انتقال به درگاه پرداخت</span>
                </button>
              </div>
            )}
          </div>

          <aside className="checkout-sidebar">
            <div className="checkout-summary">
              <h3>خلاصه سفارش</h3>

              <div className="checkout-summary-row">
                <span>شماره سفارش:</span>
                <strong dir="ltr">#{order?.id.slice(0, 8)}</strong>
              </div>

              <div className="checkout-summary-row checkout-summary-total">
                <span>مبلغ قابل پرداخت:</span>
                <strong>{formatPrice(order?.total_amount || 0)} تومان</strong>
              </div>

              <div className="checkout-secure">
                <CheckCircle2 size={14} />
                <span>پرداخت امن با رمزنگاری</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
