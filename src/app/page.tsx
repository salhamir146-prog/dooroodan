import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  ArrowLeft,
  Gift,
  Star,
} from "lucide-react";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import HeroSlider from "@/components/home/HeroSlider";
import Categories from "@/components/home/Categories";
import ProductsShowcase from "@/components/home/ProductsShowcase";
import type { Product } from "@/types";

async function getProducts(limit = 12): Promise<Product[]> {
  try {
    const ctx = getCloudflareContext();
    const db = (ctx.env as any).DB;

    if (!db) return [];

    const { results } = await db
      .prepare("SELECT * FROM products ORDER BY created_at DESC LIMIT ?")
      .bind(limit)
      .all();

    return (results || []).map((p: any) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      brand: p.brand,
      price: p.price,
      oldPrice: p.old_price || undefined,
      image: p.image,
      rating: p.rating || 0,
      reviewCount: p.review_count || 0,
      category: p.category,
      tags: p.tags ? JSON.parse(p.tags) : [],
      inStock: p.in_stock === 1,
    }));
  } catch (error) {
    console.error("getProducts error:", error);
    return [];
  }
}

export default async function Home() {
  const allProducts = await getProducts(12);

  const featured = allProducts.slice(0, 6);
  const onSale = allProducts
    .filter((p) => p.oldPrice && p.oldPrice > p.price)
    .slice(0, 6);

  return (
    <>
      {/* ============ HERO SLIDER ============ */}
      <HeroSlider />

      {/* ============ TRUST BAR ============ */}
      <section className="trust-bar">
        <div className="container-main trust-inner">
          <div className="trust-item">
            <ShieldCheck size={24} />
            <div>
              <strong>ضمانت اصالت</strong>
              <small>۱۰۰٪ اورجینال</small>
            </div>
          </div>
          <div className="trust-item">
            <Truck size={24} />
            <div>
              <strong>ارسال سریع</strong>
              <small>۲۴ تا ۴۸ ساعت</small>
            </div>
          </div>
          <div className="trust-item">
            <RotateCcw size={24} />
            <div>
              <strong>بازگشت کالا</strong>
              <small>تا ۷ روز</small>
            </div>
          </div>
          <div className="trust-item">
            <Headphones size={24} />
            <div>
              <strong>پشتیبانی</strong>
              <small>۲۴/۷ در کنار شما</small>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <Categories />

      {/* ============ FEATURED PRODUCTS ============ */}
      <ProductsShowcase
        products={featured}
        title="محصولات ویژه"
        subtitle="منتخبی از بهترین محصولات این هفته"
        viewAllLink="/products"
      />

      {/* ============ PROMO BANNER ============ */}
      <section className="promo-banner">
        <div className="container-main promo-inner">
          <div className="promo-content">
            <span className="promo-tag">🎁 پیشنهاد ویژه</span>
            <h2>تا ۴۰٪ تخفیف روی لوازم خانگی</h2>
            <p>
              فرصت محدود! همین حالا خرید کن و از تخفیف‌های ویژه بهره‌مند شو
            </p>
            <Link href="/products?sale=true" className="btn btn-white">
              مشاهده تخفیف‌ها <ArrowLeft size={16} />
            </Link>
          </div>
          <div className="promo-visual">
            <Gift size={140} />
          </div>
        </div>
      </section>

      {/* ============ ON SALE PRODUCTS ============ */}
      {onSale.length > 0 && (
        <ProductsShowcase
          products={onSale}
          title="تخفیف‌های ویژه"
          subtitle="فرصت رو از دست نده!"
          viewAllLink="/products?sale=true"
        />
      )}

      {/* ============ TESTIMONIALS ============ */}
      <section className="section">
        <div className="container-main">
          <div className="section-head">
            <h2 className="section-title">نظرات مشتریان</h2>
            <p className="section-sub">
              تجربه خرید خود را با ما به اشتراک بگذارید
            </p>
          </div>

          <div className="testimonials">
            <div className="testi-card">
              <div className="testi-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p>
                «کیفیت محصولات فوق‌العاده بود و ارسال خیلی سریع انجام شد. حتماً
                باز هم خرید می‌کنم.»
              </p>
              <div className="testi-author">
                <div className="testi-avatar">م</div>
                <div>
                  <strong>مهدی رضایی</strong>
                  <small>تهران</small>
                </div>
              </div>
            </div>

            <div className="testi-card">
              <div className="testi-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p>
                «قیمت‌ها واقعاً منصفانه‌ست و پشتیبانی خیلی خوب جواب می‌ده.
                تجربه خرید عالی داشتم.»
              </p>
              <div className="testi-author">
                <div className="testi-avatar">س</div>
                <div>
                  <strong>سارا محمدی</strong>
                  <small>اصفهان</small>
                </div>
              </div>
            </div>

            <div className="testi-card">
              <div className="testi-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p>
                «بسته‌بندی خیلی حرفه‌ای و محصول سالم به دستم رسید. ممنون از تیم
                دوو رودان.»
              </p>
              <div className="testi-author">
                <div className="testi-avatar">ع</div>
                <div>
                  <strong>علی کریمی</strong>
                  <small>مشهد</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="cta-section">
        <div className="container-main cta-inner">
          <div>
            <h2>عضو خانواده دوو رودان شوید</h2>
            <p>
              با ثبت‌نام، از تخفیف‌های ویژه مشتریان جدید بهره‌مند شوید
            </p>
          </div>
          <Link href="/login" className="btn btn-primary btn-lg">
            ثبت‌نام رایگان <ArrowLeft size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
