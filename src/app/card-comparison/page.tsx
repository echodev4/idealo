"use client";

import { useEffect, useState } from "react";
import PageHeroTitle from "@/components/card-comparison/page-hero-title";
import CardSelectionModal from "@/components/card-comparison/card-selection-modal";
import ComparisonGridSection from "@/components/card-comparison/comparison-grid-section";
import CardBrowseSection from "@/components/card-comparison/card-browse-section";
import ApplyCardModal from "@/components/card-comparison/ApplyCardModal";
import type { CardData } from "@/types/card";

type Card = {
    _id: string;
    bankName: string;
    joiningAnnualFee: string;
    apr: string;
    salaryTransferRequired: boolean;
    welcomeBonus: string;
    earnRates: string;
    keyLifestyleBenefits: string;
    pointsRedemption: string;
    documentsRequired: string;
    cardImageUrl: string;
};

export default function Home() {
    const [cards, setCards] = useState<CardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
    const [selectedCards, setSelectedCards] = useState<(Card | null)[]>([null, null, null]);

    const [applyCard, setApplyCard] = useState<Card | null>(null);
    const [openApply, setOpenApply] = useState(false);

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
        <main className="flex flex-col bg-white">
            {applyCard && (
                <ApplyCardModal
                    open={openApply}
                    onClose={() => {
                        setOpenApply(false);
                        setApplyCard(null);
                    }}
                    card={{
                        _id: applyCard._id,
                        bankName: applyCard.bankName,
                        cardImageUrl: applyCard.cardImageUrl,
                        title: `${applyCard.bankName} Credit Card`,
                        minSalaryText: "AED 5,000",
                    }}
                />
            )}


            <PageHeroTitle />

            <div className="mt-2">
                <ComparisonGridSection
                    selectedCards={selectedCards as any}
                    onAddCard={handleAddCard}
                    onRemoveCard={handleRemoveCard}
                    setApplyCard={setApplyCard}
                    setOpenApply={setOpenApply}
                />
            </div>
            <div className="mt-2">

                <CardBrowseSection
                    cards={cards as any}
                    onSelectCard={handleSelectCard as any}
                    selectedCardIds={selectedCardIds}
                    setApplyCard={setApplyCard}
                    setOpenApply={setOpenApply}
                />
            </div>


            <div className="mt-2">
                <CardSelectionModal
                    isOpen={isModalOpen}
                    cards={cards}
                    selectedCardIds={selectedCardIds}
                    onClose={() => setIsModalOpen(false)}
                    onSelectCard={handleSelectCard}
                />
            </div>

        </main>
    );
}
