"use client";

import * as React from "react";
import Image from "next/image";
import { Check, Play } from "lucide-react";
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
        <section className="mt-3 animate-pulse">
            <div className="h-4 w-56 bg-muted rounded" />
            <div className="mt-3 flex gap-2 overflow-hidden">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="w-[124px] h-[196px] bg-muted rounded" />
                ))}
            </div>
            <div className="mt-3 h-2 w-full bg-muted rounded" />
        </section>
    );
};

export default function ProductVariantsSelector() {
    const { relatedProducts, relatedLoading } = useProduct();
    const [selectedIdx, setSelectedIdx] = React.useState(0);

    const scrollerRef = React.useRef<HTMLDivElement | null>(null);
    const trackRef = React.useRef<HTMLDivElement | null>(null);

    const [thumbLeft, setThumbLeft] = React.useState(0);
    const [thumbWidth, setThumbWidth] = React.useState(48);

    const updateThumb = () => {
        const el = scrollerRef.current;
        const track = trackRef.current;
        if (!el || !track) return;

        const maxScroll = el.scrollWidth - el.clientWidth;
        const trackW = track.clientWidth;

        if (maxScroll <= 0 || trackW <= 0) {
            setThumbLeft(0);
            setThumbWidth(trackW || 48);
            return;
        }

        const w = Math.max(48, Math.round((el.clientWidth / el.scrollWidth) * trackW));
        const left = Math.round((el.scrollLeft / maxScroll) * (trackW - w));
        setThumbWidth(w);
        setThumbLeft(left);
    };

    // ✅ Hook must be called every render (no conditional returns before it)
    React.useEffect(() => {
        // Don't do anything until data is ready (prevents attaching listeners too early)
        if (relatedLoading) return;
        if (!relatedProducts?.length) return;

        updateThumb();

        const el = scrollerRef.current;
        if (!el) return;

        const onScroll = () => updateThumb();
        el.addEventListener("scroll", onScroll, { passive: true });

        const onResize = () => updateThumb();
        window.addEventListener("resize", onResize);

        return () => {
            el.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
        };
    }, [relatedLoading, relatedProducts]);

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
    const allThumbs = items.slice(0, 4);

    const scrollByAmount = (dir: "left" | "right") => {
        const el = scrollerRef.current;
        if (!el) return;
        const amount = Math.round(el.clientWidth * 0.85);
        el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    };

    const onTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = scrollerRef.current;
        const track = trackRef.current;
        if (!el || !track) return;

        const rect = track.getBoundingClientRect();
        const x = e.clientX - rect.left;

        const maxScroll = el.scrollWidth - el.clientWidth;
        const trackW = track.clientWidth;

        if (maxScroll <= 0 || trackW <= 0) return;

        const clamped = Math.max(0, Math.min(trackW - thumbWidth, x - thumbWidth / 2));
        const nextScrollLeft = (clamped / (trackW - thumbWidth)) * maxScroll;
        el.scrollTo({ left: nextScrollLeft, behavior: "smooth" });
    };

    return (
        <section className="mt-2">
            <div className="flex items-center justify-between gap-4">
                <div className="text-[13px] text-[#111827]">
                    <span className="font-semibold">{items.length} variants</span>{" "}
                    <span className="text-[#6b7280]">from</span>{" "}
                    <span className="font-semibold">AED {minPrice.toLocaleString()}</span>
                </div>

                <button
                    type="button"
                    onClick={(e) => e.preventDefault()}
                    className="inline-flex items-center justify-center gap-2 h-9 px-7 rounded-[3px] border border-[#1a73e8] text-[#1a73e8] bg-white text-[13px] font-semibold cursor-not-allowed"
                >
                    <Play className="w-4 h-4 fill-[#1a73e8] text-[#1a73e8]" />
                    filter
                </button>
            </div>

            <div className="mt-3">
                <div
                    ref={scrollerRef}
                    className={cn(
                        "flex gap-2 overflow-x-auto pb-2",
                        "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    )}
                >
                    <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="relative flex-shrink-0 w-[124px] h-[196px] rounded-[3px] border-2 border-[#1a73e8] bg-white"
                    >
                        <div className="absolute top-0 left-0 w-0 h-0 border-t-[28px] border-t-[#1a73e8] border-r-[28px] border-r-transparent" />
                        <div className="absolute top-[6px] left-[6px] text-white">
                            <Check className="w-4 h-4" />
                        </div>

                        <div className="px-2 pt-2">
                            <div className="rounded-[3px] bg-[#f3f4f6] border border-[#e5e7eb] p-2">
                                <div className="grid grid-cols-2 gap-2">
                                    {allThumbs.map((t) => (
                                        <div key={t.key} className="relative aspect-square overflow-hidden rounded-[2px] bg-white">
                                            <Image src={t.imageUrl} alt={t.name} fill className="object-contain p-1" sizes="52px" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="px-2 pt-2">
                            <div className="text-[12.5px] font-semibold text-[#111827]">All variants</div>
                            <div className="mt-2 text-[12px] text-[#6b7280]">away</div>
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
                                    "relative flex-shrink-0 w-[124px] h-[196px] rounded-[3px] border bg-white",
                                    selected ? "border-[#1a73e8]" : "border-[#d1d5db] hover:border-[#1a73e8]"
                                )}
                            >
                                <div className="px-2 pt-2">
                                    <div className="rounded-[3px] bg-[#f3f4f6] border border-[#e5e7eb] h-[92px] flex items-center justify-center overflow-hidden">
                                        <div className="relative w-full h-full">
                                            <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-2" sizes="120px" />
                                        </div>
                                    </div>
                                </div>

                                <div className="px-2 pt-2">
                                    <div className="text-[12px] leading-[1.15] font-semibold text-[#111827] min-h-[30px]">
                                        {truncate(item.name, 28)}
                                    </div>
                                    <div className="mt-2 text-[12px] text-[#6b7280]">away</div>
                                    <div className="text-[18px] font-semibold text-[#f97316] leading-none">
                                        AED {item.price.toLocaleString()}
                                    </div>
                                </div>
                            </a>
                        );
                    })}
                </div>

                <div className="mt-2 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => scrollByAmount("left")}
                        className="w-6 h-6 flex items-center justify-center text-[#6b7280] hover:text-[#111827]"
                        aria-label="Scroll left"
                    >
                        ‹
                    </button>

                    <div
                        ref={trackRef}
                        onClick={onTrackClick}
                        className="relative flex-1 h-[10px] bg-[#d1d5db] rounded-full cursor-pointer"
                    >
                        <div
                            className="absolute top-0 bottom-0 bg-[#6b7280] rounded-full"
                            style={{ width: `${thumbWidth}px`, transform: `translateX(${thumbLeft}px)` }}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => scrollByAmount("right")}
                        className="w-6 h-6 flex items-center justify-center text-[#6b7280] hover:text-[#111827]"
                        aria-label="Scroll right"
                    >
                        ›
                    </button>
                </div>
            </div>
        </section>
    );
}