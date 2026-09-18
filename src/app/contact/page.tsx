"use client";

import { useState } from "react";
import {
  ChevronLeft,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { SITE_INFO } from "@/lib/constants";

const InstagramIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TelegramIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z"></path>
    <path d="M22 2 11 13"></path>
  </svg>
);

const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1200);
  };

  return (
    <>
      <div className="breadcrumb">
        <div className="container-main">
          <Link href="/">خانه</Link>
          <ChevronLeft size={14} />
          <span>تماس با ما</span>
        </div>
      </div>

      <div className="container-main contact-page">
        <div className="contact-hero">
          <h1>با ما در تماس باشید</h1>
          <p>تیم دوو رودان آماده پاسخگویی به سوالات و پیشنهادات شماست.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info-col">
            <div className="contact-card">
              <div className="contact-card-icon"><Phone size={22} /></div>
              <div>
                <h4>تماس تلفنی</h4>
                <a href={`tel:${SITE_INFO.phoneRaw}`}>{SITE_INFO.phone}</a>
                <small>پاسخگویی ۲۴ ساعته</small>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-card-icon"><Mail size={22} /></div>
              <div>
                <h4>ایمیل</h4>
                <a href={`mailto:${SITE_INFO.email}`}>{SITE_INFO.email}</a>
                <small>پاسخ در کمتر از ۲۴ ساعت</small>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-card-icon"><MapPin size={22} /></div>
              <div>
                <h4>آدرس دفتر</h4>
                <span>{SITE_INFO.address}</span>
                <small>شنبه تا پنجشنبه</small>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-card-icon"><Clock size={22} /></div>
              <div>
                <h4>ساعت کاری</h4>
                <span>{SITE_INFO.workingHours}</span>
                <small>پشتیبانی آنلاین ۲۴/۷</small>
              </div>
            </div>

            <div className="contact-social">
              <h4>شبکه‌های اجتماعی</h4>
              <div className="contact-social-row">
                <a href="#" aria-label="اینستاگرام"><InstagramIcon size={20} /></a>
                <a href="#" aria-label="تلگرام"><TelegramIcon size={20} /></a>
                <a href="#" aria-label="واتساپ"><WhatsAppIcon size={20} /></a>
              </div>
            </div>
          </div>

          <div className="contact-form-col">
            <div className="contact-form-card">
              <h2>ارسال پیام</h2>
              <p>فرم زیر را تکمیل کنید و ما در اسرع وقت پاسخ می‌دهیم.</p>

              {submitted ? (
                <div className="contact-success">
                  <div className="success-icon">✓</div>
                  <h3>پیام شما ارسال شد!</h3>
                  <p>به‌زودی با شما تماس خواهیم گرفت.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>نام و نام خانوادگی *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="مثلاً: علی محمدی" required />
                    </div>
                    <div className="form-group">
                      <label>شماره تماس *</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="۰۹۱۲۳۴۵۶۷۸۹" pattern="[0-9]{11}" required />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>ایمیل</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@mail.com" />
                    </div>
                    <div className="form-group">
                      <label>موضوع *</label>
                      <select name="subject" value={formData.subject} onChange={handleChange} required>
                        <option value="">انتخاب کنید...</option>
                        <option value="order">درباره سفارش</option>
                        <option value="product">درباره محصول</option>
                        <option value="support">پشتیبانی فنی</option>
                        <option value="complaint">شکایت</option>
                        <option value="suggestion">پیشنهاد</option>
                        <option value="other">سایر</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>پیام شما *</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} rows={6} placeholder="پیام خود را اینجا بنویسید..." required />
                  </div>

                  <button type="submit" className="contact-submit" disabled={sending}>
                    <Send size={18} />
                    <span>{sending ? "در حال ارسال..." : "ارسال پیام"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}