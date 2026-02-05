"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type Specs = Record<string, string>;

export type BabyFacetKey =
    | "Department"
    | "Age Range"
    | "Target Age Range"
    | "Colour Name"
    | "Size"
    | "Material"
    | "Country of Origin"
    | "Item Pack Quantity"
    | "Model Name"
    | "Model Number"
    | "Features"
    | "Item Count"
    | "Set Includes"
    | "Batteries Required"
    | "Capacity"
    | "Maximum Weight Supported"
    | "Stroller Fold Type"
    | "Stroller Canopy Type"
    | "Pattern"
    | "Sleeve Type"
    | "Occasion"

export type BabyFacets = Record<BabyFacetKey, string[]>;

export interface BabyFilterSidebarProps<
    T extends { numericPrice?: number; specifications?: Specs; title?: string }
> {
    isOpen: boolean;
    onClose: () => void;

    priceRange: [number, number];
    defaultPriceRange: [number, number];
    onPriceChange: (range: [number, number]) => void;

    selected: Record<string, Set<string>>;
    onToggle: (facetKey: BabyFacetKey, value: string) => void;
    onReset: () => void;

    facets: BabyFacets;

    products: T[];
    filteredProducts: T[];
    getFacetValue: (p: T, facetKey: BabyFacetKey) => string | null;
}

function Section({
    title,
    children,
    defaultOpen = true,
}: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="mb-6">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full mb-3 font-semibold text-sm"
            >
                <span>{title}</span>
                {open ? (
                    <ChevronUp className="h-4 w-4" />
                ) : (
                    <ChevronDown className="h-4 w-4" />
                )}
            </button>
            {open && children}
        </div>
    );
}

function normalizeVal(v: string) {
    return v.trim().replace(/\s+/g, " ");
}

function FacetList({
    facetKey,
    values,
    selected,
    onToggle,
    countForValue,
    limit = 6,
}: {
    facetKey: BabyFacetKey;
    values: string[];
    selected: Set<string>;
    onToggle: (v: string) => void;
    countForValue: (v: string) => number;
    limit?: number;
}) {
    const [showAll, setShowAll] = useState(false);

    const safeValues = useMemo(() => {
        const uniq = Array.from(new Set(values.map(normalizeVal))).filter(Boolean);
        return uniq.sort((a, b) =>
            a.localeCompare(b, undefined, {
                numeric: true,
                sensitivity: "base",
            })
        );
    }, [values]);

    const displayed = showAll ? safeValues : safeValues.slice(0, limit);

    return (
        <>
            <div className="space-y-2">
                {displayed.map((v) => {
                    const isOn = selected.has(v);
                    const c = countForValue(v);
                    return (
                        <button
                            key={`${facetKey}:${v}`}
                            onClick={() => onToggle(v)}
                            className={cn(
                                "w-full flex items-center justify-between text-left text-sm py-2 px-3 rounded border transition-colors",
                                isOn
                                    ? "bg-[#E6F2FF] text-[#0066CC] border-[#0066CC]"
                                    : "border-gray-200 hover:bg-gray-50"
                            )}
                        >
                            <span className="pr-2">{v}</span>
                            <span
                                className={cn(
                                    "text-xs",
                                    isOn ? "text-[#0066CC]" : "text-gray-500"
                                )}
                            >
                                {c}
                            </span>
                        </button>
                    );
                })}
            </div>

            {safeValues.length > limit && (
                <button
                    onClick={() => setShowAll((s) => !s)}
                    className="mt-2 text-sm text-[#0066CC] hover:underline"
                >
                    {showAll ? "Show less" : "Show all"}
                </button>
            )}
        </>
    );
}

export default function BabyFilterSidebar<
    T extends { numericPrice?: number; specifications?: Specs; title?: string }
>(props: BabyFilterSidebarProps<T>) {
    const {
        isOpen,
        onClose,
        priceRange,
        defaultPriceRange,
        onPriceChange,
        selected,
        onToggle,
        onReset,
        facets,
        products,
        filteredProducts,
        getFacetValue,
    } = props;

    const countForOption = (facetKey: BabyFacetKey, value: string) => {
        const val = normalizeVal(value);

        return products.filter((p) => {
            const price = p.numericPrice ?? 0;
            if (price < priceRange[0] || price > priceRange[1]) return false;

            for (const key of Object.keys(selected)) {
                const k = key as BabyFacetKey;
                const selSet = selected[k];
                if (!selSet || selSet.size === 0) continue;

                const vHere = getFacetValue(p, k);
                if (!vHere) return false;

                const normHere = normalizeVal(vHere);

                if (k === facetKey) {
                    const wouldMatch = selSet.has(normHere) || normHere === val;
                    if (!wouldMatch) return false;
                } else {
                    if (!selSet.has(normHere)) return false;
                }
            }

            const currentSel = selected[facetKey];
            if (!currentSel || currentSel.size === 0) {
                const vHere = getFacetValue(p, facetKey);
                if (!vHere) return false;
                if (normalizeVal(vHere) !== val) return false;
            }

            return true;
        }).length;
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={cn(
                    "fixed md:sticky top-0 left-0 h-screen md:h-auto w-80 md:w-72 bg-white border-r border-border overflow-y-auto z-50 transition-transform duration-300",
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                <div className="p-4">
                    <div className="flex items-center justify-between mb-4 md:hidden">
                        <h2 className="text-lg font-semibold">Filters</h2>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <Section title="Price Range">
                        <div className="space-y-4">
                            <Slider
                                min={defaultPriceRange[0]}
                                max={defaultPriceRange[1]}
                                step={10}
                                value={priceRange}
                                onValueChange={(value) =>
                                    onPriceChange(value as [number, number])
                                }
                                className="[&_[role=slider]]:bg-[#0066CC] [&_[role=slider]]:border-[#0066CC]"
                            />
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">
                                    AED {priceRange[0].toFixed(0)}
                                </span>
                                <span className="text-gray-400">to</span>
                                <span className="font-medium">
                                    AED {priceRange[1].toFixed(0)}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">
                                Showing {filteredProducts.length} results
                            </p>
                        </div>
                    </Section>

                    {/* MAIN BABY FACETS */}
                    <Section title="Department">
                        <FacetList
                            facetKey="Department"
                            values={facets["Department"]}
                            selected={selected["Department"] ?? new Set()}
                            onToggle={(v) => onToggle("Department", v)}
                            countForValue={(v) => countForOption("Department", v)}
                        />
                    </Section>

                    <Section title="Age range">
                        <FacetList
                            facetKey="Age Range"
                            values={facets["Age Range"]}
                            selected={selected["Age Range"] ?? new Set()}
                            onToggle={(v) => onToggle("Age Range", v)}
                            countForValue={(v) => countForOption("Age Range", v)}
                        />
                    </Section>

                    <Section title="Target age range">
                        <FacetList
                            facetKey="Target Age Range"
                            values={facets["Target Age Range"]}
                            selected={selected["Target Age Range"] ?? new Set()}
                            onToggle={(v) => onToggle("Target Age Range", v)}
                            countForValue={(v) => countForOption("Target Age Range", v)}
                        />
                    </Section>

                    <Section title="Color">
                        <FacetList
                            facetKey="Colour Name"
                            values={facets["Colour Name"]}
                            selected={selected["Colour Name"] ?? new Set()}
                            onToggle={(v) => onToggle("Colour Name", v)}
                            countForValue={(v) => countForOption("Colour Name", v)}
                        />
                    </Section>

                    <Section title="Size">
                        <FacetList
                            facetKey="Size"
                            values={facets["Size"]}
                            selected={selected["Size"] ?? new Set()}
                            onToggle={(v) => onToggle("Size", v)}
                            countForValue={(v) => countForOption("Size", v)}
                        />
                    </Section>

                    <Section title="Material">
                        <FacetList
                            facetKey="Material"
                            values={facets["Material"]}
                            selected={selected["Material"] ?? new Set()}
                            onToggle={(v) => onToggle("Material", v)}
                            countForValue={(v) => countForOption("Material", v)}
                        />
                    </Section>

                    <Section title="Features">
                        <FacetList
                            facetKey="Features"
                            values={facets["Features"]}
                            selected={selected["Features"] ?? new Set()}
                            onToggle={(v) => onToggle("Features", v)}
                            countForValue={(v) => countForOption("Features", v)}
                        />
                    </Section>

                    <Button variant="outline" className="w-full mt-2" onClick={onReset}>
                        Reset Filters
                    </Button>
                </div>
            </aside>
        </>
    );
}
