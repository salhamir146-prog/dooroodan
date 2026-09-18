"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItemType } from "@/store/cart";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="cart-item">
      {/* Image */}
      <a href={`/products/${item.slug}`} className="cart-item-image">
        <img src={item.image} alt={item.title} />
      </a>

      {/* Info */}
      <div className="cart-item-info">
        <span className="cart-item-brand">{item.brand}</span>
        <a href={`/products/${item.slug}`} className="cart-item-title">
          {item.title}
        </a>
        <div className="cart-item-price-mobile">
          {formatPrice(item.price)} <small>تومان</small>
        </div>
      </div>

      {/* Quantity */}
      <div className="cart-item-qty">
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          aria-label="افزایش"
        >
          <Plus size={14} />
        </button>
        <span>{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          aria-label="کاهش"
        >
          <Minus size={14} />
        </button>
      </div>

      {/* Price */}
      <div className="cart-item-price">
        {formatPrice(item.price * item.quantity)} <small>تومان</small>
      </div>

      {/* Remove */}
      <button
        className="cart-item-remove"
        onClick={() => removeItem(item.id)}
        aria-label="حذف"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}