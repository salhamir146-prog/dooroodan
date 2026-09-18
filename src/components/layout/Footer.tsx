import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { SITE_INFO } from "@/lib/constants";

// SVG دستی برای شبکه‌های اجتماعی
const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TelegramIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z"></path>
    <path d="M22 2 11 13"></path>
  </svg>
);

const WhatsAppIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const YoutubeIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-main footer-grid">
        {/* ستون ۱ */}
        <div className="footer-col footer-about">
          <div className="brand footer-brand">
            <div className="brand-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C8 6 4 9 4 14c0 4.4 3.6 8 8 8s8-3.6 8-8c0-5-4-8-8-12z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="brand-text">
              <span className="brand-name footer-brand-name">
                {SITE_INFO.name}
              </span>
              <small className="brand-tag">{SITE_INFO.nameEn}</small>
            </div>
          </div>

          <p className="footer-desc">
            {SITE_INFO.name}، فروشگاه آنلاین لوازم خانگی با هدف ارائه بهترین
            تجربه خرید اینترنتی در ایران. ضمانت اصالت کالا، ارسال سریع و
            پشتیبانی ۲۴/۷.
          </p>

          <div className="social-row">
            <a href="#" aria-label="اینستاگرام">
              <InstagramIcon size={18} />
            </a>
            <a href="#" aria-label="تلگرام">
              <TelegramIcon size={18} />
            </a>
            <a href="#" aria-label="واتساپ">
              <WhatsAppIcon size={18} />
            </a>
            <a href="#" aria-label="یوتیوب">
              <YoutubeIcon size={18} />
            </a>
          </div>
        </div>

        {/* ستون ۲ */}
        <div className="footer-col">
          <h4>دسترسی سریع</h4>
          <ul>
            <li><a href="/">خانه</a></li>
            <li><a href="/products">محصولات</a></li>
            <li><a href="/cart">سبد خرید</a></li>
            <li><a href="/account">حساب کاربری</a></li>
            <li><a href="/login">ورود / ثبت‌نام</a></li>
          </ul>
        </div>

        {/* ستون ۳ */}
        <div className="footer-col">
          <h4>خدمات مشتریان</h4>
          <ul>
            <li><a href="/faq">سوالات متداول</a></li>
            <li><a href="/contact">تماس با ما</a></li>
            <li><a href="/terms">قوانین و مقررات</a></li>
            <li><a href="/privacy">حریم خصوصی</a></li>
            <li><a href="/returns">رویه بازگشت کالا</a></li>
          </ul>
        </div>

        {/* ستون ۴ */}
        <div className="footer-col">
          <h4>تماس با ما</h4>
          <ul className="contact-list">
            <li>
              <MapPin size={16} />
              <span>{SITE_INFO.address}</span>
            </li>
            <li>
              <Phone size={16} />
              <a href={`tel:${SITE_INFO.phoneRaw}`}>{SITE_INFO.phone}</a>
            </li>
            <li>
              <Mail size={16} />
              <a href={`mailto:${SITE_INFO.email}`}>{SITE_INFO.email}</a>
            </li>
            <li>
              <Clock size={16} />
              <span>{SITE_INFO.workingHours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container-main">
          © تمامی حقوق برای <strong>{SITE_INFO.name}</strong> محفوظ است.
        </div>
      </div>
    </footer>
  );
}