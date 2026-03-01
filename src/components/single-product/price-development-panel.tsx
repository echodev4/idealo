"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

function Sparkline() {
    return (
        <svg viewBox="0 0 420 160" className="w-full h-[140px]">
            <path
                d="M0,100 L40,100 L70,45 L110,45 L150,45 L185,45 L220,75 L250,75 L285,75 L320,40 L350,40 L380,70 L400,52 L420,66"
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
    const [active, setActive] = React.useState<"3M" | "6M" | "1Y">("3M");

    return (
        <section className="w-full">
            <div className="flex items-center justify-between gap-3">
                <div className="text-[14px] font-semibold text-[#111827]">Price development</div>

                <div className="flex items-center gap-1">
                    {(["3M", "6M", "1Y"] as const).map((k) => {
                        const selected = k === active;
                        return (
                            <button
                                key={k}
                                type="button"
                                onClick={() => setActive(k)}
                                className={cn(
                                    "h-7 px-2.5 rounded-[3px] text-[12px] font-semibold border",
                                    selected ? "bg-[#1a73e8] text-white border-[#1a73e8]" : "bg-white text-[#1a73e8] border-[#1a73e8]"
                                )}
                            >
                                {k === "1Y" ? "1 y" : k}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-3 bg-[#f3f4f6] rounded-[3px] px-3 pt-3 pb-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-[68%] border-l border-dashed border-[#cbd5e1]" />
                    <Sparkline />
                </div>

                <div className="mt-3 flex justify-center">
                    <button
                        type="button"
                        onClick={(e) => e.preventDefault()}
                        className="inline-flex items-center justify-center gap-2 h-10 px-8 rounded-[3px] border border-[#1a73e8] bg-white text-[#1a73e8] font-semibold text-[13px] cursor-not-allowed"
                    >
                        <Bell className="w-4 h-4" />
                        Price alerts
                    </button>
                </div>
            </div>
        </section>
    );
}