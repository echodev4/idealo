"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { X, Search } from "lucide-react";
import Image from "next/image";
import { CardData } from "@/types/card";

interface CardSelectionModalProps {
    isOpen: boolean;
    cards: (CardData & any)[];
    onClose: () => void;
    onSelectCard: (card: CardData) => void;
}

const CardSelectionModal = ({
    isOpen,
    cards,
    onClose,
    onSelectCard,
}: CardSelectionModalProps) => {
    const [isRendered, setIsRendered] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const filteredCards = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return cards;

        return cards.filter(card =>
            card.name.toLowerCase().includes(q) ||
            card.annualFee?.toLowerCase().includes(q) ||
            card.rewardsRate?.toLowerCase().includes(q)
        );
    }, [cards, searchQuery]);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            document.body.style.overflow = "hidden";
        } else {
            const t = setTimeout(() => {
                setIsRendered(false);
                document.body.style.overflow = "";
                setSearchQuery("");
            }, 150);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };
        if (isRendered) {
            document.addEventListener("keydown", onKeyDown);
            closeButtonRef.current?.focus();
        }
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isRendered, handleClose]);

    if (!isRendered) return null;

    const overlayClasses = isOpen
        ? "animate-in fade-in-0 duration-200"
        : "animate-out fade-out-0 duration-150";

    const modalClasses = isOpen
        ? "animate-in fade-in-0 zoom-in-95 duration-200"
        : "animate-out fade-out-0 zoom-out-95 duration-150";

    return (
        <div
            className={`fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 ${overlayClasses}`}
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                ref={modalRef}
                className={`relative bg-white rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.3)] w-[95vw] max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col ${modalClasses}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border">
                    <button
                        ref={closeButtonRef}
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-neutral-dark hover:text-neutral focus:outline-none focus:ring-2 focus:ring-ring rounded-sm"
                    >
                        <X size={24} />
                    </button>

                    <h2 className="mb-4 text-2xl font-semibold text-neutral-darkest">
                        Select a Credit Card
                    </h2>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="search"
                            placeholder="Search by bank, fee, or earn rate..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {filteredCards.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground text-lg">
                                No cards found matching "{searchQuery}"
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredCards.map((card) => (
                                <button
                                    key={card.id}
                                    onClick={() => onSelectCard(card)}
                                    className="flex flex-col items-start p-4 border border-border rounded-lg hover:border-primary hover:bg-accent/50 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <Image
                                        src={card.image}
                                        alt={card.name}
                                        width={280}
                                        height={176}
                                        className="w-full aspect-[1.586/1] object-cover rounded-md mb-3 bg-muted"
                                    />

                                    <h3 className="text-base font-semibold text-neutral-darkest line-clamp-2 mb-2 group-hover:text-primary">
                                        {card.name}
                                    </h3>

                                    <div className="flex items-center gap-2 text-sm mb-1">
                                        <span className="text-muted-foreground">Rating:</span>
                                        <span className="font-bold">{card.rating || "—"}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm mb-1">
                                        <span className="text-muted-foreground">Annual Fee:</span>
                                        <span className="font-medium">{card.annualFee || "—"}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm mb-1">
                                        <span className="text-muted-foreground">Salary Transfer:</span>
                                        <span className="font-medium">
                                            {card.creditScoreText || "—"}
                                        </span>
                                    </div>

                                    <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                        {card.rewardsRate || ""}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardSelectionModal;
