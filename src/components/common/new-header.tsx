"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { BriefcaseBusiness, ChevronDown, CreditCard, Heart, Menu, Search, User, X } from "lucide-react";

const topBarItems = ["Vouchers"];
const mobileMenuItems = ["Vouchers"];
const SUGGESTIONS_KEY = "last_search_suggestions_v1";
const SEARCH_DEBOUNCE_MS = 450;

export default function NewHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchTypeOpen, setSearchTypeOpen] = useState(false);
  const suggestionRequestIdRef = useRef(0);
  const suggestionTimeoutRef = useRef<number | undefined>(undefined);

  const showProductSearch = pathname.startsWith("/category") || pathname.startsWith("/product");
  const visibleSuggestions = useMemo(
    () => suggestions.filter(Boolean).slice(0, 5),
    [suggestions]
  );

  function handleTopBarClick(item: string) {
    if (item === "Vouchers") {
      setMobileMenuOpen(false);
      router.push("/?section=vouchers");
    }
  }

  async function cacheAiSuggestions(query: string, requestId?: number) {
    try {
      const res = await fetch(`/api/search-products?q=${encodeURIComponent(query)}`, {
        cache: "no-store",
      });
      const data = await res.json();
      const tags = Array.isArray(data?.data) ? data.data.slice(0, 5) : [];

      sessionStorage.setItem(SUGGESTIONS_KEY, JSON.stringify({ q: query, tags, ts: Date.now() }));
      if (requestId === undefined || suggestionRequestIdRef.current === requestId) {
        setSuggestions(tags);
      }
      return tags;
    } catch {
      sessionStorage.setItem(SUGGESTIONS_KEY, JSON.stringify({ q: query, tags: [], ts: Date.now() }));
      if (requestId === undefined || suggestionRequestIdRef.current === requestId) {
        setSuggestions([]);
      }
      return [];
    }
  }

  async function runProductSearch(term: string) {
    const query = term.trim();
    if (!query) return;

    if (suggestionTimeoutRef.current !== undefined) {
      window.clearTimeout(suggestionTimeoutRef.current);
      suggestionTimeoutRef.current = undefined;
    }
    suggestionRequestIdRef.current += 1;
    setIsSearching(true);
    await cacheAiSuggestions(query);
    setIsSearching(false);
    setSearchQuery("");
    setSearchFocused(false);
    router.push(`/category/${encodeURIComponent(query)}?view=suggestions`);
  }

  function submitProductSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runProductSearch(searchQuery);
  }

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setSearchFocused(true);
  }

  useEffect(() => {
    if (!searchFocused) return;

    const query = searchQuery.trim();
    const requestId = suggestionRequestIdRef.current + 1;
    suggestionRequestIdRef.current = requestId;

    if (query.length < 3) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    suggestionTimeoutRef.current = window.setTimeout(async () => {
      await cacheAiSuggestions(query, requestId);
      if (suggestionRequestIdRef.current === requestId) {
        setIsSearching(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (suggestionTimeoutRef.current !== undefined) {
        window.clearTimeout(suggestionTimeoutRef.current);
        suggestionTimeoutRef.current = undefined;
      }
    };
  }, [searchFocused, searchQuery]);

  function openCreditCards() {
    setSearchTypeOpen(false);
    router.push("/card-comparison");
  }

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Element;
      if (!target.closest("[data-product-search-root]")) {
        setSearchFocused(false);
        setSearchTypeOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <header className="landing-upper-toolbar relative z-40 bg-[#032b6b] text-white">
      <div className="landing-page-container mx-auto grid min-h-[42px] max-w-[1440px] grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-1.5 lg:flex lg:min-h-[46px] lg:items-center lg:justify-between lg:gap-4 lg:px-6">
        <button
          type="button"
          onClick={() => setMobileMenuOpen((value) => !value)}
          className="landing-toolbar-menu flex h-8 w-8 items-center justify-center rounded-[4px] border border-white/20 lg:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={19} /> : <Menu size={20} />}
        </button>

        <Link
          href="/"
          className="landing-toolbar-logo justify-self-center shrink-0 text-[24px] font-bold leading-none text-white sm:text-[26px] lg:justify-self-auto lg:text-[28px]"
          aria-label="Ideolo home"
        >
          idea<span className="text-[#ff6a00]">lo</span>
        </Link>

        {showProductSearch ? (
          <form
            data-product-search-root
            onSubmit={submitProductSearch}
            className="relative hidden min-w-0 flex-1 items-center justify-center gap-0 lg:flex"
          >
            <div className="relative">
              <button
                type="button"
                onClick={() => setSearchTypeOpen((value) => !value)}
                className="flex h-10 min-w-[150px] items-center justify-between gap-2 rounded-l-[4px] border border-white/20 bg-white px-4 text-[15px] font-bold text-[#ff6600]"
                aria-expanded={searchTypeOpen}
              >
                <span className="inline-flex items-center gap-2">
                  <BriefcaseBusiness size={18} />
                  Products
                </span>
                <ChevronDown size={16} className={searchTypeOpen ? "rotate-180 transition" : "transition"} />
              </button>

              {searchTypeOpen ? (
                <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-[210px] overflow-hidden rounded-[6px] border border-[#d1d5db] bg-white py-1 text-[#06163a] shadow-[0_12px_28px_rgba(0,0,0,0.18)]">
                  <button
                    type="button"
                    onClick={() => setSearchTypeOpen(false)}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[14px] font-semibold text-[#ff6600] hover:bg-[#fff4ed]"
                  >
                    <BriefcaseBusiness size={17} />
                    Products
                  </button>
                  <button
                    type="button"
                    onClick={openCreditCards}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[14px] font-semibold hover:bg-[#f5f6fa]"
                  >
                    <CreditCard size={17} />
                    Credit Cards
                  </button>
                </div>
              ) : null}
            </div>

            <div className="relative w-full max-w-[520px]">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
              <input
                value={searchQuery}
                onChange={(event) => void handleSearchChange(event.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="h-10 w-full rounded-r-[4px] border border-l-0 border-white/20 bg-white pl-11 pr-4 text-[15px] text-[#111827] outline-none focus:ring-2 focus:ring-[#ff6600]/35"
                placeholder="What are you looking to compare?"
              />
            </div>

            {searchFocused && (visibleSuggestions.length > 0 || isSearching) ? (
              <div className="absolute left-1/2 top-[calc(100%+6px)] z-50 w-full max-w-[670px] -translate-x-1/2 overflow-hidden rounded-[6px] border border-[#d1d5db] bg-white text-[#111827] shadow-[0_12px_28px_rgba(0,0,0,0.18)]">
                <div className="border-b border-[#eef0f3] px-4 py-2 text-[13px] font-bold text-[#6b7280]">
                  Suggestions
                </div>
                {isSearching ? (
                  <div className="px-4 py-3 text-[14px] text-[#6b7280]">Loading...</div>
                ) : (
                  visibleSuggestions.map((item, index) => (
                    <button
                      key={`${item}-${index}`}
                      type="button"
                      onClick={() => void runProductSearch(item)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-[14px] hover:bg-[#f5f6fa]"
                    >
                      <Search size={15} className="text-[#6b7280]" />
                      <span className="truncate">{item}</span>
                    </button>
                  ))
                )}
              </div>
            ) : null}
          </form>
        ) : null}

        {!showProductSearch ? <div className="hidden flex-1 lg:block" /> : null}

        <div className="landing-toolbar-actions ml-auto flex items-center justify-self-end gap-2 sm:gap-4 lg:justify-self-auto">
          {topBarItems.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleTopBarClick(item)}
              className="landing-toolbar-action hidden rounded-[4px] px-2 py-1.5 text-[14px] font-semibold hover:bg-white/10 sm:block"
            >
              {item}
            </button>
          ))}
          <button
            type="button"
            className="landing-toolbar-action hidden items-center gap-2 rounded-[4px] px-2 py-1.5 text-[14px] font-semibold hover:bg-white/10 sm:flex"
          >
            <Heart size={18} />
            Watchlist
          </button>
          <button
            type="button"
            className="landing-toolbar-action flex items-center gap-2 rounded-[4px] px-2 py-1.5 text-[14px] font-semibold hover:bg-white/10"
          >
            <User size={18} />
            <span className="hidden sm:inline">Sign in</span>
          </button>
        </div>
      </div>

      {showProductSearch ? (
        <form data-product-search-root onSubmit={submitProductSearch} className="relative px-4 pb-3 pt-2 lg:hidden">
          <div className="mx-auto flex max-w-[720px] gap-0">
            <button
              type="button"
              onClick={() => setSearchTypeOpen((value) => !value)}
              className="flex h-10 min-w-[118px] items-center justify-center gap-2 rounded-l-[4px] bg-white px-3 text-[13px] font-bold text-[#ff6600]"
            >
              <BriefcaseBusiness size={16} />
              Products
            </button>
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
              <input
                value={searchQuery}
                onChange={(event) => void handleSearchChange(event.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="h-10 w-full rounded-r-[4px] bg-white pl-9 pr-3 text-[14px] text-[#111827] outline-none"
                placeholder="Search products"
              />
            </div>
          </div>

          {searchFocused && (visibleSuggestions.length > 0 || isSearching) ? (
            <div className="absolute left-4 right-4 top-[calc(100%+2px)] z-50 overflow-hidden rounded-[6px] border border-[#d1d5db] bg-white text-[#111827] shadow-[0_12px_28px_rgba(0,0,0,0.18)]">
              <div className="border-b border-[#eef0f3] px-4 py-2 text-[13px] font-bold text-[#6b7280]">
                Suggestions
              </div>
              {isSearching ? (
                <div className="px-4 py-3 text-[14px] text-[#6b7280]">Loading...</div>
              ) : (
                visibleSuggestions.map((item, index) => (
                  <button
                    key={`${item}-${index}`}
                    type="button"
                    onClick={() => void runProductSearch(item)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-[14px] hover:bg-[#f5f6fa]"
                  >
                    <Search size={15} className="text-[#6b7280]" />
                    <span className="truncate">{item}</span>
                  </button>
                ))
              )}
            </div>
          ) : null}
        </form>
      ) : null}

      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full border-t border-white/10 bg-[#032b6b] shadow-[0_12px_24px_rgba(3,43,107,0.22)] lg:hidden">
          <nav className="mx-auto flex max-w-[1440px] flex-col px-4 py-2">
            {mobileMenuItems.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleTopBarClick(item)}
                className="min-h-11 text-left text-[15px] font-semibold text-white/95 hover:text-white"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
