"use client";

import React, { useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    Percent,
    Smartphone,
    Dumbbell,
    Baby,
    Home,
    UtensilsCrossed,
    Gamepad2,
    Stethoscope,
    Car,
    Shirt,
    PawPrint,
    Plane,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

type Cat = {
    key: string;
    icon: React.ReactNode;
    term: string;
    disabled?: boolean;
    isDeals?: boolean;
};

function useHorizontalScrollHelpers() {
    const ref = useRef<HTMLDivElement | null>(null);

    const scrollBy = (dx: number) => {
        const el = ref.current;
        if (!el) return;
        el.scrollBy({ left: dx, behavior: "smooth" });
    };

    const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
        const el = ref.current;
        if (!el) return;

        // Trackpads often send horizontal delta already
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

        // Convert vertical wheel into horizontal scroll
        e.preventDefault();
        el.scrollBy({ left: e.deltaY, behavior: "auto" });
    };

    let isDown = false;
    let startX = 0;
    let startLeft = 0;

    const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
        const el = ref.current;
        if (!el) return;
        isDown = true;
        startX = e.clientX;
        startLeft = el.scrollLeft;
        el.setPointerCapture(e.pointerId);
    };

    const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
        const el = ref.current;
        if (!el || !isDown) return;
        const dx = e.clientX - startX;
        el.scrollLeft = startLeft - dx;
    };

    const onPointerUp: React.PointerEventHandler<HTMLDivElement> = () => {
        isDown = false;
    };

    return { ref, scrollBy, onWheel, onPointerDown, onPointerMove, onPointerUp };
}

export default function CategoryBar() {
    const router = useRouter();
    const { t } = useLanguage();

    const cats: Cat[] = useMemo(
        () => [
            {
                key: "deals",
                term: "Deals",
                icon: <Percent size={24} className="text-[#F17720]" />,
                isDeals: true,
            },
            { key: "electronics", term: "Electronics", icon: <Smartphone size={24} /> },
            { key: "sport", term: "Sports & Outdoor", icon: <Dumbbell size={24} /> },
            { key: "baby", term: "Baby & Kids", icon: <Baby size={24} /> },
            { key: "home", term: "Home & Garden", icon: <Home size={24} /> },
            { key: "food", term: "Food & Drink", icon: <UtensilsCrossed size={24} /> },
            { key: "gaming", term: "Gaming & Toys", icon: <Gamepad2 size={24} /> },
            { key: "health", term: "Health & Beauty", icon: <Stethoscope size={24} /> },
            { key: "auto", term: "Automotive", icon: <Car size={24} /> },
            { key: "fashion", term: "Fashion & Accessories", icon: <Shirt size={24} /> },
            { key: "pets", term: "Pet Supplies", icon: <PawPrint size={24} /> },
            {
                key: "flight",
                term: "Flight",
                icon: <Plane size={24} />,
                disabled: true, // static section exists, but no category page right now
            },
        ],
        []
    );

    const {
        ref,
        scrollBy,
        onWheel,
        onPointerDown,
        onPointerMove,
        onPointerUp,
    } = useHorizontalScrollHelpers();

    const goToCategory = (c: Cat) => {
        if (c.disabled) return;
        router.push(`/category/${encodeURIComponent(c.term)}`);
    };

    return (
        <section
            className="w-full bg-white border-b border-[#E0E0E0] py-3 overflow-hidden"
            aria-label={t("categoryBar.ariaLabel")}
        >
            <div className="container">
                <div className="relative group flex items-center">
                    <button
                        type="button"
                        className="absolute left-2 z-10 p-1 bg-white rounded-full shadow-md invisible group-hover:visible border border-[#DEE2E6] hidden md:flex items-center justify-center"
                        aria-label={t("categoryBar.prev")}
                        onClick={() => scrollBy(-320)}
                    >
                        <ChevronLeft size={20} className="text-[#20263E]" />
                    </button>

                    <div
                        ref={ref}
                        className="flex overflow-x-auto hide-scrollbar scroll-smooth w-full space-x-6 py-1 select-none"
                        onWheel={onWheel}
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                    >
                        {cats.map((cat) => (
                            <button
                                key={cat.key}
                                type="button"
                                onClick={() => goToCategory(cat)}
                                className={`flex flex-col items-center justify-center min-w-max group/item no-underline ${cat.disabled ? "cursor-not-allowed" : "cursor-pointer"
                                    }`}
                                aria-disabled={cat.disabled ? true : undefined}
                                title={cat.disabled ? t("categoryBar.disabled") : undefined}
                            >
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`mb-1 transition-colors ${cat.isDeals
                                                ? "text-[#F17720]"
                                                : "text-[#20263E] group-hover/item:text-[var(--color-link)]"
                                            }`}
                                    >
                                        {cat.icon}
                                    </div>

                                    <span
                                        className={`text-[12px] font-normal leading-tight text-[#212121] text-center whitespace-nowrap ${cat.disabled ? "" : "group-hover/item:text-[var(--color-link)]"
                                            }`}
                                    >
                                        {t(`categoryBar.items.${cat.key}`)}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        className="absolute right-0 z-10 p-1 bg-white rounded-full shadow-md invisible group-hover:visible border border-[#E0E0E0] hidden md:flex items-center justify-center translate-x-[50%]"
                        aria-label={t("categoryBar.next")}
                        onClick={() => scrollBy(320)}
                    >
                        <ChevronRight size={20} className="text-[#20263E]" />
                    </button>
                </div>
            </div>
        </section>
    );
}