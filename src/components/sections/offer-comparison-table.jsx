"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useProduct } from "@/context/ProductContext";

const OfferComparisonTableSkeleton = () => {
    return (
        <section className="py-6 bg-background-gray-light animate-pulse">
            <div className="container">
                {/* Title */}
                <div className="h-7 w-48 bg-muted rounded mb-4" />

                {/* Filter */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-4 w-4 bg-muted rounded-sm" />
                    <div className="h-4 w-36 bg-muted rounded" />
                </div>

                {/* Table header */}
                <div className="hidden lg:grid grid-cols-[minmax(0,_3fr)_minmax(0,_1.5fr)_minmax(0,_1.7fr)_minmax(0,_2fr)_minmax(0,_1.3fr)] gap-x-4 px-4 py-2 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-3 bg-muted rounded" />
                    ))}
                </div>

                {/* Rows */}
                <ul className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <li
                            key={i}
                            className="bg-white border border-border rounded-md p-4"
                        >
                            <div className="grid grid-cols-[minmax(0,_3fr)_minmax(0,_1.5fr)_minmax(0,_1.7fr)_minmax(0,_2fr)_minmax(0,_1.3fr)] gap-x-4 items-center">
                                {/* Offer name */}
                                <div className="h-4 w-4/5 bg-muted rounded" />

                                {/* Price */}
                                <div className="space-y-2">
                                    <div className="h-6 w-24 bg-muted rounded" />
                                    <div className="h-3 w-28 bg-muted rounded" />
                                </div>

                                {/* Delivery */}
                                <div className="space-y-2">
                                    <div className="h-3 w-20 bg-muted rounded" />
                                    <div className="h-3 w-28 bg-muted rounded" />
                                </div>

                                {/* Shop */}
                                <div className="flex items-center gap-3">
                                    <div className="w-[56px] h-[56px] bg-muted rounded-md" />
                                    <div className="space-y-2">
                                        <div className="h-3 w-20 bg-muted rounded" />
                                        <div className="h-3 w-24 bg-muted rounded" />
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="h-10 w-full bg-muted rounded-md" />
                            </div>
                        </li>
                    ))}
                </ul>

                {/* Load more */}
                <div className="mt-6 flex justify-center">
                    <div className="h-10 w-40 bg-muted rounded-md" />
                </div>
            </div>
        </section>
    );
};


/* =========================
   Helpers
========================= */

const parseAED = (price) => {
    const num = Number(price.replace(/[^\d.]/g, ""));
    return isNaN(num) ? null : num;
};

const formatAED = (price) => `AED ${price.toLocaleString()}`;

/* =========================
   Offer Row
========================= */

const OfferItem = ({
    offer,
    cheapestPrice,
}) => {
    return (
        <li className="bg-white border border-border rounded-md mb-2 hover:shadow-md transition-shadow duration-200">
            <div className="p-4 grid grid-cols-[minmax(0,_3fr)_minmax(0,_1.5fr)_minmax(0,_1.7fr)_minmax(0,_2fr)_minmax(0,_1.3fr)] gap-x-4 items-start">
                {/* Offer name */}
                <div>
                    <a
                        href={offer.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-brand-blue-light hover:underline"
                    >
                        {offer.title}
                    </a>
                </div>

                {/* Price */}
                <div>
                    <span className="text-xl font-bold text-text-primary">
                        {formatAED(offer.price)}
                    </span>

                    {offer.price === cheapestPrice && (
                        <span className="bg-yellow-badge text-black text-[10px] font-semibold px-1.5 py-0.5 rounded-sm mt-1 block w-fit">
                            Best total price
                        </span>
                    )}

                    <span className="text-xs text-text-secondary block mt-1">
                        {formatAED(offer.price)} incl. shipping
                    </span>
                </div>

                {/* Delivery */}
                <div className="text-xs text-text-secondary">
                    <div className="flex items-start">
                        <CheckCircle
                            size={14}
                            className="text-success-green mr-1.5 mt-0.5"
                        />
                        <div>
                            <p>{offer.available ? "In stock" : "Availability unknown"}</p>
                            {offer.stock && <p>{offer.stock}</p>}
                        </div>
                    </div>
                </div>

                {/* Shop */}
                <div className="flex items-center gap-3">
                    <div className="w-[56px] h-[56px] border border-gray-200 rounded-md flex items-center justify-center bg-white">
                        <Image
                            src={offer.logo}
                            alt={offer.shop}
                            width={48}
                            height={48}
                            className="object-contain"
                        />
                    </div>

                    <div className="flex flex-col text-xs">
                        <span className="font-semibold text-text-primary capitalize">
                            {offer.shop.replace(/uae/i, " UAE")}
                        </span>
                        <span className="text-text-secondary">
                            Official store
                        </span>
                    </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col items-center">
                    <Button
                        asChild
                        className="bg-success-green hover:bg-[#46a040] text-white font-semibold text-sm h-10 w-full px-2"
                    >
                        <p className="cursor-pointer" onClick={() => window.open(offer.url, "__blank")}>
                            Go to shop
                        </p>
                    </Button>
                </div>
            </div>
        </li>
    );
};

/* =========================
   Main Component
========================= */

export default function OfferComparisonTable() {
    const [showAvailableOnly, setShowAvailableOnly] = useState(true);
    const [visibleOffers, setVisibleOffers] = useState(6);
    const { relatedProducts, relatedLoading } = useProduct();

    if (relatedLoading) {
        return <OfferComparisonTableSkeleton />;
    }



    const offers = relatedProducts
        .map((p) => {
            const price = parseAED(p.price);
            if (!price) return null;

            return {
                id: p._id,
                title: p.product_name,
                price,
                url: p.product_url,
                shop: p.source,
                logo: p.image_url,
                available: Boolean(p.stock_left),
                stock: p.stock_left,
            };
        })
        .filter(Boolean)

    const filtered = showAvailableOnly
        ? offers.filter((o) => o.available)
        : offers;

    const cheapestPrice =
        filtered.length > 0
            ? Math.min(...filtered.map((o) => o.price))
            : 0;

    return (
        <section className="py-6 bg-background-gray-light">
            <div className="container">
                <h2 className="text-2xl font-semibold mb-4">Price comparison</h2>

                <div className="flex justify-between items-center mb-3 text-sm">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            checked={showAvailableOnly}
                            onCheckedChange={(v) => setShowAvailableOnly(Boolean(v))}
                        />
                        <span>Available immediately</span>
                    </div>
                </div>

                <div className="hidden lg:grid grid-cols-[minmax(0,_3fr)_minmax(0,_1.5fr)_minmax(0,_1.7fr)_minmax(0,_2fr)_minmax(0,_1.3fr)] gap-x-4 px-4 py-2 text-xs font-semibold">
                    <span>Offer name</span>
                    <span>Price & Shipping</span>
                    <span>Delivery</span>
                    <span>Shop</span>
                    <span></span>
                </div>

                <ul>
                    {filtered.slice(0, visibleOffers).map((offer) => (
                        <OfferItem
                            key={offer.id}
                            offer={offer}
                            cheapestPrice={cheapestPrice}
                        />
                    ))}
                </ul>

                {visibleOffers < filtered.length && (
                    <div className="text-center mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setVisibleOffers((v) => v + 6)}
                            className="bg-white border-brand-blue-light text-brand-blue-light"
                        >
                            Show more offers
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
