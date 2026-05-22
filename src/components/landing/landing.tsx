"use client";

import { FormEvent, RefObject, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Bell,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Heart,
  Search,
  ShieldCheck,
  Tag,
  X,
} from "lucide-react";
import WatchlistToggle from "@/components/common/watchlist-toggle";

const SUGGESTIONS_KEY = "last_search_suggestions_v1";
const SEARCH_DEBOUNCE_MS = 450;

type LandingProduct = {
  _id: string;
  product_url: string;
  source: string;
  product_name: string;
  image_url: string;
  price: string;
  old_price?: string;
  discount?: string;
  rating?: string;
  ratingCount?: string;
  reviews?: string;
  average_rating?: number | null;
};

type LandingData = {
  iphoneDeals: LandingProduct[];
  dairyProducts: LandingProduct[];
  fashionProducts: LandingProduct[];
};

type SearchSectionProps = {
  query: string;
  visibleSuggestions: string[];
  isSearching: boolean;
  isFocused: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onQueryChange: (value: string) => void;
  onFocus: () => void;
  onClear: () => void;
  onSearch: (term: string) => void;
  onLandingAction: (term: string) => void;
};

const serviceTabs = [
  { label: "Products", query: "Products", icon: BriefcaseBusiness, active: true },
  { label: "Credit Cards", query: "Credit Cards", icon: CreditCard },
];

const popularSearches = ["iPhone 17", "Galaxy S26", "S26 Ultra", "Galaxy Watch 6"];

const categories = [
  {
    title: "Products",
    description: "Compare product prices",
    icon: BriefcaseBusiness,
    query: "Products",
  },
  {
    title: "Credit Cards",
    description: "Compare fees, rewards and lifestyle benefits",
    icon: CreditCard,
    query: "Credit Cards",
  },
];

const trustItems = [
  { title: "100% Free to Use", description: "No hidden charges", icon: Tag },
  { title: "Trusted Providers", description: "Verified and reliable", icon: ShieldCheck },
  { title: "Secure and Safe", description: "Your data is protected", icon: Bell },
];

function normalizeSearchTerm(term: string) {
  const cleaned = term.trim().toLowerCase().replace(/\s+/g, "");

  if (cleaned === "s24") {
    return "s24 Mobile";
  }

  return term.trim();
}

function clampText(value: string, max = 34) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}...`;
}

function formatProductPrice(price: string) {
  const raw = String(price || "").trim();
  if (!raw) return "AED";

  const amount = Number(raw.replace(/,/g, "").replace(/[^\d.]/g, ""));
  if (!Number.isFinite(amount) || amount <= 0) return raw;

  return `AED ${amount.toLocaleString("en-AE", {
    maximumFractionDigits: 2,
  })}`;
}

function LandingHeroSection() {
  return (
    <section className="landing-hero-section mx-auto grid w-full max-w-[1080px] grid-cols-1 items-center gap-3 px-4 pb-0 pt-0 md:px-6 lg:grid-cols-[1.18fr_0.82fr] lg:gap-4">
      <div className="landing-hero-copy text-center lg:text-left">
        <h1 className="landing-hero-title mx-auto max-w-[620px] text-[31px] font-bold leading-[1.08] tracking-normal text-[#06163a] min-[390px]:text-[34px] min-[430px]:text-[38px] sm:text-[46px] md:text-[54px] lg:mx-0 lg:text-[58px] xl:text-[62px]">
          <span className="block whitespace-nowrap">Compare Prices.</span>
          <span className="block w-full text-center text-[#ff6600]">Save.</span>
        </h1>
      </div>

      <div className="landing-hero-products relative hidden min-h-[235px] lg:block xl:min-h-[250px]">
        <Image
          src="/landing-hero-products.png"
          alt="Popular products including headphones, phone, smartwatch, and tire"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 48vw"
          className="object-contain object-center"
        />
      </div>
    </section>
  );
}

function LandingSearchSection({
  query,
  visibleSuggestions,
  isSearching,
  isFocused,
  inputRef,
  onSubmit,
  onQueryChange,
  onFocus,
  onClear,
  onSearch,
  onLandingAction,
}: SearchSectionProps) {
  return (
    <section className="landing-search-bar mx-auto w-[calc(100vw-32px)] max-w-[1200px] px-0 pt-0 md:w-full md:px-6 lg:-mt-8 lg:pt-0">
      <div className="landing-search-panel relative z-10 rounded-[8px] bg-white p-3 shadow-[0_8px_24px_rgba(6,22,58,0.12)] md:p-4">
        <div className="landing-services-bar mb-3 grid grid-cols-2 gap-2 border-b border-[#e5e7eb] pb-0 md:flex md:gap-0">
          {serviceTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => onLandingAction(tab.query)}
                className={`landing-service-tab flex min-h-11 items-center justify-center gap-2 border-b-2 px-3 py-2.5 text-[13px] font-bold transition md:min-w-[180px] md:text-[14px] ${
                  tab.active
                    ? "border-[#ff6600] bg-[#fff4ed] text-[#ff6600] md:bg-transparent"
                    : "border-transparent bg-white text-[#06163a] hover:border-[#ff6600] hover:text-[#ff6600]"
                }`}
              >
                <Icon size={17} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <form className="landing-search-form relative" onSubmit={onSubmit}>
          <div className="landing-search-row flex flex-col gap-3 sm:flex-row">
            <div className="landing-search-input-wrap relative min-w-0 flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6b7280]" />
              <input
                ref={inputRef}
                className="landing-search-input h-12 w-full rounded-[6px] border border-[#d1d5db] bg-white pl-12 pr-11 text-[13px] text-[#111827] outline-none focus:border-[#ff6600] focus:ring-2 focus:ring-[#ff6600]/15 min-[390px]:text-[14px] sm:text-[16px]"
                type="text"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                onFocus={onFocus}
                placeholder="What are you looking to compare?"
              />
              {query && (
                <button
                  type="button"
                  onClick={onClear}
                  className="landing-search-clear absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#6b7280] hover:bg-[#f3f4f6]"
                  aria-label="Clear search"
                >
                  <X size={17} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="landing-search-submit flex h-12 items-center justify-center gap-2 rounded-[6px] bg-[#ff6600] px-7 text-[16px] font-bold text-white hover:bg-[#ea5f00] sm:min-w-[150px]"
            >
              <Search size={18} />
              Compare
            </button>
          </div>

          {isFocused && (visibleSuggestions.length > 0 || isSearching) && (
            <div className="landing-search-suggestions absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-[6px] border border-[#e5e7eb] bg-white shadow-[0_12px_28px_rgba(0,0,0,0.12)]">
              <div className="border-b border-[#eef0f3] px-4 py-3 text-[13px] font-bold text-[#6b7280]">
                Suggestions
              </div>
              {isSearching ? (
                <div className="px-4 py-3 text-[14px] text-[#6b7280]">Loading...</div>
              ) : (
                visibleSuggestions.map((item, index) => (
                  <button
                    key={`${item}-${index}`}
                    type="button"
                    onClick={() => onSearch(item)}
                    className="landing-search-suggestion flex w-full items-center gap-3 px-4 py-3 text-left text-[14px] text-[#111827] hover:bg-[#f5f6fa]"
                  >
                    <Search size={15} className="text-[#6b7280]" />
                    <span className="truncate">{item}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </form>

        <div className="landing-popular-searches mt-3">
          <span className="block text-[13px] font-bold text-[#06163a] sm:inline-block sm:mr-2">Popular Searches:</span>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:mt-0 sm:inline-flex sm:flex-wrap sm:items-center">
            {popularSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => onLandingAction(term)}
                className="landing-popular-tag rounded-full border border-[#e5e7eb] bg-white px-3 py-1.5 text-[12px] font-bold text-[#374151] hover:border-[#ff6600] hover:text-[#ff6600] sm:text-[13px]"
                title={term}
              >
                {clampText(term, 26)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LandingCompareSection({ onCategoryAction }: { onCategoryAction: (term: string) => void }) {
  return (
    <section className="landing-category-section mx-auto w-[calc(100vw-32px)] max-w-[1200px] px-0 py-5 md:w-full md:px-6 md:py-6">
      <h2 className="landing-section-title mx-auto mb-4 max-w-[310px] text-center text-[21px] font-bold leading-tight text-[#06163a] sm:max-w-[720px] md:text-[26px]">
        What would you like to compare today?
      </h2>
      <div className="landing-category-grid grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mx-auto lg:max-w-[760px]">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.title}
              type="button"
              onClick={() => onCategoryAction(category.query)}
              className="landing-category-card flex min-h-[62px] items-center justify-between rounded-[8px] bg-white px-4 py-3 text-left shadow-[0_4px_16px_rgba(6,22,58,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(6,22,58,0.12)] sm:min-h-[142px] sm:flex-col sm:justify-center sm:p-5 sm:text-center"
            >
              <span className="flex min-w-0 items-center gap-3 sm:flex-col sm:gap-0">
                <span className="landing-category-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff3ea] text-[#00306e] sm:mx-auto sm:mb-3 sm:h-14 sm:w-14 sm:text-[#ff6600]">
                  <Icon size={22} className="sm:h-7 sm:w-7" />
                </span>
                <span className="min-w-0">
                  <span className="landing-category-title block text-[15px] font-bold text-[#06163a] sm:text-[18px]">
                    {category.title}
                  </span>
                  <span className="landing-category-description mt-1 hidden text-[14px] leading-5 text-[#526175] sm:block">
                    {category.description}
                  </span>
                </span>
              </span>
              <ChevronRight size={18} className="shrink-0 text-[#526175] sm:hidden" />
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ProductCard({
  product,
  onOpenProduct,
}: {
  product: LandingProduct;
  onOpenProduct: (product: LandingProduct) => void;
}) {
  return (
    <div className="landing-product-card group relative flex h-full w-full flex-col rounded-[8px] bg-white p-3 text-center shadow-[0_4px_14px_rgba(6,22,58,0.08)] transition hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(6,22,58,0.14)] sm:p-4">
      <div className="absolute right-3 top-3 z-10">
        <WatchlistToggle
          product={product}
          iconSize={16}
          buttonSize={9}
          className="h-8 w-8 sm:h-9 sm:w-9"
        />
      </div>

      <button
        type="button"
        onClick={() => onOpenProduct(product)}
        className="flex w-full flex-1 flex-col"
      >
        <img
          src={product.image_url}
          alt={product.product_name}
          className="landing-product-image mx-auto h-[122px] w-full object-contain sm:h-[145px] md:h-[158px]"
        />
        <span className="landing-product-title mt-3 block min-h-[44px] text-[14px] font-bold leading-5 text-[#06163a] sm:text-[15px]">
          {product.product_name}
        </span>
        <span className="landing-product-price mt-2 block text-[15px] font-bold text-[#ff6600] sm:text-[16px]">
          From {formatProductPrice(product.price)}
        </span>
      </button>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="landing-product-card w-full rounded-[8px] bg-white p-3 text-center shadow-[0_4px_14px_rgba(6,22,58,0.08)] sm:p-4">
      <div className="landing-product-image mx-auto h-[122px] w-full animate-pulse rounded-[6px] bg-[#eef1f5] sm:h-[145px] md:h-[158px]" />
      <div className="mx-auto mt-3 h-4 w-4/5 animate-pulse rounded bg-[#eef1f5]" />
      <div className="mx-auto mt-3 h-4 w-2/3 animate-pulse rounded bg-[#eef1f5]" />
    </div>
  );
}

function LandingProductsSection({
  title,
  products,
  loading,
  expanded,
  onToggleExpanded,
  onOpenProduct,
}: {
  title: string;
  products: LandingProduct[];
  loading: boolean;
  expanded: boolean;
  onToggleExpanded: () => void;
  onOpenProduct: (product: LandingProduct) => void;
}) {
  const visibleProducts = expanded ? products : products.slice(0, 8);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateCarouselArrows() {
    const el = carouselRef.current;
    if (!el) return;

    const items = Array.from(el.children) as HTMLElement[];
    const firstItem = items[0];
    const lastItem = items[items.length - 1];

    if (!firstItem || !lastItem) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const viewport = el.getBoundingClientRect();
    const first = firstItem.getBoundingClientRect();
    const last = lastItem.getBoundingClientRect();

    setCanScrollLeft(first.left < viewport.left - 2);
    setCanScrollRight(last.right > viewport.right + 2);
  }

  useEffect(() => {
    updateCarouselArrows();
    const el = carouselRef.current;
    if (!el || expanded) return;

    const onScroll = () => updateCarouselArrows();
    el.addEventListener("scroll", onScroll, { passive: true });

    const resizeObserver = new ResizeObserver(() => updateCarouselArrows());
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
    };
  }, [expanded, loading, visibleProducts.length]);

  function scrollCarousel(direction: "left" | "right") {
    const el = carouselRef.current;
    if (!el) return;

    const amount = Math.round(el.clientWidth * 0.85);
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  return (
    <section className="landing-products-section mx-auto w-[calc(100vw-32px)] max-w-[1200px] px-0 pb-9 md:w-full md:px-6">
      <div className="landing-products-header mb-4 flex items-center justify-between gap-4">
        <h2 className="landing-section-title text-[24px] font-bold text-[#06163a] md:text-[28px]">{title}</h2>
        {products.length > 0 && (
          <button
            type="button"
            onClick={onToggleExpanded}
            className="landing-view-all shrink-0 text-[13px] font-bold text-[#0066c0] hover:text-[#ff6600]"
          >
            {expanded ? "Show less" : "View all"}
          </button>
        )}
      </div>

      {expanded ? (
        <div className="landing-products-grid grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => <ProductSkeleton key={index} />)
            : visibleProducts.map((product) => (
                <ProductCard key={product._id} product={product} onOpenProduct={onOpenProduct} />
              ))}
        </div>
      ) : (
        <div className="group relative">
          {canScrollLeft && (
            <button
              type="button"
              aria-label={`Previous ${title}`}
              onClick={() => scrollCarousel("left")}
              className="absolute left-0 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center bg-[#c7cfd7] text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 md:flex"
            >
              <ChevronLeft size={26} />
            </button>
          )}
          {canScrollRight && (
            <button
              type="button"
              aria-label={`Next ${title}`}
              onClick={() => scrollCarousel("right")}
              className="absolute right-0 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center bg-[#c7cfd7] text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 md:flex"
            >
              <ChevronRight size={26} />
            </button>
          )}

          <div
            ref={carouselRef}
            className="landing-products-carousel hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 md:-mx-6 md:px-6"
          >
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="w-[46%] min-w-[46%] snap-start sm:w-[31%] sm:min-w-[31%] lg:w-[18%] lg:min-w-[18%]">
                    <ProductSkeleton />
                  </div>
                ))
              : visibleProducts.map((product) => (
                  <div
                    key={product._id}
                    className="w-[46%] min-w-[46%] snap-start sm:w-[31%] sm:min-w-[31%] lg:w-[18%] lg:min-w-[18%]"
                  >
                    <ProductCard product={product} onOpenProduct={onOpenProduct} />
                  </div>
                ))}
          </div>
        </div>
      )}
    </section>
  );
}

function LandingTrustSection() {
  return (
    <section className="landing-trust-section mx-auto w-[calc(100vw-32px)] max-w-[1200px] px-0 pb-14 md:w-full md:px-6">
      <div className="landing-trust-grid grid grid-cols-3 gap-3 rounded-[8px] bg-[#032b6b] px-3 py-5 text-white shadow-[0_10px_24px_rgba(3,43,107,0.2)] md:gap-5 md:px-6">
        {trustItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="landing-trust-item text-center">
              <Icon className="landing-trust-icon mx-auto mb-2 h-7 w-7 text-[#ffb26f] md:h-8 md:w-8" />
              <h3 className="landing-trust-title text-[12px] font-bold leading-tight text-white md:text-[16px]">{item.title}</h3>
              <p className="landing-trust-description mt-1 text-[11px] leading-snug text-[#d1d5db] md:text-[13px]">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function Landing() {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [iphoneProducts, setIphoneProducts] = useState<LandingProduct[]>([]);
  const [dairyProducts, setDairyProducts] = useState<LandingProduct[]>([]);
  const [fashionProducts, setFashionProducts] = useState<LandingProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [featuredExpanded, setFeaturedExpanded] = useState(false);
  const [popularExpanded, setPopularExpanded] = useState(false);
  const suggestionRequestIdRef = useRef(0);
  const suggestionTimeoutRef = useRef<number | undefined>(undefined);

  const visibleSuggestions = useMemo(
    () => suggestions.filter(Boolean).slice(0, 5),
    [suggestions]
  );

  const featuredProducts = useMemo(() => {
    const merged = [...fashionProducts, ...dairyProducts];
    return merged.filter((product) => product.product_url && product.product_name);
  }, [dairyProducts, fashionProducts]);

  const popularProducts = useMemo(
    () => iphoneProducts.filter((product) => product.product_url && product.product_name),
    [iphoneProducts]
  );

  useEffect(() => {
    let alive = true;

    async function fetchLandingProducts() {
      try {
        setProductsLoading(true);
        const res = await fetch("/api/landing", { cache: "no-store" });
        const json = (await res.json()) as LandingData;

        if (!alive) return;
        setIphoneProducts(Array.isArray(json.iphoneDeals) ? json.iphoneDeals : []);
        setDairyProducts(Array.isArray(json.dairyProducts) ? json.dairyProducts : []);
        setFashionProducts(Array.isArray(json.fashionProducts) ? json.fashionProducts : []);
      } catch {
        if (!alive) return;
        setIphoneProducts([]);
        setDairyProducts([]);
        setFashionProducts([]);
      } finally {
        if (!alive) return;
        setProductsLoading(false);
      }
    }

    fetchLandingProducts();
    return () => {
      alive = false;
    };
  }, []);

  async function cacheAiSuggestions(q: string, requestId?: number) {
    try {
      const res = await fetch(`/api/search-products?q=${encodeURIComponent(q)}`, {
        cache: "no-store",
      });
      const data = await res.json();
      const tags = Array.isArray(data?.data) ? data.data.slice(0, 5) : [];

      sessionStorage.setItem(SUGGESTIONS_KEY, JSON.stringify({ q, tags, ts: Date.now() }));
      if (requestId === undefined || suggestionRequestIdRef.current === requestId) {
        setSuggestions(tags);
      }
      return tags;
    } catch {
      sessionStorage.setItem(SUGGESTIONS_KEY, JSON.stringify({ q, tags: [], ts: Date.now() }));
      if (requestId === undefined || suggestionRequestIdRef.current === requestId) {
        setSuggestions([]);
      }
      return [];
    }
  }

  function focusProductSearch() {
    setQuery("");
    setSuggestions([]);
    setIsFocused(true);
    searchInputRef.current?.focus();
    searchInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function runSearch(term: string) {
    const q = normalizeSearchTerm(term);
    if (!q) return;

    if (q.toLowerCase() === "credit cards") {
      setQuery("");
      setIsFocused(false);
      setSuggestions([]);
      router.push("/card-comparison");
      return;
    }

    if (q.toLowerCase() === "products") {
      focusProductSearch();
      return;
    }

    if (suggestionTimeoutRef.current !== undefined) {
      window.clearTimeout(suggestionTimeoutRef.current);
      suggestionTimeoutRef.current = undefined;
    }
    suggestionRequestIdRef.current += 1;
    setIsSearching(true);
    await cacheAiSuggestions(q);
    setIsSearching(false);
    setQuery("");
    setIsFocused(false);
    router.push(`/category/${encodeURIComponent(q)}?view=suggestions`);
  }

  async function runLandingAction(term: string) {
    const q = normalizeSearchTerm(term).toLowerCase();

    if (q === "credit cards") {
      setQuery("");
      setIsFocused(false);
      setSuggestions([]);
      router.push("/card-comparison");
      return;
    }

    if (q === "products") {
      focusProductSearch();
      return;
    }

    await runSearch(term);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runSearch(query);
  }

  function handleSuggestionRefresh(nextQuery: string) {
    setQuery(nextQuery);
    setIsFocused(true);
  }

  useEffect(() => {
    if (!isFocused) return;

    const q = normalizeSearchTerm(query);
    const requestId = suggestionRequestIdRef.current + 1;
    suggestionRequestIdRef.current = requestId;

    if (q.length < 3) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    suggestionTimeoutRef.current = window.setTimeout(async () => {
      await cacheAiSuggestions(q, requestId);
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
  }, [isFocused, query]);

  function clearSearch() {
    setQuery("");
    setSuggestions([]);
  }

  function openProduct(product: LandingProduct) {
    const encodedUrl = encodeURIComponent(product.product_url);

    router.push(
      `/product/${encodedUrl}?product_name=${encodeURIComponent(product.product_name)}&source=${encodeURIComponent(
        product.source
      )}`
    );
  }

  return (
    <main className="landing-interface box-border overflow-x-hidden bg-[#f5f6fa] font-sans text-[#06163a] [&_*]:box-border">
      <LandingHeroSection />
      <LandingSearchSection
        query={query}
        visibleSuggestions={visibleSuggestions}
        isSearching={isSearching}
        isFocused={isFocused}
        inputRef={searchInputRef}
        onSubmit={handleSubmit}
        onQueryChange={handleSuggestionRefresh}
        onFocus={() => setIsFocused(true)}
        onClear={clearSearch}
        onSearch={runSearch}
        onLandingAction={runLandingAction}
      />
      <LandingCompareSection onCategoryAction={runLandingAction} />
      <LandingProductsSection
        title="Featured Products"
        products={featuredProducts}
        loading={productsLoading}
        expanded={featuredExpanded}
        onToggleExpanded={() => setFeaturedExpanded((value) => !value)}
        onOpenProduct={openProduct}
      />
      <LandingProductsSection
        title="Popular Products"
        products={popularProducts}
        loading={productsLoading}
        expanded={popularExpanded}
        onToggleExpanded={() => setPopularExpanded((value) => !value)}
        onOpenProduct={openProduct}
      />
      <LandingTrustSection />
    </main>
  );
}
