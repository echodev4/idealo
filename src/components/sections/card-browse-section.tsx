"use client";

import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import Image from "next/image";
import { CardData } from "@/types/card";

interface CardBrowseSectionProps {
    cards: CardData[];
    onSelectCard: (card: CardData) => void;
    selectedCardIds: string[];
}

const CardBrowseSection = ({ cards, onSelectCard, selectedCardIds }: CardBrowseSectionProps) => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCards = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return cards;
        return cards.filter(card =>
            card.name.toLowerCase().includes(q)
        );
    }, [cards, searchQuery]);

    return (
        <div className="py-12 bg-white">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
                <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-semibold text-neutral-darkest mb-4">
                        Browse Credit Cards
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        Search for a card by name or click the + icon to add it to your comparison
                    </p>

                    <div className="relative max-w-xl mx-auto mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral" />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search card name..."
                            className="w-full h-12 pl-12 pr-4 border border-input rounded-md bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
                        />
                    </div>
                </div>

                {filteredCards.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">
                            No cards found matching "{searchQuery}"
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCards.map((card) => {
                            const isSelected = selectedCardIds.includes(card.id);

                            return (
                                <div
                                    key={card.id}
                                    className={`relative flex flex-col items-start p-5 border rounded-lg transition-all ${isSelected
                                            ? "border-primary bg-green-lightest"
                                            : "border-border hover:border-neutral-light hover:shadow-sm"
                                        }`}
                                >
                                    <div className="relative w-full">
                                        <Image
                                            src={card.image}
                                            alt={card.name}
                                            width={320}
                                            height={202}
                                            className="w-full aspect-[1.586/1] object-cover rounded-md mb-4 bg-muted"
                                        />

                                        {!isSelected && (
                                            <button
                                                onClick={() => onSelectCard(card)}
                                                className="absolute top-2 right-2 bg-primary text-white rounded-full p-2 shadow-lg hover:scale-110 transition-all"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        )}

                                        {isSelected && (
                                            <div className="absolute top-2 right-2 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                                                Selected
                                            </div>
                                        )}
                                    </div>

                                    <h3
                                        className={`text-base font-semibold line-clamp-2 mb-3 min-h-[3rem] ${isSelected ? "text-primary" : "text-neutral-darkest"
                                            }`}
                                    >
                                        {card.name}
                                    </h3>

                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`w-4 h-4 ${i < Math.floor(card.rating || 0)
                                                            ? "text-yellow-400 fill-current"
                                                            : "text-gray-300 fill-current"
                                                        }`}
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="text-sm font-bold text-neutral-darkest">
                                            {card.rating || "—"}
                                        </span>
                                    </div>

                                    <div className="w-full space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Annual Fee:</span>
                                            <span className="font-semibold text-neutral-darkest">
                                                {card.annualFee || "—"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Credit Score:</span>
                                            <span className="font-medium text-neutral-darkest">
                                                {card.creditScoreText || "—"}
                                            </span>
                                        </div>
                                    </div>

                                    {card.greatFor?.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {card.greatFor.slice(0, 3).map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="text-xs px-2 py-1 bg-green-lightest text-primary rounded-full font-medium"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardBrowseSection;
