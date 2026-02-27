"use client";

import * as React from "react";
import Image from "next/image";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProduct } from "@/context/ProductContext";

function parseAEDPrice(price: string): number | null {
    if (!price) return null;
    const numeric = price.replace(/[^\d.]/g, "");
    const value = Number(numeric);
    return isNaN(value) ? null : value;
}

function truncate(s: string, n: number) {
    if (!s) return "";
    if (s.length <= n) return s;
    return s.slice(0, n).trimEnd() + "...";
}

const ProductVariantsSelectorSkeleton = () => {
    return (
        <section className="mt-4 animate-pulse">
            <div className="h-4 w-56 bg-muted rounded" />
            <div className="mt-3 flex gap-3 overflow-hidden">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="w-[170px] h-[220px] bg-muted rounded" />
                ))}
            </div>
            <div className="mt-3 h-2 w-[360px] bg-muted rounded" />
        </section>
    );
};

export default function ProductVariantsSelector() {
    const { relatedProducts, relatedLoading } = useProduct();
    const [selectedIdx, setSelectedIdx] = React.useState(0);
    const scrollerRef = React.useRef<HTMLDivElement | null>(null);

    if (relatedLoading) return <ProductVariantsSelectorSkeleton />;
    if (!relatedProducts?.length) return null;

    const items = relatedProducts
        .map((p) => {
            const price = parseAEDPrice(p.price);
            if (price === null) return null;
            return {
                key: p._id || p.product_url,
                name: p.product_name,
                imageUrl: p.image_url,
                price,
            };
        })
        .filter(Boolean) as { key: string; name: string; imageUrl: string; price: number }[];

    if (!items.length) return null;

    const minPrice = Math.min(...items.map((i) => i.price));

    const scrollByAmount = (dir: "left" | "right") => {
        const el = scrollerRef.current;
        if (!el) return;
        const amount = 5 * 170 + 4 * 12;
        el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    };

    const allThumbs = items.slice(0, 4);

    return (
        <section className="mt-4">
            <div className="flex items-center justify-between gap-4">
                <div className="text-[14px] text-[#111827]">
                    <span className="font-semibold">{items.length} variants</span>{" "}
                    <span className="text-[#6b7280]">from</span>{" "}
                    <span className="font-semibold text-[#f97316]">AED {minPrice.toLocaleString()}</span>
                </div>

                <button
                    type="button"
                    onClick={(e) => e.preventDefault()}
                    className="inline-flex items-center justify-center h-9 px-6 rounded border border-[#1a73e8] text-[#1a73e8] bg-white text-[13px] font-semibold cursor-not-allowed"
                >
                    filter
                </button>
            </div>

            <div className="mt-3 relative">
                <button
                    type="button"
                    onClick={() => scrollByAmount("left")}
                    className="hidden lg:flex items-center justify-center absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-[#e5e7eb] shadow-sm hover:border-[#cbd5e1]"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-5 h-5 text-[#374151]" />
                </button>

                <div
                    ref={scrollerRef}
                    className={cn(
                        "flex gap-3 overflow-x-auto pb-3 pr-2",
                        "[scrollbar-width:thin] [scrollbar-color:#9ca3af_#e5e7eb]"
                    )}
                >
                    <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="relative flex-shrink-0 w-[170px] h-[220px] rounded border border-[#1a73e8] bg-white"
                    >
                        <div className="absolute top-0 left-0 w-0 h-0 border-t-[28px] border-t-[#1a73e8] border-r-[28px] border-r-transparent" />
                        <div className="absolute top-[5px] left-[5px] text-white">
                            <Check className="w-4 h-4" />
                        </div>

                        <div className="px-3 pt-3">
                            <div className="grid grid-cols-2 gap-2">
                                {allThumbs.map((t) => (
                                    <div
                                        key={t.key}
                                        className="relative aspect-[4/3] rounded bg-[#f3f4f6] border border-[#e5e7eb] overflow-hidden"
                                    >
                                        <Image src={t.imageUrl} alt={t.name} fill className="object-contain p-1.5" sizes="70px" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="px-3 pt-3">
                            <div className="text-[13px] font-semibold text-[#111827]">All variants</div>
                            <div className="mt-2 text-[12px] text-[#6b7280]">from</div>
                            <div className="text-[18px] font-semibold text-[#f97316] leading-none">
                                AED {minPrice.toLocaleString()}
                            </div>
                        </div>
                    </a>

                    {items.map((item, idx) => {
                        const selected = idx === selectedIdx;
                        return (
                            <a
                                key={item.key}
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedIdx(idx);
                                }}
                                className={cn(
                                    "relative flex-shrink-0 w-[170px] h-[220px] rounded border bg-white",
                                    selected ? "border-[#1a73e8]" : "border-[#d1d5db] hover:border-[#9ca3af]"
                                )}
                            >
                                {selected ? (
                                    <>
                                        <div className="absolute top-0 left-0 w-0 h-0 border-t-[28px] border-t-[#1a73e8] border-r-[28px] border-r-transparent" />
                                        <div className="absolute top-[5px] left-[5px] text-white">
                                            <Check className="w-4 h-4" />
                                        </div>
                                    </>
                                ) : null}

                                <div className="px-3 pt-3">
                                    <div className="relative w-full h-[92px] rounded bg-[#f3f4f6] border border-[#e5e7eb] overflow-hidden">
                                        <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-2" sizes="140px" />
                                    </div>
                                </div>

                                <div className="px-3 pt-2">
                                    <div className="text-[12.5px] leading-[1.15] font-semibold text-[#111827] min-h-[34px]">
                                        {truncate(item.name, 36)}
                                    </div>
                                    <div className="mt-2 text-[12px] text-[#6b7280]">from</div>
                                    <div className="text-[18px] font-semibold text-[#f97316] leading-none">
                                        AED {item.price.toLocaleString()}
                                    </div>
                                </div>
                            </a>
                        );
                    })}
                </div>

                <button
                    type="button"
                    onClick={() => scrollByAmount("right")}
                    className="hidden lg:flex items-center justify-center absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-[#e5e7eb] shadow-sm hover:border-[#cbd5e1]"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-5 h-5 text-[#374151]" />
                </button>

                <div className="mt-2 h-[10px] w-full max-w-[420px] bg-[#e5e7eb] rounded overflow-hidden">
                    <div className="h-full w-[55%] bg-[#9ca3af] rounded" />
                </div>
            </div>
        </section>
    );
}