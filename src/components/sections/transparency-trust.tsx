import React from "react";
import { Check, Award, Tag } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

const TransparencyTrust = () => {
    const { t } = useLanguage();

    return (
        <section className="bg-white home-band border-t border-[#E0E0E0]">
            <div className="container">
                <h2 className="text-[20px] font-bold text-[#000000] text-center mb-[40px] leading-[1.25]">
                    {t("landing.trust.title", "Trusted price comparison")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-[32px] mb-[48px]">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-[20px] text-[#666666]">
                            <Tag size={48} strokeWidth={1.5} className="rotate-[135deg]" />
                        </div>
                        <h3 className="text-[16px] font-bold text-[#000000] mb-[12px]">
                            {t("landing.trust.pillar1Title", "Transparent results")}
                        </h3>
                        <p className="text-[14px] leading-[1.6] text-[#666666] max-w-[360px]">
                            {t(
                                "landing.trust.pillar1Body",
                                "We help you compare prices across many stores so you can make confident choices."
                            )}
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <div className="mb-[20px] text-[#666666]">
                            <Award size={48} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-[16px] font-bold text-[#000000] mb-[12px]">
                            {t("landing.trust.pillar2Title", "Plenty of options")}
                        </h3>
                        <p className="text-[14px] leading-[1.6] text-[#666666] max-w-[360px]">
                            {t(
                                "landing.trust.pillar2Body",
                                "Explore products, compare offers, and find the best value for what you need."
                            )}
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <div className="mb-[20px] text-[#666666]">
                            <Award size={48} strokeWidth={1.5} className="fill-current opacity-30" />
                        </div>
                        <h3 className="text-[16px] font-bold text-[#000000] mb-[12px]">
                            {t("landing.trust.pillar3Title", "Quality & reliability")}
                        </h3>
                        <p className="text-[14px] leading-[1.6] text-[#666666] max-w-[360px]">
                            {t(
                                "landing.trust.pillar3Body",
                                "We focus on up-to-date offers and a smooth experience across devices."
                            )}
                        </p>
                    </div>
                </div>

                <div className="bg-[#F8F9FA] rounded-[4px] p-[24px] flex flex-col md:flex-row items-center justify-center gap-[32px] border border-[#E0E0E0]">
                    <div className="border-[2px] border-black bg-white flex flex-col items-center justify-between p-[8px] min-w-[120px] h-[90px] cursor-not-allowed">
                        <div className="text-[18px] font-bold flex items-center leading-none">
                            {t("landing.trust.badgeTop", "CERT")}
                            <span className="text-[10px] ml-1 font-normal">{t("landing.trust.badgeSub", "QUALITY")}</span>
                        </div>
                        <div className="text-[8px] font-bold text-center border-y border-black py-0.5 w-full">
                            {t("landing.trust.badgeMid", "Verified")}
                        </div>
                        <div className="text-[7px] text-center">{t("landing.trust.badgeBottom", "Details coming soon")}</div>
                    </div>

                    <div className="flex flex-col gap-[8px]">
                        <h4 className="text-[16px] font-bold text-[#000000] mb-[4px]">
                            {t("landing.trust.qualityTitle", "Certified quality")}
                        </h4>

                        <div className="grid grid-cols-2 gap-x-[32px] gap-y-[4px]">
                            {[
                                t("landing.trust.q1", "Transparency"),
                                t("landing.trust.q2", "Privacy"),
                                t("landing.trust.q3", "Fresh data"),
                                t("landing.trust.q4", "Search tools"),
                            ].map((label) => (
                                <div key={label} className="flex items-center gap-[8px] text-[14px] text-[#212121]">
                                    <Check size={16} className="text-[#2E7D32]" strokeWidth={3} />
                                    <span>{label}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            className="text-[14px] text-[var(--color-link)] font-medium hover:underline mt-[8px] flex items-center gap-[4px] w-fit cursor-not-allowed"
                            aria-disabled="true"
                            title={t("landing.common.comingSoon", "Coming soon")}
                        >
                            {t("landing.trust.more", "Learn more")}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TransparencyTrust;