"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ArrowRight,
  Image as ImageIcon,
  Check,
  AlertCircle,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    brand: "",
    price: "",
    oldPrice: "",
    image: "",
    category: "cooler",
    rating: "4.5",
    reviewCount: "0",
    description: "",
    inStock: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
          rating: Number(form.rating),
          reviewCount: Number(form.reviewCount),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push("/admin/products"), 1500);
      } else {
        setError(data.message || "خطا در افزودن محصول");
      }
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="admin-panel">
        <main className="admin-content admin-content-full">
          <div className="admin-success-box">
            <div className="success-icon-large">
              <Check size={60} />
            </div>
            <h1>محصول با موفقیت اضافه شد!</h1>
            <p>در حال انتقال به لیست محصولات...</p>
            <Loader2 size={24} className="spin" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <main className="admin-content admin-content-full">
        <header className="admin-page-header">
          <div>
            <Link href="/admin/products" className="admin-back-link">
              <ArrowRight size={16} />
              بازگشت به محصولات
            </Link>
            <h1>افزودن محصول جدید</h1>
            <p>اطلاعات محصول رو کامل کن</p>
          </div>
        </header>

        {error && (
          <div className="admin-error-box">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          {/* Image preview */}
          <div className="admin-image-preview">
            <label>لینک تصویر محصول</label>
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              required
              dir="ltr"
            />
            {form.image && (
              <div className="image-preview-box">
                <img
                  src={form.image}
                  alt="Preview"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
            <p className="admin-form-hint">
              💡 <strong>پیشنهاد:</strong> از{" "}
              <a href="https://imgbb.com" target="_blank" rel="noreferrer">
                imgbb.com
              </a>{" "}
              عکس رو آپلود کن و لینکش رو اینجا پیست کن.
            </p>
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-field">
              <label>نام محصول *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="مثلاً: کولر گازی اینورتر ۱۸۰۰۰"
                required
              />
            </div>

            <div className="admin-form-field">
              <label>برند *</label>
              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="مثلاً: LG"
                required
              />
            </div>

            <div className="admin-form-field">
              <label>قیمت (تومان) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="مثلاً: 55000000"
                required
                dir="ltr"
              />
            </div>

            <div className="admin-form-field">
              <label>قیمت قدیم (اختیاری)</label>
              <input
                type="number"
                name="oldPrice"
                value={form.oldPrice}
                onChange={handleChange}
                placeholder="مثلاً: 65000000"
                dir="ltr"
              />
            </div>

            <div className="admin-form-field">
              <label>دسته‌بندی</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-field">
              <label>Slug (اختیاری)</label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="مثلاً: lg-ac-18000"
                dir="ltr"
              />
            </div>

            <div className="admin-form-field">
              <label>امتیاز (۰ تا ۵)</label>
              <input
                type="number"
                name="rating"
                value={form.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                dir="ltr"
              />
            </div>

            <div className="admin-form-field">
              <label>تعداد نظرات</label>
              <input
                type="number"
                name="reviewCount"
                value={form.reviewCount}
                onChange={handleChange}
                min="0"
                dir="ltr"
              />
            </div>
          </div>

          <div className="admin-form-field">
            <label>توضیحات</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="توضیحات کامل محصول..."
            />
          </div>

          <div className="admin-form-field admin-form-checkbox">
            <label>
              <input
                type="checkbox"
                name="inStock"
                checked={form.inStock}
                onChange={handleChange}
              />
              <span>موجود در انبار</span>
            </label>
          </div>

          <div className="admin-form-actions">
            <button
              type="submit"
              className="admin-save-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="spin" />
                  <span>در حال ذخیره...</span>
                </>
              ) : (
                <>
                  <Check size={18} />
                  <span>ذخیره محصول</span>
                </>
              )}
            </button>
            <Link href="/admin/products" className="admin-cancel-btn">
              لغو
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
