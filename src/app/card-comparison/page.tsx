"use client";

import { useEffect, useState } from "react";
import PageHeroTitle from "@/components/sections/page-hero-title";
import CardSelectionModal from "@/components/sections/card-selection-modal";
import ComparisonGridSection from "@/components/sections/comparison-grid-section";
import CardBrowseSection from "@/components/sections/card-browse-section";
import type { CardData } from "@/types/card";

export default function Home() {
    const [cards, setCards] = useState<CardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
    const [selectedCards, setSelectedCards] = useState<(CardData | null)[]>([null, null, null]);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await fetch("/api/cards");
                if (!res.ok) throw new Error(`Failed to load cards (${res.status})`);

                const data = await res.json();
                setCards(data.items || []);
            } catch (e: any) {
                setError(e?.message || "Failed to load cards");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const handleAddCard = (slotIndex: number) => {
        setSelectedSlotIndex(slotIndex);
        setIsModalOpen(true);
    };

    const handleSelectCard = (card: CardData) => {
        // ❌ Block duplicates (hard safety)
        if (selectedCards.some((c) => c?._id === card._id)) {
            setIsModalOpen(false);
            setSelectedSlotIndex(null);
            return;
        }

        const next = [...selectedCards];

        if (selectedSlotIndex !== null) {
            next[selectedSlotIndex] = card;
        } else {
            const emptySlotIndex = next.findIndex((c) => c === null);
            if (emptySlotIndex !== -1) {
                next[emptySlotIndex] = card;
            }
        }

        setSelectedCards(next);
        setIsModalOpen(false);
        setSelectedSlotIndex(null);
    };



    const handleRemoveCard = (slotIndex: number) => {
        const next = [...selectedCards];
        next[slotIndex] = null;
        setSelectedCards(next);
    };

    const selectedCardIds = selectedCards.filter(Boolean).map((c) => c!._id);

    if (loading) return <div className="py-20 text-center">Loading cards…</div>;
    if (error) return <div className="py-20 text-center text-red-600">{error}</div>;

    return (
        <main className="flex flex-col">
            <PageHeroTitle />

            <div className="py-8 md:py-12 lg:py-16">
                <ComparisonGridSection
                    selectedCards={selectedCards as any}
                    onAddCard={handleAddCard}
                    onRemoveCard={handleRemoveCard}
                />
            </div>

            <CardBrowseSection
                cards={cards as any}
                onSelectCard={handleSelectCard as any}
                selectedCardIds={selectedCardIds}
            />

            <CardSelectionModal
                isOpen={isModalOpen}
                cards={cards}
                selectedCardIds={selectedCardIds}
                onClose={() => setIsModalOpen(false)}
                onSelectCard={handleSelectCard}
            />

        </main>
    );
}
