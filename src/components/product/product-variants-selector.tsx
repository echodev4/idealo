"use client";

import * as React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProduct } from "@/context/ProductContext";

/* =========================
   Helpers
========================= */

function parseAEDPrice(price: string): number | null {
    if (!price) return null;
    const numeric = price.replace(/[^\d.]/g, "");
    const value = Number(numeric);
    return isNaN(value) ? null : value;
}

function extractStorage(name: string): string | null {
    const match = name.match(/(\d+)\s?GB/i);
    return match ? `${match[1]}GB` : null;
}

function extractColor(name: string): string | null {
    const parts = name.split(",");
    return parts.length >= 3 ? parts[2].trim() : null;
}

/* =========================
   Component
========================= */

const ProductVariantsSelectorSkeleton = () => {
    return (
        <section className="bg-white p-4 sm:p-6 rounded-lg mt-6 animate-pulse">
            {/* Heading */}
            <div className="h-6 w-28 bg-muted rounded mb-4" />

            <div className="relative">
                <div className="flex overflow-x-auto space-x-3 pb-4">
                    {/* All variants card skeleton */}
                    <div className="flex-shrink-0 w-[140px] h-[190px] border border-border rounded-lg p-3 flex flex-col justify-between text-center">
                        <div className="grid grid-cols-2 gap-1 mb-2 h-[68px]">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="w-[30px] h-[40px] bg-muted rounded mx-auto"
                                />
                            ))}
                        </div>

                        <div className="flex-grow flex flex-col justify-center">
                            <div className="h-4 w-20 bg-muted rounded mx-auto mb-2" />
                            <div className="h-5 w-24 bg-muted rounded mx-auto" />
                        </div>
                    </div>

                    {/* Variant cards skeleton */}
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 w-[140px] h-[190px] border border-border rounded-lg p-3 flex flex-col items-center justify-between text-center"
                        >
                            {/* Discount badge placeholder */}
                            <div className="absolute top-0 left-0 h-4 w-10 bg-muted rounded-tl-md rounded-br-md" />

                            {/* Image */}
                            <div className="w-full h-[80px] flex items-center justify-center">
                                <div className="w-[50px] h-[80px] bg-muted rounded" />
                            </div>

                            {/* Name */}
                            <div className="h-[42px] w-full flex items-center justify-center">
                                <div className="h-4 w-24 bg-muted rounded" />
                            </div>

                            {/* Price */}
                            <div className="mt-1">
                                <div className="h-3 w-12 bg-muted rounded mx-auto mb-1" />
                                <div className="h-5 w-20 bg-muted rounded mx-auto" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ProductVariantsSelector = () => {
    const { relatedProducts, relatedLoading } = useProduct();

    const [selectedKey, setSelectedKey] = React.useState<string | null>(null);

    /* -------- Build variants -------- */
    const variantsMap = new Map<
        string,
        {
            key: string;
            name: string;
            imageUrl: string;
            prices: number[];
        }
    >();

    relatedProducts.forEach((product) => {
        const storage = extractStorage(product.product_name);
        const color = extractColor(product.product_name);
        const price = parseAEDPrice(product.price);

        if (!storage || !color || price === null) return;

        const key = `${storage}_${color}`;

        if (!variantsMap.has(key)) {
            variantsMap.set(key, {
                key,
                name: `${storage} ${color}`,
                imageUrl: product.image_url,
                prices: [price],
            });
        } else {
            variantsMap.get(key)!.prices.push(price);
        }
    });

    const variants = Array.from(variantsMap.values()).map((v) => {
        const minPrice = Math.min(...v.prices);
        const maxPrice = Math.max(...v.prices);

        return {
            ...v,
            price: minPrice,
            discount:
                maxPrice > minPrice
                    ? `-${Math.round(((maxPrice - minPrice) / maxPrice) * 100)}%`
                    : null,
        };
    });

    const cheapestPrice = Math.min(...variants.map((v) => v.price));


    /* -------- Set default selection safely -------- */
    React.useEffect(() => {
        if (!selectedKey && variants.length) {
            const cheapest = variants.reduce((a, b) =>
                a.price < b.price ? a : b
            );
            setSelectedKey(cheapest.key);
        }
    }, [variants, selectedKey]);

    /* -------- Loading -------- */
    if (relatedLoading) {
        return <ProductVariantsSelectorSkeleton />;
    }

    if (!variants.length) return null;

    return (
        <section className="bg-white p-4 sm:p-6 rounded-lg mt-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
                Variant:
            </h2>

            <div className="relative">
                <div className="flex overflow-x-auto space-x-3 pb-4">
                    <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="flex-shrink-0 w-[140px] h-[190px] border border-border rounded-lg p-3 flex flex-col justify-between text-center hover:shadow-md transition-shadow"
                    >
                        <div className="grid grid-cols-2 gap-1 mb-2 h-[68px]">
                            {variants.slice(0, 4).map((v) => (
                                <Image
                                    key={v.key}
                                    src={v.imageUrl}
                                    alt={v.name}
                                    width={30}
                                    height={40}
                                    className="object-contain mx-auto"
                                />
                            ))}
                        </div>

                        <div className="flex-grow flex flex-col justify-center">
                            <span className="text-sm font-semibold text-text-primary">
                                All variants
                            </span>
                            <div className="text-sm mt-1">
                                <span className="text-text-secondary text-xs">from</span>
                                <p className="font-bold text-accent-orange text-lg">
                                    AED {cheapestPrice.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </a>

                    {/* VARIANT CARDS */}
                    {variants.map((variant) => {
                        const selected = variant.key === selectedKey;

                        return (
                            <a
                                key={variant.key}
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedKey(variant.key);
                                }}
                                className={cn(
                                    "relative flex-shrink-0 w-[140px] h-[190px] border rounded-lg p-3 flex flex-col items-center justify-between text-center hover:shadow-md transition-shadow",
                                    selected
                                        ? "border-2 border-brand-blue-light bg-[#F0F7FF] box-border"
                                        : "border border-border bg-white"

                                )}
                            >
                                {variant.discount && (
                                    <div className="absolute top-0 left-0 bg-accent-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-tl-md rounded-br-md z-10">
                                        {variant.discount}
                                    </div>
                                )}

                                {selected && (
                                    <div className="absolute top-1.5 right-1.5 bg-brand-blue-light text-white rounded-full w-5 h-5 flex items-center justify-center z-10">
                                        <Check size={14} />
                                    </div>
                                )}

                                <div className="w-full h-[80px] flex items-center justify-center">
                                    <Image
                                        src={variant.imageUrl}
                                        alt={variant.name}
                                        width={50}
                                        height={80}
                                        className="object-contain"
                                    />
                                </div>

                                <div className="mt-2 text-sm font-semibold text-text-primary leading-tight h-[42px] flex items-center justify-center">
                                    {variant.name}
                                </div>

                                <div className="mt-1">
                                    <span className="text-text-secondary text-xs">from</span>
                                    <p className="font-bold text-text-primary text-lg">
                                        AED {variant.price.toLocaleString()}
                                    </p>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ProductVariantsSelector;

