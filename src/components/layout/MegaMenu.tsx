"use client";

import { Snowflake, Shirt, Wind, Flame, Gift } from "lucide-react";
import { CATEGORIES, BRANDS } from "@/lib/constants";

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  snowflake: Snowflake,
  shirt: Shirt,
  wind: Wind,
  flame: Flame,
};

interface Props {
  type: "categories" | "brands";
  onClose: () => void;
}

export default function MegaMenu({ type, onClose }: Props) {
  if (type === "brands") {
    return (
      <div className="mega-menu brands-mega">
        <div className="brands-grid">
          {BRANDS.map((brand) => (
            <a
              key={brand}
              href={`/products?brand=${brand}`}
              className="brand-item"
            >
              <span>{brand}</span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mega-menu">
      {CATEGORIES.map((cat) => {
        const Icon = ICONS[cat.icon] || Snowflake;
        return (
          <div className="mega-col" key={cat.id}>
            <h4>
              <Icon size={16} />
              <span>{cat.title}</span>
            </h4>
            <ul>
              {cat.children.map((child) => (
                <li key={child.title}>
                  <a href={child.href} onClick={onClose}>
                    {child.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      <div className="mega-col mega-col-promo">
        <div className="promo-card">
          <Gift size={32} />
          <h5>تخفیف ویژه</h5>
          <p>تا ۴۰٪ تخفیف</p>
          <a href="/products?sale=true">مشاهده</a>
        </div>
      </div>
    </div>
  );
}