import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-vazir",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "دوو رودان | فروشگاه آنلاین لوازم خانگی",
    template: "%s | دوو رودان",
  },
  description:
    "دوو رودان - فروشگاه آنلاین لوازم خانگی با ضمانت اصالت، ارسال سریع و بهترین قیمت.",
  keywords: ["دوو رودان", "لوازم خانگی", "یخچال", "لباسشویی", "کولر گازی"],
  metadataBase: new URL("https://dooroodan.ir"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body className="font-vazir antialiased">
        <Header />
        <main className="site-main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}