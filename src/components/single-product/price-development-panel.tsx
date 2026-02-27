"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function Sparkline() {
    return (
        <svg viewBox="0 0 420 160" className="w-full h-full">
            <path
                d="M0,92 L30,92 L60,30 L90,30 L120,30 L150,30 L180,60 L210,60 L240,60 L270,25 L300,25 L330,60 L360,40 L390,70 L420,55"
                fill="none"
                stroke="#f97316"
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
        </svg>
    );
}

export default function PriceDevelopmentPanel() {
    const [active, setActive] = React.useState < "3M" | "6M" | "1Y" > ("3M");

    return (
        <section className="w-full">
            <div className="flex items-center justify-between gap-4">
                <div className="text-[16px] font-semibold text-[#111827]">Price development</div>
                <div className="flex items-center gap-1">
                    {(["3M", "6M", "1Y"] as const).map((k) => {
                        const selected = k === active;
                        return (
                            <button
                                key={k}
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActive(k);
                                }}
                                className={cn(
                                    "h-7 px-2.5 rounded text-[12px] font-semibold border",
                                    selected
                                        ? "bg-[#1a73e8] text-white border-[#1a73e8] cursor-not-allowed"
                                        : "bg-white text-[#1a73e8] border-[#1a73e8] cursor-not-allowed"
                                )}
                            >
                                {k === "1Y" ? "1 year" : k}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-3 relative h-[170px] w-full bg-white">
                <div className="absolute inset-0 border-l border-dashed border-[#e5e7eb]" style={{ left: "50%" }} />
                <div className="absolute top-4 left-0 right-0 h-px border-t border-dashed border-[#e5e7eb]" />
                <div className="absolute inset-0 px-2">
                    <Sparkline />
                </div>
            </div>

            <div className="mt-4">
                <button
                    type="button"
                    onClick={(e) => e.preventDefault()}
                    className="w-full h-11 rounded border border-[#1a73e8] bg-white text-[#1a73e8] font-semibold text-[14px] cursor-not-allowed"
                >
                    Price alerts
                </button>
            </div>
        </section>
    );
}