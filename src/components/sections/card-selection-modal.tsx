"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { CardData } from "@/types/card";

interface Props {
    isOpen: boolean;
    cards: CardData[];
    selectedCardIds: string[];
    onClose: () => void;
    onSelectCard: (card: CardData) => void;
}


/* helpers */
const splitList = (text?: string) =>
    text
        ? text.split(/\n|;/g).map((t) => t.trim()).filter(Boolean)
        : [];

export default function CardSelectionModal({
    isOpen,
    cards,
    onClose,
    onSelectCard,
    selectedCardIds
}: Props) {
    const [isRendered, setIsRendered] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const closeBtnRef = useRef<HTMLButtonElement>(null);


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

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            document.body.style.overflow = "hidden";
            setTimeout(() => closeBtnRef.current?.focus(), 0);
        } else {
            const t = setTimeout(() => {
                setIsRendered(false);
                document.body.style.overflow = "";
                setSearchQuery("");
            }, 150);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    const handleClose = useCallback(() => onClose(), [onClose]);

    useEffect(() => {
        const esc = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
        document.addEventListener("keydown", esc);
        return () => document.removeEventListener("keydown", esc);
    }, [handleClose]);

    if (!isRendered) return null;

    return (
        <div
            className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/50"
            onClick={handleClose}
        >
            <div
                className="bg-white w-[95vw] max-w-[900px] max-h-[90vh] rounded-lg shadow-xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Select a Credit Card</h2>
                    <button
                        ref={closeBtnRef}
                        onClick={handleClose}
                        className="p-2 rounded hover:bg-muted cursor-pointer"
                    >
                        <X />
                    </button>
                </div>

                {/* Search */}
                <div className="p-6 border-b">
                    <input
                        type="search"
                        placeholder="Search by bank name, fee, or earn rate..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-11 px-4 border rounded-md"
                    />
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto p-6">
                    {filteredCards.length === 0 ? (
                        <p className="text-center text-muted-foreground py-12">
                            No cards found
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredCards.map((card) => {
                                const pills = [
                                    ...splitList(card.earnRates),
                                    ...splitList(card.keyLifestyleBenefits),
                                ].slice(0, 3);
                                const isSelected = selectedCardIds.includes(card._id);


                                return (
                                    <button
                                        key={card._id}
                                        disabled={isSelected}
                                        onClick={() => !isSelected && onSelectCard(card)}
                                        className={`text-left border rounded-lg p-4 flex flex-col transition
    ${isSelected
                                                ? "opacity-50 cursor-not-allowed"
                                                : "hover:border-green-600"}
  `}
                                    >
                                        <Image
                                            src={card.cardImageUrl}
                                            alt={card.bankName}
                                            width={300}
                                            height={190}
                                            className="w-full aspect-[1.6/1] object-cover rounded-md mb-3"
                                        />

                                        <p className="text-xs uppercase text-muted-foreground font-semibold">
                                            {card.bankName}
                                        </p>

                                        <div className="grid grid-cols-2 gap-3 mt-2 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">Salary Transfer</p>
                                                <p className="font-semibold">
                                                    {card.salaryTransferRequired
                                                        ? "Required"
                                                        : "Not Required"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Annual Fee</p>
                                                <p className="font-semibold">
                                                    {card.joiningAnnualFee}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {pills.map((p, i) => (
                                                <span
                                                    key={i}
                                                    className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full"
                                                >
                                                    {p}
                                                </span>
                                            ))}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
