"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import FilterSidebar from "@/components/sections/filter-sidebar";
import Products from "@/components/sections/products";
import ProductCardSkeleton from "@/components/sections/skeleton-product-card";

export interface Product {
  product_url: string;
  _id: string;
  source: string;
  product_name: string;
  image_url: string;
  price: string;
  old_price?: string;
  discount?: string;
  reviews?: string;
  average_rating?: number | null;
  created_at?: string;
  updated_at?: string;

  // derived (frontend-only)
  numericPrice?: number;
  numericOldPrice?: number;
}

const ITEMS_PER_PAGE = 18;
const API_LIMIT = 100;

/**
 * Converts formatted price strings to numeric values.
 * Safe for strings like "AED 3,499" or "$1,299"
 */
function cleanPrice(p?: string): number {
  return Number((p || "").replace(/[^\d.]/g, "")) || 0;
}

/* ======================
   PAGE
====================== */

export default function CategoryPage() {
  const params = useParams();
  const searchedName = decodeURIComponent(params.name as string);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [defaultPriceRange, setDefaultPriceRange] =
    useState<[number, number]>([0, 0]);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  /* ======================
     FETCH PRODUCTS
  ====================== */

  useEffect(() => {
    let isActive = true;

    async function fetchProducts() {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/products?q=${encodeURIComponent(searchedName)}&limit=${API_LIMIT}`,
          { cache: "no-store" }
        );

        const json = await res.json();
        const apiProducts: Product[] = json.products || [];

        if (!isActive) return;

        const mapped: Product[] = apiProducts
          .filter(
            (p) =>
              p.product_name &&
              p.image_url &&
              p.product_url
          )
          .map((p) => {
            const numericPrice = cleanPrice(p.price);
            const numericOldPrice = cleanPrice(p.old_price);

            return {
              ...p,
              numericPrice,
              numericOldPrice,
            };
          });

        setProducts(mapped);
        setCurrentPage(1);

        // Compute price bounds once
        const prices = mapped
          .map((p) => p.numericPrice || 0)
          .filter((p) => p > 0);

        if (prices.length) {
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setDefaultPriceRange([min, max]);
          setPriceRange([min, max]);
        }
      } catch (err) {
        console.error("❌ Error fetching category products:", err);
      } finally {
        if (isActive) setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      isActive = false;
    };
  }, [searchedName]);

  /* ======================
     RESET PAGINATION
  ====================== */

  useEffect(() => {
    setCurrentPage(1);
  }, [priceRange, selectedStores]);

  /* ======================
     APPLY FILTERS
  ====================== */

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const price = p.numericPrice ?? 0;

      const priceMatch =
        price >= priceRange[0] && price <= priceRange[1];

      const storeMatch =
        selectedStores.length === 0 ||
        selectedStores.includes(p.source);

      return priceMatch && storeMatch;
    });
  }, [products, priceRange, selectedStores]);

  /* ======================
     PAGINATION
  ====================== */

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  /* ======================
     RENDER
  ====================== */
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <FilterSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            priceRange={priceRange}
            defaultPriceRange={defaultPriceRange}
            onPriceChange={setPriceRange}
            selectedStores={selectedStores}
            onStoreToggle={(store) =>
              setSelectedStores((prev) =>
                prev.includes(store)
                  ? prev.filter((s) => s !== store)
                  : [...prev, store]
              )
            }
            stores={[...new Set(products.map((p) => p.source))]}
          />

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
                <Products
                  products={paginatedProducts}
                  landingPage={false}
                />

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
