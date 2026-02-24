"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const trendingItems = [
    {
        name: "Shopping bags",
        slug: "shopping-bags",
        image: "https://cdn.idealo.com/images/category/de_DE/16352/240x200.jpg",
    },
    {
        name: "Trading cards",
        slug: "trading-cards",
        image: "https://cdn.idealo.com/images/category/de_DE/18448/240x200.jpg",
    },
    {
        name: "Children's shoes",
        slug: "childrens-shoes",
        image: "https://cdn.idealo.com/images/category/de_DE/11595/240x200.jpg",
    },
    {
        name: "Fertilizer",
        slug: "fertilizer",
        image: "https://cdn.idealo.com/images/category/de_DE/9848/240x200.jpg",
    },
    {
        name: "Hedge trimmers",
        slug: "hedge-trimmers",
        image: "https://cdn.idealo.com/images/category/de_DE/11274/240x200.jpg",
    },
    {
        name: "Robotic lawnmower",
        slug: "robotic-lawnmower",
        image: "https://cdn.idealo.com/images/category/de_DE/32794/240x200.jpg",
    },
    {
        name: "Bicycle carrier",
        slug: "bicycle-carrier",
        image: "https://cdn.idealo.com/images/category/de_DE/18357/240x200.jpg",
    },
    {
        name: "Jerseys",
        slug: "jerseys",
        image: "https://cdn.idealo.com/images/category/de_DE/15073/240x200.jpg",
    },
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

export default function TrendingProducts() {
    const ref = useRef<HTMLDivElement | any>(null);
    const { canLeft, canRight, scrollBy } = useHorizontalScroll(ref);

    return (
        <section className="bg-white py-8">
            <div className="container max-w-[1280px] mx-auto px-3 lg:px-0">
                <h2 className="text-[20px] font-bold text-[#212121] mb-4">
                    Currently trending
                </h2>

                <div className="relative">
                    {canLeft && (
                        <button
                            type="button"
                            aria-label="Previous"
                            onClick={() => scrollBy(-420)}
                            className="hidden md:flex absolute left-[-14px] top-[86px] w-8 h-8 bg-white border border-[#DEE2E6] rounded-full shadow-md items-center justify-center z-20 hover:bg-[#F1F3F5]"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    )}

                    {canRight && (
                        <button
                            type="button"
                            aria-label="Next"
                            onClick={() => scrollBy(420)}
                            className="hidden md:flex absolute right-[-14px] top-[86px] w-8 h-8 bg-white border border-[#DEE2E6] rounded-full shadow-md items-center justify-center z-20 hover:bg-[#F1F3F5]"
                        >
                            <ChevronRight size={20} />
                        </button>
                    )}

                    <div
                        ref={ref}
                        className="flex gap-6 overflow-x-auto pb-2 hide-scrollbar scroll-smooth touch-pan-x overscroll-x-contain"
                    >
                        {trendingItems.map((item) => (
                            <Link
                                key={item.slug}
                                href={`/category/${encodeURIComponent(item.slug)}`}
                                className="flex-none w-[150px] md:w-[170px] no-underline hover:no-underline"
                            >
                                <div className="w-full aspect-square rounded-[999px] bg-[#F5F5F5] flex items-center justify-center overflow-hidden">
                                    <div className="relative w-[110px] h-[110px] md:w-[120px] md:h-[120px]">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            sizes="170px"
                                            className="object-contain"
                                        />
                                    </div>
                                </div>

                                <div className="mt-3 text-center text-[14px] text-[#212121] leading-[1.3]">
                                    {item.name}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}