"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Products from "@/components/sections/products";
import ProductCardSkeleton from "@/components/sections/skeleton-product-card";
import { Home, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";

import BabyFilterSidebar, {
  BabyFacetKey,
  BabyFacets,
} from "@/components/sections/baby-filter-sidebar";

import MobileFilterSidebar, {
  MobileFacetKey,
  MobileFacets,
} from "@/components/sections/mobile-filter-sidebar";

import FashionFilterSidebar, {
  FashionFacetKey,
  FashionFacets,
} from "@/components/sections/fashion-filter-sidebar";

import PetFilterSidebar, {
  PetFacetKey,
  PetFacets,
} from "@/components/sections/pet-filter-sidebar";

type Specs = Record<string, string>;

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

  specifications?: Specs;

  numericPrice?: number;
  numericOldPrice?: number;

  scraped_at?: any;
}

const ITEMS_PER_PAGE = 20;
const API_LIMIT = 100;

function cleanPrice(p?: string): number {
  return Number((p || "").replace(/[^\d.]/g, "")) || 0;
}

function norm(s: string) {
  return s.trim().replace(/\s+/g, " ");
}

const KNOWN_BRANDS = [
  "Apple",
  "Samsung",
  "Xiaomi",
  "Huawei",
  "Oppo",
  "OnePlus",
  "Google",
  "Nokia",
  "Realme",
  "Vivo",
  "Honor",
  "Sony",
  "Motorola",
];

function getManufacturer(p: Product): string | null {
  const t = p.title || "";
  for (const b of KNOWN_BRANDS) {
    if (t.toLowerCase().includes(b.toLowerCase())) return b;
  }
  const first = t.split(" ")[0]?.trim();
  if (first && first.length > 1) return first;
  return null;
}

function getSpec(p: Product, key: string): string | null {
  const v = p.specifications?.[key];
  if (!v) return null;
  return norm(v);
}

const FASHION_MAIN_CATEGORY = "Fashion & Accessories";

const FASHION_KEYS: FashionFacetKey[] = [
  "Colour Name",
  "Department",
  "Material",
  "Fit",
  "Occasion",
  "Pattern",
  "Size",
  "Care Instructions",
  "Model Name",
  "Model Number",
  "Country of Origin",
  "Material Composition",
  "Bottom Length",
  "Waist Type",
  "Item Pack Quantity",
  "Weave Type",
  "Lining Material",
];

const BABY_MAIN_CATEGORY = "Baby & Child";

const BABY_KEYS: BabyFacetKey[] = [
  "Colour Name",
  "Department",
  "Age Range",
  "Target Age Range",
  "Size",
  "Material",
  "Country of Origin",
  "Item Pack Quantity",
  "Model Name",
  "Model Number",
  "Features",
  "Item Count",
  "Set Includes",
  "Batteries Required",
  "Capacity",
  "Maximum Weight Supported",
  "Stroller Fold Type",
  "Stroller Canopy Type",
  "Pattern",
];

const PET_MAIN_CATEGORY = "Pet Supplies";

const PET_KEYS: PetFacetKey[] = [
  "Department",
  "Age Range",
  "Target Age Range",
  "Size",
  "Colour Name",
  "Material",
  "Dietary Needs",
  "Item Form",
  "Item Count",
  "Item Pack Quantity",
  "Country of Origin",
  "Model Name",
  "Model Number",
  "What's In The Box",
  "Care Instructions",
  "Storage Requirements",
  "Shelf Life",
  "Product Weight",
  "Product Ingredients",
  "Nutritional Facts",
  "Allergy Information",
  "Specialty",
];

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
  const params = useParams();
  const searchedName = decodeURIComponent(params.name as string);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [defaultPriceRange, setDefaultPriceRange] = useState<[number, number]>([0, 0]);
  const [selected, setSelected] = useState<Record<string, Set<string>>>({});

  const [currentPage, setCurrentPage] = useState(1);

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
          `/api/category-products?q=${encodeURIComponent(searchedName)}&limit=${API_LIMIT}`,
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
          }));

        setProducts(mapped);
        setSelected({});
        setCurrentPage(1);
        setSortKey("popular");
        setViewMode("grid");

        const prices = mapped.map((p) => p.numericPrice || 0).filter((x) => x > 0);

        if (prices.length) {
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setDefaultPriceRange([min, max]);
          setPriceRange([min, max]);
        } else {
          setDefaultPriceRange([0, 0]);
          setPriceRange([0, 0]);
        }
      } catch (err) {
        console.error("Error fetching category products:", err);
        if (isActive) setProducts([]);
      } finally {
        if (isActive) setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      isActive = false;
    };
  }, [searchedName]);

  useEffect(() => {
    if (!sortOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!sortRef.current) return;
      if (!sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [sortOpen]);

  const isMobileCategory = useMemo(() => {
    if (!products.length) return false;
    const exact = products.filter((p) => p.category === "Mobile Phones & Smartphones").length;
    return exact / products.length >= 0.6;
  }, [products]);

  const isFashionCategory = useMemo(() => {
    if (!products.length) return false;
    const exact = products.filter((p) => p.main_category === FASHION_MAIN_CATEGORY).length;
    return exact / products.length >= 0.6;
  }, [products]);

  const isBabyCategory = useMemo(() => {
    if (!products.length) return false;
    const exact = products.filter((p) => p.main_category === BABY_MAIN_CATEGORY).length;
    return exact / products.length >= 0.6;
  }, [products]);

  const isPetCategory = useMemo(() => {
    if (!products.length) return false;
    const exact = products.filter((p) => p.main_category === PET_MAIN_CATEGORY).length;
    return exact / products.length >= 0.6;
  }, [products]);

  const filterMode: "mobile" | "fashion" | "baby" | "pet" | "none" = useMemo(() => {
    if (isMobileCategory) return "mobile";
    if (isFashionCategory) return "fashion";
    if (isBabyCategory) return "baby";
    if (isPetCategory) return "pet";
    return "none";
  }, [isMobileCategory, isFashionCategory, isBabyCategory, isPetCategory]);

  useEffect(() => {
    setSelected({});
    setPriceRange(defaultPriceRange);
    setCurrentPage(1);
    setIsSidebarOpen(false);
  }, [filterMode, defaultPriceRange]);

  const mobileFacets: MobileFacets = useMemo(() => {
    const empty: MobileFacets = {
      Manufacturer: [],
      "Internal Memory": [],
      "RAM Size": [],
      "Network Type": [],
      "Operating System": [],
      "SIM Type": [],
      "Colour Name": [],
    };

    if (filterMode !== "mobile") return empty;

    const onlyMobile = products.filter((p) => p.category === "Mobile Phones & Smartphones");

    for (const p of onlyMobile) {
      const m = getManufacturer(p);
      if (m) empty["Manufacturer"].push(norm(m));

      const internal = getSpec(p, "Internal Memory");
      if (internal) empty["Internal Memory"].push(internal);

      const ram = getSpec(p, "RAM Size");
      if (ram) empty["RAM Size"].push(ram);

      const net = getSpec(p, "Network Type");
      if (net) empty["Network Type"].push(net);

      const os = getSpec(p, "Operating System");
      if (os) empty["Operating System"].push(os);

      const sim = getSpec(p, "SIM Type");
      if (sim) empty["SIM Type"].push(sim);

      const color = getSpec(p, "Colour Name");
      if (color) empty["Colour Name"].push(color);
    }

    return empty;
  }, [products, filterMode]);

  const getMobileFacetValue = (p: Product, facetKey: MobileFacetKey) => {
    if (facetKey === "Manufacturer") return getManufacturer(p);
    return getSpec(p, facetKey);
  };

  const toggleMobileFacet = (facetKey: MobileFacetKey, value: string) => {
    const v = norm(value);
    setSelected((prev) => {
      const next = { ...prev };
      const set = new Set(next[facetKey] ?? []);
      if (set.has(v)) set.delete(v);
      else set.add(v);
      next[facetKey] = set;
      return next;
    });
  };

  const fashionFacets: FashionFacets = useMemo(() => {
    const empty = {} as FashionFacets;
    for (const k of FASHION_KEYS) empty[k] = [];

    if (filterMode !== "fashion") return empty;

    const onlyFashion = products.filter((p) => p.main_category === FASHION_MAIN_CATEGORY);

    for (const p of onlyFashion) {
      for (const k of FASHION_KEYS) {
        const v = getSpec(p, k);
        if (v) empty[k].push(v);
      }
    }

    return empty;
  }, [products, filterMode]);

  const getFashionFacetValue = (p: Product, facetKey: FashionFacetKey) => {
    return getSpec(p, facetKey);
  };

  const toggleFashionFacet = (facetKey: FashionFacetKey, value: string) => {
    const v = norm(value);
    setSelected((prev) => {
      const next = { ...prev };
      const set = new Set(next[facetKey] ?? []);
      if (set.has(v)) set.delete(v);
      else set.add(v);
      next[facetKey] = set;
      return next;
    });
  };

  const babyFacets: BabyFacets = useMemo(() => {
    const empty = {} as BabyFacets;
    for (const k of BABY_KEYS) empty[k] = [];

    if (filterMode !== "baby") return empty;

    const onlyBaby = products.filter((p) => p.main_category === BABY_MAIN_CATEGORY);

    for (const p of onlyBaby) {
      for (const k of BABY_KEYS) {
        const v = getSpec(p, k);
        if (v) empty[k].push(v);
      }
    }

    return empty;
  }, [products, filterMode]);

  const getBabyFacetValue = (p: Product, facetKey: BabyFacetKey) => {
    return getSpec(p, facetKey);
  };

  const petFacets: PetFacets = useMemo(() => {
    const empty = {} as PetFacets;
    for (const k of PET_KEYS) empty[k] = [];

    if (filterMode !== "pet") return empty;

    const onlyPet = products.filter((p) => p.main_category === PET_MAIN_CATEGORY);

    for (const p of onlyPet) {
      for (const k of PET_KEYS) {
        const v = getSpec(p, k);
        if (v) empty[k].push(v);
      }
    }

    return empty;
  }, [products, filterMode]);

  const getPetFacetValue = (p: Product, facetKey: PetFacetKey) => {
    return getSpec(p, facetKey);
  };

  const togglePetFacet = (facetKey: PetFacetKey, value: string) => {
    const v = norm(value);
    setSelected((prev) => {
      const next = { ...prev };
      const set = new Set(next[facetKey] ?? []);
      if (set.has(v)) set.delete(v);
      else set.add(v);
      next[facetKey] = set;
      return next;
    });
  };

  const toggleBabyFacet = (facetKey: BabyFacetKey, value: string) => {
    const v = norm(value);
    setSelected((prev) => {
      const next = { ...prev };
      const set = new Set(next[facetKey] ?? []);
      if (set.has(v)) set.delete(v);
      else set.add(v);
      next[facetKey] = set;
      return next;
    });
  };

  const resetFilters = () => {
    setSelected({});
    setPriceRange(defaultPriceRange);
  };

  const filteredProducts = useMemo(() => {
    let base = products;

    if (filterMode === "mobile") {
      base = products.filter((p) => p.category === "Mobile Phones & Smartphones");
    }
    if (filterMode === "baby") {
      base = products.filter((p) => p.main_category === BABY_MAIN_CATEGORY);
    }
    if (filterMode === "fashion") {
      base = products.filter((p) => p.main_category === FASHION_MAIN_CATEGORY);
    }
    if (filterMode === "pet") {
      base = products.filter((p) => p.main_category === PET_MAIN_CATEGORY);
    }

    return base.filter((p) => {
      const price = p.numericPrice ?? 0;
      if (price < priceRange[0] || price > priceRange[1]) return false;

      for (const k of Object.keys(selected)) {
        const set = selected[k];
        if (!set || set.size === 0) continue;

        if (filterMode === "mobile") {
          const key = k as MobileFacetKey;
          const val = getMobileFacetValue(p, key);
          if (!val) return false;
          if (!set.has(norm(val))) return false;
        }

        if (filterMode === "fashion") {
          const key = k as FashionFacetKey;
          const val = getFashionFacetValue(p, key);
          if (!val) return false;
          if (!set.has(norm(val))) return false;
        }

        if (filterMode === "baby") {
          const key = k as BabyFacetKey;
          const val = getBabyFacetValue(p, key);
          if (!val) return false;
          if (!set.has(norm(val))) return false;
        }

        if (filterMode === "pet") {
          const key = k as PetFacetKey;
          const val = getPetFacetValue(p, key);
          if (!val) return false;
          if (!set.has(norm(val))) return false;
        }
      }

      return true;
    });
  }, [products, selected, priceRange, filterMode]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selected, priceRange, filterMode, sortKey, viewMode]);

  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts];

    const popA = (p: Product) => Number((p.ratingCount || "").toString().replace(/[^\d]/g, "")) || 0;
    const savings = (p: Product) => Math.max(0, (p.numericOldPrice || 0) - (p.numericPrice || 0));
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

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  const sortLabel = useMemo(() => {
    if (sortKey === "popular") return "Most popular first";
    if (sortKey === "savings") return "Biggest savings first";
    if (sortKey === "cheap") return "Price: Cheapest first";
    if (sortKey === "high") return "Price: Highest first";
    return "Newest first";
  }, [sortKey]);

  const pageButtons = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => String(i + 1));
    const set = new Set<number>([1, 2, 3, totalPages - 1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
    const nums = Array.from(set).filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);

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
            <Home className="h-4 w-4" />
          </Link>

          <ChevronRight className="h-4 w-4 text-gray-400" />

          <span className="cursor-not-allowed text-gray-600 capitalize">{searchedName}</span>
        </div>



        <div className="hidden md:flex items-center justify-between gap-3 mb-3">
          <div className="mb-3 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-semibold leading-tight text-gray-900 capitalize">{searchedName}</h1>
              <div className="mt-1 text-[14px] text-gray-600">{sortedProducts.length} products found</div>
              <div className="mb-3 flex flex-col gap-2 md:hidden">
                <div className="flex items-center justify-between gap-2">
                  {filterMode !== "none" ? (
                    <button
                      onClick={() => setIsSidebarOpen(true)}
                      className="h-10 rounded border border-[#cfd6dd] bg-white px-4 text-[13px] font-medium text-[#0b63c8] hover:bg-[#f2f6fb]"
                    >
                      Filters
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-2">
                    <div ref={sortRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setSortOpen((v) => !v)}
                        className="inline-flex h-10 items-center gap-2 rounded border border-[#cfd6dd] bg-white px-3 text-[13px] font-medium text-gray-800"
                      >
                        <span className="text-[#0b63c8]">{sortLabel}</span>
                        {sortOpen ? (
                          <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}                      </button>

                      {sortOpen ? (
                        <div className="absolute right-0 top-[44px] z-30 w-[240px] overflow-hidden rounded border border-[#cfd6dd] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                          {[
                            { k: "popular", t: "Most popular first" },
                            { k: "savings", t: "Biggest savings first" },
                            { k: "cheap", t: "Price: Cheapest first" },
                            { k: "high", t: "Price: Highest first" },
                            { k: "new", t: "Newest first" },
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
                                className={`flex w-full items-center justify-between px-4 py-2 text-left text-[13px] ${active ? "bg-[#0b63c8] text-white" : "text-[#0b63c8] hover:bg-[#f2f6fb]"
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
                        className={`grid h-10 w-10 place-items-center ${viewMode === "grid" ? "bg-[#0b63c8] text-white" : "text-[#0b63c8] hover:bg-[#f2f6fb]"
                          }`}
                      >
                        <GridIcon active={viewMode === "grid"} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("list")}
                        className={`grid h-10 w-10 place-items-center border-l border-[#cfd6dd] ${viewMode === "list" ? "bg-[#0b63c8] text-white" : "text-[#0b63c8] hover:bg-[#f2f6fb]"
                          }`}
                      >
                        <ListIcon active={viewMode === "list"} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div ref={sortRef} className="relative">
              <button
                type="button"
                onClick={() => setSortOpen((v) => !v)}
                className="inline-flex h-10 items-center gap-2 rounded border border-[#cfd6dd] bg-white px-3 text-[13px] font-medium text-gray-800"
              >
                <span className="text-[#0b63c8]">{sortLabel}</span>
                {sortOpen ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}              </button>

              {sortOpen ? (
                <div className="absolute right-0 top-[44px] z-30 w-[260px] overflow-hidden rounded border border-[#cfd6dd] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                  {[
                    { k: "popular", t: "Most popular first" },
                    { k: "savings", t: "Biggest savings first" },
                    { k: "cheap", t: "Price: Cheapest first" },
                    { k: "high", t: "Price: Highest first" },
                    { k: "new", t: "Newest first" },
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
                        className={`flex w-full items-center justify-between px-4 py-2 text-left text-[13px] ${active ? "bg-[#0b63c8] text-white" : "text-[#0b63c8] hover:bg-[#f2f6fb]"
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
                className={`grid h-10 w-10 place-items-center ${viewMode === "grid" ? "bg-[#0b63c8] text-white" : "text-[#0b63c8] hover:bg-[#f2f6fb]"
                  }`}
              >
                <GridIcon active={viewMode === "grid"} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`grid h-10 w-10 place-items-center border-l border-[#cfd6dd] ${viewMode === "list" ? "bg-[#0b63c8] text-white" : "text-[#0b63c8] hover:bg-[#f2f6fb]"
                  }`}
              >
                <ListIcon active={viewMode === "list"} />
              </button>
            </div>
          </div>
        </div>


        <div className="flex gap-4">
          {filterMode === "mobile" && (
            <MobileFilterSidebar<Product>
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              priceRange={priceRange}
              defaultPriceRange={defaultPriceRange}
              onPriceChange={setPriceRange}
              selected={selected}
              onToggle={toggleMobileFacet}
              onReset={resetFilters}
              facets={mobileFacets}
              products={products.filter((p) => p.category === "Mobile Phones & Smartphones")}
              filteredProducts={sortedProducts}
              getFacetValue={getMobileFacetValue}
            />
          )}

          {filterMode === "fashion" && (
            <FashionFilterSidebar<Product>
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              priceRange={priceRange}
              defaultPriceRange={defaultPriceRange}
              onPriceChange={setPriceRange}
              selected={selected}
              onToggle={toggleFashionFacet}
              onReset={resetFilters}
              facets={fashionFacets}
              products={products.filter((p) => p.main_category === FASHION_MAIN_CATEGORY)}
              filteredProducts={sortedProducts}
              getFacetValue={getFashionFacetValue}
            />
          )}

          {filterMode === "baby" && (
            <BabyFilterSidebar<Product>
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              priceRange={priceRange}
              defaultPriceRange={defaultPriceRange}
              onPriceChange={setPriceRange}
              selected={selected}
              onToggle={toggleBabyFacet}
              onReset={resetFilters}
              facets={babyFacets}
              products={products.filter((p) => p.main_category === BABY_MAIN_CATEGORY)}
              filteredProducts={sortedProducts}
              getFacetValue={getBabyFacetValue}
            />
          )}

          {filterMode === "pet" && (
            <PetFilterSidebar<Product>
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              priceRange={priceRange}
              defaultPriceRange={defaultPriceRange}
              onPriceChange={setPriceRange}
              selected={selected}
              onToggle={togglePetFacet}
              onReset={resetFilters}
              facets={petFacets}
              products={products.filter((p) => p.main_category === PET_MAIN_CATEGORY)}
              filteredProducts={sortedProducts}
              getFacetValue={getPetFacetValue}
            />
          )}

          <main className="min-w-0 flex-1">


            {loading ? (
              <div className="w-full bg-[#cfd6dd] p-px">
                <div className="grid grid-cols-2 gap-px sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="bg-white p-4">
                      <ProductCardSkeleton />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <Products products={paginatedProducts as any} landingPage={false} view={viewMode} />

                {totalPages > 1 ? (
                  <div className="mt-6 flex items-center justify-end gap-2">
                    <div className="flex items-center gap-2">
                      {pageButtons.map((t, idx) => {
                        if (t === "…") {
                          return (
                            <div key={`e-${idx}`} className="h-10 w-10 grid place-items-center text-[14px] text-gray-500">
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
                            className={`h-10 w-10 rounded border text-sm font-medium ${active ? "bg-[#0b63c8] text-white border-[#0b63c8]" : "border-[#cfd6dd] text-[#0b63c8] hover:bg-[#f2f6fb]"
                              }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className={`ml-2 h-10 w-[84px] rounded border text-sm font-semibold ${currentPage === totalPages
                        ? "cursor-not-allowed border-[#cfd6dd] bg-[#e9eef5] text-[#9aa7b6]"
                        : "border-[#0b63c8] bg-[#0b63c8] text-white hover:bg-[#095bb6]"
                        }`}
                      disabled={currentPage === totalPages}
                    >
                      →
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}