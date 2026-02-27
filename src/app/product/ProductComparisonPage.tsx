"use client";

import { ProductProvider } from "@/context/ProductContext";
import ProductGallery from "@/components/single-product/product-gallery";
import ProductHeaderInfo from "@/components/single-product/product-header-info";
import ProductVariantsSelector from "@/components/single-product/product-variants-selector";
import OfferComparisonTable from "@/components/single-product/offer-comparison-table";
import ProductDetailsSpecifications from "@/components/single-product/product-details-specifications";
import PriceDevelopmentPanel from "@/components/single-product/price-development-panel";
import { useProduct } from "@/context/ProductContext";
import { Home } from "lucide-react";



interface Props {
  productUrl: string;
  productName?: string;
  sourceName?: string;
}

export default function ProductComparisonPage({
  productUrl,
  productName,
  sourceName,
}: Props) {
  const { product, loading, relatedProducts, relatedLoading } = useProduct();
  console.log(product)

  return (
    <ProductProvider
      productUrl={productUrl}
      productName={productName}
      sourceName={sourceName}
    >
      <div className="hidden lg:flex items-center gap-2 text-[12px] text-[#6b7280]">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="inline-flex items-center gap-1 hover:underline cursor-not-allowed"
        >
          <Home className="w-3.5 h-3.5" />
        </a>
        <span className="text-[#9ca3af]">›</span>
        <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline cursor-not-allowed">
          Sports &amp; Outdoors
        </a>
        <span className="text-[#9ca3af]">›</span>
        <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline cursor-not-allowed">
          Sports shoes
        </a>
        <span className="text-[#9ca3af]">›</span>
        <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline cursor-not-allowed">
          running shoes
        </a>
        <span className="text-[#9ca3af]">›</span>
        <span className="text-[#111827] truncate">{product?.title}</span>
      </div>

      <main className="max-w-[1280px] mx-auto px-3 lg:px-0 pt-2 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr_420px] gap-6 lg:gap-10">

          <div>
            <ProductGallery />
          </div>

          <div className="min-w-0">
            <div className="lg:pt-2">
              <ProductHeaderInfo />
            </div>

            <div className="mt-5">
              <ProductVariantsSelector />
            </div>
          </div>

          <div className="lg:pt-2">
            <PriceDevelopmentPanel />
          </div>
        </div>

        <div className="mt-8 max-w-[1216px] mx-auto">
          <OfferComparisonTable />
        </div>
      </main>

      <div className="max-w-[1280px] mx-auto px-3 lg:px-0 pb-8">
        <div className="max-w-[1216px] mx-auto">
          <ProductDetailsSpecifications />
        </div>
      </div>
    </ProductProvider>
  );
}