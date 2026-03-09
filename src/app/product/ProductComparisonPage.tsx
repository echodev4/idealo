"use client";

import * as React from "react";
import Link from "next/link";
import { Home, BadgePercent, LineChart, FileText } from "lucide-react";
import { ProductProvider, useProduct } from "@/context/ProductContext";
import { useLanguage } from "@/contexts/language-context";
import ProductGallery from "@/components/single-product/product-gallery";
import ProductHeaderInfo from "@/components/single-product/product-header-info";
import ProductVariantsSelector from "@/components/single-product/product-variants-selector";
import OfferComparisonTable from "@/components/single-product/offer-comparison-table";
import ProductDetailsSpecifications from "@/components/single-product/product-details-specifications";
import PriceDevelopmentPanel from "@/components/single-product/price-development-panel";
import { cn } from "@/lib/utils";

type MobileTab = "offers" | "history" | "specs";

interface Props {
  productUrl: string;
  productName?: string;
  sourceName?: string;
}

function ProductTopNav() {
  const { product, loading } = useProduct();
  const { t } = useLanguage();

  return (
    <div className="hidden lg:flex items-center gap-2 text-[12px] text-[#6b7280] pt-1 pb-3">
      <Link href="/" className="inline-flex items-center text-[#111827] hover:text-[#1a73e8]">
        <Home className="w-3.5 h-3.5" />
      </Link>
      <span className="text-[#9ca3af]">&gt;</span>
      <span className="truncate max-w-[900px] text-[#111827] cursor-not-allowed">
        {loading
          ? t("singleProduct.comparison.breadcrumb.loading", "Loading...")
          : product?.title || t("singleProduct.comparison.breadcrumb.product", "Product")}
      </span>
    </div>
  );
}

function MobileProductTabs({ activeTab, onChange }: { activeTab: MobileTab; onChange: (tab: MobileTab) => void }) {
  const { t } = useLanguage();

  const tabs: { key: MobileTab; label: string; icon: React.ReactNode }[] = [
    {
      key: "offers",
      label: t("category.products.showOffers", "Offers"),
      icon: <BadgePercent className="w-5 h-5" />,
    },
    {
      key: "history",
      label: t("singleProduct.headerInfo.actions.priceHistory", "Price History"),
      icon: <LineChart className="w-5 h-5" />,
    },
    {
      key: "specs",
      label: t("singleProduct.detailsSpecifications.title", "Product Specification"),
      icon: <FileText className="w-5 h-5" />,
    },
  ];

  return (
    <div className="lg:hidden mt-4 border-y border-[#e5e7eb]">
      <div className="grid grid-cols-3 divide-x divide-[#e5e7eb]">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-2 py-3 text-[12px] font-medium",
                active ? "text-[#1a73e8]" : "text-[#111827]"
              )}
            >
              {tab.icon}
              <span className="text-center leading-tight">{tab.label}</span>
              {active ? <span className="absolute inset-x-0 bottom-0 h-[3px] bg-[#1a73e8]" /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProductComparisonContent() {
  const [mobileTab, setMobileTab] = React.useState<MobileTab>("offers");

  return (
    <>
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

            <MobileProductTabs activeTab={mobileTab} onChange={setMobileTab} />

            <div className="lg:hidden mt-4">
              {mobileTab === "offers" ? <OfferComparisonTable /> : null}
              {mobileTab === "history" ? <PriceDevelopmentPanel /> : null}
              {mobileTab === "specs" ? <ProductDetailsSpecifications /> : null}
            </div>
          </div>

          <div className="hidden lg:block lg:pt-4">
            <PriceDevelopmentPanel />
          </div>
        </div>

        <div className="hidden lg:block mt-8 max-w-[1216px] mx-auto">
          <OfferComparisonTable />
        </div>
      </main>

      <div className="hidden lg:block container max-w-[1280px] mx-auto px-3 lg:px-0 pb-8">
        <div className="max-w-[1216px] mx-auto">
          <ProductDetailsSpecifications />
        </div>
      </div>
    </>
  );
}

export default function ProductComparisonPage({ productUrl, productName, sourceName }: Props) {
  return (
    <ProductProvider productUrl={productUrl} productName={productName} sourceName={sourceName}>
      <ProductComparisonContent />
    </ProductProvider>
  );
}

