"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

const SAMPLE_SUGGESTIONS = [
  "یخچال ساید بای ساید",
  "ماشین لباسشویی",
  "کولر گازی اینورتر",
  "اجاق گاز ۵ شعله",
  "مایکروویو هوشمند",
  "جارو رباتیک",
  "ماشین ظرفشویی",
  "پکیج دیواری",
  "پنکه سقفی",
  "چای‌ساز",
];

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length === 0) {
      setSuggestions([]);
      return;
    }
    const filtered = SAMPLE_SUGGESTIONS.filter((s) =>
      s.includes(query.trim())
    ).slice(0, 6);
    setSuggestions(filtered);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setShowSuggest(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="search-box" ref={boxRef}>
      <Search size={18} className="search-icon" />
      <input
        type="text"
        placeholder="جستجوی محصول، برند یا دسته‌بندی..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowSuggest(true)}
      />
      <button className="search-btn">جستجو</button>

      {showSuggest && suggestions.length > 0 && (
        <div className="search-suggest">
          {suggestions.map((s) => (
            <a key={s} href={`/products?q=${encodeURIComponent(s)}`}>
              <Search size={14} />
              <span>{s}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}