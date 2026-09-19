import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Snowflake,
  Shirt,
  Wind,
  Flame,
  Tv,
  Utensils,
  ArrowLeft,
  Gift,
  Star,
  Quote,
} from "lucide-react";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { formatPrice, discountPercent } from "@/lib/utils";
import type { Product } from "@/types";

// ============ تابع کمکی برای گرفتن محصولات ============
async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const ctx = getCloudflareContext();
    const db = (ctx.env as any).DB;

    if (!db) return [];

    const { results } = await db
      .prepare("SELECT * FROM products ORDER BY created_at DESC LIMIT 8")
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
    console.error("getFeaturedProducts error:", error);
    return [];
  }
}

// ============ صفحه‌ی خانه ============
export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="hero-slider">
          <div className="slide active" style={{ background: "linear-gradient(135deg, #0b3b5c 0%, #1a5a7a 100%)" }}>
            <div className="container-main slide-inner">
              <div className="slide-content">
                <span className="slide-badge">✨ جدیدترین‌های ۱۴۰۴</span>
                <h1>
                  خانه‌ای مدرن با <span>دوو رودان</span>
                </h1>
                <p>
                  جدیدترین لوازم خانگی هوشمند با گارانتی معتبر و قیمت رقابتی
                </p>
                <div className="slide-btns">
                  <Link href="/products" className="btn btn-primary">
                    مشاهده محصولات <ArrowLeft size={18} />
                  </Link>
                  <Link href="/products?sale=true" className="btn btn-outline-light">
                    تخفیف‌ها
                  </Link>
                </div>
              </div>
              <div className="slide-visual">
                <div className="floating-card card-a">
                  <ShieldCheck size={20} />
                  <div>
                    <strong>گارانتی اصالت</strong>
                    <small>۱۸ ماهه</small>
                  </div>
                </div>
                <div className="floating-card card-b">
                  <Truck size={20} />
                  <div>
                    <strong>ارسال سریع</strong>
                    <small>سراسر کشور</small>
                  </div>
                </div>
                <div className="visual-circle">
                  <Snowflake size={130} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
      <section className="section">
        <div className="container-main">
          <div className="section-head">
            <h2 className="section-title">دسته‌بندی محصولات</h2>
            <p className="section-sub">دسته‌بندی مورد نظر خود را انتخاب کنید</p>
          </div>

          <div className="categories-grid">
            <Link href="/products?cat=fridge" className="cat-card">
              <div className="cat-icon"><Snowflake size={26} /></div>
              <h4>یخچال و فریزر</h4>
              <span>۱۲۰+ محصول</span>
            </Link>
            <Link href="/products?cat=washer" className="cat-card">
              <div className="cat-icon"><Shirt size={26} /></div>
              <h4>لباسشویی</h4>
              <span>۸۵+ محصول</span>
            </Link>
            <Link href="/products?cat=cooler" className="cat-card">
              <div className="cat-icon"><Wind size={26} /></div>
              <h4>سرمایش و گرمایش</h4>
              <span>۹۵+ محصول</span>
            </Link>
            <Link href="/products?cat=cooker" className="cat-card">
              <div className="cat-icon"><Flame size={26} /></div>
              <h4>پخت و پز</h4>
              <span>۶۰+ محصول</span>
            </Link>
            <Link href="/products?cat=tv" className="cat-card">
              <div className="cat-icon"><Tv size={26} /></div>
              <h4>صوتی و تصویری</h4>
              <span>۱۵۰+ محصول</span>
            </Link>
            <Link href="/products?cat=kitchen" className="cat-card">
              <div className="cat-icon"><Utensils size={26} /></div>
              <h4>لوازم آشپزخانه</h4>
              <span>۲۰۰+ محصول</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="section section-alt">
        <div className="container-main">
          <div className="section-head">
            <h2 className="section-title">محصولات ویژه</h2>
            <p className="section-sub">منتخبی از بهترین محصولات این هفته</p>
          </div>

          {products.length === 0 ? (
            <div className="home-empty">
              <p>هنوز محصولی اضافه نشده. بعداً برگردید!</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => {
                const discount = product.oldPrice
                  ? discountPercent(product.price, product.oldPrice)
                  : 0;

                return (
                  <article key={product.id} className="product-card">
                    {discount > 0 && (
                      <span className="product-badge badge-sale">
                        {discount}٪ تخفیف
                      </span>
                    )}
                    {product.tags?.includes("new") && !discount && (
                      <span className="product-badge badge-new">جدید</span>
                    )}

                    <Link href={`/products/${product.slug}`} className="product-media">
                      <img
                        src={product.image}
                        alt={product.title}
                        loading="lazy"
                      />
                    </Link>

                    <div className="product-body">
                      <span className="product-brand">{product.brand}</span>
                      <h3 className="product-title">
                        <Link href={`/products/${product.slug}`}>
                          {product.title}
                        </Link>
                      </h3>

                      <div className="product-rating">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            fill={
                              i < Math.floor(product.rating)
                                ? "currentColor"
                                : "none"
                            }
                            color="currentColor"
                          />
                        ))}
                        <span>({product.rating})</span>
                      </div>

                      <div className="product-price">
                        <div className="price-main">
                          {formatPrice(product.price)} <small>تومان</small>
                        </div>
                        {product.oldPrice && (
                          <div className="price-old">
                            {formatPrice(product.oldPrice)}
                          </div>
                        )}
                      </div>

                      <Link
                        href={`/products/${product.slug}`}
                        className="btn-add-cart"
                      >
                        <ArrowLeft size={16} />
                        <span>مشاهده</span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <div className="center-btn">
            <Link href="/products" className="btn btn-outline">
              مشاهده همه محصولات <ArrowLeft size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ PROMO BANNER ============ */}
      <section className="promo-banner">
        <div className="container-main promo-inner">
          <div className="promo-content">
            <span className="promo-tag">🎁 پیشنهاد ویژه</span>
            <h2>تا ۴۰٪ تخفیف روی لوازم خانگی</h2>
            <p>
              فرصت محدود! همین حالا خرید کن و از تخفیف‌های ویژه بهره‌مند شو
            </p>
            <Link href="/products" className="btn btn-white">
              مشاهده تخفیف‌ها <ArrowLeft size={16} />
            </Link>
          </div>
          <div className="promo-visual">
            <Gift size={140} />
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="section">
        <div className="container-main">
          <div className="section-head">
            <h2 className="section-title">نظرات مشتریان</h2>
            <p className="section-sub">تجربه خرید خود را با ما به اشتراک بگذارید</p>
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
