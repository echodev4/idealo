"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

type FooterLink = { label: string; href: string };

const FooterButton = ({
    className,
    children,
    onClick,
}: {
    className: string;
    children: React.ReactNode;
    onClick?: () => void;
}) => (
    <button
        type="button"
        className={className}
        onClick={onClick}
    >
        {children}
    </button>
);

export default function Footer() {
    const { t } = useLanguage();
    const [contactOpen, setContactOpen] = useState(false);

    const legalLinks: FooterLink[] = [
        { label: "About Us", href: "#" },
        { label: "Terms and Conditions", href: "#" },
        { label: "Privacy Policy", href: "#" },
        { label: "Contact Us", href: "contact" },
    ];

    return (
        <footer className="w-full bg-[#0A3761] text-white">
            <div className="max-w-[1280px] mx-auto px-3 lg:px-0 pt-10 lg:pt-12 pb-8">
                <div>
                    <div className="flex flex-wrap justify-center gap-x-2 gap-y-2 text-[13px] text-white/75">
                        {legalLinks.map((l, i) => (
                            <React.Fragment key={l.label}>
                                <FooterButton
                                    className="hover:text-white hover:underline"
                                    onClick={l.href === "contact" ? () => setContactOpen(true) : undefined}
                                >
                                    {l.label}
                                </FooterButton>
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
            {contactOpen ? (
                <div
                    className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/50 px-4"
                    onClick={() => setContactOpen(false)}
                >
                    <div
                        className="w-full max-w-[520px] rounded-[8px] bg-white p-6 text-[#06163a] shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="mb-5 flex items-center justify-between gap-4">
                            <h2 className="text-[22px] font-bold">Contact Us</h2>
                            <button
                                type="button"
                                className="grid h-9 w-9 place-items-center rounded-full text-[#526175] hover:bg-[#f1f3f5]"
                                onClick={() => setContactOpen(false)}
                                aria-label="Close contact form"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <form
                            className="space-y-4"
                            onSubmit={(event) => {
                                event.preventDefault();
                                setContactOpen(false);
                            }}
                        >
                            <label className="block">
                                <span className="mb-1 block text-[13px] font-bold">Name</span>
                                <input className="h-11 w-full rounded-[6px] border border-[#d1d5db] px-3 outline-none focus:border-[#ff6600] focus:ring-2 focus:ring-[#ff6600]/15" required />
                            </label>
                            <label className="block">
                                <span className="mb-1 block text-[13px] font-bold">Email</span>
                                <input type="email" className="h-11 w-full rounded-[6px] border border-[#d1d5db] px-3 outline-none focus:border-[#ff6600] focus:ring-2 focus:ring-[#ff6600]/15" required />
                            </label>
                            <label className="block">
                                <span className="mb-1 block text-[13px] font-bold">Message</span>
                                <textarea className="min-h-[120px] w-full resize-y rounded-[6px] border border-[#d1d5db] px-3 py-2 outline-none focus:border-[#ff6600] focus:ring-2 focus:ring-[#ff6600]/15" required />
                            </label>
                            <button
                                type="submit"
                                className="inline-flex h-11 items-center justify-center rounded-[6px] bg-[#ff6600] px-6 text-[15px] font-bold text-white hover:bg-[#ea5f00]"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            ) : null}
        </footer>
    );
}

