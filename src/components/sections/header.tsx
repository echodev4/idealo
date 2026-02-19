"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Heart,
  Bell,
  User2,
  Search,
  Loader2,
  CreditCard,
  Tag,
  Plane,
  Home,
  Baby,
  Gamepad2,
  Car,
  Shirt,
  PawPrint,
  Utensils,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useRouter } from "next/navigation";

// small debounce helper
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const SkipLinks = () => {
  const { t } = useLanguage();
  return (
    <nav>
      <ul className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:p-4 focus-within:bg-white focus-within:text-black focus-within:z-50">
        <li>
          <a href="#i-header-navigation">{t("header.skipLinks.navigation")}</a>
        </li>
        <li>
          <a href="#i-header-search">{t("header.skipLinks.search")}</a>
        </li>
        <li>
          <a href="#main">{t("header.skipLinks.main")}</a>
        </li>
      </ul>
    </nav>
  );
};

type RealProduct = {
  product_url: string;
  source: string;
  product_name: string;
  image_url: string;
  price: string;
  old_price?: string;
  discount?: string;
};

const RECENT_KEY = "recent_searches_v1";
const SUGGESTIONS_KEY = "last_search_suggestions_v1";

function readRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(RECENT_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeRecent(next: string[]) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(RECENT_KEY, JSON.stringify(next.slice(0, 8)));
}

function addToRecent(term: string) {
  const t = term.trim();
  if (!t) return;
  const existing = readRecent();
  const next = [t, ...existing.filter((x) => x.toLowerCase() !== t.toLowerCase())];
  writeRecent(next);
}

function truncateLabel(s: string, max = 22) {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

function HeaderAction({
  icon,
  label,
  onClick,
  cursor
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  cursor: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`hidden md:flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 transition ${cursor}`}
    >
      <span className="text-white/90">{icon}</span>
      <span className="text-sm text-white/90">{label}</span>
    </button>
  );
}

export default function Header() {
  const { t, direction } = useLanguage();
  const [query, setQuery] = useState<string>("");

  const [aiTags, setAiTags] = useState<string[]>([]);
  const [realProducts, setRealProducts] = useState<RealProduct[]>([]);

  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // debounce query by 1200ms
  const debouncedQuery = useDebounce(query, 1200);

  // categories (Popular Searches)
  const popularSearches = useMemo(
    () => [
      "Electronics",
      "Sports & Outdoor",
      "Baby & Kids",
      "Home & Garden",
      "Food & Drink",
      "Gaming & Toys",
      "Health & Beauty",
      "Automotive",
      "Fashion & Accessories",
      "Pet Supplies",
    ],
    []
  );

  const navCats = useMemo(
    () => [
      { label: "Deals", term: "Deals", icon: <Tag size={18} /> },
      { label: "Electronics", term: "Electronics", icon: <Sparkles size={18} /> },
      { label: "Sports & Outdoor", term: "Sports & Outdoor", icon: <Gamepad2 size={18} /> },
      { label: "Baby & Kids", term: "Baby & Kids", icon: <Baby size={18} /> },
      { label: "Home & Garden", term: "Home & Garden", icon: <Home size={18} /> },
      { label: "Food & Drink", term: "Food & Drink", icon: <Utensils size={18} /> },
      { label: "Automotive", term: "Automotive", icon: <Car size={18} /> },
      { label: "Fashion", term: "Fashion & Accessories", icon: <Shirt size={18} /> },
      { label: "Pet Supplies", term: "Pet Supplies", icon: <PawPrint size={18} /> },
      { label: "Flight", term: "Flight", icon: <Plane size={18} /> },
    ],
    []
  );

  const closeDropdown = () => setShowDropdown(false);

  const navigateToCategory = (term: string) => {
    addToRecent(term);
    setRecent(readRecent());
    setQuery("");
    closeDropdown();
    router.push(`/category/${term}`);
  };

  const navigateToProduct = (p: RealProduct) => {
    const encodedUrl = encodeURIComponent(p.product_url);
    addToRecent(query || p.product_name);
    setRecent(readRecent());
    setQuery("");
    closeDropdown();
    router.push(
      `/product/${encodedUrl}?product_name=${encodeURIComponent(p.product_name)}&source=${encodeURIComponent(
        p.source
      )}`
    );
  };

  const handleSearchSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const q = query.trim();
    if (!q) return;

    addToRecent(q);
    setRecent(readRecent());

    try {
      const res = await fetch(`/api/search-products?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      const tags: string[] = Array.isArray(data?.data) ? data.data.slice(0, 5) : [];

      sessionStorage.setItem(SUGGESTIONS_KEY, JSON.stringify({ q, tags, ts: Date.now() }));
    } catch {
      sessionStorage.setItem(SUGGESTIONS_KEY, JSON.stringify({ q, tags: [], ts: Date.now() }));
    }

    setQuery("");
    closeDropdown();
    router.push(`/category/${q}?view=suggestions`);
  };

  const handleClickLogo = (event: React.MouseEvent) => {
    event.preventDefault();
    router.push(`/`);
  };

  // load recent on mount
  useEffect(() => {
    setRecent(readRecent());
  }, []);

  // fetch AI tags + real products for dropdown
  useEffect(() => {
    let isActive = true;

    const fetchDropdownData = async () => {
      const q = debouncedQuery.trim();

      if (!q || q.length < 3) {
        if (isActive) {
          setAiTags([]);
          setRealProducts([]);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);

        const [aiRes, prodRes] = await Promise.all([
          fetch(`/api/search-products?q=${encodeURIComponent(q)}`),
          fetch(`/api/search-products-real?q=${encodeURIComponent(q)}`),
        ]);

        const aiJson = await aiRes.json();
        const prodJson = await prodRes.json();

        if (!isActive) return;

        setAiTags(Array.isArray(aiJson?.data) ? aiJson.data : []);
        setRealProducts(Array.isArray(prodJson?.data) ? prodJson.data : []);
      } catch (err) {
        console.error("Dropdown search failed:", err);
        if (isActive) {
          setAiTags([]);
          setRealProducts([]);
        }
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchDropdownData();
    return () => {
      isActive = false;
    };
  }, [debouncedQuery]);

  // close dropdown on outside click
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const showPopularAndRecent = showDropdown && !query.trim();
  const showTypedResults = showDropdown && query.trim().length >= 1;

  return (
    <>
      <SkipLinks />

      <header className="sticky top-0 z-[10000] text-white" style={{ background: "var(--color-idealo-blue)" }}>
        {/* Top mini row (SHOPPING / FLIGHT / MAGAZINE) */}
        <div className="hidden md:block border-b" style={{ borderColor: "var(--color-idealo-divider)" }}>
          <div className="mx-auto max-w-[1280px] px-4 h-10 flex items-center justify-between">
            <nav id="i-header-navigation" className="flex items-center gap-6 text-sm">
              <button className="font-semibold underline underline-offset-4" type="button">
                SHOPPING
              </button>
              <button className="opacity-90 hover:opacity-100" type="button">
                FLIGHT
              </button>
              <button className="opacity-90 hover:opacity-100" type="button">
                MAGAZINE
              </button>
            </nav>
          </div>
        </div>

        {/* Main header row */}
        <div className="mx-auto max-w-[1280px] px-4">
          {/* Row 1: logo + actions */}
          <div className="h-14 md:h-16 flex items-center justify-between gap-3">
            {/* Logo (left) */}
            <button
              type="button"
              onClick={handleClickLogo}
              className="flex items-center gap-2"
              aria-label="Home"
            >
              <span className="text-3xl font-extrabold tracking-tight leading-none cursor-pointer">
                idealo
              </span>
            </button>

            <div className="hidden md:block flex-1 max-w-[680px] relative mx-4" ref={dropdownRef}>
              <form
                id="i-header-search"
                role="search"
                className="relative"
                autoComplete="off"
                onSubmit={handleSearchSubmit}
              >
                <Input
                  type="search"
                  placeholder={t("header.search.placeholder")}
                  className="bg-white text-gray-900 rounded-md h-11 w-full pl-4 pr-14 text-base"
                  aria-label={t("header.search.placeholder")}
                  name="search"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  dir={direction}
                  value={query}
                  onFocus={() => setShowDropdown(true)}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                />

                <button
                  type="submit"
                  className={`absolute top-1/2 -translate-y-1/2 h-9 w-12 rounded-md flex items-center justify-center ${direction === "rtl" ? "left-1" : "right-1"
                    }`}
                  style={{ background: "var(--color-primary)" }}
                  aria-label={t("header.search.searchButton")}
                >
                  <Search size={18} className="text-white" />
                </button>
              </form>

              {/* Dropdown (desktop) */}
              {showDropdown && (
                <div className="absolute mt-2 w-full bg-white text-black shadow-lg rounded-md overflow-hidden z-50 border border-gray-200">
                  {showPopularAndRecent && (
                    <div className="p-4 space-y-4">
                      <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase mb-2">
                          Popular Searches
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {popularSearches.map((term) => (
                            <button
                              key={term}
                              type="button"
                              title={term}
                              onClick={() => navigateToCategory(term)}
                              className="text-sm px-3 py-1 rounded"
                              style={{
                                background: "var(--color-idealo-chip-bg)",
                                color: "var(--color-idealo-chip-text)",
                              }}
                            >
                              {truncateLabel(term, 24)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase mb-2">
                          Recently Searched
                        </div>
                        {recent.length === 0 ? (
                          <div className="text-sm text-gray-500">No recent searches</div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {recent.slice(0, 8).map((term) => (
                              <button
                                key={term}
                                type="button"
                                title={term}
                                onClick={() => navigateToCategory(term)}
                                className="text-sm px-3 py-1 rounded"
                                style={{
                                  background: "var(--color-idealo-chip-bg)",
                                  color: "var(--color-idealo-chip-text)",
                                }}
                              >
                                {truncateLabel(term, 24)}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {showTypedResults && (
                    <div className="max-h-[420px] overflow-y-auto">
                      {loading ? (
                        <div className="flex items-center justify-center p-4 text-gray-500">
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Loading...
                        </div>
                      ) : (
                        <div className="p-2">
                          {query.trim().length >= 3 && (
                            <div className="px-2 pt-2 pb-2">
                              <div className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                Suggestions
                              </div>

                              {aiTags.length > 0 ? (
                                <ul className="space-y-1">
                                  {aiTags.map((item, index) => (
                                    <li key={`${item}-${index}`}>
                                      <button
                                        type="button"
                                        title={item}
                                        className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 truncate"
                                        onClick={() => navigateToCategory(item)}
                                      >
                                        {item}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="px-3 py-2 text-sm text-gray-500">
                                  No suggestions found
                                </div>
                              )}
                            </div>
                          )}

                          <div className="px-2 pt-3 pb-2 border-t border-gray-100">
                            <div className="text-xs font-semibold text-gray-400 uppercase mb-2">
                              Products
                            </div>

                            {realProducts.length > 0 ? (
                              <ul className="space-y-1">
                                {realProducts.map((p) => (
                                  <li key={`${p.source}-${p.product_url}`}>
                                    <button
                                      type="button"
                                      className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 flex items-center gap-3"
                                      onClick={() => navigateToProduct(p)}
                                      title={p.product_name}
                                    >
                                      <div className="h-10 w-10 bg-gray-50 rounded overflow-hidden flex-shrink-0 relative">
                                        {p.image_url ? (
                                          <Image
                                            src={p.image_url}
                                            alt={p.product_name}
                                            fill
                                            className="object-contain"
                                          />
                                        ) : null}
                                      </div>

                                      <div className="min-w-0 flex-1">
                                        <div className="text-sm font-medium truncate">
                                          {p.product_name}
                                        </div>
                                        <div className="text-xs text-gray-500 truncate">
                                          {p.source} • {p.price}
                                        </div>
                                      </div>
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="px-3 py-2 text-sm text-gray-500">
                                No products found
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-1">
              <HeaderAction icon={<Heart size={18} />} label={t("header.userActions.wishlist")} cursor="not-allowed" />
              <HeaderAction icon={<Bell size={18} />} label={t("header.userActions.priceAlert")} cursor="not-allowed" />
              <HeaderAction icon={<User2 size={18} />} label={t("header.userActions.login")} cursor="not-allowed" />
              <HeaderAction
                icon={<CreditCard size={18} />}
                label={t("header.userActions.card")}
                onClick={() => router.push("/card-comparison")}
                cursor="cursor-pointer"
              />
            </div>

            {/* Mobile actions (3 icons) */}
            <div className="md:hidden flex items-center gap-1">
              <button
                type="button"
                className="p-2 rounded hover:bg-white/10"
                aria-label={t("header.userActions.card")}
                onClick={() => router.push("/card-comparison")}
              >
                <CreditCard size={22} />
              </button>

              <button
                type="button"
                className="p-2 rounded hover:bg-white/10"
                aria-label={t("header.userActions.wishlist")}
              >
                <Heart size={22} />
              </button>

              <button
                type="button"
                className="p-2 rounded hover:bg-white/10"
                aria-label={t("header.userActions.login")}
              >
                <User2 size={22} />
              </button>
            </div>
          </div>

          <div className="md:hidden pb-3" ref={dropdownRef}>
            <form role="search" className="relative" autoComplete="off" onSubmit={handleSearchSubmit}>
              <Input
                type="search"
                placeholder={t("header.search.placeholder")}
                className="bg-white text-gray-900 rounded-md h-11 w-full pl-4 pr-14 text-base"
                value={query}
                dir={direction}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowDropdown(true);
                }}
              />

              <button
                type="submit"
                className={`absolute top-1/2 -translate-y-1/2 h-9 w-12 rounded-md flex items-center justify-center ${direction === "rtl" ? "left-1" : "right-1"
                  }`}
                style={{ background: "var(--color-primary)" }}
              >
                <Search size={18} className="text-white" />
              </button>
            </form>

            {/* Mobile dropdown */}
            {showDropdown && (
              <div className="mt-2 w-full bg-white text-black shadow-lg rounded-md overflow-hidden z-50 border border-gray-200">
                {showPopularAndRecent && (
                  <div className="p-4 space-y-4">
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase mb-2">
                        Popular Searches
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((term) => (
                          <button
                            key={term}
                            type="button"
                            title={term}
                            onClick={() => navigateToCategory(term)}
                            className="text-sm px-3 py-1 rounded"
                            style={{
                              background: "var(--color-idealo-chip-bg)",
                              color: "var(--color-idealo-chip-text)",
                            }}
                          >
                            {truncateLabel(term, 24)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase mb-2">
                        Recently Searched
                      </div>
                      {recent.length === 0 ? (
                        <div className="text-sm text-gray-500">No recent searches</div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {recent.slice(0, 8).map((term) => (
                            <button
                              key={term}
                              type="button"
                              title={term}
                              onClick={() => navigateToCategory(term)}
                              className="text-sm px-3 py-1 rounded"
                              style={{
                                background: "var(--color-idealo-chip-bg)",
                                color: "var(--color-idealo-chip-text)",
                              }}
                            >
                              {truncateLabel(term, 24)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {showTypedResults && (
                  <div className="max-h-[320px] overflow-y-auto">
                    {loading ? (
                      <div className="flex items-center justify-center p-4 text-gray-500">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Loading...
                      </div>
                    ) : (
                      <div className="p-2">
                        {query.trim().length >= 3 && (
                          <div className="px-2 pt-2 pb-2">
                            <div className="text-xs font-semibold text-gray-400 uppercase mb-2">
                              Suggestions
                            </div>
                            {aiTags.length > 0 ? (
                              <ul className="space-y-1">
                                {aiTags.map((item, index) => (
                                  <li key={`${item}-${index}`}>
                                    <button
                                      type="button"
                                      title={item}
                                      className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 truncate"
                                      onClick={() => navigateToCategory(item)}
                                    >
                                      {item}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="px-3 py-2 text-sm text-gray-500">
                                No suggestions found
                              </div>
                            )}
                          </div>
                        )}

                        <div className="px-2 pt-3 pb-2 border-t border-gray-100">
                          <div className="text-xs font-semibold text-gray-400 uppercase mb-2">
                            Products
                          </div>
                          {realProducts.length > 0 ? (
                            <ul className="space-y-1">
                              {realProducts.map((p) => (
                                <li key={`${p.source}-${p.product_url}`}>
                                  <button
                                    type="button"
                                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 flex items-center gap-3"
                                    onClick={() => navigateToProduct(p)}
                                    title={p.product_name}
                                  >
                                    <div className="h-10 w-10 bg-gray-50 rounded overflow-hidden flex-shrink-0 relative">
                                      {p.image_url ? (
                                        <Image
                                          src={p.image_url}
                                          alt={p.product_name}
                                          fill
                                          className="object-contain"
                                        />
                                      ) : null}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <div className="text-sm font-medium truncate">
                                        {p.product_name}
                                      </div>
                                      <div className="text-xs text-gray-500 truncate">
                                        {p.source} • {p.price}
                                      </div>
                                    </div>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              No products found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>


        {/* Second nav row (categories) */}
        <div style={{ background: "var(--color-idealo-blue-2)" }} className="border-t" >
          <div className="mx-auto max-w-[1280px] px-4">
            <div className="h-12 flex items-center gap-2 overflow-x-auto overflow-y-hidden whitespace-nowrap no-scrollbar">
              {navCats.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => navigateToCategory(c.term)}
                  className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 transition whitespace-nowrap text-sm text-white/90 cursor-pointer"

                >
                  <span className="opacity-90">{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
