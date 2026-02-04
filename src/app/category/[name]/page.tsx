"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Products from "@/components/sections/products";
import ProductCardSkeleton from "@/components/sections/skeleton-product-card";
import MobileFilterSidebar, { MobileFacetKey, MobileFacets } from "@/components/sections/mobile-filter-sidebar";

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

// Simple brand extraction
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
  // fallback: first word if capitalized
  const first = t.split(" ")[0]?.trim();
  if (first && first.length > 1) return first;
  return null;
}

function getSpec(p: Product, key: string): string | null {
  const v = p.specifications?.[key];
  if (!v) return null;
  return norm(v);
}

export default function CategoryPage() {
  const params = useParams();
  const searchedName = decodeURIComponent(params.name as string);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [defaultPriceRange, setDefaultPriceRange] = useState<[number, number]>([0, 0]);
  const [selected, setSelected] = useState<Record<string, Set<string>>>({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

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

        // price bounds
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

  // Rule: show mobile filters only if 60%+ are exactly this category
  const isMobileCategory = useMemo(() => {
    if (!products.length) return false;
    const exact = products.filter((p) => p.category === "Mobile Phones & Smartphones").length;
    return exact / products.length >= 0.6;
  }, [products]);

  // Build facet options from products (only when mobile category is dominant)
  const facets: MobileFacets = useMemo(() => {
    const empty: MobileFacets = {
      "Manufacturer": [],
      "Internal Memory": [],
      "RAM Size": [],
      "Network Type": [],
      "Operating System": [],
      "SIM Type": [],
      "Colour Name": [],
    };

    if (!isMobileCategory) return empty;

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
  }, [products, isMobileCategory]);

  const getFacetValue = (p: Product, facetKey: MobileFacetKey): string | null => {
    if (facetKey === "Manufacturer") return getManufacturer(p);
    return getSpec(p, facetKey);
  };

  const toggleFacet = (facetKey: MobileFacetKey, value: string) => {
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

  // Apply filters (only if isMobileCategory; otherwise only price filter)
  const filteredProducts = useMemo(() => {
    const base = isMobileCategory
      ? products.filter((p) => p.category === "Mobile Phones & Smartphones")
      : products;

    return base.filter((p) => {
      // price
      const price = p.numericPrice ?? 0;
      if (priceRange[0] !== 0 || priceRange[1] !== 0) {
        if (price < priceRange[0] || price > priceRange[1]) return false;
      }

      // facets
      for (const k of Object.keys(selected)) {
        const key = k as MobileFacetKey;
        const set = selected[key];
        if (!set || set.size === 0) continue;

        const val = getFacetValue(p, key);
        if (!val) return false;
        if (!set.has(norm(val))) return false;
      }

      return true;
    });
  }, [products, selected, priceRange, isMobileCategory]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selected, priceRange, isMobileCategory]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Mobile Filters button */}
        {isMobileCategory && (
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
          {isMobileCategory && (
            <MobileFilterSidebar<Product>
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              priceRange={priceRange}
              defaultPriceRange={defaultPriceRange}
              onPriceChange={setPriceRange}
              selected={selected}
              onToggle={toggleFacet}
              onReset={resetFilters}
              facets={facets}
              products={products.filter((p) => p.category === "Mobile Phones & Smartphones")}
              filteredProducts={filteredProducts}
              getFacetValue={getFacetValue}
            />
          )}

          <main className="flex-1">
            <div className="mb-3">
              <h2 className="text-2xl font-bold mb-1 capitalize">{searchedName}</h2>
              <p className="text-gray-500">{filteredProducts.length} products found</p>
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
