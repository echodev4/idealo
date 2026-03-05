"use client";

import React from "react";
import { useLanguage } from "@/contexts/language-context";

type FooterLink = { label: string; href: string };

const PreventLink = ({
    href,
    className,
    children,
}: {
    href: string;
    className: string;
    children: React.ReactNode;
}) => (
    <a
        href={href}
        className={className}
        aria-disabled="true"
        onClick={(e) => e.preventDefault()}
    >
        {children}
    </a>
);

export default function Footer() {
    const { t } = useLanguage();

    const legalLinks: FooterLink[] = [
        { label: t("footer.legalLinks.dataProtection", "Data protection"), href: "#" },
        { label: t("footer.legalLinks.privacy", "Privacy"), href: "#" },
        { label: t("footer.legalLinks.terms", "Legal Notice / Terms and Conditions"), href: "#" },
        { label: t("footer.legalLinks.accessibility", "Accessibility"), href: "#" },
    ];

    return (
        <footer className="w-full bg-[#0A3761] text-white">
            <div className="max-w-[1280px] mx-auto px-3 lg:px-0 pt-10 lg:pt-12 pb-8">
                <div>
                    <div className="flex flex-wrap justify-center gap-x-2 gap-y-2 text-[13px] text-white/75">
                        {legalLinks.map((l, i) => (
                            <React.Fragment key={l.label}>
                                <PreventLink href={l.href} className="hover:text-white hover:underline cursor-not-allowed">
                                    {l.label}
                                </PreventLink>
                                {i !== legalLinks.length - 1 && <span className="px-1 text-white/40">&middot;</span>}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="mt-7 text-center text-[12px] leading-[1.55] text-white/70 max-w-[980px] mx-auto">
                        <p className="m-0">
                            {t(
                                "footer.disclaimer.prices",
                                "All prices are in dirhams including VAT, plus shipping if applicable. Prices, rankings, delivery times, and shipping costs are subject to change. Delivery times are in days (Monday-Friday, excluding public holidays)."
                            )}
                        </p>
                        <p className="m-0 mt-3">
                            {t(
                                "footer.disclaimer.reviews",
                                'We publish consumer reviews (product opinions) on our website. We have not verified whether these reviews are from consumers who have actually used or purchased the reviewed product, unless the review is marked as "verified opinion."'
                            )}
                        </p>
                        <p className="m-0 mt-3">{t("footer.disclaimer.moreInfo", "Further information can be found on the respective product detail page.")}</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

