"use client";

import { useState } from "react";
import { ChevronDown, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { SORT_OPTIONS } from "@/lib/products";

interface Props {
  total: number;
  onOpenFilter?: () => void;
}

export default function SortBar({ total, onOpenFilter }: Props) {
  const [sort, setSort] = useState("newest");
  const [open, setOpen] = useState(false);
  const current = SORT_OPTIONS.find((s) => s.value === sort);

  return (
    <div className="sort-bar">
      <div className="sort-left">
        <span className="sort-count">{total.toLocaleString("fa-IR")} محصول</span>
      </div>

      <div className="sort-right">
        <button className="filter-toggle-btn" onClick={onOpenFilter}>
          <SlidersHorizontal size={16} />
          <span>فیلتر</span>
        </button>

        <div className="sort-dropdown">
          <button className="sort-trigger" onClick={() => setOpen(!open)}>
            <span>مرتب‌سازی: {current?.label}</span>
            <ChevronDown size={14} />
          </button>
          {open && (
            <ul className="sort-menu">
              {SORT_OPTIONS.map((opt) => (
                <li key={opt.value}>
                  <button
                    className={sort === opt.value ? "active" : ""}
                    onClick={() => {
                      setSort(opt.value);
                      setOpen(false);
                    }}
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}