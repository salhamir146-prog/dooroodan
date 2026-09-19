"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Plus,
  Search,
  Edit3,
  Trash2,
  Package,
  ArrowRight,
  Home,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  slug: string;
  title: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  in_stock: number;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const meRes = await fetch("/api/admin/me");
        const meData = await meRes.json();
        if (!meData.success) {
          router.push("/admin/login");
          return;
        }

        const res = await fetch("/api/admin/products");
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("مطمئنی می‌خوای این محصول رو حذف کنی؟")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("خطا در حذف محصول");
      }
    } catch {
      alert("خطا در ارتباط با سرور");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

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
          <Link href="/admin/products" className="active">
            <Package size={18} />
            <span>محصولات</span>
          </Link>
          <Link href="/admin/orders">
            <ArrowRight size={18} />
            <span>سفارشات</span>
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
            <h1>مدیریت محصولات</h1>
            <p>{products.length} محصول در فروشگاه</p>
          </div>
          <Link href="/admin/products/new" className="admin-add-btn">
            <Plus size={18} />
            <span>افزودن محصول</span>
          </Link>
        </header>

        {/* Search */}
        <div className="admin-search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="جستجو در محصولات..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Products Table */}
        {filtered.length === 0 ? (
          <div className="admin-empty">
            <Package size={60} />
            <h2>محصولی پیدا نشد</h2>
            <p>
              {search
                ? "نتیجه‌ای برای جستجوی شما یافت نشد."
                : "هنوز محصولی اضافه نکردی."}
            </p>
          </div>
        ) : (
          <div className="admin-products-list">
            {filtered.map((p) => (
              <div key={p.id} className="admin-product-row">
                <div className="admin-product-img">
                  <img src={p.image} alt={p.title} />
                </div>

                <div className="admin-product-info">
                  <strong>{p.title}</strong>
                  <div className="admin-product-meta">
                    <span>{p.brand}</span>
                    <span>•</span>
                    <span>{p.category}</span>
                    {p.in_stock === 0 && (
                      <>
                        <span>•</span>
                        <span className="admin-stock-out">ناموجود</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="admin-product-price">
                  {formatPrice(p.price)} <small>تومان</small>
                </div>

                <div className="admin-product-actions">
                  <Link
                    href={`/admin/products/edit/${p.id}`}
                    className="admin-action-btn edit"
                    title="ویرایش"
                  >
                    <Edit3 size={16} />
                  </Link>
                  <button
                    className="admin-action-btn delete"
                    onClick={() => handleDelete(p.id)}
                    disabled={deleting === p.id}
                    title="حذف"
                  >
                    {deleting === p.id ? (
                      <Loader2 size={16} className="spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
