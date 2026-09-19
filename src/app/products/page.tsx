"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import FilterSidebar from "@/components/product/FilterSidebar";
import SortBar from "@/components/product/SortBar";
import { getProducts } from "@/lib/api";
import type { Product } from "@/types";

export default function ProductsPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <>
      <div className="breadcrumb">
        <div className="container-main">
          <Link href="/">خانه</Link>
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
            total={products.length}
            onOpenFilter={() => setFilterOpen(true)}
          />

          {loading ? (
            <div className="products-loading">
              <Loader2 size={40} className="spin" />
              <p>در حال بارگذاری محصولات...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="products-empty">
              <p>هنوز محصولی اضافه نشده است.</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="pagination">
              <button disabled>قبلی</button>
              <button className="active">۱</button>
              <button>بعدی</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
