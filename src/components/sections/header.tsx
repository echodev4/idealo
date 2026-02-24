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
  CreditCard,
  Percent,
  Plug,
  Dumbbell,
  Baby,
  Home,
  Utensils,
  Gamepad2,
  HeartPulse,
  Car,
  Shirt,
  PawPrint,
  Plane,
  ChevronRight,
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
  const categoriesRef = useRef<HTMLDivElement | null>(null);

  const categories = useMemo(
    () => [
      { label: "Deals", icon: Percent, active: true },
      { label: "Electrical goods", icon: Plug },
      { label: "Sports & Outdoors", icon: Dumbbell },
      { label: "Baby & Child", icon: Baby },
      { label: "Home & Garden", icon: Home },
      { label: "Food & Drink", icon: Utensils },
      { label: "Gaming & Play", icon: Gamepad2 },
      { label: "Drugstore & Health", icon: HeartPulse },
      { label: "Cars & Motorcycles", icon: Car },
      { label: "Fashion & Accessories", icon: Shirt },
      { label: "Pet supplies", icon: PawPrint },
      { label: "Flight", icon: Plane },
    ],
    []
  );

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
      `/product/${encodedUrl}?product_name=${encodeURIComponent(p.product_name)}&source=${encodeURIComponent(
        p.source
      )}`
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

  const scrollCategoriesRight = () => {
    categoriesRef.current?.scrollBy({ left: 260, behavior: "smooth" });
  };

  const scrollCategoriesLeft = () => {
    categoriesRef.current?.scrollBy({ left: -260, behavior: "smooth" });
  };

  return (
    <>
      <SkipLinks />

      <header className="sticky top-0 z-40 text-white [&_a:hover]:no-underline">
        <div className="bg-[#0A3761]">
          <div className="mx-auto max-w-[1280px] px-3">
            <div className="grid h-[40px] grid-cols-[1fr_auto_1fr] items-center">
              <div />
              <ul
                id="i-header-navigation"
                className="flex h-full items-center justify-center gap-0"
                role="menu"
              >
                <li role="none" className="h-full">
                  <span className="relative flex h-full items-center px-3 text-[13px] font-bold uppercase tracking-wide">
                    {t("header.navigation.shopping")}
                    <span className="absolute bottom-[8px] left-3 right-3 h-[3px] bg-[#FF6600]" />
                  </span>
                </li>
                <li role="none" className="h-full">
                  <span className="relative flex h-full items-center px-3 text-[13px] font-bold uppercase tracking-wide cursor-not-allowed opacity-90">
                    {t("header.navigation.flight")}
                  </span>
                </li>
                <li role="none" className="h-full">
                  <span className="relative flex h-full items-center px-3 text-[13px] font-bold uppercase tracking-wide cursor-not-allowed opacity-90">
                    {t("header.navigation.magazine")}
                  </span>
                </li>
              </ul>

              <div className="flex items-center justify-end gap-2">
                <span className="hidden md:inline text-[13px] font-semibold opacity-95">
                  {t("header.sustainability")} {t("header.atIdealo") ?? ""}
                </span>
                <div className="flex items-center gap-1">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-[#2E7D32] cursor-not-allowed">
                    <Leaf size={14} className="text-white fill-white" />
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-[#2E7D32] cursor-not-allowed">
                    <Leaf size={14} className="text-white fill-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10">
            <div className="mx-auto max-w-[1280px] px-3 py-3">
              <div className="hidden lg:flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded hover:bg-white/10"
                    aria-label="Menu"
                  >
                    <Menu size={22} />
                  </button>

                  <Link href="/" className="block no-underline hover:no-underline" aria-label="Home">                    <div className="leading-none">
                    <div className="text-[40px] font-bold tracking-tight">idealo</div>
                    <div className="mt-1 h-[5px] w-[92px] bg-[#FF6600]" />
                  </div>
                  </Link>
                </div>

                <div className="min-w-0 flex-1 relative z-50" ref={dropdownRef}>
                  <form
                    id="i-header-search"
                    role="search"
                    className="relative"
                    autoComplete="off"
                    onSubmit={handleSubmit}
                  >
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
                      className="h-[44px] w-full rounded-[4px] border-0 bg-white pl-4 pr-[84px] text-[16px] text-[#212121] shadow-none focus-visible:ring-0"
                    />

                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {query && (
                        <button
                          type="button"
                          onClick={() => setQuery("")}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-[#666] hover:bg-black/5"
                          aria-label="Clear search"
                        >
                          <X size={18} />
                        </button>
                      )}
                      <button
                        type="submit"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D0D0D0] text-[#BDBDBD] hover:border-[#FF6600] hover:text-[#FF6600] bg-white"
                        aria-label={t("header.search.searchButton")}
                      >
                        <Search size={20} />
                      </button>
                    </div>
                  </form>

                  {isOpen && <div className="fixed inset-0 bg-black/50" onClick={close} aria-hidden="true" />}

                  {isOpen && (
                    <div
                      className={`absolute top-[calc(100%-4px)] ${direction === "rtl" ? "right-0" : "left-0"
                        } w-full overflow-hidden rounded-b-[4px] bg-white text-[#212121] shadow-lg`}
                    >
                      {showPopularAndRecent && (
                        <>
                          <div className="px-4 py-3 border-b border-[#eee]">
                            <span className="text-[14px] font-bold text-[#666]">Popular searches</span>
                          </div>

                          <div className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              {popularSearches.map((term) => (
                                <button
                                  key={term}
                                  type="button"
                                  onClick={() => navigateToCategory(term)}
                                  className="rounded-[4px] bg-[#F1F3F5] px-3 py-1 text-[13px] text-[#212121] transition-colors hover:bg-[#E9ECEF]"
                                  title={term}
                                >
                                  {clampText(term, 26)}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="px-4 py-3 border-t border-[#eee]">
                            <span className="text-[14px] font-bold text-[#666]">Recently searched</span>
                          </div>

                          <div className="px-4 pb-4">
                            {recent.length === 0 ? (
                              <div className="py-2 text-[13px] text-[#666]">No recent searches</div>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {recent.slice(0, RECENT_LIMIT).map((term) => (
                                  <button
                                    key={term}
                                    type="button"
                                    onClick={() => navigateToCategory(term)}
                                    className="rounded-[4px] bg-[#F1F3F5] px-3 py-1 text-[13px] text-[#212121] transition-colors hover:bg-[#E9ECEF]"
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
                                <span className="text-[14px] font-bold text-[#666]">Suggestions</span>
                              </div>

                              <ol className="m-0 list-none p-0">
                                {(aiTags?.length ? aiTags : []).map((item, idx) => (
                                  <li key={`${item}-${idx}`}>
                                    <button
                                      type="button"
                                      onClick={() => navigateToCategory(item)}
                                      className="flex w-full items-center px-4 py-2 text-left text-[14px] transition-colors hover:bg-[#f1f3f5]"
                                      title={item}
                                    >
                                      <Search size={14} className="mr-3 text-[#666]" />
                                      <span className="truncate">{item}</span>
                                    </button>
                                  </li>
                                ))}

                                {query.trim().length >= 3 && aiTags.length === 0 && (
                                  <li className="px-4 py-2 text-[13px] text-[#666]">No suggestions found</li>
                                )}
                              </ol>

                              <div className="px-4 py-3 border-t border-[#eee]">
                                <span className="text-[14px] font-bold text-[#666]">Products</span>
                              </div>

                              <div className="px-2 pb-2">
                                {realProducts.length === 0 ? (
                                  <div className="px-2 py-2 text-[13px] text-[#666]">No products found</div>
                                ) : (
                                  <ul className="m-0 list-none p-0">
                                    {realProducts.map((p) => (
                                      <li key={`${p.source}-${p.product_url}`}>
                                        <button
                                          type="button"
                                          onClick={() => navigateToProduct(p)}
                                          className="flex w-full items-center gap-3 rounded px-2 py-2 text-left transition-colors hover:bg-[#f1f3f5]"
                                          title={p.product_name}
                                        >
                                          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded border border-[#E0E0E0] bg-white">
                                            <Image src={p.image_url} alt={p.product_name} fill className="object-contain" />
                                          </div>

                                          <div className="min-w-0 flex-1">
                                            <div className="truncate text-[14px] font-medium">{p.product_name}</div>
                                            <div className="truncate text-[12px] text-[#666]">
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

                <div className="flex items-center gap-0">
                  <div className="mr-4">
                    <LanguageSwitcher variant="compact" />
                  </div>

                  <Link
                    href="/card-comparison"
                    className="flex items-center gap-2 rounded px-3 py-2 hover:bg-white/10 no-underline hover:no-underline"
                    aria-label="Cards"
                  >
                    <CreditCard size={22} />
                    <span className="text-[14px] font-semibold">Cards</span>
                  </Link>

                  <div className="mx-3 h-7 w-px bg-white/25" />

                  <span className="flex items-center gap-2 rounded px-3 py-2 cursor-not-allowed opacity-90 select-none">
                    <Bell size={22} />
                    <span className="text-[14px] font-semibold">Price alert</span>
                  </span>

                  <div className="mx-3 h-7 w-px bg-white/25" />

                  <span className="flex items-center gap-2 rounded px-3 py-2 cursor-not-allowed opacity-90 select-none">
                    <User size={22} />
                    <span className="text-[14px] font-semibold">Register</span>
                  </span>
                </div>
              </div>

              <div className="lg:hidden">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded hover:bg-white/10"
                      aria-label="Menu"
                    >
                      <Menu size={22} />
                    </button>

                    <Link href="/" className="block no-underline hover:no-underline" aria-label="Home">
                      <div className="leading-none">
                        <div className="text-[34px] font-bold tracking-tight">idealo</div>
                        <div className="mt-1 h-[5px] w-[78px] bg-[#FF6600]" />
                      </div>
                    </Link>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/card-comparison"
                      className="flex h-10 w-10 items-center justify-center rounded hover:bg-white/10 no-underline hover:no-underline"
                      aria-label="Cards"
                    >
                      <CreditCard size={22} />
                    </Link>

                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded hover:bg-white/10 cursor-not-allowed opacity-90"
                      aria-label={t("header.userActions.wishlist")}
                      onClick={(e) => e.preventDefault()}
                    >
                      <Heart size={22} />
                    </button>

                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded hover:bg-white/10 cursor-not-allowed opacity-90"
                      aria-label="Price alert"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Bell size={22} />
                    </button>

                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded hover:bg-white/10 cursor-not-allowed opacity-90"
                      aria-label="Register"
                      onClick={(e) => e.preventDefault()}
                    >
                      <User size={22} />
                    </button>

                    <div className="ml-1">
                      <LanguageSwitcher variant="compact" />
                    </div>
                  </div>
                </div>

                <div className="mt-3 relative z-50" ref={dropdownRef}>
                  <form id="i-header-search" role="search" className="relative" autoComplete="off" onSubmit={handleSubmit}>
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
                      className="h-[46px] w-full rounded-[4px] border-0 bg-white pl-4 pr-[84px] text-[16px] text-[#212121] shadow-none focus-visible:ring-0"
                    />

                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {query && (
                        <button
                          type="button"
                          onClick={() => setQuery("")}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-[#666] hover:bg-black/5"
                          aria-label="Clear search"
                        >
                          <X size={18} />
                        </button>
                      )}
                      <button
                        type="submit"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#FF6600] text-[#FF6600] hover:bg-[#FF6600] hover:text-white"
                        aria-label={t("header.search.searchButton")}
                      >
                        <Search size={20} />
                      </button>
                    </div>
                  </form>

                  {isOpen && <div className="fixed inset-0 bg-black/50" onClick={close} aria-hidden="true" />}

                  {isOpen && (
                    <div
                      className={`absolute top-[calc(100%-4px)] ${direction === "rtl" ? "right-0" : "left-0"
                        } w-full overflow-hidden rounded-b-[4px] bg-white text-[#212121] shadow-lg`}
                    >
                      {showPopularAndRecent && (
                        <>
                          <div className="px-4 py-3 border-b border-[#eee]">
                            <span className="text-[14px] font-bold text-[#666]">Popular searches</span>
                          </div>

                          <div className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              {popularSearches.map((term) => (
                                <button
                                  key={term}
                                  type="button"
                                  onClick={() => navigateToCategory(term)}
                                  className="rounded-[4px] bg-[#F1F3F5] px-3 py-1 text-[13px] text-[#212121] transition-colors hover:bg-[#E9ECEF]"
                                  title={term}
                                >
                                  {clampText(term, 26)}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="px-4 py-3 border-t border-[#eee]">
                            <span className="text-[14px] font-bold text-[#666]">Recently searched</span>
                          </div>

                          <div className="px-4 pb-4">
                            {recent.length === 0 ? (
                              <div className="py-2 text-[13px] text-[#666]">No recent searches</div>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {recent.slice(0, RECENT_LIMIT).map((term) => (
                                  <button
                                    key={term}
                                    type="button"
                                    onClick={() => navigateToCategory(term)}
                                    className="rounded-[4px] bg-[#F1F3F5] px-3 py-1 text-[13px] text-[#212121] transition-colors hover:bg-[#E9ECEF]"
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
                                <span className="text-[14px] font-bold text-[#666]">Suggestions</span>
                              </div>

                              <ol className="m-0 list-none p-0">
                                {(aiTags?.length ? aiTags : []).map((item, idx) => (
                                  <li key={`${item}-${idx}`}>
                                    <button
                                      type="button"
                                      onClick={() => navigateToCategory(item)}
                                      className="flex w-full items-center px-4 py-2 text-left text-[14px] transition-colors hover:bg-[#f1f3f5]"
                                      title={item}
                                    >
                                      <Search size={14} className="mr-3 text-[#666]" />
                                      <span className="truncate">{item}</span>
                                    </button>
                                  </li>
                                ))}

                                {query.trim().length >= 3 && aiTags.length === 0 && (
                                  <li className="px-4 py-2 text-[13px] text-[#666]">No suggestions found</li>
                                )}
                              </ol>

                              <div className="px-4 py-3 border-t border-[#eee]">
                                <span className="text-[14px] font-bold text-[#666]">Products</span>
                              </div>

                              <div className="px-2 pb-2">
                                {realProducts.length === 0 ? (
                                  <div className="px-2 py-2 text-[13px] text-[#666]">No products found</div>
                                ) : (
                                  <ul className="m-0 list-none p-0">
                                    {realProducts.map((p) => (
                                      <li key={`${p.source}-${p.product_url}`}>
                                        <button
                                          type="button"
                                          onClick={() => navigateToProduct(p)}
                                          className="flex w-full items-center gap-3 rounded px-2 py-2 text-left transition-colors hover:bg-[#f1f3f5]"
                                          title={p.product_name}
                                        >
                                          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded border border-[#E0E0E0] bg-white">
                                            <Image src={p.image_url} alt={p.product_name} fill className="object-contain" />
                                          </div>

                                          <div className="min-w-0 flex-1">
                                            <div className="truncate text-[14px] font-medium">{p.product_name}</div>
                                            <div className="truncate text-[12px] text-[#666]">
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
              </div>
            </div>

            <div className="bg-[#2F5672]">
              <div className="mx-auto max-w-[1280px] px-3">
                <div className="relative flex items-stretch">
                  <div
                    ref={categoriesRef}
                    className="flex w-full gap-0 overflow-x-auto py-2 pl-10 pr-10 hide-scrollbar"
                    role="navigation"
                    aria-label="Categories"
                  >
                    {categories.map((c) => {
                      const Icon = c.icon;
                      return (
                        <button
                          key={c.label}
                          type="button"
                          onClick={() => navigateToCategory(c.label)}
                          className="min-w-[108px] flex-shrink-0 px-2 py-2 text-center hover:bg-white/10"
                        >
                          <div className="mx-auto flex h-6 w-6 items-center justify-center">
                            <Icon size={22} className={c.active ? "text-white" : "text-white"} />
                          </div>
                          <div className="mt-1 text-[12px] font-semibold leading-4 text-white">
                            {c.label}
                          </div>
                          {c.active && <div className="mx-auto mt-1 h-[3px] w-8 bg-[#FF6600]" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 z-10 bg-gradient-to-r from-[#2F5672] to-transparent">
                    <button
                      type="button"
                      onClick={scrollCategoriesLeft}
                      className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded bg-white/10 hover:bg-white/15"
                      aria-label="Scroll categories left"
                    >
                      <ChevronRight className="rotate-180" size={20} />
                    </button>
                  </div>

                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 z-10 bg-gradient-to-l from-[#2F5672] to-transparent">
                    <button
                      type="button"
                      onClick={scrollCategoriesRight}
                      className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded bg-white/10 hover:bg-white/15"
                      aria-label="Scroll categories right"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-black/10" />
          </div>
        </div>
      </header>
    </>
  );
}