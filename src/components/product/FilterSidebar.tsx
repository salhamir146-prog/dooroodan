"use client";

import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { FILTER_BRANDS } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

interface Props {
  isOpenMobile?: boolean;
  onClose?: () => void;
}

export default function FilterSidebar({ isOpenMobile, onClose }: Props) {
  const [priceRange, setPriceRange] = useState(65000000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearAll = () => {
    setPriceRange(65000000);
    setSelectedBrands([]);
    setInStockOnly(false);
  };

  return (
    <aside className={`filter-sidebar ${isOpenMobile ? "open" : ""}`}>
      <div className="filter-head">
        <h3>فیلترها</h3>
        <button className="filter-close-mobile" onClick={onClose}>
          <X size={18} />
        </button>
        <button className="filter-clear" onClick={clearAll}>
          پاک کردن
        </button>
      </div>

      {/* Price */}
      <div className="filter-group">
        <h4>محدوده قیمت</h4>
        <input
          type="range"
          min={0}
          max={65000000}
          step={500000}
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="price-range"
        />
        <div className="price-range-labels">
          <span>۰</span>
          <span>{formatPrice(priceRange)} تومان</span>
        </div>
      </div>

      {/* Brands */}
      <div className="filter-group">
        <h4>برند</h4>
        <div className="brand-filters">
          {FILTER_BRANDS.map((brand) => (
            <label key={brand} className="filter-checkbox">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* In stock */}
      <div className="filter-group">
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
          />
          <span>فقط کالاهای موجود</span>
        </label>
      </div>
    </aside>
  );
}