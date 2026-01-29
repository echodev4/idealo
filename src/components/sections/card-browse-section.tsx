"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Plus, ChevronDown } from "lucide-react";
import { CardData } from "@/types/card";

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
                                    className="flex items-center justify-between mt-4 text-sm font-medium text-neutral-darkest"
                                >
                                    View Features
                                    <ChevronDown size={16} />
                                </button>

                                {openFeaturesId === card._id && (
                                    <div className="mt-3 text-sm text-muted-foreground space-y-2">
                                        {splitList(card.keyLifestyleBenefits).map((t, i) => (
                                            <div key={i}>• {t}</div>
                                        ))}
                                        {splitList(card.pointsRedemption).map((t, i) => (
                                            <div key={i}>• {t}</div>
                                        ))}
                                    </div>
                                )}

                                {/* CTA */}
                                <div className="mt-auto pt-6 grid grid-cols-2 gap-3">
                                    <a
                                        href="#"
                                        className="text-center bg-green-600 text-white py-2 rounded-md font-semibold"
                                    >
                                        Apply Now
                                    </a>
                                    <a
                                        href="#"
                                        className="text-center border border-green-600 text-green-600 py-2 rounded-md font-semibold"
                                    >
                                        Details →
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
