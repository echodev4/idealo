"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { ProductProvider, useProduct } from "@/context/ProductContext";
import ProductGallery from "@/components/single-product/product-gallery";
import ProductHeaderInfo from "@/components/single-product/product-header-info";
import ProductVariantsSelector from "@/components/single-product/product-variants-selector";
import OfferComparisonTable from "@/components/single-product/offer-comparison-table";
import ProductDetailsSpecifications from "@/components/single-product/product-details-specifications";
import PriceDevelopmentPanel from "@/components/single-product/price-development-panel";

interface Props {
  productUrl: string;
  productName?: string;
  sourceName?: string;
}

function ProductTopNav() {
  const { product, loading } = useProduct();

  return (
    <div className="hidden lg:flex items-center gap-2 text-[12px] text-[#6b7280] pt-1 pb-3">
      <Link href="/" className="inline-flex items-center text-[#111827] hover:text-[#1a73e8]">
        <Home className="w-3.5 h-3.5" />
      </Link>
      <span className="text-[#9ca3af]">›</span>
      <span className="truncate max-w-[900px] text-[#111827] cursor-not-allowed">
        {loading ? "Loading..." : product?.title || "Product"}
      </span>
    </div>
  );
}

export default function ProductComparisonPage({ productUrl, productName, sourceName }: Props) {
  return (
    <ProductProvider productUrl={productUrl} productName={productName} sourceName={sourceName}>
      <main className="container max-w-[1280px] mx-auto px-3 lg:px-0 pt-2 pb-6">
        <ProductTopNav />

        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_280px] gap-6 lg:gap-10">
          <div className="lg:pt-6">
            <ProductGallery />
          </div>

          <div className="min-w-0 lg:pt-4">
            <ProductHeaderInfo />
            <div className="mt-4 lg:mt-5">
              <ProductVariantsSelector />
            </div>
          </div>

          <div className="lg:pt-4">
            <PriceDevelopmentPanel />
          </div>
        </div>

        <div className="mt-8 max-w-[1216px] mx-auto">
          <OfferComparisonTable />
        </div>
      </main>

      <div className="container max-w-[1280px] mx-auto px-3 lg:px-0 pb-8">
        <div className="max-w-[1216px] mx-auto">
          <ProductDetailsSpecifications />
        </div>
      </div>
    </ProductProvider>
  );
}