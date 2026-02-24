"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import {
  Search,
  Heart,
  Bell,
  User,
  Menu,
  Leaf,
  X,
  Loader2,
  CardSim
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

type RealProduct = {
  product_url: string;
  source: string;
  product_name: string;
  image_url: string;
  price: string;
  old_price?: string;
  discount?: string;
};

const RECENT_KEY = "recent_searches_v2";
const SUGGESTIONS_KEY = "last_search_suggestions_v1";
const RECENT_LIMIT = 5;

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

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
  sessionStorage.setItem(RECENT_KEY, JSON.stringify(next.slice(0, RECENT_LIMIT)));
}

function addToRecent(term: string) {
  const t = term.trim();
  if (!t) return;

  const existing = readRecent();
  const next = [t, ...existing.filter((x) => x.toLowerCase() !== t.toLowerCase())];
  writeRecent(next);
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

function clampText(s: string, max = 34) {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

export default function Header() {
  const router = useRouter();
  const { t, direction } = useLanguage();

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 450);

  const [aiTags, setAiTags] = useState<string[]>([]);
  const [realProducts, setRealProducts] = useState<RealProduct[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    setRecent(readRecent());
  }, []);

  useEffect(() => {
    let alive = true;

    async function fetchSuggestions() {
      const q = debouncedQuery.trim();

      if (q.length < 3) {
        if (!alive) return;
        setAiTags([]);
        setRealProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [aiRes, realRes] = await Promise.all([
          fetch(`/api/search-products?q=${encodeURIComponent(q)}`, { cache: "no-store" }),
          fetch(`/api/search-products-real?q=${encodeURIComponent(q)}`, { cache: "no-store" }),
        ]);

        const aiJson = await aiRes.json();
        const realJson = await realRes.json();

        if (!alive) return;

        setAiTags(Array.isArray(aiJson?.data) ? aiJson.data : []);
        setRealProducts(Array.isArray(realJson?.data) ? realJson.data : []);
      } catch (e) {
        console.error("search dropdown error:", e);
        if (!alive) return;
        setAiTags([]);
        setRealProducts([]);
      } finally {
        if (alive) setLoading(false);
      }
    }

    fetchSuggestions();
    return () => {
      alive = false;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const close = () => setIsOpen(false);

  const navigateToCategory = (term: string) => {
    addToRecent(term);
    setRecent(readRecent());
    setQuery("");
    close();
    router.push(`/category/${encodeURIComponent(term)}`);
  };

  const navigateToProduct = (p: RealProduct) => {
    const encodedUrl = encodeURIComponent(p.product_url);
    addToRecent(query || p.product_name);
    setRecent(readRecent());
    setQuery("");
    close();

    router.push(
      `/product/${encodedUrl}?product_name=${encodeURIComponent(
        p.product_name
      )}&source=${encodeURIComponent(p.source)}`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    close();
    router.push(`/category/${encodeURIComponent(q)}?view=suggestions`);
  };

  const showPopularAndRecent = isOpen && query.trim().length === 0;
  const showTypedResults = isOpen && query.trim().length >= 1;

  return (
    <>
      <SkipLinks />

      <header className="w-full bg-[#20263E] text-white sticky top-0 z-40">
        {/* Top bar */}
        <div className="mx-auto flex h-[32px] max-w-[1280px] items-center justify-between px-[12px]">
          <ul id="i-header-navigation" className="flex h-full list-none items-center p-0 m-0" role="menu">
            <li className="h-full" role="none">
              <span className="flex h-full items-center px-[12px] text-[13px] font-medium text-white bg-white/10 cursor-not-allowed">
                {t("header.navigation.shopping")}
              </span>
            </li>
            <li
              className="relative h-full before:absolute before:left-0 before:top-1/4 before:h-1/2 before:w-[1px] before:bg-[#ffffff33]"
              role="none"
            >
              <span className="flex h-full items-center px-[12px] text-[13px] font-medium text-[#ffffffb3] cursor-not-allowed">
                {t("header.navigation.flight")}
              </span>
            </li>
            <li
              className="relative h-full before:absolute before:left-0 before:top-1/4 before:h-1/2 before:w-[1px] before:bg-[#ffffff33]"
              role="none"
            >
              <span className="flex h-full items-center px-[12px] text-[13px] font-medium text-[#ffffffb3] cursor-not-allowed">
                {t("header.navigation.magazine")}
              </span>
            </li>
          </ul>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[12px] text-[#ffffffb3]">
              {t("header.sustainability")}
            </span>
            <div className="flex items-center bg-[#2E7D32] rounded px-1.5 py-0.5 cursor-not-allowed">
              <Leaf size={14} className="text-white fill-white" />
            </div>
          </div>
        </div>

        {/* Main header row */}
        <div className="mx-auto max-w-[1280px] px-[12px] py-[12px]">
          <div className="grid grid-cols-[auto_1fr_auto] gap-x-4 lg:gap-x-8 items-center">
            {/* Left: menu + logo */}
            <div className="flex items-center gap-4">
              <Link href="/" className="block" aria-label="Home">
                <div className="flex items-baseline">
                  <span className="text-[32px] font-bold tracking-tighter leading-none">
                    idealo
                  </span>
                  <span className="w-2.5 h-2.5 bg-[#F17720] rounded-full ml-1 mb-1" />
                </div>
              </Link>
            </div>

            {/* Center: search */}
            <div className="relative z-50" ref={dropdownRef}>
              <form
                id="i-header-search"
                role="search"
                className="relative flex items-center h-[44px]"
                autoComplete="off"
                onSubmit={handleSubmit}
              >
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder={t("header.search.placeholder")}
                    value={query}
                    dir={direction}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className="w-full h-[40px] pl-4 pr-[92px] rounded-[4px] border-none text-[16px] text-[#212121] bg-white focus:outline-none focus:ring-0"
                  />

                  <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pr-2 h-full">
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="p-2 text-[#666]"
                        aria-label="Clear search"
                      >
                        <X size={18} />
                      </button>
                    )}
                    <button type="submit" className="p-2 text-[#20263E]" aria-label={t("header.search.searchButton")}>
                      <Search size={24} />
                    </button>
                  </div>
                </div>
              </form>

              {/* Backdrop */}
              {isOpen && (
                <div
                  className="fixed inset-0 bg-black/50"
                  onClick={close}
                  aria-hidden="true"
                />
              )}

              {/* Dropdown */}
              {isOpen && (
                <div
                  className={`absolute top-[calc(100%-4px)] ${direction === "rtl" ? "right-0" : "left-0"
                    } w-full bg-white rounded-b-[4px] shadow-lg text-[#212121] overflow-hidden`}
                >
                  {showPopularAndRecent && (
                    <>
                      <div className="px-4 py-3 border-b border-[#eee]">
                        <span className="text-[14px] font-bold text-[#666]">
                          Popular searches
                        </span>
                      </div>

                      <div className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {popularSearches.map((term) => (
                            <button
                              key={term}
                              type="button"
                              onClick={() => navigateToCategory(term)}
                              className="px-3 py-1 rounded-[4px] text-[13px] bg-[#F1F3F5] hover:bg-[#E9ECEF] text-[#212121] transition-colors"
                              title={term}
                            >
                              {clampText(term, 26)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="px-4 py-3 border-t border-[#eee]">
                        <span className="text-[14px] font-bold text-[#666]">
                          Recently searched
                        </span>
                      </div>

                      <div className="px-4 pb-4">
                        {recent.length === 0 ? (
                          <div className="text-[13px] text-[#666] py-2">
                            No recent searches
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {recent.slice(0, RECENT_LIMIT).map((term) => (
                              <button
                                key={term}
                                type="button"
                                onClick={() => navigateToCategory(term)}
                                className="px-3 py-1 rounded-[4px] text-[13px] bg-[#F1F3F5] hover:bg-[#E9ECEF] text-[#212121] transition-colors"
                                title={term}
                              >
                                {clampText(term, 26)}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {showTypedResults && (
                    <div className="max-h-[420px] overflow-y-auto">
                      {loading ? (
                        <div className="flex items-center gap-2 px-4 py-4 text-[#666]">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-[13px]">Loading…</span>
                        </div>
                      ) : (
                        <>
                          <div className="px-4 py-3 border-b border-[#eee]">
                            <span className="text-[14px] font-bold text-[#666]">
                              Suggestions
                            </span>
                          </div>

                          <ol className="list-none m-0 p-0">
                            {(aiTags?.length ? aiTags : []).map((item, idx) => (
                              <li key={`${item}-${idx}`}>
                                <button
                                  type="button"
                                  onClick={() => navigateToCategory(item)}
                                  className="w-full flex items-center px-4 py-2 hover:bg-[#f1f3f5] text-[14px] transition-colors text-left"
                                  title={item}
                                >
                                  <Search size={14} className="mr-3 text-[#666]" />
                                  <span className="truncate">{item}</span>
                                </button>
                              </li>
                            ))}

                            {query.trim().length >= 3 && aiTags.length === 0 && (
                              <li className="px-4 py-2 text-[13px] text-[#666]">
                                No suggestions found
                              </li>
                            )}
                          </ol>

                          <div className="px-4 py-3 border-t border-[#eee]">
                            <span className="text-[14px] font-bold text-[#666]">
                              Products
                            </span>
                          </div>

                          <div className="px-2 pb-2">
                            {realProducts.length === 0 ? (
                              <div className="px-2 py-2 text-[13px] text-[#666]">
                                No products found
                              </div>
                            ) : (
                              <ul className="list-none m-0 p-0">
                                {realProducts.map((p) => (
                                  <li key={`${p.source}-${p.product_url}`}>
                                    <button
                                      type="button"
                                      onClick={() => navigateToProduct(p)}
                                      className="w-full flex items-center gap-3 px-2 py-2 rounded hover:bg-[#f1f3f5] transition-colors text-left"
                                      title={p.product_name}
                                    >
                                      <div className="h-10 w-10 bg-white border border-[#E0E0E0] rounded overflow-hidden flex-shrink-0 relative">
                                        <Image
                                          src={p.image_url}
                                          alt={p.product_name}
                                          fill
                                          className="object-contain"
                                        />
                                      </div>

                                      <div className="min-w-0 flex-1">
                                        <div className="text-[14px] font-medium truncate">
                                          {p.product_name}
                                        </div>
                                        <div className="text-[12px] text-[#666] truncate">
                                          {p.source} • {p.price}
                                        </div>
                                      </div>
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: actions + language */}
            <div className="flex items-center gap-3 lg:gap-5">
              <LanguageSwitcher variant="compact" className="hidden lg:inline-block" />

              <Link
                href="/wishlist"
                className="flex flex-col items-center justify-center cursor-not-allowed"
                aria-label={t("header.userActions.wishlist")}
                onClick={(e) => e.preventDefault()}
              >
                <Heart size={24} className="text-white" />
                <span className="text-[10px] font-semibold uppercase mt-1 hidden lg:block">
                  {t("header.userActions.wishlist")}
                </span>
              </Link>

             
              <Link
                href="/pricealerts"
                className="flex flex-col items-center justify-center cursor-not-allowed"
                aria-label={t("header.userActions.priceAlert")}
                onClick={(e) => e.preventDefault()}
              >
                <CardSim size={24} className="text-white" />
                <span className="text-[10px] font-semibold uppercase mt-1 hidden lg:block">
                  {t("header.userActions.login")}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}