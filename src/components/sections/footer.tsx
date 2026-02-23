import React from "react";
import { useLanguage } from "@/contexts/language-context";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const Footer = () => {
    const { t } = useLanguage();

    const left = {
        title: t("footer.brand", "SubsFaraz"),
        links: [
            { label: t("footer.about", "About us"), href: "#" },
            { label: t("footer.sustainability", "Sustainability"), href: "#" },
            { label: t("footer.press", "Press"), href: "#" },
            { label: t("footer.jobs", "Jobs"), href: "#" },
            { label: t("footer.blog", "Blog"), href: "#" },
        ],
    };

    const middle = [
        {
            title: t("footer.shopping", "Shopping"),
            links: [{ label: t("footer.comparePrices", "Compare prices"), href: "#" }],
        },
        {
            title: t("footer.support", "Customer service"),
            links: [
                { label: t("footer.help", "Help center"), href: "#" },
                { label: t("footer.contact", "Contact us"), href: "#" },
            ],
        },
    ];

    const right = {
        title: t("footer.business", "Business"),
        links: [
            { label: t("footer.retailers", "Retailers"), href: "#" },
            { label: t("footer.partners", "Partners"), href: "#" },
            { label: t("footer.registerShop", "Shop registration"), href: "#" },
            { label: t("footer.affiliates", "Affiliate program"), href: "#" },
        ],
    };

    const follow = {
        title: t("footer.follow", "Follow us"),
        links: [
            { label: t("footer.newsletter", "Newsletter"), href: "#" },
            { label: t("footer.instagram", "Instagram"), href: "#" },
            { label: t("footer.facebook", "Facebook"), href: "#" },
            { label: t("footer.youtube", "YouTube"), href: "#" },
        ],
    };

    const mobileColumns = [left, ...middle, right, follow];

    return (
        <footer className="w-full bg-[#0A3761] text-white">
            <div className="border-b border-white/10">
                <div className="container py-4">
                    <p className="text-center text-[13px] leading-[1.4] text-white/90">
                        {t(
                            "footer.ctaLine",
                            "Compare offers across stores and find the best price."
                        )}
                    </p>
                </div>
            </div>

            <div className="container py-10">
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8">
                    <div>
                        <div className="text-[20px] font-bold tracking-tight mb-4">
                            {left.title}
                        </div>
                        <ul className="space-y-2">
                            {left.links.map((l) => (
                                <li key={l.label}>
                                    <a
                                        className="text-[13px] text-white/80 hover:text-white hover:underline cursor-not-allowed"
                                        href={l.href}
                                        aria-disabled="true"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        {l.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-8">
                        {middle.map((col) => (
                            <div key={col.title}>
                                <div className="text-[14px] font-bold mb-3">{col.title}</div>
                                <ul className="space-y-2">
                                    {col.links.map((l) => (
                                        <li key={l.label}>
                                            <a
                                                className="text-[13px] text-white/80 hover:text-white hover:underline cursor-not-allowed"
                                                href={l.href}
                                                aria-disabled="true"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                {l.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div>
                        <div className="text-[14px] font-bold mb-3">{right.title}</div>
                        <ul className="space-y-2">
                            {right.links.map((l) => (
                                <li key={l.label}>
                                    <a
                                        className="text-[13px] text-white/80 hover:text-white hover:underline cursor-not-allowed"
                                        href={l.href}
                                        aria-disabled="true"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        {l.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <div className="text-[14px] font-bold mb-3">{follow.title}</div>
                        <ul className="space-y-2">
                            {follow.links.map((l) => (
                                <li key={l.label}>
                                    <a
                                        className="text-[13px] text-white/80 hover:text-white hover:underline cursor-not-allowed"
                                        href={l.href}
                                        aria-disabled="true"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        {l.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="md:hidden">
                    <div className="text-[20px] font-bold tracking-tight mb-4">
                        {t("footer.brand", "SubsFaraz")}
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                        {mobileColumns.map((col) => (
                            <AccordionItem
                                key={col.title}
                                value={col.title}
                                className="border-white/10"
                            >
                                <AccordionTrigger className="text-left text-[14px] font-bold text-white hover:no-underline">
                                    {col.title}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ul className="space-y-2 pb-2">
                                        {col.links.map((l) => (
                                            <li key={l.label}>
                                                <a
                                                    className="text-[13px] text-white/80 hover:text-white hover:underline cursor-not-allowed"
                                                    href={l.href}
                                                    aria-disabled="true"
                                                    onClick={(e) => e.preventDefault()}
                                                >
                                                    {l.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>

            <div className="border-t border-white/10">
                <div className="container py-5">
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[12px] text-white/70">
                        {[
                            { key: "footer.imprint", fallback: "Imprint" },
                            { key: "footer.privacy", fallback: "Privacy" },
                            { key: "footer.terms", fallback: "Terms" },
                            { key: "footer.cookies", fallback: "Cookies" },
                        ].map((item) => (
                            <a
                                key={item.key}
                                href="#"
                                className="hover:text-white transition-colors cursor-not-allowed"
                                aria-disabled="true"
                                onClick={(e) => e.preventDefault()}
                            >
                                {t(item.key, item.fallback)}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;