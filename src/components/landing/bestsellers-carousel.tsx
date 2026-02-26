"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

type Product = {
    _id: string;
    product_url: string;
    source: string;
    product_name: string;
    image_url: string;
    price: string;
};

function parsePriceToNumber(price?: string) {
    if (!price) return null;
    const cleaned = price.replace(/[^0-9.,]/g, "").replace(",", ".");
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : null;
}

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

export default function BestsellersCarousel({
    products,
    loading,
    fallbackTitle = "Dairy deals",
}: {
    products: Product[];
    loading: boolean;
    fallbackTitle?: string;
}) {
    const items = useMemo(() => (Array.isArray(products) ? products : []), [products]);
    const ref = useRef<HTMLDivElement | null>(null);

    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(false);
    const [thumbLeft, setThumbLeft] = useState(0);
    const [thumbWidth, setThumbWidth] = useState(0);

    const updateArrows = () => {
        const el = ref.current;
        if (!el) return;

        const maxScroll = el.scrollWidth - el.clientWidth;
        const left = el.scrollLeft;
        const eps = 2;

        setCanLeft(left > eps);
        setCanRight(left < maxScroll - eps);

        if (el.scrollWidth <= el.clientWidth || maxScroll <= 0) {
            setThumbLeft(0);
            setThumbWidth(0);
            return;
        }

        const ratio = el.clientWidth / el.scrollWidth;
        const w = Math.max(64, Math.round(el.clientWidth * ratio));
        const maxLeft = el.clientWidth - w;
        const l = Math.round((left / maxScroll) * maxLeft);

        setThumbWidth(w);
        setThumbLeft(l);
    };

    useEffect(() => {
        updateArrows();
        const el = ref.current;
        if (!el) return;

        const onScroll = () => updateArrows();
        el.addEventListener("scroll", onScroll, { passive: true });

        const ro = new ResizeObserver(() => updateArrows());
        ro.observe(el);

        return () => {
            el.removeEventListener("scroll", onScroll);
            ro.disconnect();
        };
    }, [items.length, loading]);

    const scrollByAmount = (dir: "left" | "right") => {
        const el = ref.current;
        if (!el) return;
        const amount = Math.round(el.clientWidth * 0.85);
        const maxScroll = el.scrollWidth - el.clientWidth;
        const next = dir === "left" ? el.scrollLeft - amount : el.scrollLeft + amount;
        el.scrollTo({ left: clamp(next, 0, maxScroll), behavior: "smooth" });
    };

    const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
        const el = ref.current;
        if (!el) return;
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        el.scrollLeft += e.deltaY;
    };

    const dragging = useRef(false);
    const startX = useRef(0);
    const startLeft = useRef(0);

    const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
        const el = ref.current;
        if (!el) return;
        dragging.current = true;
        startX.current = e.clientX;
        startLeft.current = el.scrollLeft;
        el.setPointerCapture(e.pointerId);
    };

    const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
        const el = ref.current;
        if (!el || !dragging.current) return;
        const dx = e.clientX - startX.current;
        el.scrollLeft = startLeft.current - dx;
    };

    const endDrag = () => {
        dragging.current = false;
    };

    const scrollerClass =
        "flex overflow-x-auto gap-4 pb-4 select-none scroll-smooth touch-pan-x overscroll-x-contain " +
        "[-ms-overflow-style:none] [scrollbar-width:none] " +
        "[&::-webkit-scrollbar]:hidden";

    return (
        <section className="bg-[#DCEAF6] py-10">
            <div className="max-w-[1280px] mx-auto px-3 lg:px-0">
                <h2 className="text-[22px] font-bold text-[#212121] mb-4 leading-[1.25] m-0">{fallbackTitle}</h2>

                <div className="relative group">
                    {loading ? (
                        <div className={scrollerClass}>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex-none w-[220px] sm:w-[240px] bg-white border border-[#E0E0E0] rounded-[4px] shadow-card overflow-hidden h-[360px] animate-pulse"
                                >
                                    <div className="h-[210px] bg-[#F1F3F5]" />
                                    <div className="p-4">
                                        <div className="h-4 w-20 bg-[#E9ECEF] rounded mb-2" />
                                        <div className="h-5 w-full bg-[#E9ECEF] rounded mb-2" />
                                        <div className="h-4 w-3/4 bg-[#E9ECEF] rounded mb-4" />
                                        <div className="h-6 w-24 bg-[#E9ECEF] rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            ref={ref}
                            className={scrollerClass}
                            onWheel={onWheel}
                            onPointerDown={onPointerDown}
                            onPointerMove={onPointerMove}
                            onPointerUp={endDrag}
                            onPointerCancel={endDrag}
                            onPointerLeave={endDrag}
                        >
                            {items.map((p, idx) => {
                                const name = p.product_name;
                                const price = parsePriceToNumber(p.price);
                                const encodedUrl = encodeURIComponent(p.product_url);

                                const starsFilled = 4;
                                const count = "10";

                                return (
                                    <Link
                                        key={p._id ?? p.product_url}
                                        href={`/product/${encodedUrl}?product_name=${encodeURIComponent(name)}&source=${encodeURIComponent(
                                            p.source
                                        )}`}
                                        className="flex-none w-[230px] sm:w-[250px] border border-[#DADADA] rounded-[4px] shadow-card overflow-hidden flex flex-col no-underline hover:no-underline bg-white"
                                    >
                                        <div className="relative bg-[#F1F3F5] px-4 pt-4 pb-2">
                                            <button
                                                type="button"
                                                aria-label="Wishlist"
                                                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white border border-[#E0E0E0] flex items-center justify-center text-[#0B62B3]"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }}
                                            >
                                                <Heart size={20} strokeWidth={2} />
                                            </button>

                                            <div className="relative h-[170px] w-full flex items-center justify-center">
                                                <Image
                                                    src={p.image_url}
                                                    alt={name}
                                                    fill
                                                    sizes="(max-width: 640px) 70vw, 240px"
                                                    className="object-contain"
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-white px-4 pt-3 pb-4 flex flex-col flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="bg-[#0066C0] text-white text-[12px] font-bold px-2 py-0.5 rounded-[2px] lowercase">
                                                    featured
                                                </span>
                                                <span className="text-[#666666] text-[14px] truncate">in {p.source}</span>
                                            </div>

                                            <div className="text-[#212121] text-[14px] leading-[1.35] font-normal line-clamp-2 min-h-[38px] mb-3">
                                                {name}
                                            </div>

                                            <div className="mt-auto">
                                                <div className="flex items-center gap-2 mb-3 cursor-not-allowed select-none">
                                                    <div className="flex items-center gap-0.5">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={13}
                                                                fill={i < starsFilled ? "#212121" : "none"}
                                                                color={i < starsFilled ? "#212121" : "#CFCFCF"}
                                                                strokeWidth={2}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-[12px] text-[#666666]">{count}</span>
                                                </div>

                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-[14px] text-[#666666]">from</span>
                                                    <span className="text-[18px] font-bold text-[#212121]">
                                                        {price !== null ? `AED ${price}` : `AED ${p.price}`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {thumbWidth > 0 && (
                        <div className="pointer-events-none hidden md:block absolute left-0 right-0 bottom-[2px] h-[14px] opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[6px] bg-transparent" />
                            <div
                                className="absolute top-1/2 h-[6px] -translate-y-1/2 rounded-full bg-[#8E9AA6]/70"
                                style={{ width: thumbWidth, transform: `translateX(${thumbLeft}px) translateY(-50%)` }}
                            />
                        </div>
                    )}

                    {canLeft && (
                        <button
                            type="button"
                            aria-label="Previous"
                            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 h-12 w-12 bg-[#C7CFD7] items-center justify-center z-20
              opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity"
                            onClick={() => scrollByAmount("left")}
                        >
                            <ChevronLeft size={26} className="text-white" />
                        </button>
                    )}

                    {canRight && (
                        <button
                            type="button"
                            aria-label="Next"
                            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 h-12 w-12 bg-[#C7CFD7] items-center justify-center z-20
              opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity"
                            onClick={() => scrollByAmount("right")}
                        >
                            <ChevronRight size={26} className="text-white" />
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}