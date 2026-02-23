import React from "react";
import { useLanguage } from "@/contexts/language-context";

export default function NewsletterCTA() {
    const { t } = useLanguage();

    return (
        <section className="bg-[var(--background)] home-band w-full flex flex-col items-center justify-center text-center">
            <div className="container">
                <h2 className="text-[20px] font-bold leading-[1.25] text-[#212121] mb-4 mt-0">
                    {t("landing.newsletter.title", "Get deals & updates by email")}
                </h2>

                <div className="flex justify-center">
                    <a href="#" className="btn-idealo-outline cursor-not-allowed">
                        {t("landing.newsletter.cta", "Subscribe to newsletter")}
                    </a>
                </div>
            </div>
        </section>
    );
}