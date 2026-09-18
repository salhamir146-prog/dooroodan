"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import FilterSidebar from "@/components/product/FilterSidebar";
import SortBar from "@/components/product/SortBar";
import { SAMPLE_PRODUCTS } from "@/lib/products";

export default function ProductsPage() {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <>
      <div className="breadcrumb">
        <div className="container-main">
          <a href="/">خانه</a>
          <ChevronLeft size={14} />
          <span>محصولات</span>
        </div>
      </div>

      <div className="container-main products-page">
        <div className={`sidebar-wrapper ${filterOpen ? "open" : ""}`}>
          <FilterSidebar
            isOpenMobile={filterOpen}
            onClose={() => setFilterOpen(false)}
          />
        </div>

        {filterOpen && (
          <div
            className="filter-overlay show"
            onClick={() => setFilterOpen(false)}
          />
        )}

        <div className="products-main">
          <SortBar
            total={SAMPLE_PRODUCTS.length}
            onOpenFilter={() => setFilterOpen(true)}
          />

          <div className="products-grid">
            {SAMPLE_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="pagination">
            <button disabled>قبلی</button>
            <button className="active">۱</button>
            <button>۲</button>
            <button>۳</button>
            <button>بعدی</button>
          </div>
        </div>
      </div>
    </>
  );
}