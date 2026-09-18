// محصول
export interface Product {
    id: string;
    slug: string;
    title: string;
    brand: string;
    price: number;
    oldPrice?: number;
    image: string;
    images?: string[];
    rating: number;
    reviewCount: number;
    category: string;
    tags?: string[];
    description?: string;
    inStock: boolean;
  }
  
  // آیتم سبد خرید
  export interface CartItem {
    id: string;
    title: string;
    brand: string;
    price: number;
    image: string;
    quantity: number;
  }
  
  // کاربر
  export interface User {
    id: string;
    phone: string;
    name?: string;
    email?: string;
    role: "user" | "admin";
  }