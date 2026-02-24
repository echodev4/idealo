"use client";

import Image from "next/image";
import { Plane, ChevronLeft, ChevronRight, ChevronRight as RowChevron } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const flightDeals = [
    {
        from: "Munich",
        to: "Istanbul",
        dates: "27.04.2026 – 05.05.2026",
        trip: "Round trip",
        badge: "direct flight",
        oldPrice: "145 €",
        currentPrice: "127 €",
        discount: "-12 %",
        imageUrl:
            "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=900&q=80",
        destLabel: "Istanbul",
    },
    {
        from: "Hamburg",
        to: "Antalya",
        dates: "09.04.2026 – 19.04.2026",
        trip: "Round trip",
        badge: "direct flight",
        oldPrice: "87 €",
        currentPrice: "77 €",
        discount: "-12 %",
        imageUrl:
            "https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=900&q=80",
        destLabel: "Antalya",
    },
    {
        from: "Frankfurt",
        to: "Izmir",
        dates: "May 9, 2026 – May 23, 2026",
        trip: "Round trip",
        badge: "direct flight",
        oldPrice: "127 €",
        currentPrice: "113 €",
        discount: "-11 %",
        imageUrl:
            "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=900&q=80",
        destLabel: "Izmir",
    },
    {
        from: "Münster",
        to: "Mallorca",
        dates: "14.04.2026 – 21.04.2026",
        trip: "Round trip",
        badge: "direct flight",
        oldPrice: "84 €",
        currentPrice: "45 €",
        discount: "-47 %",
        imageUrl:
            "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80",
        destLabel: "Mallorca",
    },
    {
        from: "Berlin",
        to: "Tirana",
        dates: "May 7, 2026 – May 21, 2026",
        trip: "Round trip",
        badge: "direct flight",
        oldPrice: "70 €",
        currentPrice: "56 €",
        discount: "-20 %",
        imageUrl:
            "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=900&q=80",
        destLabel: "Tirana",
    },
    {
        from: "Berlin",
        to: "Dubrovnik",
        dates: "27.04.2026 – 04.05.2026",
        trip: "Round trip",
        badge: "direct flight",
        oldPrice: "98 €",
        currentPrice: "49 €",
        discount: "-50 %",
        imageUrl:
            "https://images.unsplash.com/photo-1526481280695-3c687fd5432c?auto=format&fit=crop&w=900&q=80",
        destLabel: "Dubrovnik",
    },
];

const flightLinks = [
    { name: "Flights to Mallorca", price: "13 €" },
    { name: "Flights to Dubai", price: "86 €" },
    { name: "Flights to Hurghada", price: "54 €" },
    { name: "Flights to Pisa", price: "16 €" },
    { name: "Flights to Antalya", price: "38 €" },
    { name: "Flights to Split", price: "34 €" },
    { name: "Flights to Crete Heraklion", price: "40 €" },
    { name: "Flights to Tenerife South", price: "20 €" },
    { name: "Flights to New York", price: "218 €" },
    { name: "Flights to Fuerteventura", price: "20 €" },
    { name: "Flights to Kos", price: "44 €" },
    { name: "Flights to Malé", price: "215 €" },
];

function useHorizontalScroll(ref: React.RefObject<HTMLDivElement>) {
    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(false);

    const update = () => {
        const el = ref.current;
        if (!el) return;
        const max = el.scrollWidth - el.clientWidth;
        setCanLeft(el.scrollLeft > 2);
        setCanRight(el.scrollLeft < max - 2);
    };

    useEffect(() => {
        update();
        const el = ref.current;
        if (!el) return;

        const onScroll = () => update();
        const onResize = () => update();

        el.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize);

        return () => {
            el.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
        };
    }, [ref]);

    const scrollBy = (dx: number) => {
        ref.current?.scrollBy({ left: dx, behavior: "smooth" });
    };

    return { canLeft, canRight, scrollBy };
}

export default function FlightsDeals() {
    const rowRef = useRef<HTMLDivElement | any>(null);
    const { canLeft, canRight, scrollBy } = useHorizontalScroll(rowRef);

    return (
        <section className="bg-[#F2F4F5] py-8 md:py-10">
            <div className="container max-w-[1280px] mx-auto px-3 lg:px-0">
                <div className="flex items-start justify-between gap-4 mb-5">
                    <h2 className="text-[20px] md:text-[22px] font-bold text-[#212121] m-0">
                        Travel cheaper with idealo
                    </h2>

                    <button
                        type="button"
                        aria-disabled="true"
                        className="hidden sm:inline-flex items-center gap-2 text-[13px] font-semibold text-[#0474BA] bg-white border border-[#0474BA] rounded-[4px] px-3 py-2 cursor-not-allowed select-none"
                        title="Coming soon"
                    >
                        Last minute flight deals
                        <Plane size={14} className="rotate-45" />
                    </button>
                </div>

                <div className="relative mb-8">
                    {canLeft && (
                        <button
                            type="button"
                            aria-label="Previous"
                            onClick={() => scrollBy(-520)}
                            className="absolute -left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-[#DEE2E6] rounded-full shadow-md hidden md:flex items-center justify-center z-20 hover:bg-[#F1F3F5]"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    )}

                    {canRight && (
                        <button
                            type="button"
                            aria-label="Next"
                            onClick={() => scrollBy(520)}
                            className="absolute -right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-[#DEE2E6] rounded-full shadow-md hidden md:flex items-center justify-center z-20 hover:bg-[#F1F3F5]"
                        >
                            <ChevronRight size={20} />
                        </button>
                    )}

                    <div
                        ref={rowRef}
                        className="flex gap-3 overflow-x-auto hide-scrollbar scroll-smooth touch-pan-x overscroll-x-contain pb-1"
                    >
                        {flightDeals.map((deal, idx) => (
                            <div
                                key={idx}
                                className="flex-none w-[240px] sm:w-[260px] md:w-[270px] bg-white border border-[#E0E0E0] rounded-[6px] overflow-hidden cursor-not-allowed"
                                title="Coming soon"
                            >
                                <div className="relative h-[110px] w-full">
                                    <Image
                                        src={deal.imageUrl}
                                        alt={deal.destLabel}
                                        fill
                                        sizes="270px"
                                        className="object-cover"
                                        priority={idx < 2}
                                    />
                                    <div className="absolute top-2 left-2 bg-[#FF6600] text-white text-[12px] font-bold px-2 py-1 leading-none rounded-[2px]">
                                        {deal.discount}
                                    </div>
                                    <div className="absolute left-3 bottom-2 text-white text-[12px] font-semibold drop-shadow">
                                        {deal.destLabel}
                                    </div>
                                </div>

                                <div className="p-3">
                                    <div className="text-[16px] font-bold text-[#212121] leading-tight mb-1">
                                        {deal.from} ↔ {deal.to}
                                    </div>
                                    <div className="text-[12px] text-[#666666] mb-2">{deal.dates}</div>

                                    <div className="text-[12px] text-[#666666] leading-tight">
                                        {deal.trip},{" "}
                                        <span className="text-[#11A37F] font-medium">{deal.badge}</span>
                                    </div>

                                    <div className="mt-3 flex items-end justify-between">
                                        <div className="text-[13px] text-[#666666]">
                                            <span className="mr-1">from</span>
                                            <span className="line-through">{deal.oldPrice}</span>
                                        </div>

                                        <div className="text-[18px] font-bold text-[#FF6600] whitespace-nowrap">
                                            <span className="text-[13px] font-normal text-[#666666] mr-1">from</span>
                                            {deal.currentPrice}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {canRight && (
                        <button
                            type="button"
                            aria-label="Next"
                            onClick={() => scrollBy(520)}
                            className="md:hidden absolute right-1 top-[46px] w-9 h-9 bg-white border border-[#DEE2E6] rounded-full shadow-md flex items-center justify-center z-20"
                        >
                            <ChevronRight size={20} />
                        </button>
                    )}
                </div>

                <div className="text-[16px] md:text-[18px] font-bold text-[#212121] mb-4">
                    Easily compare current flight deals from numerous airlines worldwide.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                    {flightLinks.map((l, idx) => (
                        <button
                            key={idx}
                            type="button"
                            aria-disabled="true"
                            className="w-full flex items-center justify-between bg-white border border-[#E0E0E0] rounded-[4px] px-3 py-2 cursor-not-allowed text-left"
                            title="Coming soon"
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <Plane size={14} className="text-[#666666] rotate-45 flex-none" />
                                <span className="text-[13px] text-[#212121] font-semibold truncate">{l.name}</span>
                            </div>

                            <div className="flex items-center gap-2 flex-none">
                                <span className="text-[13px] text-[#666666] whitespace-nowrap">from {l.price}</span>
                                <RowChevron size={16} className="text-[#ADB5BD]" />
                            </div>
                        </button>
                    ))}
                </div>

                <div className="mt-6 sm:hidden flex justify-end">
                    <button
                        type="button"
                        aria-disabled="true"
                        className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#0474BA] bg-white border border-[#0474BA] rounded-[4px] px-3 py-2 cursor-not-allowed select-none"
                        title="Coming soon"
                    >
                        Last minute flight deals
                        <Plane size={14} className="rotate-45" />
                    </button>
                </div>
            </div>
        </section>
    );
}