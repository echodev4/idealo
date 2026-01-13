"use client";

import { useEffect, useState } from "react";
import PageHeroTitle from "@/components/sections/page-hero-title";
import CardSelectionModal from "@/components/sections/card-selection-modal";
import ComparisonGridSection from "@/components/sections/comparison-grid-section";
import CardBrowseSection from "@/components/sections/card-browse-section";
import type { CardData } from "@/types/card";

function mapDbCard(c: any): CardData {
    return {
        id: c._id,
        name: `${c.bankName} ${c.cardName ?? ""}`.trim(),
        image: c.cardImageUrl,
        rating: 4.2,
        creditScoreText: "Good to Excellent",
        greatFor: [],
        annualFee: c.joiningAnnualFee,
        bonusOffers: c.welcomeBonus,
        rewardsRate: c.earnRates,
        introAPR: "",
        ongoingAPR: c.apr,
        pros: [],
        cons: [],
        applyUrl: "#",
    };
}

export default function Home() {
    const [cards, setCards] = useState<CardData[]>([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
    const [selectedCards, setSelectedCards] = useState<(CardData | null)[]>([null, null, null]);

    useEffect(() => {
        fetch("/api/cards")
            .then(res => res.json())
            .then(data => {
                setCards(data.items.map(mapDbCard));
                setLoading(false);
            });
    }, []);

    const handleAddCard = (slotIndex: number) => {
        setSelectedSlotIndex(slotIndex);
        setIsModalOpen(true);
    };

    const handleSelectCard = (card: CardData) => {
        const emptySlotIndex = selectedCards.findIndex(c => c === null);
        if (emptySlotIndex !== -1) {
            const next = [...selectedCards];
            next[emptySlotIndex] = card;
            setSelectedCards(next);
        }
        setIsModalOpen(false);
        setSelectedSlotIndex(null);
    };

    const handleRemoveCard = (slotIndex: number) => {
        const next = [...selectedCards];
        next[slotIndex] = null;
        setSelectedCards(next);
    };

    const selectedCardIds = selectedCards
        .filter(Boolean)
        .map(c => c!.id);

    if (loading) {
        return <div className="py-20 text-center">Loading cards…</div>;
    }

    return (
        <main className="flex flex-col">
            <PageHeroTitle />

            <div className="py-8 md:py-12 lg:py-16">
                <ComparisonGridSection
                    selectedCards={selectedCards}
                    onAddCard={handleAddCard}
                    onRemoveCard={handleRemoveCard}
                />
            </div>

            <CardBrowseSection
                cards={cards}
                onSelectCard={handleSelectCard}
                selectedCardIds={selectedCardIds}
            />

            <CardSelectionModal
                isOpen={isModalOpen}
                cards={cards}
                onClose={() => setIsModalOpen(false)}
                onSelectCard={handleSelectCard}
            />
        </main>
    );
}
