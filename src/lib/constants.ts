// اطلاعات فروشگاه
export const SITE_INFO = {
    name: "دوو رودان",
    nameEn: "DOO ROODAN",
    tagline: "خانه‌ای مدرن، زندگی‌ای راحت",
    phone: "۰۲۱-۱۲۳۴۵۶۷۸",
    phoneRaw: "+982112345678",
    email: "info@dooroodan.ir",
    address: "تهران، خیابان ولیعصر، پلاک ۱۲۳",
    workingHours: "شنبه تا پنجشنبه، ۹ الی ۲۰",
    domain: "dooroodan.ir",
  };
  
  // نوار بالا
  export const TOP_BAR_ITEMS = {
    left: "ارسال رایگان بالای ۵ میلیون تومان",
    right: [
      { icon: "phone", text: SITE_INFO.phone, href: `tel:${SITE_INFO.phoneRaw}` },
      { icon: "headset", text: "پشتیبانی ۲۴/۷", href: "#" },
    ],
  };
  
  // دسته‌بندی‌های اصلی (برای مگا منو)
  export const CATEGORIES = [
    {
      id: "fridge",
      title: "یخچال و فریزر",
      icon: "snowflake",
      href: "/products?cat=fridge",
      children: [
        { title: "یخچال ساید بای ساید", href: "/products?sub=side-by-side" },
        { title: "یخچال فریزر بالا", href: "/products?sub=top-freezer" },
        { title: "یخچال فریزر پایین", href: "/products?sub=bottom-freezer" },
        { title: "فریزر صنعتی", href: "/products?sub=industrial-freezer" },
        { title: "یخچال ویترینی", href: "/products?sub=showcase" },
      ],
    },
    {
      id: "washer",
      title: "شستشو و ظرفشویی",
      icon: "shirt",
      href: "/products?cat=washer",
      children: [
        { title: "ماشین لباسشویی", href: "/products?sub=washing-machine" },
        { title: "ماشین ظرفشویی", href: "/products?sub=dishwasher" },
        { title: "لباسشویی توکار", href: "/products?sub=built-in-washer" },
        { title: "خشک‌کن", href: "/products?sub=dryer" },
        { title: "اتو و بخار", href: "/products?sub=iron" },
      ],
    },
    {
      id: "cooler",
      title: "سرمایش و گرمایش",
      icon: "wind",
      href: "/products?cat=cooler",
      children: [
        { title: "کولر گازی", href: "/products?sub=ac" },
        { title: "کولر آبی", href: "/products?sub=water-cooler" },
        { title: "پکیج و رادیاتور", href: "/products?sub=package" },
        { title: "بخاری برقی", href: "/products?sub=heater" },
        { title: "پنکه", href: "/products?sub=fan" },
      ],
    },
    {
      id: "cooker",
      title: "پخت و پز",
      icon: "flame",
      href: "/products?cat=cooker",
      children: [
        { title: "اجاق گاز", href: "/products?sub=stove" },
        { title: "مایکروویو", href: "/products?sub=microwave" },
        { title: "فر برقی", href: "/products?sub=oven" },
        { title: "سرخ‌کن بدون روغن", href: "/products?sub=airfryer" },
        { title: "چای‌ساز و قهوه‌ساز", href: "/products?sub=tea-maker" },
      ],
    },
  ];
  
  // برندها
  export const BRANDS = [
    "LG",
    "Samsung",
    "Bosch",
    "Hisense",
    "Xiaomi",
    "Snowa",
    "Pakshoma",
    "Emersun",
    "Beko",
    "Daewoo",
    "Midea",
    "Whirlpool",
  ];
  
  // منو اصلی
  export const MAIN_MENU = [
    { title: "خانه", href: "/", active: true },
    { title: "محصولات", href: "/products", hasMega: false },
    { title: "دسته‌بندی", href: "#", hasMega: "categories" },
    { title: "برندها", href: "#", hasMega: "brands" },
    { title: "تخفیف‌ها", href: "/products?sale=true", hot: true },
    { title: "سوالات متداول", href: "/faq" },
    { title: "تماس با ما", href: "/contact" },
    { title: "پیگیری استعلام", href: "/track" },
  ];
  
  // منوی موبایل
  export const MOBILE_MENU = [
    { title: "خانه", href: "/", icon: "Home" },
    { title: "محصولات", href: "/products", icon: "Box" },
    { title: "دسته‌بندی", href: "/products", icon: "Grid3x3" },
    { title: "تخفیف‌ها", href: "/products?sale=true", icon: "Tag" },
    { title: "سوالات متداول", href: "/faq", icon: "HelpCircle" },
    { title: "حساب کاربری", href: "/account", icon: "User" },
    { title: "سبد خرید", href: "/cart", icon: "ShoppingBag" },
  ];
