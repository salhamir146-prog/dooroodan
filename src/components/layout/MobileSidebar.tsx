"use client";

import { useEffect } from "react";
import {
  X,
  Home,
  Box,
  Grid3x3,
  Tag,
  HelpCircle,
  User,
  ShoppingBag,
  Heart,
} from "lucide-react";
import { MOBILE_MENU, SITE_INFO } from "@/lib/constants";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  Home,
  Box,
  Grid3x3,
  Tag,
  HelpCircle,
  User,
  ShoppingBag,
  Heart,
};

export default function MobileSidebar({ isOpen, onClose }: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const menuItems = [
    ...MOBILE_MENU,
    { title: "علاقه‌مندی‌ها", href: "/wishlist", icon: "Heart" },
  ];

  return (
    <>
      <div
        className={`mobile-overlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
      />
      <aside className={`mobile-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-head">
          <span className="sidebar-brand">{SITE_INFO.name}</span>
          <button className="close-side" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <ul className="side-menu">
          {menuItems.map((item) => {
            const Icon = ICONS[item.icon] || Home;
            return (
              <li key={item.title}>
                <a href={item.href} onClick={onClose}>
                  <Icon size={18} />
                  <span>{item.title}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="sidebar-footer">
          <p>{SITE_INFO.phone}</p>
        </div>
      </aside>
    </>
  );
}