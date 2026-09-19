"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItemType {
  id: string;
  slug: string;
  title: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
}

interface InquiryInfo {
  id: string;
  phone: string;
  createdAt: number;
}

interface CartStore {
  items: CartItemType[];
  inquiry: InquiryInfo | null;
  addItem: (item: Omit<CartItemType, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setInquiry: (info: InquiryInfo) => void;
  clearInquiry: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      inquiry: null,

      addItem: (newItem) => {
        const items = get().items;
        const existing = items.find((item) => item.id === newItem.id);

        if (existing) {
          set({
            items: items.map((item) =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...items, { ...newItem, quantity: 1 }] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [], inquiry: null }),

      setInquiry: (info) => set({ inquiry: info }),

      clearInquiry: () => set({ inquiry: null }),

      getTotalPrice: () =>
        get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),

      getTotalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "dooroodan-cart",
    }
  )
);
