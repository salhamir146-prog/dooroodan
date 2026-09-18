import { Phone, Headphones, Truck } from "lucide-react";
import { SITE_INFO, TOP_BAR_ITEMS } from "@/lib/constants";

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="container-main topbar-inner">
        <div className="topbar-left">
          <Truck size={14} />
          <span>{TOP_BAR_ITEMS.left}</span>
        </div>
        <div className="topbar-right">
          <a href={`tel:${SITE_INFO.phoneRaw}`}>
            <Phone size={14} />
            <span>{SITE_INFO.phone}</span>
          </a>
          <a href="#">
            <Headphones size={14} />
            <span>پشتیبانی ۲۴/۷</span>
          </a>
        </div>
      </div>
    </div>
  );
}