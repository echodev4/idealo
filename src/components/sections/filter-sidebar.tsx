"use client";

import { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;

  /** Current selected price range */
  priceRange: [number, number];

  /** Default (min/max) price range derived in parent */
  defaultPriceRange: [number, number];

  onPriceChange: (range: [number, number]) => void;

  selectedStores: string[];
  onStoreToggle: (store: string) => void;
  stores: string[];
}

export default function FilterSidebar({
  isOpen,
  onClose,
  priceRange,
  defaultPriceRange,
  onPriceChange,
  selectedStores,
  onStoreToggle,
  stores
}: FilterSidebarProps) {
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  const handleReset = () => {
    // reset price to full range
    onPriceChange(defaultPriceRange);

    // reset stores
    selectedStores.forEach((s) => onStoreToggle(s));
  };

  return (
    <>
      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 h-screen md:h-auto w-80 md:w-64 bg-white border-r border-border overflow-y-auto z-50 transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-4">
          {/* Mobile header */}
          <div className="flex items-center justify-between mb-4 md:hidden">
            <h2 className="text-lg font-semibold">Filters</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* -------------------------
           * STORE FILTER
           * -------------------------
           */}
          <div className="mb-6">
            <button
              onClick={() => setIsStoreOpen(!isStoreOpen)}
              className="flex items-center justify-between w-full mb-3 font-semibold text-sm"
            >
              <span>Stores</span>
              {isStoreOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {isStoreOpen && (
              <div className="space-y-2">
                {stores.map((store) => {
                  const selected = selectedStores.includes(store);
                  return (
                    <button
                      key={store}
                      onClick={() => onStoreToggle(store)}
                      className={cn(
                        "w-full text-left text-sm py-2 px-3 rounded border transition-colors",
                        selected
                          ? "bg-[#E6F2FF] text-[#0066CC] border-[#0066CC]"
                          : "border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      {store}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* -------------------------
           * PRICE FILTER
           * -------------------------
           */}
          <div className="mb-6">
            <button
              onClick={() => setIsPriceOpen(!isPriceOpen)}
              className="flex items-center justify-between w-full mb-3 font-semibold text-sm"
            >
              <span>Price Range</span>
              {isPriceOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {isPriceOpen && (
              <div className="space-y-4">
                <Slider
                  min={defaultPriceRange[0]}
                  max={defaultPriceRange[1]}
                  step={10}
                  value={priceRange}
                  onValueChange={(value) =>
                    onPriceChange(value as [number, number])
                  }
                  className="[&_[role=slider]]:bg-[#0066CC] [&_[role=slider]]:border-[#0066CC]"
                />

                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    AED {priceRange[0].toFixed(0)}
                  </span>
                  <span className="text-gray-400">to</span>
                  <span className="font-medium">
                    AED {priceRange[1].toFixed(0)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* -------------------------
           * RESET
           * -------------------------
           */}
          <Button variant="outline" className="w-full" onClick={handleReset}>
            Reset Filters
          </Button>
        </div>
      </aside>
    </>
  );
}
