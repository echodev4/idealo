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
}: Props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [openFeaturesId, setOpenFeaturesId] = useState<string | null>(null);

    const filteredCards = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return cards;

        return cards.filter(
            (c) =>
                c.bankName.toLowerCase().includes(q) ||
                c.joiningAnnualFee?.toLowerCase().includes(q) ||
                c.earnRates?.toLowerCase().includes(q)
        );
    }, [cards, searchQuery]);

    return (
        <section className="bg-white py-12">
            <div className="mx-auto max-w-7xl px-4">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-semibold text-neutral-darkest">
                        Browse Credit Cards
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        Search and add cards to compare features, fees, and benefits
                    </p>

                    <input
                        type="search"
                        placeholder="Search by bank name, fee, or earn rate..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mt-6 w-full max-w-xl mx-auto h-12 px-4 border rounded-md"
                    />
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                    <a
                                        href="#"
                                         className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-green-600 font-bold py-3 bg-green-600 text-white hover:bg-green-700"
                                    >
                                        Apply Now
                                    </a>

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
