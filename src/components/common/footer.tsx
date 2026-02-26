"use client";

import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

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
    const cols: Array<{ title: string; links: FooterLink[] }> = [
        {
            title: "idealo",
            links: [
                { label: "About Us", href: "#" },
                { label: "sustainability", href: "#" },
                { label: "Disposal of old appliances", href: "#" },
                { label: "press", href: "#" },
                { label: "Jobs", href: "#" },
                { label: "Friends", href: "#" },
            ],
        },
        {
            title: "Trip",
            links: [{ label: "Flight price comparison", href: "#" }],
        },
        {
            title: "Business",
            links: [
                { label: "dealers", href: "#" },
                { label: "service provider", href: "#" },
                { label: "Shop registration", href: "#" },
                { label: "Affiliate Partner Program", href: "#" },
                { label: "idealo Partner Magazine", href: "#" },
            ],
        },
        {
            title: "Follow us",
            links: [
                { label: "Newsletter", href: "#" },
                { label: "idealo magazine", href: "#" },
                { label: "Facebook", href: "#" },
                { label: "Instagram", href: "#" },
            ],
        },
    ];

    const legalLinks: FooterLink[] = [
        { label: "Data protection", href: "#" },
        { label: "Privacy", href: "#" },
        { label: "Legal Notice / Terms and Conditions", href: "#" },
        { label: "Accessibility", href: "#" },
    ];

    const countries: FooterLink[] = [
        { label: "Austria", href: "#" },
        { label: "Great Britain", href: "#" },
        { label: "Spain", href: "#" },
        { label: "France", href: "#" },
        { label: "Italy", href: "#" },
    ];

    return (
        <footer className="w-full bg-[#0A3761] text-white">
            <div className="max-w-[1280px] mx-auto px-3 lg:px-0 pt-10 lg:pt-12 pb-8">
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-x-14 gap-y-10">
                    {cols.map((col) => (
                        <div key={col.title}>
                            <div className="text-[16px] font-bold mb-5">{col.title}</div>
                            <ul className="space-y-3">
                                {col.links.map((l) => (
                                    <li key={l.label}>
                                        <PreventLink
                                            href={l.href}
                                            className="text-[15px] text-white/80 hover:text-white hover:underline cursor-not-allowed"
                                        >
                                            {l.label}
                                        </PreventLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="md:hidden">
                    <Accordion type="single" collapsible className="w-full space-y-3">
                        {cols.map((col) => (
                            <AccordionItem
                                key={col.title}
                                value={col.title}
                                className="border-0 rounded-[2px] overflow-hidden bg-[#082F54]"
                            >
                                <AccordionTrigger className="px-4 py-4 text-left text-[16px] font-bold text-white hover:no-underline [&[data-state=open]>svg]:rotate-180 [&>svg]:text-white/75 [&>svg]:h-5 [&>svg]:w-5">
                                    {col.title}
                                </AccordionTrigger>
                                <AccordionContent className="px-4 pb-4 pt-0">
                                    <ul className="space-y-3">
                                        {col.links.map((l) => (
                                            <li key={l.label}>
                                                <PreventLink
                                                    href={l.href}
                                                    className="text-[15px] text-white/85 hover:text-white hover:underline cursor-not-allowed"
                                                >
                                                    {l.label}
                                                </PreventLink>
                                            </li>
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <div className="mt-8 text-center">
                        <div className="text-[16px] font-bold leading-snug px-4">
                            Bring the idealo price comparison to your smartphone!
                        </div>

                        <div className="mt-4 flex items-center justify-center gap-3">
                            <a
                                href="#"
                                onClick={(e) => e.preventDefault()}
                                aria-disabled="true"
                                className="cursor-not-allowed"
                            >
                                <img
                                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                                    alt="App Store"
                                    className="h-10 w-auto"
                                />
                            </a>
                            <a
                                href="#"
                                onClick={(e) => e.preventDefault()}
                                aria-disabled="true"
                                className="cursor-not-allowed"
                            >
                                <img
                                    src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                                    alt="Google Play"
                                    className="h-10 w-auto"
                                />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-10">
                    <div className="flex flex-wrap justify-center gap-x-2 gap-y-2 text-[13px] text-white/75">
                        {legalLinks.map((l, i) => (
                            <React.Fragment key={l.label}>
                                <PreventLink href={l.href} className="hover:text-white hover:underline cursor-not-allowed">
                                    {l.label}
                                </PreventLink>
                                {i !== legalLinks.length - 1 && <span className="px-1 text-white/40">·</span>}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="mt-4 flex flex-wrap justify-center gap-x-2 gap-y-2 text-[13px] text-white/75">
                        {countries.map((c, i) => (
                            <React.Fragment key={c.label}>
                                <PreventLink href={c.href} className="hover:text-white hover:underline cursor-not-allowed">
                                    {c.label}
                                </PreventLink>
                                {i !== countries.length - 1 && <span className="px-1 text-white/40">·</span>}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="mt-7 text-center text-[12px] leading-[1.55] text-white/70 max-w-[980px] mx-auto">
                        <p className="m-0">
                            All prices are in euros including VAT, plus shipping if applicable. Prices, rankings, delivery times, and
                            shipping costs are subject to change. Delivery times are in days (Monday-Friday, excluding public
                            holidays).
                        </p>
                        <p className="m-0 mt-3">
                            We publish consumer reviews (product opinions) on our website. We have not verified whether these reviews
                            are from consumers who have actually used or purchased the reviewed product, unless the review is marked
                            as "verified opinion."
                        </p>
                        <p className="m-0 mt-3">Further information can be found on the respective product detail page.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}