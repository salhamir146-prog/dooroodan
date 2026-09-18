// تبدیل اعداد انگلیسی به فارسی
export function toPersianNumber(num: number | string): string {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num
      .toString()
      .replace(/\d/g, (d) => persianDigits[parseInt(d)]);
  }
  
  // قالب‌بندی قیمت به تومان
  export function formatPrice(price: number): string {
    return toPersianNumber(price.toLocaleString("en-US"));
  }
  
  // محاسبه درصد تخفیف
  export function discountPercent(price: number, oldPrice: number): number {
    if (oldPrice <= price) return 0;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  }
  
  // ترکیب کلاس‌ها (به جای clsx)
  export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(" ");
  }