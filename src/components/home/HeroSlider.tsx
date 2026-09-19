"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  Snowflake,
  Wind,
  Gift,
} from "lucide-react";

const SLIDES = [
  {
    id: 1,
    badge: "✨ جدیدترین‌های ۱۴۰۴",
    title: "خانه‌ای مدرن با",
    titleHighlight: "دوو رودان",
    description:
      "جدیدترین لوازم خانگی هوشمند با گارانتی معتبر و قیمت رقابتی",
    buttonText: "مشاهده محصولات",
    buttonLink: "/products",
    secondButtonText: "تخفیف‌ها",
    secondButtonLink: "/products?sale=true",
    bgGradient: "linear-gradient(135deg, #0b3b5c 0%, #1a5a7a 100%)",
    visual: "snowflake",
    cardA: { icon: "shield", title: "گارانتی اصالت", subtitle: "۱۸ ماهه" },
    cardB: { icon: "truck", title: "ارسال سریع", subtitle: "سراسر کشور" },
  },
  {
    id: 2,
    badge: "🔥 فروش ویژه تابستان",
    title: "تا",
    titleHighlight: "۴۰٪ تخفیف",
    description: "فرصت رو از دست نده! بهترین برندها با بهترین قیمت",
    buttonText: "خرید کن",
    buttonLink: "/products?sale=true",
    bgGradient: "linear-gradient(135deg, #1a5a7a 0%, #4a90d9 100%)",
    visual: "wind",
    cardA: { icon: "gift", title: "هدیه خرید", subtitle: "برای همه سفارش‌ها" },
  },
  {
    id: 3,
    badge: "🚚 ارسال رایگان",
    title: "ارسال",
    titleHighlight: "رایگان",
    description: "سفارش بالای ۵ میلیون تومان، ارسال رایگان درب منزل",
    buttonText: "شروع خرید",
    buttonLink: "/products",
    bgGradient: "linear-gradient(135deg, #061f30 0%, #0b3b5c 100%)",
    visual: "shield",
  },
];

function VisualIcon({ type }: { type: string }) {
  const size = 130;
  if (type === "snowflake") return <Snowflake size={size} />;
  if (type === "wind") return <Wind size={size} />;
  return <ShieldCheck size={size} />;
}

function MiniIcon({ type }: { type: string }) {
  if (type === "shield") return <ShieldCheck size={20} />;
  if (type === "truck") return <Truck size={20} />;
  if (type === "gift") return <Gift size={20} />;
  return <ShieldCheck size={20} />;
}

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const goNext = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
    setAutoPlay(false);
  };

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    setAutoPlay(false);
  };

  const slide = SLIDES[current];

  return (
    <section className="hero-slider-section">
      <div
        className="hero-slide"
        style={{ background: slide.bgGradient }}
        key={slide.id}
      >
        <div className="container-main slide-inner">
          <div className="slide-content">
            <span className="slide-badge">{slide.badge}</span>
            <h1>
              {slide.title} <span>{slide.titleHighlight}</span>
            </h1>
            <p>{slide.description}</p>
            <div className="slide-btns">
              <Link href={slide.buttonLink} className="btn btn-primary">
                {slide.buttonText} <ArrowLeft size={18} />
              </Link>
              {slide.secondButtonText && (
                <Link
                  href={slide.secondButtonLink || "#"}
                  className="btn btn-outline-light"
                >
                  {slide.secondButtonText}
                </Link>
              )}
            </div>
          </div>

          <div className="slide-visual">
            {slide.cardA && (
              <div className="floating-card card-a">
                <MiniIcon type={slide.cardA.icon} />
                <div>
                  <strong>{slide.cardA.title}</strong>
                  <small>{slide.cardA.subtitle}</small>
                </div>
              </div>
            )}
            {slide.cardB && (
              <div className="floating-card card-b">
                <MiniIcon type={slide.cardB.icon} />
                <div>
                  <strong>{slide.cardB.title}</strong>
                  <small>{slide.cardB.subtitle}</small>
                </div>
              </div>
            )}
            <div className="visual-circle">
              <VisualIcon type={slide.visual} />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <button className="slider-nav prev" onClick={goPrev} aria-label="قبلی">
        <ChevronRight size={24} />
      </button>
      <button className="slider-nav next" onClick={goNext} aria-label="بعدی">
        <ChevronLeft size={24} />
      </button>

      {/* Dots */}
      <div className="slider-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`slider-dot ${i === current ? "active" : ""}`}
            onClick={() => {
              setCurrent(i);
              setAutoPlay(false);
            }}
            aria-label={`اسلاید ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
