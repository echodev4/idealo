"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
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

function CardComparisonSkeleton() {
    return (
        <main className="flex flex-1 flex-col bg-white">
            <div className="mx-auto w-full max-w-[1280px] px-4 py-5">
                <div className="mx-auto h-10 w-[min(760px,90vw)] animate-pulse rounded bg-[#eef1f5]" />
                <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="rounded-xl border bg-white p-4 shadow-sm">
                            <div className="mb-4 aspect-[1.6/1] w-full animate-pulse rounded-md bg-[#eef1f5]" />
                            <div className="h-3 w-16 animate-pulse rounded bg-[#eef1f5]" />
                            <div className="mt-3 grid grid-cols-3 gap-4">
                                <div>
                                    <div className="h-3 w-20 animate-pulse rounded bg-[#eef1f5]" />
                                    <div className="mt-2 h-4 w-16 animate-pulse rounded bg-[#eef1f5]" />
                                </div>
                                <div>
                                    <div className="h-3 w-16 animate-pulse rounded bg-[#eef1f5]" />
                                    <div className="mt-2 h-4 w-20 animate-pulse rounded bg-[#eef1f5]" />
                                </div>
                                <div>
                                    <div className="h-3 w-20 animate-pulse rounded bg-[#eef1f5]" />
                                    <div className="mt-2 h-4 w-16 animate-pulse rounded bg-[#eef1f5]" />
                                </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {Array.from({ length: 4 }).map((_, pillIndex) => (
                                    <div
                                        key={pillIndex}
                                        className="h-7 w-24 animate-pulse rounded-full bg-[#eef1f5]"
                                    />
                                ))}
                            </div>
                            <div className="mt-4 rounded-md bg-[#f6f7f9] p-3">
                                <div className="flex items-center justify-between">
                                    <div className="h-4 w-28 animate-pulse rounded bg-[#eef1f5]" />
                                    <ChevronDown size={16} className="text-[#cbd5e1]" />
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <div className="h-12 animate-pulse rounded-xl bg-[#eef1f5]" />
                                <div className="h-12 animate-pulse rounded-xl bg-[#eef1f5]" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 rounded-2xl border bg-gray-50/60 p-6 shadow-sm">
                    <div className="mx-auto h-8 w-56 animate-pulse rounded bg-[#eef1f5]" />
                    <div className="mx-auto mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-[#eef1f5]" />
                    <div className="mx-auto mt-6 h-12 w-full max-w-2xl animate-pulse rounded-lg bg-[#eef1f5]" />
                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="rounded-xl border bg-white p-4 shadow-sm">
                                <div className="mb-3 aspect-[1.6/1] w-full animate-pulse rounded-md bg-[#eef1f5]" />
                                <div className="h-3 w-16 animate-pulse rounded bg-[#eef1f5]" />
                                <div className="mt-3 grid grid-cols-3 gap-3">
                                    <div className="h-10 animate-pulse rounded bg-[#eef1f5]" />
                                    <div className="h-10 animate-pulse rounded bg-[#eef1f5]" />
                                    <div className="h-10 animate-pulse rounded bg-[#eef1f5]" />
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {Array.from({ length: 4 }).map((_, pillIndex) => (
                                        <div
                                            key={pillIndex}
                                            className="h-7 w-24 animate-pulse rounded-full bg-[#eef1f5]"
                                        />
                                    ))}
                                </div>
                                <div className="mt-4 h-11 animate-pulse rounded-md bg-[#eef1f5]" />
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div className="h-12 animate-pulse rounded-xl bg-[#eef1f5]" />
                                    <div className="h-12 animate-pulse rounded-xl bg-[#eef1f5]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

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

    if (loading) return <CardComparisonSkeleton />;
    if (error) return <div className="py-20 text-center text-red-600">{error}</div>;

    return (
        <main className="flex min-h-full flex-col bg-white">
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
