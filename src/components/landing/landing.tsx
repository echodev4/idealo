"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Car,
  CreditCard,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  Wrench,
  X,
} from "lucide-react";

const SUGGESTIONS_KEY = "last_search_suggestions_v1";

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

const serviceTabs = [
  { label: "Products", query: "Products", icon: ShoppingBag, active: true },
  { label: "Services", query: "Services", icon: Wrench },
  { label: "Credit Cards", query: "Credit Cards", icon: CreditCard },
  { label: "Tires", query: "Tire Replacement", icon: Car },
];

const popularSearches = ["iPhone 15", "Galaxy S24", "Car Insurance", "Credit Cards", "AC Repair"];

const categories = [
  {
    title: "Products",
    description: "Compare prices on electronics, appliances and daily essentials.",
    query: "Products",
    icon: ShoppingBag,
  },
  {
    title: "Credit Cards",
    description: "Compare fees, rewards, salary rules and lifestyle benefits.",
    query: "Credit Cards",
    icon: CreditCard,
  },
  {
    title: "Services",
    description: "Find verified providers and request practical quotes faster.",
    query: "Services",
    icon: Wrench,
  },
  {
    title: "Tire Replacement",
    description: "Compare tire prices, fitting options and installation packages.",
    query: "Tire Replacement",
    icon: Car,
  },
  {
    title: "Insurance",
    description: "Review policy options before choosing the right protection.",
    query: "Insurance",
    icon: ShieldCheck,
  },
];

const featuredProducts = [
  {
    title: "Apple iPhone 15",
    price: "AED 2,799",
    query: "Apple iPhone 15",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500&auto=format&fit=crop",
  },
  {
    title: "Samsung Galaxy S24",
    price: "AED 2,399",
    query: "Samsung Galaxy S24",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=500&auto=format&fit=crop",
  },
  {
    title: "MacBook Air M3",
    price: "AED 3,999",
    query: "MacBook Air M3",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=500&auto=format&fit=crop",
  },
  {
    title: "Sony WH-1000XM5",
    price: "AED 899",
    query: "Sony WH-1000XM5",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=500&auto=format&fit=crop",
  },
  {
    title: "LG OLED TV",
    price: "AED 1,499",
    query: "LG OLED TV",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=500&auto=format&fit=crop",
  },
];

const trustItems = [
  { title: "100% Free to Use", description: "No hidden charges", icon: Tag },
  { title: "Top 3 Quotes", description: "Save time and money", icon: Sparkles },
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

export default function Landing() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [iphoneProducts, setIphoneProducts] = useState<LandingProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const visibleSuggestions = useMemo(
    () => suggestions.filter(Boolean).slice(0, 5),
    [suggestions]
  );

  const popularIphoneProducts = useMemo(
    () => iphoneProducts.filter((product) => product.product_url && product.product_name).slice(0, 6),
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
      } catch {
        if (!alive) return;
        setIphoneProducts([]);
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

  async function cacheAiSuggestions(q: string) {
    try {
      const res = await fetch(`/api/search-products?q=${encodeURIComponent(q)}`, {
        cache: "no-store",
      });
      const data = await res.json();
      const tags = Array.isArray(data?.data) ? data.data.slice(0, 5) : [];

      sessionStorage.setItem(SUGGESTIONS_KEY, JSON.stringify({ q, tags, ts: Date.now() }));
      setSuggestions(tags);
      return tags;
    } catch {
      sessionStorage.setItem(SUGGESTIONS_KEY, JSON.stringify({ q, tags: [], ts: Date.now() }));
      setSuggestions([]);
      return [];
    }
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

    setIsSearching(true);
    await cacheAiSuggestions(q);
    setIsSearching(false);
    setQuery("");
    setIsFocused(false);
    router.push(`/category/${encodeURIComponent(q)}?view=suggestions`);
  }

  async function runLandingAction(term: string) {
    if (normalizeSearchTerm(term).toLowerCase() === "credit cards") {
      setQuery("");
      setIsFocused(false);
      setSuggestions([]);
      router.push("/card-comparison");
      return;
    }

    await runSearch(term);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runSearch(query);
  }

  async function handleSuggestionRefresh(nextQuery: string) {
    setQuery(nextQuery);
    setIsFocused(true);

    const q = normalizeSearchTerm(nextQuery);
    if (q.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    await cacheAiSuggestions(q);
    setIsSearching(false);
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
    <main className="landing-interface bg-[#f5f6fa] text-[#0d1b3d]">
      <section className="landing-hero-section mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-8 px-4 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-6">
        <div className="landing-hero-copy rounded-[8px] bg-gradient-to-br from-[#f7f8fc] to-[#edf1ff] px-6 py-10 sm:px-10 lg:px-14 lg:py-16">
          <h1 className="landing-hero-title max-w-[760px] text-[40px] font-bold leading-[1.08] tracking-normal text-[#0d1b3d] sm:text-[52px] lg:text-[64px]">
            Compare. <span className="text-[#ff6a00]">Save.</span>
            <br />
            Make the best choice.
          </h1>
          <p className="landing-hero-subtitle mt-5 max-w-[560px] text-[17px] leading-7 text-[#4b5563]">
            Search products, services, cards and local quotes with the same AI-assisted suggestions used across Ideolo.
          </p>
        </div>

        <div className="landing-hero-products grid grid-cols-3 items-end gap-4">
          {featuredProducts.slice(0, 3).map((product, index) => (
            <button
              key={product.title}
              type="button"
              onClick={() => runSearch(product.query)}
              className={`landing-hero-product-card rounded-[8px] bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition hover:-translate-y-1 ${
                index === 1 ? "min-h-[230px]" : "min-h-[190px]"
              }`}
            >
              <img
                src={product.image}
                alt={product.title}
                className="landing-hero-product-image h-[150px] w-full object-contain"
              />
            </button>
          ))}
        </div>
      </section>

      <section className="landing-search-bar mx-auto max-w-[1200px] px-4 lg:px-6">
        <div className="landing-search-panel relative z-10 rounded-[8px] bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <div className="landing-services-bar mb-5 flex flex-wrap gap-2">
            {serviceTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => runLandingAction(tab.query)}
                  className={`landing-service-tab flex items-center gap-2 rounded-[4px] border px-4 py-2 text-[14px] font-bold transition ${
                    tab.active
                      ? "border-[#ff6a00] bg-[#fff3ea] text-[#ff6a00]"
                      : "border-[#e5e7eb] bg-white text-[#374151] hover:border-[#ff6a00]"
                  }`}
                >
                  <Icon size={17} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <form className="landing-search-form relative" onSubmit={handleSubmit}>
            <div className="landing-search-row flex flex-col gap-3 sm:flex-row">
              <div className="landing-search-input-wrap relative min-w-0 flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6b7280]" />
                <input
                  className="landing-search-input h-14 w-full rounded-[6px] border border-[#d1d5db] bg-white pl-12 pr-12 text-[16px] text-[#111827] outline-none focus:border-[#ff6a00] focus:ring-2 focus:ring-[#ff6a00]/15"
                  type="text"
                  value={query}
                  onChange={(event) => handleSuggestionRefresh(event.target.value)}
                  onFocus={() => setIsFocused(true)}
                  placeholder="What are you looking to compare?"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setSuggestions([]);
                    }}
                    className="landing-search-clear absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#6b7280] hover:bg-[#f3f4f6]"
                    aria-label="Clear search"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="landing-search-submit flex h-14 items-center justify-center gap-2 rounded-[6px] bg-[#ff6a00] px-7 text-[16px] font-bold text-white hover:bg-[#ea5f00]"
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
                      onClick={() => runSearch(item)}
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

          <div className="landing-popular-searches mt-4 flex flex-wrap gap-2">
            {popularSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => runLandingAction(term)}
                className="landing-popular-tag rounded-full bg-[#f3f4f6] px-4 py-2 text-[14px] font-medium text-[#374151] hover:bg-[#e5e7eb]"
                title={term}
              >
                {clampText(term, 26)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-category-section mx-auto max-w-[1440px] px-4 py-10 lg:px-6">
        <h2 className="landing-section-title mb-5 text-[28px] font-bold text-[#0d1b3d]">
          What would you like to compare today?
        </h2>
        <div className="landing-category-grid grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.title}
                className="landing-category-card rounded-[8px] bg-white p-6 text-center shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
              >
                <span className="landing-category-icon mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#fff3ea] text-[#ff6a00]">
                  <Icon size={28} />
                </span>
                <span className="landing-category-title block text-[18px] font-bold text-[#111827]">{category.title}</span>
                <span className="landing-category-description mt-2 block text-[14px] leading-5 text-[#6b7280]">
                  {category.description}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="landing-products-section mx-auto max-w-[1440px] px-4 pb-10 lg:px-6">
        <div className="landing-products-header mb-5 flex items-center justify-between gap-4">
          <h2 className="landing-section-title text-[28px] font-bold text-[#0d1b3d]">Popular Products</h2>
        </div>

        <div className="landing-products-grid grid grid-cols-2 gap-4 lg:grid-cols-6">
          {productsLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="landing-product-card rounded-[8px] bg-white p-4 text-center shadow-[0_4px_14px_rgba(0,0,0,0.05)]"
                >
                  <div className="landing-product-image mx-auto h-[150px] w-full animate-pulse rounded-[6px] bg-[#eef1f5] sm:h-[170px]" />
                  <div className="mx-auto mt-4 h-4 w-4/5 animate-pulse rounded bg-[#eef1f5]" />
                  <div className="mx-auto mt-3 h-4 w-2/3 animate-pulse rounded bg-[#eef1f5]" />
                </div>
              ))
            : popularIphoneProducts.map((product) => (
                <button
                  key={product._id}
                  type="button"
                  onClick={() => openProduct(product)}
                  className="landing-product-card rounded-[8px] bg-white p-4 text-center shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition hover:-translate-y-1"
                >
                  <img
                    src={product.image_url}
                    alt={product.product_name}
                    className="landing-product-image mx-auto h-[150px] w-full object-contain sm:h-[170px]"
                  />
                  <span className="landing-product-title mt-4 block min-h-[44px] text-[15px] font-bold leading-5 text-[#111827]">
                    {product.product_name}
                  </span>
                  <span className="landing-product-price mt-2 block text-[16px] font-bold text-[#ff6a00]">
                    From {formatProductPrice(product.price)}
                  </span>
                </button>
              ))}
        </div>
      </section>

      <section className="landing-trust-section mx-auto max-w-[1440px] px-4 pb-14 lg:px-6">
        <div className="landing-trust-grid grid grid-cols-1 gap-4 rounded-[8px] bg-[#032b6b] p-6 text-white sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="landing-trust-item text-center">
                <Icon className="landing-trust-icon mx-auto mb-3 h-8 w-8 text-[#ffb26f]" />
                <h3 className="landing-trust-title text-[17px] font-bold">{item.title}</h3>
                <p className="landing-trust-description mt-1 text-[14px] text-[#d1d5db]">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
