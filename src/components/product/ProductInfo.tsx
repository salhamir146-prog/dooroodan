"use client";

import { useState } from "react";
import {
  ShoppingCart,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  CheckCircle2,
} from "lucide-react";
import type { Product } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

interface Props {
  product: Product;
}

export default function ProductInfo({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    // اضافه کردن به تعداد مشخص
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        slug: product.slug,
        title: product.title,
        brand: product.brand,
        price: product.price,
        image: product.image,
      });
    }

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    // اضافه کن و برو به سبد
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        slug: product.slug,
        title: product.title,
        brand: product.brand,
        price: product.price,
        image: product.image,
      });
    }
    window.location.href = "/cart";
  };

  return (
    <div className="product-info">
      <span className="product-info-brand">{product.brand}</span>
      <h1 className="product-info-title">{product.title}</h1>

      {/* Availability */}
      <div className="product-info-availability">
        {product.inStock ? (
          <>
            <CheckCircle2 size={16} />
            <span>موجود در انبار</span>
          </>
        ) : (
          <span className="out-of-stock">ناموجود</span>
        )}
      </div>

      {/* Price section */}
      <div className="product-info-price">
        <div className="price-row">
          <span className="price-label">قیمت:</span>
          <span className="price-current">
            {formatPrice(product.price)} <small>تومان</small>
          </span>
        </div>
        {product.oldPrice && (
          <div className="price-row-old">
            <span className="price-old">
              {formatPrice(product.oldPrice)} تومان
            </span>
            <span className="price-save">
              {formatPrice(product.oldPrice - product.price)} تومان صرفه‌جویی
            </span>
          </div>
        )}
      </div>

      {/* Quantity + Buttons */}
      <div className="product-info-actions">
        <div className="qty-picker">
          <button
            onClick={() => setQuantity(Math.min(quantity + 1, 10))}
            aria-label="افزایش"
            type="button"
          >
            <Plus size={16} />
          </button>
          <span>{quantity}</span>
          <button
            onClick={() => setQuantity(Math.max(quantity - 1, 1))}
            aria-label="کاهش"
            type="button"
          >
            <Minus size={16} />
          </button>
        </div>

        <button
          className={cn("btn-add-main", isAdded && "added")}
          onClick={handleAdd}
          disabled={!product.inStock}
          type="button"
        >
          <ShoppingCart size={18} />
          <span>{isAdded ? "به سبد اضافه شد ✓" : "افزودن به سبد خرید"}</span>
        </button>

        <button
          className="btn-buy-now"
          onClick={handleBuyNow}
          disabled={!product.inStock}
          type="button"
        >
          <Zap size={18} />
          <span>خرید سریع</span>
        </button>
      </div>

      {/* Features */}
      <div className="product-info-features">
        <div className="feature-item">
          <Truck size={20} />
          <div>
            <strong>ارسال سریع</strong>
            <small>تهران: همان روز | سایر: ۲-۳ روز</small>
          </div>
        </div>
        <div className="feature-item">
          <ShieldCheck size={20} />
          <div>
            <strong>ضمانت اصالت</strong>
            <small>۱۸ ماه گارانتی معتبر</small>
          </div>
        </div>
        <div className="feature-item">
          <RotateCcw size={20} />
          <div>
            <strong>بازگشت کالا</strong>
            <small>تا ۷ روز پس از دریافت</small>
          </div>
        </div>
      </div>
    </div>
  );
}