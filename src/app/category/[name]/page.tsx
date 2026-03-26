"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Products from "@/components/category/products";
import ProductCardSkeleton from "@/components/category/skeleton-product-card";
import { useLanguage } from "@/contexts/language-context";

export interface Product {
  _id?: string;
  product_url: string;

  title: string;
  currentPrice: string;
  previousPrice?: string;
  discountPercentage?: string;
  rating?: string;
  ratingCount?: string;
  images: { src: string; alt?: string }[];

  category_path_text?: string;
  category?: string;
  main_category?: string;

  source?: string;
  source_record_id?: string;

  numericPrice?: number;
  numericOldPrice?: number;

  scraped_at?: any;
  offerCount?: number;
}

const ITEMS_PER_PAGE = 20;

function cleanPrice(p?: string): number {
  return Number((p || "").replace(/[^\d.]/g, "")) || 0;
}

function getScrapedAtMs(p: Product) {
  const v: any = (p as any)?.scraped_at;
  const d = v?.$date ?? v;
  const ms = d ? Date.parse(String(d)) : 0;
  return Number.isFinite(ms) ? ms : 0;
}

type SortKey = "popular" | "savings" | "cheap" | "high" | "new";
type ViewMode = "grid" | "list";

function GridIcon({ active }: { active: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className={active ? "fill-current" : "fill-current"}>
      <path d="M20 22h-5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2m-9-2v-5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2M22 9V4a2 2 0 0 0-2-2h-5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2M11 9V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2" />
    </svg>
  );
}

function ListIcon({ active }: { active: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className={active ? "fill-current" : "fill-current"}>
      <path d="M20 11H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2m2 9v-5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="fill-current">
      <path d="M12 3l9 8h-3v10h-5v-6H11v6H6V11H3l9-8z" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" className="fill-current">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export default function CategoryPage() {
  const { t } = useLanguage();
  const params = useParams();
  const searchedName = decodeURIComponent(params.name as string);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [sortKey, setSortKey] = useState<SortKey>("popular");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement | null>(null);

  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  useEffect(() => {
    let isActive = true;

    async function fetchProducts() {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/category-products?q=${encodeURIComponent(searchedName)}&page=${currentPage}&limit=${ITEMS_PER_PAGE}`,
          { cache: "no-store" }
        );

        const json = await res.json();
        const apiProducts: Product[] = Array.isArray(json.products) ? json.products : [];

        if (!isActive) return;

        const mapped: Product[] = apiProducts
          .filter((p) => p?.title && p?.product_url && p?.images?.[0]?.src)
          .map((p) => ({
            ...p,
            numericPrice: cleanPrice(p.currentPrice),
            numericOldPrice: cleanPrice(p.previousPrice),
            offerCount: typeof p.offerCount === "number" ? p.offerCount : 0,
          }));

        setProducts(mapped);
        setTotalProducts(Number(json.total) || 0);
        setTotalPages(Number(json.totalPages) || 0);
      } catch (err) {
        console.error("Error fetching category products:", err);
        if (isActive) {
          setProducts([]);
          setTotalProducts(0);
          setTotalPages(0);
        }
      } finally {
        if (isActive) setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      isActive = false;
    };
  }, [searchedName, currentPage]);

  useEffect(() => {
    if (!sortOpen) return;

    const onDown = (e: MouseEvent) => {
      if (!sortRef.current) return;
      if (!sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };

    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [sortOpen]);

  useEffect(() => {
    setCurrentPage(1);
    setSortKey("popular");
    setViewMode("grid");
  }, [searchedName]);

  const filteredProducts = useMemo(() => {
    return products;
  }, [products]);

  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts];

    const popA = (p: Product) =>
      Number((p.ratingCount || "").toString().replace(/[^\d]/g, "")) || 0;

    const savings = (p: Product) =>
      Math.max(0, (p.numericOldPrice || 0) - (p.numericPrice || 0));

    const price = (p: Product) => p.numericPrice || 0;

    arr.sort((a, b) => {
      if (sortKey === "popular") return popA(b) - popA(a);
      if (sortKey === "savings") return savings(b) - savings(a);
      if (sortKey === "cheap") return price(a) - price(b);
      if (sortKey === "high") return price(b) - price(a);
      if (sortKey === "new") return getScrapedAtMs(b) - getScrapedAtMs(a);
      return 0;
    });

    return arr;
  }, [filteredProducts, sortKey]);

  const sortLabel = useMemo(() => {
    if (sortKey === "popular") return t("categoryPage.sort.popular", "Most popular first");
    if (sortKey === "savings") return t("categoryPage.sort.savings", "Biggest savings first");
    if (sortKey === "cheap") return t("categoryPage.sort.cheap", "Price: Cheapest first");
    if (sortKey === "high") return t("categoryPage.sort.high", "Price: Highest first");
    return t("categoryPage.sort.newest", "Newest first");
  }, [sortKey, t]);

  const pageButtons = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => String(i + 1));

    const set = new Set<number>([
      1,
      2,
      3,
      totalPages - 1,
      totalPages,
      currentPage,
      currentPage - 1,
      currentPage + 1,
    ]);

    const nums = Array.from(set)
      .filter((n) => n >= 1 && n <= totalPages)
      .sort((a, b) => a - b);

    const out: string[] = [];
    for (let i = 0; i < nums.length; i++) {
      const n = nums[i];
      const prev = nums[i - 1];
      if (i > 0 && prev && n - prev > 1) out.push("…");
      out.push(String(n));
    }

    return out;
  }, [totalPages, currentPage]);

  return (
    <div className="min-h-screen bg-[#eef2f6]">
      <div className="max-w-[1280px] mx-auto px-3 lg:px-0 py-5">
        <div className="mb-3 flex items-center gap-2 text-[13px] text-gray-600">
          <Link href="/" className="inline-flex items-center gap-2 text-[#0b63c8] hover:underline">
            <HomeIcon />
          </Link>
          <span className="text-gray-400">
            <ChevronRightIcon />
          </span>
          <span className="cursor-not-allowed text-gray-600 capitalize">{searchedName}</span>
        </div>

        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-semibold leading-tight text-gray-900 capitalize">
              {searchedName}
            </h1>
            <div className="mt-1 text-[14px] text-gray-600">
              {totalProducts} {t("categoryPage.productsFound", "products found")}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div ref={sortRef} className="relative">
              <button
                type="button"
                onClick={() => setSortOpen((v) => !v)}
                className="inline-flex h-10 items-center gap-2 rounded border border-[#cfd6dd] bg-white px-3 text-[13px] font-medium text-gray-800"
              >
                <span className="text-[#0b63c8]">{sortLabel}</span>
                <span className="text-gray-500">▾</span>
              </button>

              {sortOpen ? (
                <div className="absolute right-0 top-[44px] z-30 w-[260px] overflow-hidden rounded border border-[#cfd6dd] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                  {[
                    { k: "popular", t: t("categoryPage.sort.popular", "Most popular first") },
                    { k: "savings", t: t("categoryPage.sort.savings", "Biggest savings first") },
                    { k: "cheap", t: t("categoryPage.sort.cheap", "Price: Cheapest first") },
                    { k: "high", t: t("categoryPage.sort.high", "Price: Highest first") },
                    { k: "new", t: t("categoryPage.sort.newest", "Newest first") },
                  ].map((o) => {
                    const active = sortKey === (o.k as SortKey);
                    return (
                      <button
                        key={o.k}
                        type="button"
                        onClick={() => {
                          setSortKey(o.k as SortKey);
                          setSortOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-4 py-2 text-left text-[13px] ${
                          active ? "bg-[#0b63c8] text-white" : "text-[#0b63c8] hover:bg-[#f2f6fb]"
                        }`}
                      >
                        <span>{o.t}</span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <div className="flex items-center overflow-hidden rounded border border-[#cfd6dd] bg-white">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`grid h-10 w-10 place-items-center ${
                  viewMode === "grid" ? "bg-[#0b63c8] text-white" : "text-[#0b63c8] hover:bg-[#f2f6fb]"
                }`}
              >
                <GridIcon active={viewMode === "grid"} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`grid h-10 w-10 place-items-center border-l border-[#cfd6dd] ${
                  viewMode === "list" ? "bg-[#0b63c8] text-white" : "text-[#0b63c8] hover:bg-[#f2f6fb]"
                }`}
              >
                <ListIcon active={viewMode === "list"} />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-3 flex flex-col gap-2 md:hidden">
          <div className="flex items-center justify-end gap-2">
            <div className="flex items-center gap-2">
              <div ref={sortRef} className="relative">
                <button
                  type="button"
                  onClick={() => setSortOpen((v) => !v)}
                  className="inline-flex h-10 items-center gap-2 rounded border border-[#cfd6dd] bg-white px-3 text-[13px] font-medium text-gray-800"
                >
                  <span className="text-[#0b63c8]">{sortLabel}</span>
                  <span className="text-gray-500">▾</span>
                </button>

                {sortOpen ? (
                  <div className="absolute right-0 top-[44px] z-30 w-[240px] overflow-hidden rounded border border-[#cfd6dd] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                    {[
                      { k: "popular", t: t("categoryPage.sort.popular", "Most popular first") },
                      { k: "savings", t: t("categoryPage.sort.savings", "Biggest savings first") },
                      { k: "cheap", t: t("categoryPage.sort.cheap", "Price: Cheapest first") },
                      { k: "high", t: t("categoryPage.sort.high", "Price: Highest first") },
                      { k: "new", t: t("categoryPage.sort.newest", "Newest first") },
                    ].map((o) => {
                      const active = sortKey === (o.k as SortKey);
                      return (
                        <button
                          key={o.k}
                          type="button"
                          onClick={() => {
                            setSortKey(o.k as SortKey);
                            setSortOpen(false);
                          }}
                          className={`flex w-full items-center justify-between px-4 py-2 text-left text-[13px] ${
                            active ? "bg-[#0b63c8] text-white" : "text-[#0b63c8] hover:bg-[#f2f6fb]"
                          }`}
                        >
                          <span>{o.t}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              <div className="flex items-center overflow-hidden rounded border border-[#cfd6dd] bg-white">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`grid h-10 w-10 place-items-center ${
                    viewMode === "grid" ? "bg-[#0b63c8] text-white" : "text-[#0b63c8] hover:bg-[#f2f6fb]"
                  }`}
                >
                  <GridIcon active={viewMode === "grid"} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`grid h-10 w-10 place-items-center border-l border-[#cfd6dd] ${
                    viewMode === "list" ? "bg-[#0b63c8] text-white" : "text-[#0b63c8] hover:bg-[#f2f6fb]"
                  }`}
                >
                  <ListIcon active={viewMode === "list"} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <main className="min-w-0 flex-1">
            <div className="hidden md:flex items-center justify-between gap-3"></div>

            {loading ? (
              <div className="w-full bg-[#cfd6dd] p-px">
                <div className="grid grid-cols-2 gap-px sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  {[...Array(15)].map((_, i) => (
                    <div key={i} className="bg-white p-4">
                      <ProductCardSkeleton />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Products products={sortedProducts as any} view={viewMode} />
            )}
          </main>
        </div>

        {totalPages > 1 ? (
          <div className="mt-6 flex items-center justify-end gap-2">
            <div className="flex items-center gap-2">
              {pageButtons.map((t, idx) => {
                if (t === "…") {
                  return (
                    <div key={`e-${idx}`} className="grid h-10 w-10 place-items-center text-[14px] text-gray-500">
                      …
                    </div>
                  );
                }

                const page = Number(t);
                const active = page === currentPage;

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-10 w-10 rounded border text-sm font-medium ${
                      active
                        ? "border-[#0b63c8] bg-[#0b63c8] text-white"
                        : "border-[#cfd6dd] text-[#0b63c8] hover:bg-[#f2f6fb]"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={`ml-2 h-10 w-[84px] rounded border text-sm font-semibold ${
                currentPage === totalPages
                  ? "cursor-not-allowed border-[#cfd6dd] bg-[#e9eef5] text-[#9aa7b6]"
                  : "border-[#0b63c8] bg-[#0b63c8] text-white hover:bg-[#095bb6]"
              }`}
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}