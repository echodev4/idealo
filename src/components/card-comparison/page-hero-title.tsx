"use client";

import React from "react";
import { useLanguage } from "@/contexts/language-context";

const PageHeroTitle = () => {
    const { t } = useLanguage();

    return (
        <section className="bg-white border-b">
            <div className="mx-auto max-w-[1200px] px-4 py-4 md:py-5 text-center">
                <h1 className="font-serif text-[1.25rem] md:text-[1.5rem] lg:text-[1.75rem] font-medium text-neutral-800">
                    {t("cardComparison.pageHeroTitle.title", "Select the cards you'd like to compare")}
                </h1>
            </div>
        </section>
    );
};

export default PageHeroTitle;
