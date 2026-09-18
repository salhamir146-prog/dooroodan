"use client";

import { useState } from "react";
import { Star, FileText, MessageSquare } from "lucide-react";
import type { Product } from "@/types";

interface Props {
  product: Product;
}

const TABS = [
  { id: "specs", label: "مشخصات فنی", icon: FileText },
  { id: "desc", label: "توضیحات", icon: FileText },
  { id: "reviews", label: "نظرات کاربران", icon: MessageSquare },
];

const SPECS = [
  { key: "برند", value: "" },
  { key: "مدل", value: "" },
  { key: "گارانتی", value: "۱۸ ماه شرکتی" },
  { key: "کشور سازنده", value: "کره جنوبی" },
  { key: "رنگ", value: "سفید" },
  { key: "وزن", value: "۵۵ کیلوگرم" },
  { key: "ابعاد", value: "۱۰۰×۶۰×۵۰ سانتی‌متر" },
  { key: "مصرف انرژی", value: "A+++" },
];

export default function ProductTabs({ product }: Props) {
  const [activeTab, setActiveTab] = useState("specs");

  return (
    <div className="product-tabs">
      <div className="tabs-head">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="tabs-body">
        {activeTab === "specs" && (
          <div className="specs-grid">
            {SPECS.map((spec, i) => (
              <div className="spec-item" key={i}>
                <span className="spec-key">{spec.key}</span>
                <span className="spec-value">
                  {spec.value || product.brand}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "desc" && (
          <div className="desc-content">
            <p>
              {product.title} یکی از محصولات باکیفیت و پرطرفدار برند{" "}
              <strong>{product.brand}</strong> است که با طراحی مدرن و امکانات
              پیشرفته، تجربه‌ای متفاوت را برای شما رقم می‌زند.
            </p>
            <p>
              این محصول دارای گارانتی معتبر ۱۸ ماهه شرکتی است و با خدمات پس از
              فروش گسترده در سراسر کشور، خیال شما را از بابت کیفیت راحت
              می‌کند.
            </p>
            <ul>
              <li>✅ کیفیت ساخت بالا و مواد اولیه درجه یک</li>
              <li>✅ طراحی مدرن و شیک</li>
              <li>✅ مصرف انرژی بهینه</li>
              <li>✅ گارانتی معتبر و خدمات پس از فروش</li>
            </ul>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="reviews-content">
            <div className="reviews-summary">
              <div className="reviews-score">
                <span className="score-number">{product.rating}</span>
                <div className="score-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={
                        i < Math.floor(product.rating) ? "currentColor" : "none"
                      }
                    />
                  ))}
                </div>
                <small>از {product.reviewCount} نظر</small>
              </div>
            </div>

            <div className="review-item">
              <div className="review-head">
                <strong>علی محمدی</strong>
                <div className="review-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p>
                کیفیت خیلی خوبی داره، دقیقاً همون چیزی بود که انتظار داشتم.
                ارسال هم سریع انجام شد.
              </p>
              <small className="review-date">۲ هفته پیش</small>
            </div>

            <div className="review-item">
              <div className="review-head">
                <strong>سارا احمدی</strong>
                <div className="review-stars">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" />
                  ))}
                  <Star size={12} />
                </div>
              </div>
              <p>
                محصول خوبیه ولی قیمتش یه کم بالاست. کیفیت ساخت واقعاً
                راضی‌کننده‌ست.
              </p>
              <small className="review-date">۱ ماه پیش</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}