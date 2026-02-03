"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Products from "@/components/sections/products";
import ProductCardSkeleton from "@/components/sections/skeleton-product-card";

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

  numericPrice?: number;
  numericOldPrice?: number;
}

const ITEMS_PER_PAGE = 18;
const API_LIMIT = 100;

function cleanPrice(p?: string): number {
  return Number((p || "").replace(/[^\d.]/g, "")) || 0;
}

export default function CategoryPage() {
  const params = useParams();
  const searchedName = decodeURIComponent(params.name as string);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

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
        setCurrentPage(1);
      } catch (err) {
        console.error("❌ Error fetching category products:", err);
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

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return products.slice(start, start + ITEMS_PER_PAGE);
  }, [products, currentPage]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <main>
          <div className="mb-3">
            <h2 className="text-2xl font-bold mb-1 capitalize">
              {searchedName}
            </h2>
            <p className="text-gray-500">{products.length} products found</p>
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
  );
}
