"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Products from "@/components/sections/products";
import ProductCardSkeleton from "@/components/sections/skeleton-product-card";

import MobileFilterSidebar, {
  MobileFacetKey,
  MobileFacets,
} from "@/components/sections/mobile-filter-sidebar";

import FashionFilterSidebar, {
  FashionFacetKey,
  FashionFacets,
} from "@/components/sections/fashion-filter-sidebar";

type Specs = Record<string, string>;

export interface Product {
  _id?: string;
  product_url: string;

  title: string;
  currentPrice: string;
  previousPrice?: string;
  discountPercentage?: string;
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
}

const ITEMS_PER_PAGE = 18;
const API_LIMIT = 100;

function cleanPrice(p?: string): number {
  return Number((p || "").replace(/[^\d.]/g, "")) || 0;
}

function norm(s: string) {
  return s.trim().replace(/\s+/g, " ");
}

// --------------------
// MOBILE HELPERS
// --------------------
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

// --------------------
// FASHION HELPERS
// --------------------
const FASHION_MAIN_CATEGORY = "Fashion & Accessories";

// Your “common” spec keys list for fashion.
// We’ll use a curated subset in UI (Department, Size, Colour, Material, Fit, Occasion, Pattern)
// but you can extend later easily.
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

export default function CategoryPage() {
  const params = useParams();
  const searchedName = decodeURIComponent(params.name as string);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [defaultPriceRange, setDefaultPriceRange] =
    useState<[number, number]>([0, 0]);
  const [selected, setSelected] = useState<Record<string, Set<string>>>({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let isActive = true;

    async function fetchProducts() {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/category-products?q=${encodeURIComponent(
            searchedName
          )}&limit=${API_LIMIT}`,
          { cache: "no-store" }
        );

        const json = await res.json();
        const apiProducts: Product[] = Array.isArray(json.products)
          ? json.products
          : [];

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

        const prices = mapped
          .map((p) => p.numericPrice || 0)
          .filter((x) => x > 0);

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

  // 60% Rule (Mobile by category)
  const isMobileCategory = useMemo(() => {
    if (!products.length) return false;
    const exact = products.filter(
      (p) => p.category === "Mobile Phones & Smartphones"
    ).length;
    return exact / products.length >= 0.6;
  }, [products]);

  // 60% Rule (Fashion by main_category)
  const isFashionCategory = useMemo(() => {
    if (!products.length) return false;
    const exact = products.filter((p) => p.main_category === FASHION_MAIN_CATEGORY)
      .length;
    return exact / products.length >= 0.6;
  }, [products]);

  // Choose which filter mode is active (mobile wins if both somehow true)
  const filterMode: "mobile" | "fashion" | "none" = useMemo(() => {
    if (isMobileCategory) return "mobile";
    if (isFashionCategory) return "fashion";
    return "none";
  }, [isMobileCategory, isFashionCategory]);

  // Reset selections when mode changes (keeps state clean)
  useEffect(() => {
    setSelected({});
    setPriceRange(defaultPriceRange);
    setCurrentPage(1);
    setIsSidebarOpen(false);
  }, [filterMode, defaultPriceRange]);

  // --------------------
  // MOBILE FACETS
  // --------------------
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

    const onlyMobile = products.filter(
      (p) => p.category === "Mobile Phones & Smartphones"
    );

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

  // --------------------
  // FASHION FACETS
  // --------------------
  const fashionFacets: FashionFacets = useMemo(() => {
    const empty = {} as FashionFacets;
    for (const k of FASHION_KEYS) empty[k] = [];

    if (filterMode !== "fashion") return empty;

    const onlyFashion = products.filter(
      (p) => p.main_category === FASHION_MAIN_CATEGORY
    );

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

  const resetFilters = () => {
    setSelected({});
    setPriceRange(defaultPriceRange);
  };

  // Apply filters based on active mode
  const filteredProducts = useMemo(() => {
    let base = products;

    if (filterMode === "mobile") {
      base = products.filter(
        (p) => p.category === "Mobile Phones & Smartphones"
      );
    } else if (filterMode === "fashion") {
      base = products.filter((p) => p.main_category === FASHION_MAIN_CATEGORY);
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
      }

      return true;
    });
  }, [products, selected, priceRange, filterMode]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selected, priceRange, filterMode]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Filters button (mobile + fashion) */}
        {filterMode !== "none" && (
          <div className="mb-3 md:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="px-4 py-2 rounded border text-sm border-gray-300 hover:bg-gray-100"
            >
              Filters
            </button>
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar */}
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
              products={products.filter(
                (p) => p.category === "Mobile Phones & Smartphones"
              )}
              filteredProducts={filteredProducts}
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
              products={products.filter(
                (p) => p.main_category === FASHION_MAIN_CATEGORY
              )}
              filteredProducts={filteredProducts}
              getFacetValue={getFashionFacetValue}
            />
          )}

          <main className="flex-1">
            <div className="mb-3">
              <h2 className="text-2xl font-bold mb-1 capitalize">
                {searchedName}
              </h2>
              <p className="text-gray-500">
                {filteredProducts.length} products found
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(12)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                <Products products={paginatedProducts} landingPage={false} />

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 flex-wrap mt-4">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const page = i + 1;
                      const active = page === currentPage;

                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded border text-sm ${active
                            ? "bg-[#0066CC] text-white border-[#0066CC]"
                            : "border-gray-300 hover:bg-gray-100"
                            }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
