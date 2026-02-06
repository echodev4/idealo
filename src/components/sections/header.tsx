"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart, Bell, User2, Search, Loader2, CreditCard, X } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
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
        <li><a href="#i-header-navigation">{t("header.skipLinks.navigation")}</a></li>
        <li><a href="#i-header-search">{t("header.skipLinks.search")}</a></li>
        <li><a href="#main">{t("header.skipLinks.main")}</a></li>
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

  // Enter behavior: fetch AI tags (same as dropdown tags) and open grouped view page
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

      // Store tags in sessionStorage so the category page can render grouped boxes instantly.
      sessionStorage.setItem(
        SUGGESTIONS_KEY,
        JSON.stringify({ q, tags, ts: Date.now() })
      );
    } catch {
      // If AI fails, the category page can fall back to normal behavior.
      sessionStorage.setItem(
        SUGGESTIONS_KEY,
        JSON.stringify({ q, tags: [], ts: Date.now() })
      );
    }

    setQuery("");
    closeDropdown();
    router.push(`/category/${q}?view=suggestions`);
  };

  const handleClickLogo = async (event: React.MouseEvent) => {
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
      <header
        id="header-idealo"
        className="bg-[#24456f] text-white font-sans sticky top-0 z-[10000]"
      >
        <div className="hidden md:block">
          <div className="container mx-auto flex justify-between items-center text-xs py-1 px-4">
            <nav id="i-header-navigation">
              <ul className="flex items-center text-sm" role="menu">
                <li role="none">
                  <span
                    className="font-semibold cursor-default px-2"
                    onClick={handleClickLogo}
                  >
                    {t("header.navigation.shopping")}
                  </span>
                </li>
              </ul>
            </nav>
            <div className="flex items-center gap-4">
              <LanguageSwitcher variant="compact" />
            </div>
          </div>
        </div>

        <div className="container mx-auto flex items-center justify-between px-4 h-16 relative">
          <div
            className="flex-1 max-w-xl mx-4 hidden md:block relative"
            ref={dropdownRef}
          >
            <form
              id="i-header-search"
              role="search"
              className="relative"
              autoComplete="off"
              onSubmit={handleSearchSubmit}
            >
              <Input
                type="search"
                id="i-search-input"
                placeholder={t("header.search.placeholder")}
                className="bg-white text-gray-900 rounded-md h-11 w-full pl-4 pr-24 text-base"
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

              <Button
                type="submit"
                className={`absolute ${direction === "rtl" ? "left-1" : "right-1"
                  } top-1/2 -translate-y-1/2 h-9 w-[82px] bg-[#FF6600] hover:bg-orange-600 rounded-md flex items-center justify-center p-0`}
                aria-label={t("header.search.searchButton")}
              >
                <Search size={20} className="text-white" />
              </Button>
            </form>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute mt-2 w-full bg-white text-black shadow-lg rounded-md overflow-hidden z-50">
                {/* Empty input: Popular + Recent */}
                {showPopularAndRecent && (
                  <div className="p-4 space-y-4">
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        Popular Searches
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((term) => (
                          <button
                            key={term}
                            type="button"
                            title={term}
                            onClick={() => navigateToCategory(term)}
                            className="bg-gray-100 hover:bg-gray-200 text-[#24456f] text-sm px-3 py-1 rounded"
                          >
                            {truncateLabel(term, 24)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
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
                              className="bg-gray-100 hover:bg-gray-200 text-[#24456f] text-sm px-3 py-1 rounded"
                            >
                              {truncateLabel(term, 24)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Typed input: AI tags + products */}
                {showTypedResults && (
                  <div className="max-h-[420px] overflow-y-auto">
                    {loading ? (
                      <div className="flex items-center justify-center p-4 text-gray-500">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Loading...
                      </div>
                    ) : (
                      <div className="p-2">
                        {/* AI tags */}
                        {query.trim().length >= 3 && (
                          <div className="px-2 pt-2 pb-1">
                            <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
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

                        {/* Real products */}
                        <div className="px-2 pt-3 pb-2 border-t border-gray-100">
                          <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
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

          <div
            className={`flex items-center space-x-2 md:space-x-4 ${direction === "rtl" ? "flex-row-reverse space-x-reverse" : ""
              }`}
          >
            <button className="md:hidden p-1" aria-label={t("header.search.searchButton")}>
              <Search size={24} />
            </button>

            <p
              className="hidden md:flex flex-col items-center cursor-pointer space-y-1 text-xs hover:opacity-80 transition-opacity"
              onClick={() => router.push("/card-comparison")}
            >
              <CreditCard size={24} />
              <span>{t("header.userActions.card")}</span>
            </p>

            <p className="hidden md:flex flex-col items-center cursor-pointer space-y-1 text-xs hover:opacity-80 transition-opacity">
              <Heart size={24} />
              <span>{t("header.userActions.wishlist")}</span>
            </p>

            <p className="hidden md:flex flex-col items-center cursor-pointer space-y-1 text-xs hover:opacity-80 transition-opacity">
              <Bell size={24} />
              <span>{t("header.userActions.priceAlert")}</span>
            </p>

            <p className="hidden md:flex flex-col cursor-pointer items-center space-y-1 text-xs hover:opacity-80 transition-opacity">
              <User2 size={24} />
              <span>{t("header.userActions.login")}</span>
            </p>

            <div className="md:hidden">
              <LanguageSwitcher variant="compact" />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
