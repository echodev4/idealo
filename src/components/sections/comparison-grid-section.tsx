"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
    Plus,
    Star,
    Check,
    X,
    ArrowUpRight,
    BarChart2,
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

const StarRating = ({ rating, max = 5 }: { rating: number; max?: number }) => (
    <div className="flex items-center">
        {[...Array(max)].map((_, i) => {
            const fill = Math.max(0, Math.min(1, rating - i));
            return (
                <div key={i} className="relative h-4 w-4">
                    <Star className="absolute text-[#e0e0e0]" fill="#e0e0e0" size={16} />
                    <div style={{ width: `${fill * 100}%` }} className="absolute overflow-hidden h-4">
                        <Star className="text-[#ffd700]" fill="#ffd700" size={16} />
                    </div>
                </div>
            );
        })}
    </div>
);

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

const ProsConsList = ({ title, items, type }: { title: string; items?: string[]; type: "pros" | "cons" }) => {
    if (!items || items.length === 0) return null;

    const Icon = type === "pros" ? Check : X;
    const color = type === "pros" ? "text-primary" : "text-destructive";

    return (
        <div className="border-t border-border py-4">
            <div className="flex items-center gap-2 mb-2">
                <Icon className={cn("h-5 w-5", color)} />
                <h4 className="text-sm font-semibold text-muted-foreground">{title}</h4>
            </div>
            <ul className="space-y-2">
                {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                        <Icon className={cn("h-4 w-4 mt-1", color)} />
                        <span className="text-[15px] leading-relaxed">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};


const FilledCardSlot = ({ card, onRemove }: { card: CardData & any; onRemove: () => void }) => (
    <div className="flex flex-col h-full bg-white">
        <div className="p-1">
            <button onClick={onRemove} className="block text-right text-sm text-[#0066cc] hover:underline mb-1 ml-auto">
                Remove Card
            </button>

            <Image
                src={card.image}
                alt={card.name}
                width={380}
                height={240}
                className="w-full aspect-[1.586/1] object-cover rounded-lg bg-muted"
            />

            <h3 className="text-lg font-semibold text-neutral-darkest my-4 line-clamp-2 min-h-[3.25rem]">
                {card.name}
            </h3>

            <div className="flex items-center gap-2 mb-4">
                <StarRating rating={card.rating || 0} />
                <span className="font-bold text-base">{card.rating || "—"}</span>
            </div>
        </div>

        <div className="card-content-section">

            {/* Salary Transfer */}
            <div className={cn(styles.cardRow)}>
                <AttributeRow icon={BarChart2} label="Salary Transfer">
                    {card.creditScoreText}
                </AttributeRow>
            </div>

            {/* Annual Fee */}
            <div className={cn(styles.cardRow)}>
                <AttributeRow icon={DollarSign} label="Annual Fee">
                    <ExpandableText text={card.annualFee} />
                </AttributeRow>
            </div>

            {/* Welcome Bonus */}
            <div className={cn(styles.cardRow)}>
                <AttributeRow icon={Gift} label="Welcome Bonus">
                    <ExpandableText text={card.bonusOffers} />
                </AttributeRow>
            </div>

            {/* Earn Rates */}
            <div className={cn(styles.cardRow)}>
                <AttributeRow icon={Percent} label="Earn Rates">
                    <ExpandableText text={card.rewardsRate} />
                </AttributeRow>
            </div>

            {/* Lifestyle Benefits */}
            <div className={cn(styles.cardRow)}>
                <AttributeRow icon={ThumbsUp} label="Lifestyle Benefits">
                    <ExpandableText text={card.lifestyleBenefits} />
                </AttributeRow>
            </div>

            {/* Points Redemption */}
            <div className={cn(styles.cardRow)}>
                <AttributeRow icon={Calendar} label="Points Redemption">
                    <ExpandableText text={card.introAPR} />
                </AttributeRow>
            </div>

            {/* APR */}
            <div className={cn(styles.cardRow)}>
                <AttributeRow icon={TrendingUp} label="APR">
                    {card.ongoingAPR || "—"}
                </AttributeRow>
            </div>

            {/* Documents Required */}
            <div className={cn(styles.cardRow)}>
                <AttributeRow icon={Check} label="Documents Required">
                    <ExpandableText text={card.documentsRequired} />
                </AttributeRow>
            </div>

        </div>

        <div className="mt-6">
            <a
                href={card.applyUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full justify-center gap-2 rounded-md bg-primary py-3.5 px-8 text-base font-bold uppercase text-primary-foreground hover:scale-[1.02] cursor-pointer transition-transform"
            >
                APPLY NOW
                <ArrowUpRight className="h-4 w-4" />
            </a>
        </div>
    </div>
);


const EmptyCardSlot = ({ onClick }: { onClick: () => void }) => (
    <button
        onClick={onClick}
        className="group flex min-h-[400px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#d0d0d0] bg-white py-12 px-6 text-center hover:border-primary"
    >
        <div className="flex h-12 w-12 items-center justify-center rounded-md border-2 border-dashed">
            <Plus className="h-8 w-8 text-[#999999] group-hover:text-primary" />
        </div>
        <p className="mt-4 text-base font-medium text-[#999999] group-hover:text-primary">
            Click to add card
        </p>
    </button>
);

interface Props {
    selectedCards: (CardData | null)[];
    onAddCard: (slotIndex: number) => void;
    onRemoveCard: (slotIndex: number) => void;
}

const ComparisonGridSection = ({ selectedCards, onAddCard, onRemoveCard }: Props) => (
    <section className="bg-white">
        <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
            <div className={styles.comparisonGridContainer}>
                {selectedCards.map((card, i) => (
                    <div key={i}>
                        {card ? (
                            <FilledCardSlot card={card} onRemove={() => onRemoveCard(i)} />
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
