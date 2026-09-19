import Link from "next/link";
import {
  Snowflake,
  Shirt,
  Wind,
  Flame,
  Tv,
  Utensils,
  Coffee,
  Mic,
} from "lucide-react";

const CATEGORIES = [
  {
    id: "fridge",
    title: "یخچال و فریزر",
    icon: Snowflake,
    count: "۱۲۰+",
    color: "blue",
  },
  {
    id: "washer",
    title: "لباسشویی",
    icon: Shirt,
    count: "۸۵+",
    color: "teal",
  },
  {
    id: "cooler",
    title: "سرمایش و گرمایش",
    icon: Wind,
    count: "۹۵+",
    color: "cyan",
  },
  {
    id: "cooker",
    title: "پخت و پز",
    icon: Flame,
    count: "۶۰+",
    color: "orange",
  },
  {
    id: "tv",
    title: "صوتی و تصویری",
    icon: Tv,
    count: "۱۵۰+",
    color: "purple",
  },
  {
    id: "kitchen",
    title: "لوازم آشپزخانه",
    icon: Utensils,
    count: "۲۰۰+",
    color: "green",
  },
  {
    id: "coffee",
    title: "چای و قهوه",
    icon: Coffee,
    count: "۴۵+",
    color: "brown",
  },
  {
    id: "audio",
    title: "صوتی خانگی",
    icon: Mic,
    count: "۸۰+",
    color: "pink",
  },
];

export default function Categories() {
  return (
    <section className="section">
      <div className="container-main">
        <div className="section-head">
          <h2 className="section-title">دسته‌بندی محصولات</h2>
          <p className="section-sub">دسته‌بندی مورد نظر خود را انتخاب کنید</p>
        </div>

        <div className="categories-grid">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/products?cat=${cat.id}`}
                className={`cat-card cat-${cat.color}`}
              >
                <div className="cat-icon">
                  <Icon size={28} />
                </div>
                <h4>{cat.title}</h4>
                <span>{cat.count} محصول</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
