"use client";

import { useState } from "react";
import { ChevronLeft, Search, MessageCircle, Phone, Mail, ChevronDown } from "lucide-react";
import Link from "next/link";

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

const FAQ_CATEGORIES = [
  { id: "all", label: "همه" },
  { id: "order", label: "ثبت سفارش" },
  { id: "payment", label: "پرداخت" },
  { id: "shipping", label: "ارسال" },
  { id: "return", label: "مرجوعی" },
  { id: "warranty", label: "گارانتی" },
  { id: "account", label: "حساب کاربری" },
];

const FAQS: FAQItem[] = [
  { category: "order", q: "چطور می‌توانم سفارش ثبت کنم؟", a: "کافیست محصول مورد نظر خود را انتخاب کنید و روی دکمه «افزودن به سبد خرید» کلیک کنید. سپس به صفحه سبد خرید بروید و با تکمیل اطلاعات، سفارش خود را ثبت کنید." },
  { category: "order", q: "آیا می‌توانم سفارشم را لغو کنم؟", a: "بله، تا قبل از ارسال سفارش، می‌توانید از طریق پنل کاربری یا تماس با پشتیبانی، سفارش خود را لغو کنید." },
  { category: "order", q: "چطور از وضعیت سفارشم مطلع شوم؟", a: "پس از ثبت سفارش، کد رهگیری برای شما پیامک می‌شود. همچنین از طریق پنل کاربری بخش «سفارش‌های من» می‌توانید وضعیت سفارش را مشاهده کنید." },
  { category: "payment", q: "روش‌های پرداخت چیست؟", a: "پرداخت آنلاین از طریق درگاه‌های بانکی معتبر (زرین‌پال، آیدی‌پی و ...) و همچنین پرداخت در محل (در برخی شهرها) امکان‌پذیر است." },
  { category: "payment", q: "آیا پرداخت امن است؟", a: "بله، تمامی تراکنش‌ها از طریق درگاه‌های بانکی دارای مجوز انجام می‌شود و اطلاعات کارت شما نزد ما ذخیره نمی‌شود." },
  { category: "payment", q: "چرا قیمت‌ها بعد از انتخاب تغییر می‌کند؟", a: "به دلیل نوسانات بازار و تغییر قیمت محصولات، در صفحه سبد خرید دکمه «استعلام قیمت» قرار داده شده که با یک کلیک می‌توانید قیمت جدید را از فروشنده دریافت کنید." },
  { category: "shipping", q: "هزینه ارسال چقدر است؟", a: "هزینه ارسال بسته به مقصد و وزن سفارش محاسبه می‌شود. سفارش‌های بالای ۵ میلیون تومان ارسال رایگان دارند." },
  { category: "shipping", q: "چه مدت طول می‌کشد تا سفارش من برسد؟", a: "ارسال به تهران در همان روز و به سایر شهرها حداکثر ۲ تا ۳ روز کاری زمان می‌برد." },
  { category: "shipping", q: "آیا امکان تحویل درب منزل وجود دارد؟", a: "بله، ارسال به درب منزل شما انجام می‌شود. برای لوازم حجیم، هماهنگی حمل و نصب با شما انجام خواهد شد." },
  { category: "return", q: "شرایط بازگشت کالا چیست؟", a: "تا ۷ روز پس از دریافت کالا، در صورت سالم بودن و باز نشدن بسته‌بندی اصلی، امکان بازگشت وجود دارد." },
  { category: "return", q: "چطور کالا را مرجوع کنم؟", a: "از طریق پنل کاربری بخش «سفارش‌های من» → انتخاب سفارش → درخواست مرجوعی، یا تماس با پشتیبانی." },
  { category: "warranty", q: "گارانتی محصولات چند ماهه است؟", a: "مدت گارانتی بسته به نوع محصول متفاوت است. به طور کلی، محصولات دارای ۱۸ ماه گارانتی شرکتی معتبر هستند." },
  { category: "warranty", q: "آیا خدمات پس از فروش ارائه می‌دهید؟", a: "بله، تمامی محصولات دارای خدمات پس از فروش رسمی برند هستند." },
  { category: "account", q: "چطور ثبت‌نام کنم؟", a: "با وارد کردن شماره موبایل و دریافت کد تایید (OTP)، می‌توانید به سرعت ثبت‌نام کنید." },
  { category: "account", q: "رمز عبورم را فراموش کرده‌ام، چه کنم؟", a: "از صفحه ورود، روی «فراموشی رمز» کلیک کنید و با وارد کردن شماره موبایل، کد تایید دریافت کنید." },
  { category: "account", q: "چطور اطلاعات حسابم را ویرایش کنم؟", a: "پس از ورود به حساب کاربری، از بخش «پروفایل» می‌توانید نام، ایمیل، شماره و سایر اطلاعات خود را ویرایش کنید." },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = FAQS.filter((faq) => {
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      faq.q.includes(searchQuery) ||
      faq.a.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div className="breadcrumb">
        <div className="container-main">
          <Link href="/">خانه</Link>
          <ChevronLeft size={14} />
          <span>سوالات متداول</span>
        </div>
      </div>

      <div className="container-main faq-page">
        <div className="faq-hero">
          <h1>چطور می‌توانیم کمکتان کنیم؟</h1>
          <p>پاسخ سوالات پرتکرار شما در یک نگاه</p>

          <div className="faq-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="جستجو در سوالات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="faq-categories">
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`faq-cat-btn ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="faq-list">
          {filtered.length === 0 ? (
            <div className="faq-empty">
              <p>سوالی با این مشخصات پیدا نشد.</p>
            </div>
          ) : (
            filtered.map((faq, i) => (
              <div key={i} className={`faq-item ${openIndex === i ? "open" : ""}`}>
                <button
                  className="faq-question"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={18} />
                </button>
                {openIndex === i && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="faq-contact">
          <h3>پاسخ سوال خود را پیدا نکردید؟</h3>
          <p>تیم پشتیبانی ما آماده کمک به شماست</p>

          <div className="faq-contact-grid">
            <a href="tel:+982112345678" className="faq-contact-item">
              <Phone size={24} />
              <strong>تماس تلفنی</strong>
              <small>۰۲۱-۱۲۳۴۵۶۷۸</small>
            </a>
            <a href="/contact" className="faq-contact-item">
              <MessageCircle size={24} />
              <strong>فرم تماس</strong>
              <small>پاسخ در کمتر از ۲۴ ساعت</small>
            </a>
            <a href="mailto:info@dooroodan.ir" className="faq-contact-item">
              <Mail size={24} />
              <strong>ایمیل</strong>
              <small>info@dooroodan.ir</small>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}