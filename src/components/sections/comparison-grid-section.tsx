"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
    Plus,
    Check,
    ArrowUpRight,
    ThumbsUp,
    DollarSign,
    Gift,
    Percent,
    Calendar,
    TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CardData } from "@/types/card";
import styles from "@/app/card-comparison/comparison-grid-section.module.css";


const AttributeRow = ({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) => (
    <div className="border-t border-border py-4">
        <div className="flex items-center gap-2 mb-1">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold text-muted-foreground">{label}</h4>
        </div>
        <div className="text-base text-neutral-darkest leading-relaxed">{children}</div>
    </div>
);

const ExpandableText = ({ text }: { text?: string }) => {
    const [open, setOpen] = useState(false);
    if (!text) return <span className="text-muted-foreground">—</span>;

    const needs = text.length > 250;

    return (
        <div>
            <div
                className={cn(
                    "relative overflow-hidden transition-[max-height] duration-300",
                    !open && "max-h-[100px]"
                )}
                style={{ maxHeight: open ? "500px" : "100px" }}
            >
                <p className="whitespace-pre-line">{text}</p>
                {!open && needs && <div className="absolute bottom-0 h-8 w-full bg-gradient-to-t from-white to-transparent" />}
            </div>
            {needs && (
                <button onClick={() => setOpen(!open)} className="mt-2 text-sm font-medium text-[#0066cc] hover:underline">
                    {open ? "Show less" : "Read more"}
                </button>
            )}
        </div>
    );
};



const FilledCardSlot = ({
    card,
    onRemove,
    setApplyCard,
    setOpenApply
}: {
    card: any;
    onRemove: () => void;
    setApplyCard: any
    setOpenApply: any
}) => {
    return (
        <div className="flex h-[720px] flex-col overflow-hidden rounded-lg border bg-white">
            <div className="sticky top-0 z-10 bg-white border-b px-4 pt-3 pb-4">
                <button
                    onClick={onRemove}
                    className="ml-auto mb-2 block text-sm text-[#0066cc] hover:underline"
                >
                    Remove Card
                </button>

                <Image
                    src={card.cardImageUrl}
                    alt={card.bankName}
                    width={320}
                    height={200}
                    className="mx-auto aspect-[1.586/1] w-full max-w-[260px] rounded-md object-cover bg-gray-100"
                />

                <h3 className="mt-4 text-center text-base font-semibold leading-snug">
                    {card.bankName} Credit Card
                </h3>

                <p className="text-center text-sm text-neutral-500 mt-1">
                    Salary Transfer:{" "}
                    <span className="font-semibold text-neutral-800">
                        {card.salaryTransferRequired ? "Required" : "Not Required"}
                    </span>
                </p>

                <p
                    onClick={() => {
                        setApplyCard(card)
                        setOpenApply(true)
                    }}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-bold text-primary-foreground hover:opacity-95 cursor-pointer"
                >
                    APPLY NOW
                    <ArrowUpRight className="h-4 w-4" />
                </p>
            </div>

            {/* 🔵 SCROLLABLE BODY */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
                <AttributeRow icon={DollarSign} label="Annual Fee">
                    <ExpandableText text={card.joiningAnnualFee} />
                </AttributeRow>

                {card.welcomeBonus && card.welcomeBonus !== "-" && (
                    <AttributeRow icon={Gift} label="Welcome Bonus">
                        <ExpandableText text={card.welcomeBonus} />
                    </AttributeRow>
                )}

                <AttributeRow icon={Percent} label="Earn Rates">
                    <ExpandableText text={card.earnRates} />
                </AttributeRow>

                <AttributeRow icon={ThumbsUp} label="Lifestyle Benefits">
                    <ExpandableText text={card.keyLifestyleBenefits} />
                </AttributeRow>

                <AttributeRow icon={Calendar} label="Points Redemption">
                    <ExpandableText text={card.pointsRedemption} />
                </AttributeRow>

                <AttributeRow icon={TrendingUp} label="APR">
                    {card.apr || "—"}
                </AttributeRow>

                <AttributeRow icon={Check} label="Documents Required">
                    <ExpandableText text={card.documentsRequired} />
                </AttributeRow>
            </div>
        </div>
    );
};



const EmptyCardSlot = ({ onClick }: { onClick: () => void }) => (
    <button
        onClick={onClick}
        className="group flex min-h-[240px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#d0d0d0] bg-white py-8 px-4 text-center hover:border-primary transition"
    >
        <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-dashed">
            <Plus className="h-6 w-6 text-[#999999] group-hover:text-primary" />
        </div>
        <p className="mt-3 text-sm font-medium text-[#999999] group-hover:text-primary">
            Click to add card
        </p>
    </button>
);


interface Props {
    selectedCards: (CardData | null)[];
    onAddCard: (slotIndex: number) => void;
    onRemoveCard: (slotIndex: number) => void;
    setApplyCard: any
    setOpenApply: any
}

const ComparisonGridSection = ({ selectedCards, onAddCard, onRemoveCard, setApplyCard, setOpenApply }: Props) => (
    <section className="bg-white py-4">
        <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
            <div className={styles.comparisonGridContainer}>
                {selectedCards.map((card, i) => (
                    <div key={i}>
                        {card ? (
                            <FilledCardSlot setApplyCard={setApplyCard} setOpenApply={setOpenApply} card={card} onRemove={() => onRemoveCard(i)} />
                        ) : (
                            <EmptyCardSlot onClick={() => onAddCard(i)} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default ComparisonGridSection;
