"use client";

import React from "react";
import Image from "next/image";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Star } from "lucide-react";
import { useProduct } from "@/context/ProductContext";

const PriceWidgetSidebarSkeleton = () => {
    return (
        <aside className="sticky top-5 w-full max-w-[340px] hidden lg:block animate-pulse">
            <div className="flex flex-col gap-4">
                {/* BEST PRICE CARD */}
                <div className="border border-border rounded-md p-4 bg-white">
                    <div className="flex flex-col gap-3">
                        <div className="h-3 w-20 bg-muted rounded" />

                        <div className="h-8 w-32 bg-muted rounded" />

                        <div className="h-3 w-24 bg-muted rounded" />

                        <div className="h-11 w-full bg-muted rounded-md" />

                        {/* Shop info */}
                        <div className="flex items-center gap-3 mt-1">
                            <div className="w-[80px] h-[20px] bg-muted rounded" />

                            <div className="flex flex-col gap-1">
                                <div className="h-3 w-20 bg-muted rounded" />
                                <div className="h-3 w-24 bg-muted rounded" />
                            </div>
                        </div>
                    </div>

                    {/* Show more offers */}
                    <div className="mt-4 h-3 w-32 bg-muted rounded" />
                </div>

                {/* PRICE HISTORY CARD */}
                <div className="border border-border rounded-md p-4 bg-white">
                    <div className="flex justify-between items-center">
                        <div className="h-4 w-28 bg-muted rounded" />
                        <div className="flex gap-1">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-5 w-8 bg-muted rounded" />
                            ))}
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="mt-4 h-[100px] w-full bg-muted rounded" />

                    {/* Savings text */}
                    <div className="mt-4 space-y-2">
                        <div className="h-4 w-3/4 bg-muted rounded mx-auto" />
                        <div className="h-3 w-5/6 bg-muted rounded mx-auto" />
                        <div className="h-3 w-2/3 bg-muted rounded mx-auto" />
                    </div>
                </div>

                {/* PRICE ALERT BUTTON */}
                <div className="h-11 w-full bg-muted rounded-md" />
            </div>
        </aside>
    );
};



/* =========================
   Helpers
========================= */

function parseAEDPrice(price: string) {
    if (!price) return null;
    const numeric = price.replace(/[^\d.]/g, "");
    const value = Number(numeric);
    return isNaN(value) ? null : value;
}

/* =========================
   Static Chart 
========================= */

const PriceChart = () => (
    <div className="relative h-[100px] w-full mt-2">
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 300 100"
            preserveAspectRatio="none"
            className="absolute bottom-0 left-0"
        >
            <line
                x1="0"
                y1="25"
                x2="300"
                y2="25"
                stroke="#cccccc"
                strokeWidth="1"
                strokeDasharray="4 2"
            />
            <path
                d="M 0 40 C 30 50, 60 30, 90 45 S 150 70, 180 60 S 240 40, 270 55 S 300 70, 300 70"
                fill="none"
                stroke="#E74C3C"
                strokeWidth="2"
            />
        </svg>
    </div>
);

/* =========================
   Component
========================= */

const PriceWidgetSidebar = () => {
    const { relatedProducts, relatedLoading } = useProduct();

    if (relatedLoading) {
        return <PriceWidgetSidebarSkeleton />;
    }


    /* -------- Prices -------- */
    const pricedProducts = relatedProducts
        .map((p) => ({
            ...p,
            numericPrice: parseAEDPrice(p.price),
        }))
        .filter((p) => p.numericPrice !== null);

    if (!pricedProducts.length) return null;

    const cheapest = pricedProducts.reduce((a, b) =>
        a.numericPrice < b.numericPrice ? a : b
    );

    const minPrice = Math.min(...pricedProducts.map((p) => p.numericPrice));
    const maxPrice = Math.max(...pricedProducts.map((p) => p.numericPrice));
    const savings = maxPrice - minPrice;
    const discountPercent =
        maxPrice > 0 ? Math.round((savings / maxPrice) * 100) : 0;

    return (
        <aside className="sticky top-5 w-full max-w-[340px] hidden lg:block">
            <div className="flex flex-col gap-4">
                {/* BEST PRICE CARD */}
                <Card className="shadow-none border border-border">
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-3">
                            <p className="text-xs text-text-secondary">Best price</p>

                            <p className="text-[28px] font-bold leading-none text-text-primary">
                                AED {minPrice.toLocaleString()}
                            </p>

                            <p className="text-xs text-text-tertiary">plus shipping</p>

                            <Button
                                asChild
                                className="w-full h-11 bg-success-green hover:bg-success-green/90 font-semibold text-sm rounded-md cursor-pointer"
                            >
                                <p
                                    onClick={() => window.open(cheapest.product_url, "__blank")}
                                >
                                    Go to shop
                                </p>
                            </Button>

                            {/* SHOP INFO */}
                            <div className="flex items-center gap-3 mt-1">
                                <a href={cheapest.product_url} className="flex-shrink-0">
                                    <Image
                                        src={cheapest.image_url}
                                        alt={cheapest.source}
                                        width={80}
                                        height={20}
                                        className="object-contain"
                                    />
                                </a>

                                <div className="flex flex-col text-xs">
                                    <a
                                        href={cheapest.product_url}
                                        className="text-brand-blue-light hover:underline font-normal"
                                    >
                                        {cheapest.source}
                                    </a>

                                    {/* STATIC RATING */}
                                    <div className="flex items-center gap-1 text-text-secondary">
                                        <div className="flex">
                                            {[...Array(4)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className="w-3.5 h-3.5 fill-star-rating-yellow text-star-rating-yellow"
                                                />
                                            ))}
                                            <div className="relative w-3.5 h-3.5">
                                                <Star className="w-3.5 h-3.5 fill-border text-border absolute" />
                                                <div
                                                    className="absolute top-0 left-0 h-full overflow-hidden"
                                                    style={{ width: "70%" }}
                                                >
                                                    <Star className="w-3.5 h-3.5 fill-star-rating-yellow text-star-rating-yellow" />
                                                </div>
                                            </div>
                                        </div>
                                        <span className="font-bold text-xs ml-1">4,7</span>
                                        <span className="text-xs">(2.824)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SHOW MORE OFFERS */}
                        <Accordion type="single" collapsible className="w-full mt-2">
                            <AccordionItem value="item-1" className="border-none">
                                <AccordionTrigger className="p-0 text-brand-blue-light hover:no-underline [&>svg]:text-brand-blue-light hover:text-accent-orange text-xs font-normal">
                                    Show more offers
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 text-xs text-text-secondary">
                                    <p>
                                        AED {minPrice.toLocaleString()} – AED{" "}
                                        {maxPrice.toLocaleString()}
                                    </p>
                                    <span className="text-brand-blue-light">
                                        Compare {relatedProducts.length} offers
                                    </span>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>

                {/* PRICE HISTORY */}
                <Card className="shadow-none border border-border">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-text-primary text-base">
                                Price history
                            </h3>

                            <Tabs defaultValue="3m" className="w-auto">
                                <TabsList className="h-7 p-0.5 bg-background-gray-medium rounded-md w-auto">
                                    <TabsTrigger value="3m" className="h-[22px] px-2 text-xs">
                                        3M
                                    </TabsTrigger>
                                    <TabsTrigger value="6m" className="h-[22px] px-2 text-xs">
                                        6M
                                    </TabsTrigger>
                                    <TabsTrigger value="1y" className="h-[22px] px-2 text-xs">
                                        1Y
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <PriceChart />

                        <div className="text-center mt-3 text-sm text-text-secondary">
                            <p>
                                You save today:{" "}
                                <span className="font-bold text-success-green">
                                    AED {savings.toLocaleString()} (-{discountPercent}%)
                                </span>
                            </p>

                            <div className="text-xs text-text-tertiary mt-1 space-y-0.5">
                                <p>
                                    Instead of:{" "}
                                    <span className="line-through">
                                        AED {maxPrice.toLocaleString()}
                                    </span>{" "}
                                    <span className="text-[11px]">
                                        Average best price over 90 days
                                    </span>
                                </p>
                                <p>
                                    Price: AED {minPrice.toLocaleString()}{" "}
                                    <span className="text-[11px]">Best price</span>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* PRICE ALERT */}
                <Button
                    variant="outline"
                    className="w-full h-11 text-brand-blue-light border-brand-blue-light hover:text-brand-blue-light hover:bg-background-gray-light rounded-md font-semibold text-sm"
                >
                    <Bell className="mr-2 h-4 w-4" />
                    Set price alert
                </Button>
            </div>
        </aside>
    );
};

export default PriceWidgetSidebar;
