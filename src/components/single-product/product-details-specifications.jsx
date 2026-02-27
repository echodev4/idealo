"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useProduct } from "@/context/ProductContext";

const ProductDetailsSpecificationsSkeleton = () => {
    return (
        <section className="bg-white p-6 md:p-8 rounded-lg mt-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)] animate-pulse">
            {/* Title */}
            <div className="h-7 w-48 bg-muted rounded mb-6" />

            <div className="flex flex-col md:flex-row gap-x-8">
                {/* Left image */}
                <div className="w-full md:w-1/4 lg:w-1/5 hidden md:flex justify-center pt-24">
                    <div className="w-[160px] h-[326px] bg-muted rounded-md" />
                </div>

                {/* Specifications */}
                <div className="w-full md:w-3/4 lg:w-4/5">
                    <dl>
                        {Array.from({ length: 15 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex flex-col sm:flex-row py-3 border-b border-muted gap-2 sm:gap-0"
                            >
                                <div className="w-full sm:w-[190px] h-4 bg-muted rounded" />
                                <div className="h-4 w-3/4 bg-muted rounded" />
                            </div>
                        ))}
                    </dl>

                    {/* Expand button */}
                    <div className="mt-4 h-10 w-full bg-muted rounded-md" />
                </div>
            </div>
        </section>
    );
};



/* =========================
   Constants
========================= */

const INITIAL_VISIBLE_COUNT = 15;


const SpecificationRow = ({
    label,
    value,
}) => (
    <div className="flex flex-col sm:flex-row py-3 border-b border-muted gap-2 sm:gap-0">
        <dt className="w-full sm:w-[190px] shrink-0 sm:pr-4 text-sm text-text-secondary">
            {label}
        </dt>
        <dd className="text-sm text-text-primary">{value}</dd>
    </div>
);

/* =========================
   Main Component
========================= */

export default function ProductDetailsSpecifications() {
    const [isExpanded, setIsExpanded] = useState(false);
    const { product, loading } = useProduct();

    if (loading) {
        return <ProductDetailsSpecificationsSkeleton />;
    }



    const specs =
        Object.entries(product.specifications).map(([label, value]) => ({
            label,
            value,
        }))

    const initialSpecs = specs.slice(0, INITIAL_VISIBLE_COUNT);
    const expandableSpecs = specs.slice(INITIAL_VISIBLE_COUNT);

    const image = product.images?.[0];

    if(!specs.length) return null

    return (
        <section
            id="datasheet"
            className="bg-white p-6 md:p-8 rounded-lg mt-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
        >
            <h2 className="text-2xl font-semibold text-text-primary mb-6">
                Product Details
            </h2>

            <div className="flex flex-col md:flex-row gap-x-8">
                {/* Left image */}
                <div className="w-full md:w-1/4 lg:w-1/5 shrink-0 hidden md:block pt-24 text-center">
                    {image && (
                        <Image
                            src={image.src}
                            alt={image.alt}
                            width={160}
                            height={326}
                            className="mx-auto object-contain"
                        />
                    )}
                </div>

                {/* Specifications */}
                <div className="w-full md:w-3/4 lg:w-4/5">
                    <dl>
                        {initialSpecs.map((spec, index) => (
                            <SpecificationRow
                                key={index}
                                label={spec.label}
                                value={spec.value}
                            />
                        ))}

                        {isExpanded &&
                            expandableSpecs.map((spec, index) => (
                                <SpecificationRow
                                    key={`ex-${index}`}
                                    label={spec.label}
                                    value={spec.value}
                                />
                            ))}
                    </dl>

                    {expandableSpecs.length > 0 && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="w-full mt-4 flex items-center justify-center gap-2 rounded-md border border-border py-2.5 text-sm font-semibold text-brand-blue-light hover:border-brand-blue-light transition-colors"
                        >
                            {isExpanded ? (
                                <>
                                    Show fewer details <ChevronUp className="h-4 w-4" />
                                </>
                            ) : (
                                <>
                                    Show all details <ChevronDown className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
