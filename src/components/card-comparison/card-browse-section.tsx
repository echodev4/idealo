"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Plus, ChevronDown } from "lucide-react";
import { CardData } from "@/types/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";



interface Props {
    cards: CardData[];
    onSelectCard: (card: CardData) => void;
    selectedCardIds: string[];
    setApplyCard: (card: CardData) => void;
    setOpenApply: (open: boolean) => void;
}

/* ---------- helpers ---------- */

const splitList = (text?: string) => {
    if (!text) return [];
    return text
        .split(/\n|;/g)
        .map((t) => t.trim())
        .filter(Boolean);
};

export default function CardBrowseSection({
    cards,
    onSelectCard,
    selectedCardIds,
    setApplyCard,
    setOpenApply
}: Props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [openFeaturesId, setOpenFeaturesId] = useState<string | null>(null);


    // filters
    const [salaryTransfer, setSalaryTransfer] =
        useState<"any" | "required" | "not-required">("any");

    const [annualFeeFilter, setAnnualFeeFilter] =
        useState<"any" | "free-life" | "free-first-year" | "under-500" | "under-1000">("any");

    const [selectedBank, setSelectedBank] = useState<string>("all");
    const [isIslamicOnly, setIsIslamicOnly] = useState(false);

    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const filterBase =
        "h-10 px-4 rounded-lg border bg-white text-sm focus:ring-2 focus:ring-green-500";


    const resetFilters = () => {
        setSearchQuery("");
        setSalaryTransfer("any");
        setAnnualFeeFilter("any");
        setSelectedBank("all");
        setIsIslamicOnly(false);
        setSortOrder("asc");
    };



    const filteredCards = useMemo(() => {
        let list = [...cards];

        /* ---------- search ---------- */
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter((c) =>
                [
                    c.bankName,
                    c.joiningAnnualFee,
                    c.welcomeBonus,
                    c.earnRates,
                    c.keyLifestyleBenefits,
                    c.pointsRedemption,
                    c.documentsRequired,
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(q)
            );
        }

        /* ---------- salary transfer ---------- */
        if (salaryTransfer !== "any") {
            list = list.filter((c) =>
                salaryTransfer === "required"
                    ? c.salaryTransferRequired
                    : !c.salaryTransferRequired
            );
        }

        /* ---------- annual fee ---------- */
        if (annualFeeFilter !== "any") {
            list = list.filter((c) => {
                const fee = c.joiningAnnualFee?.toLowerCase() || "";

                if (annualFeeFilter === "free-life") {
                    return fee.includes("free for life");
                }

                if (annualFeeFilter === "free-first-year") {
                    return fee.includes("free for 1st year") || fee.includes("1st year free");
                }

                const match = fee.match(/aed\s?([\d,]+)/i);
                if (!match) return false;

                const amount = Number(match[1].replace(",", ""));

                if (annualFeeFilter === "under-500") return amount <= 500;
                if (annualFeeFilter === "under-1000") return amount <= 1000;

                return true;
            });
        }

        /* ---------- bank ---------- */
        if (selectedBank !== "all") {
            list = list.filter((c) => c.bankName === selectedBank);
        }

        /* ---------- islamic ---------- */
        if (isIslamicOnly) {
            list = list.filter((c) =>
                (
                    c.bankName +
                    c.joiningAnnualFee +
                    c.keyLifestyleBenefits
                )
                    .toLowerCase()
                    .includes("islamic")
            );
        }

        /* ---------- sort ---------- */
        list.sort((a, b) =>
            sortOrder === "asc"
                ? a.bankName.localeCompare(b.bankName)
                : b.bankName.localeCompare(a.bankName)
        );

        return list;
    }, [
        cards,
        searchQuery,
        salaryTransfer,
        annualFeeFilter,
        selectedBank,
        isIslamicOnly,
        sortOrder,
    ]);


    return (
        <section className="bg-white">
            <div className="mx-auto max-w-7xl px-4">
                {/* Filters */}
                <div className="mt-8 rounded-2xl border bg-gray-50/60 p-6 shadow-sm">

                    <div className="mb-8 text-center">
                        <h2 className="text-2xl md:text-3xl font-semibold text-neutral-darkest">
                            Browse Credit Cards
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            Search and add cards to compare features, fees, and benefits
                        </p>

                        <div className="relative max-w-2xl mx-auto">
                            <svg
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                width="18"
                                height="18"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                                />
                            </svg>

                            <input
                                type="search"
                                placeholder="Search cards by bank, fee, benefits..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-12 pl-11 pr-4 rounded-lg border bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                            />
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3 items-center justify-between">
                            <div className="flex flex-wrap gap-3">

                                {/* Salary Transfer */}
                                <select
                                    className={filterBase}
                                    value={salaryTransfer}
                                    onChange={(e) => setSalaryTransfer(e.target.value as any)}
                                >
                                    <option value="any">Any salary transfer</option>
                                    <option value="required">Required</option>
                                    <option value="not-required">Not required</option>
                                </select>

                                {/* Bank */}
                                <select
                                    value={selectedBank}
                                    className={filterBase}
                                    onChange={(e) => setSelectedBank(e.target.value)}
                                >
                                    <option value="all">All banks</option>
                                    {[...new Set(cards.map((c) => c.bankName))]
                                        .sort()
                                        .map((bank) => (
                                            <option key={bank} value={bank}>
                                                {bank}
                                            </option>
                                        ))}
                                </select>

                                {/* Annual Fee */}
                                <select
                                    className={filterBase}
                                    value={annualFeeFilter}
                                    onChange={(e) => setAnnualFeeFilter(e.target.value as any)}
                                >
                                    <option value="any">Any fee</option>
                                    <option value="free-life">Free for life</option>
                                    <option value="free-first-year">Free for 1st year</option>
                                    <option value="under-500">Under AED 500</option>
                                    <option value="under-1000">Under AED 1,000</option>
                                </select>

                                {/* Islamic */}
                                <label className="flex items-center gap-2 px-3 h-10 border rounded-md text-sm cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isIslamicOnly}
                                        onChange={(e) => setIsIslamicOnly(e.target.checked)}
                                    />
                                    Islamic
                                </label>
                            </div>

                            {/* Right side */}
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">
                                    {filteredCards.length} cards
                                </span>

                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value as any)}
                                    className={filterBase}
                                >
                                    <option value="asc">Bank (A–Z)</option>
                                    <option value="desc">Bank (Z–A)</option>
                                </select>

                                {/* Reset */}
                                <button
                                    onClick={resetFilters}
                                    className="h-10 px-4 rounded-md border text-sm font-semibold hover:bg-gray-50"
                                >
                                    Reset filters
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                    {filteredCards.map((card) => {
                        const isSelected = selectedCardIds.includes(card._id);

                        const lifestyle = splitList(card.keyLifestyleBenefits);
                        const redemption = splitList(card.pointsRedemption);
                        const earnRates = splitList(card.earnRates);

                        const pills = [
                            ...earnRates,
                            ...lifestyle,
                            ...redemption,
                        ].slice(0, 4);

                        return (
                            <div
                                key={card._id}
                                className={`relative flex flex-col h-full border rounded-xl bg-white p-4
    ${isSelected ? "opacity-60 cursor-not-allowed" : ""}`}
                            >

                                {/* Add button */}
                                {!isSelected && (
                                    <button
                                        onClick={() => onSelectCard(card)}
                                        className="absolute top-3 right-3 bg-orange-500 text-white p-2 rounded-full hover:scale-110 transition"
                                    >
                                        <Plus size={18} />
                                    </button>
                                )}

                                {isSelected && (
                                    <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                                        Selected
                                    </span>
                                )}




                                {/* Image */}
                                <Image
                                    src={card.cardImageUrl}
                                    alt={card.bankName}
                                    width={320}
                                    height={200}
                                    className="w-full aspect-[1.6/1] object-cover rounded-md mb-4"
                                />

                                {/* Bank name */}
                                <p className="text-xs uppercase text-muted-foreground font-semibold">
                                    {card.bankName}
                                </p>

                                {/* Info row */}
                                <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Salary Transfer</p>
                                        <p className="font-semibold">
                                            {card.salaryTransferRequired ? "Required" : "Not Required"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Annual Fee</p>
                                        <p className="font-semibold">{card.joiningAnnualFee}</p>
                                    </div>
                                </div>

                                {/* Feature pills */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {pills.map((item, i) => (
                                        <span
                                            key={i}
                                            className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>

                                {/* View features */}
                                <button
                                    onClick={() =>
                                        setOpenFeaturesId(
                                            openFeaturesId === card._id ? null : card._id
                                        )
                                    }
                                    className={`
    mt-4
    flex
    items-center
    justify-between
    w-full
    rounded-md
    px-4
    py-3
    text-sm
    font-semibold
    transition-colors
    duration-200
    ${openFeaturesId === card._id
                                            ? "bg-gray-100 text-neutral-darkest"
                                            : "bg-gray-50 text-neutral-darkest hover:bg-gray-100"
                                        }
  `}
                                >
                                    {openFeaturesId === card._id ? "Hide Features" : "View Features"}

                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform duration-300 ${openFeaturesId === card._id ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                <div
                                    className={`mt-3 text-sm overflow-hidden transition-all duration-300 ease-in-out
    ${openFeaturesId === card._id
                                            ? "max-h-[180px] opacity-100"
                                            : "max-h-0 opacity-0"}
  `}
                                >
                                    <div className="max-h-[180px] overflow-y-auto pr-2">
                                        {/* Welcome Bonus */}
                                        {card.welcomeBonus && card.welcomeBonus !== "-" && (
                                            <div className="mb-3">
                                                <p className="mb-1 font-semibold text-neutral-darkest">
                                                    Welcome Bonus
                                                </p>
                                                <ul className="space-y-1 text-muted-foreground">
                                                    {splitList(card.welcomeBonus).map((item, i) => (
                                                        <li key={i}>• {item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Earn Rates */}
                                        {card.earnRates && (
                                            <div className="mb-3">
                                                <p className="mb-1 font-semibold text-neutral-darkest">
                                                    Earn Rates
                                                </p>
                                                <ul className="space-y-1 text-muted-foreground">
                                                    {splitList(card.earnRates).map((item, i) => (
                                                        <li key={i}>• {item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Lifestyle Benefits */}
                                        {card.keyLifestyleBenefits && (
                                            <div>
                                                <p className="mb-1 font-semibold text-neutral-darkest">
                                                    Key Lifestyle Benefits
                                                </p>
                                                <ul className="space-y-1 text-muted-foreground">
                                                    {splitList(card.keyLifestyleBenefits).map((item, i) => (
                                                        <li key={i}>• {item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>



                                {/* CTA */}
                                <div className="mt-auto pt-6 grid grid-cols-2 gap-3">
                                    <p
                                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-green-600 font-bold py-3 bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                                        onClick={() => {
                                            setApplyCard(card)
                                            setOpenApply(true)
                                        }
                                        }
                                    >
                                        Apply Now
                                    </p>

                                    <Link
                                        href={`/card-comparison/${card._id}`}
                                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-green-600 text-green-700 font-bold py-3 hover:bg-green-50"
                                    >
                                        Details
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>


                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
