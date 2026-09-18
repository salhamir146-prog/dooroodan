"use client";

import { useState, useEffect } from "react";
import { Menu, Heart, ShoppingBag, User, ChevronDown } from "lucide-react";
import TopBar from "./TopBar";
import SearchBox from "./SearchBox";
import MegaMenu from "./MegaMenu";
import MobileSidebar from "./MobileSidebar";
import { MAIN_MENU, SITE_INFO } from "@/lib/constants";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";

export default function Header() {
  const [openMega, setOpenMega] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalCart = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const totalWishlist = useWishlistStore((state) => state.items.length);

  const handleMegaEnter = (hasMega: string | boolean | undefined) => {
    if (typeof hasMega === "string") {
      setOpenMega(hasMega);
    }
  };

  return (
    <>
      <header className="site-header">
        <TopBar />

        <div className="container-main header-inner">
          <a href="/" className="brand">
            <div className="brand-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C8 6 4 9 4 14c0 4.4 3.6 8 8 8s8-3.6 8-8c0-5-4-8-8-12z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="brand-text">
              <span className="brand-name">{SITE_INFO.name}</span>
              <small className="brand-tag">{SITE_INFO.nameEn}</small>
            </div>
          </a>

          <SearchBox />

          <div className="header-actions">
            <a href="/login" className="action-btn">
              <User size={18} />
              <span>ورود | ثبت‌نام</span>
            </a>
            <a href="/wishlist" className="action-btn wishlist-action">
              <Heart size={18} />
              <span>علاقه‌مندی</span>
              {mounted && totalWishlist > 0 && (
                <span className="wishlist-count">{totalWishlist}</span>
              )}
            </a>
            <a href="/cart" className="action-btn cart-action">
              <ShoppingBag size={18} />
              <span>سبد خرید</span>
              <span className="cart-count">{mounted ? totalCart : 0}</span>
            </a>
          </div>

          <button
            className="menu-toggle"
            onClick={() => setMobileOpen(true)}
            aria-label="منو"
          >
            <Menu size={22} />
          </button>
        </div>

        <nav className="main-nav">
          <div className="container-main nav-inner">
            <ul className="nav-list">
              {MAIN_MENU.map((item) => (
                <li
                  key={item.title}
                  className={item.hasMega ? "has-mega" : ""}
                  onMouseEnter={() => handleMegaEnter(item.hasMega)}
                  onMouseLeave={() => setOpenMega(null)}
                >
                  <a href={item.href} className={item.active ? "active" : ""}>
                    <span>{item.title}</span>
                    {item.hasMega && <ChevronDown size={12} />}
                    {item.hot && <span className="badge-hot">داغ</span>}
                  </a>

                  {item.hasMega && openMega === item.hasMega && (
                    <MegaMenu
                      type={item.hasMega as "categories" | "brands"}
                      onClose={() => setOpenMega(null)}
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <MobileSidebar
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
