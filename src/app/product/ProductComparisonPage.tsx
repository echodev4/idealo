"use client";

import { ProductProvider } from "@/context/ProductContext";
import ProductGallery from "@/components/sections/product-gallery";
import ProductHeaderInfo from "@/components/sections/product-header-info";
import ProductVariantsSelector from "@/components/sections/product-variants-selector"
import PriceWidgetSidebar from "@/components/sections/price-widget-sidebar"
import OfferComparisonTable from "@/components/sections/offer-comparison-table"
import ProductDetailsSpecifications from "@/components/sections/product-details-specifications"

interface Props {
  productUrl: string;
  productName?: string;
  sourceName?: string;
}

export default function ProductComparisonPage({
  productUrl,
  productName,
  sourceName
}: Props) {
  return (
    <ProductProvider productUrl={productUrl} productName={productName} sourceName={sourceName}>
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-1 max-w-[876px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <div className="flex justify-center md:justify-start">
                <ProductGallery />
              </div>

              <div className="flex flex-col">
                <ProductHeaderInfo
                />
              </div>
            </div>

            <ProductVariantsSelector />
          </div>

          <PriceWidgetSidebar />
        </div>

        <div className="mt-8 max-w-[1216px] mx-auto">
          <OfferComparisonTable />
        </div>
      </main>

      <div className="container mx-auto px-4 py-6 max-w-[1216px]">
        <ProductDetailsSpecifications />
      </div>
    </ProductProvider>
  );
}
