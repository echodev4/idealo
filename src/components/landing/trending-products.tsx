"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/language-context";

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

type RtlScrollType = "negative" | "reverse" | "default";
let cachedRtlScrollType: RtlScrollType | null = null;

function getRtlScrollType(): RtlScrollType {
    if (cachedRtlScrollType) return cachedRtlScrollType;
    if (typeof document === "undefined") return "negative";

    const outer = document.createElement("div");
    const inner = document.createElement("div");

    outer.dir = "rtl";
    outer.style.width = "4px";
    outer.style.height = "1px";
    outer.style.overflow = "scroll";
    outer.style.position = "absolute";
    outer.style.top = "-9999px";

    inner.style.width = "8px";
    inner.style.height = "1px";
    outer.appendChild(inner);
    document.body.appendChild(outer);

    outer.scrollLeft = 1;

    if (outer.scrollLeft === 0) {
        cachedRtlScrollType = "negative";
    } else {
        const initial = outer.scrollLeft;
        outer.scrollLeft = 0;
        cachedRtlScrollType = outer.scrollLeft === 0 ? "default" : (initial > 0 ? "reverse" : "negative");
    }

    document.body.removeChild(outer);
    return cachedRtlScrollType;
}

function getNormalizedScrollLeft(el: HTMLDivElement, isRtl: boolean) {
    if (!isRtl) return el.scrollLeft;

    const max = el.scrollWidth - el.clientWidth;
    const left = el.scrollLeft;
    const type = getRtlScrollType();

    if (type === "negative") return max + left;
    if (type === "reverse") return max - left;
    return left;
}

function getNativeScrollLeft(normalizedLeft: number, el: HTMLDivElement, isRtl: boolean) {
    if (!isRtl) return normalizedLeft;

    const max = el.scrollWidth - el.clientWidth;
    const type = getRtlScrollType();

    if (type === "negative") return normalizedLeft - max;
    if (type === "reverse") return max - normalizedLeft;
    return normalizedLeft;
}

function useHorizontalScroll(ref: React.RefObject<HTMLDivElement>, isRtl: boolean) {
    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(false);

    const update = () => {
        const el = ref.current;
        if (!el) return;
        const max = el.scrollWidth - el.clientWidth;
        const left = getNormalizedScrollLeft(el, isRtl);
        setCanLeft(left > 2);
        setCanRight(left < max - 2);
    };

    useEffect(() => {
        update();
        const el = ref.current;
        if (!el) return;

        const onScroll = () => update();
        const ro = new ResizeObserver(() => update());

        el.addEventListener("scroll", onScroll, { passive: true });
        ro.observe(el);

        return () => {
            el.removeEventListener("scroll", onScroll);
            ro.disconnect();
        };
    }, [ref, isRtl]);

    const scrollBy = (dx: number) => {
        const el = ref.current;
        if (!el) return;
        const max = el.scrollWidth - el.clientWidth;
        const current = getNormalizedScrollLeft(el, isRtl);
        const next = Math.max(0, Math.min(max, current + dx));
        el.scrollTo({ left: getNativeScrollLeft(next, el, isRtl), behavior: "smooth" });
    };

    return { canLeft, canRight, scrollBy };
}

export default function TrendingProducts() {
    const { t, direction } = useLanguage();
    const isRtl = direction === "rtl";
    const ref = useRef<HTMLDivElement | any>(null);
    const { canLeft, canRight, scrollBy } = useHorizontalScroll(ref, isRtl);

    const scrollerClass =
        "flex gap-8 overflow-x-auto pb-3 scroll-smooth overscroll-x-contain " +
        "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

    return (
        <section className="bg-white py-8">
            <div className="max-w-[1280px] mx-auto px-3 lg:px-0">
                <h2 className="text-[20px] font-bold text-[#212121] mb-4">{t("landing.trendingProducts.title", "Currently trending")}</h2>

                <div className="relative group">
                    {canLeft && (
                        <button
                            type="button"
                            aria-label={t("landing.trendingProducts.aria.previous", "Previous")}
                            onClick={() => scrollBy(-520)}
                            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center bg-[#AEB7C2] z-20
    opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity"
                        >
                            <ChevronLeft size={22} className="text-white" />
                        </button>
                    )}

                    {canRight && (
                        <button
                            type="button"
                            aria-label={t("landing.trendingProducts.aria.next", "Next")}
                            onClick={() => scrollBy(520)}
                            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center bg-[#AEB7C2] z-20
    opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity"
                        >
                            <ChevronRight size={22} className="text-white" />
                        </button>
                    )}

                    <div ref={ref} className={scrollerClass}>
                        {trendingItems.map((item) => {
                            const name =
                                item.slug === "shopping-bags"
                                    ? t("landing.trendingProducts.items.shoppingBags", "Shopping bags")
                                    : item.slug === "trading-cards"
                                        ? t("landing.trendingProducts.items.tradingCards", "Trading cards")
                                        : item.slug === "childrens-shoes"
                                            ? t("landing.trendingProducts.items.childrensShoes", "Children's shoes")
                                            : item.slug === "fertilizer"
                                                ? t("landing.trendingProducts.items.fertilizer", "Fertilizer")
                                                : item.slug === "hedge-trimmers"
                                                    ? t("landing.trendingProducts.items.hedgeTrimmers", "Hedge trimmers")
                                                    : item.slug === "robotic-lawnmower"
                                                        ? t("landing.trendingProducts.items.roboticLawnmower", "Robotic lawnmower")
                                                        : item.slug === "bicycle-carrier"
                                                            ? t("landing.trendingProducts.items.bicycleCarrier", "Bicycle carrier")
                                                            : t("landing.trendingProducts.items.jerseys", "Jerseys");
                            return (
                                <Link
                                    key={item.slug}
                                    href={`/category/${encodeURIComponent(item.slug)}`}
                                    className="flex-none w-[170px] md:w-[185px] no-underline hover:no-underline"
                                >
                                    <div className="mx-auto h-[132px] w-[132px] md:h-[140px] md:w-[140px] rounded-full bg-[#F2F2F2] flex items-center justify-center overflow-hidden">
                                        <div className="relative h-[86px] w-[110px] md:h-[92px] md:w-[118px]">
                                            <Image
                                                src={item.image}
                                                alt={name}
                                                fill
                                                sizes="185px"
                                                className="object-contain mix-blend-multiply"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-3 text-center text-[14px] text-[#212121] leading-[1.3]">
                                        {name}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
