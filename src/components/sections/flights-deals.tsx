import React from "react";
import { Plane, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

const flightDeals = [
    {
        from: "Bremen",
        to: "Rhodes",
        dates: "08.04.2026 – 15.04.2026",
        type: "Return flight, 1 stop",
        oldPrice: "180 €",
        currentPrice: "146 €",
        discount: "-19 %",
        imageUrl:
            "https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        destSub: "Rhodes",
    },
    {
        from: "Berlin",
        to: "Oviedo",
        dates: "14.04.2026 – 19.04.2026",
        type: "Return flight, 1 stop",
        oldPrice: "123 €",
        currentPrice: "99 €",
        discount: "-20 %",
        imageUrl:
            "https://images.unsplash.com/photo-1543783232-af41011617e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        destSub: "Oviedo",
    },
    {
        from: "Frankfurt",
        to: "New York Newark",
        dates: "30.06.2026 – 06.07.2026",
        type: "Return flight, direct",
        oldPrice: "432 €",
        currentPrice: "386 €",
        discount: "-11 %",
        imageUrl:
            "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        destSub: "Newark",
    },
    {
        from: "Munich",
        to: "Rome Ciampino",
        dates: "12.05.2026 – 15.05.2026",
        type: "Return flight, 1 stop",
        oldPrice: "210 €",
        currentPrice: "182 €",
        discount: "-13 %",
        imageUrl:
            "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        destSub: "Rome",
    },
    {
        from: "Nuremberg",
        to: "Chania",
        dates: "19.05.2026 – 26.05.2026",
        type: "Return flight, direct",
        oldPrice: "140 €",
        currentPrice: "99 €",
        discount: "-29 %",
        imageUrl:
            "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        destSub: "Chania",
    },
    {
        from: "Berlin",
        to: "Milan Malpensa",
        dates: "13.04.2026 – 20.04.2026",
        type: "Return flight, direct",
        oldPrice: "112 €",
        currentPrice: "84 €",
        discount: "-25 %",
        imageUrl:
            "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        destSub: "Milan",
    },
];

const flightLinks = [
    { name: "Flights to Mallorca", price: "13 €" },
    { name: "Flights to Dubai", price: "86 €" },
    { name: "Flights to Hurghada", price: "54 €" },
    { name: "Flights to Pisa", price: "16 €" },
    { name: "Flights to Antalya", price: "35 €" },
    { name: "Flights to Split", price: "34 €" },
    { name: "Flights to Crete (Heraklion)", price: "40 €" },
    { name: "Flights to Tenerife South", price: "17 €" },
    { name: "Flights to New York", price: "218 €" },
    { name: "Flights to Fuerteventura", price: "20 €" },
    { name: "Flights to Kos", price: "44 €" },
    { name: "Flights to Malé", price: "249 €" },
];

export default function FlightsDeals() {
    const { t } = useLanguage();

    return (
        <section className="bg-[var(--background)] home-band">
            <div className="container">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-4">
                    <h2 className="text-[20px] font-bold text-[#000000] m-0">
                        {t("landing.flights.title", "Travel deals")}
                    </h2>

                    <button
                        type="button"
                        className="flex items-center gap-1 text-[13px] font-medium text-[var(--color-link)] border border-[#DEE2E6] px-3 py-1.5 rounded-[4px] bg-white hover:bg-gray-50 transition-colors cursor-not-allowed"
                        aria-disabled="true"
                    >
                        {t("landing.flights.cta", "See last-minute flight deals")}
                        <Plane size={14} className="rotate-45" />
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[8px] mb-8">
                    {flightDeals.map((deal, idx) => (
                        <div
                            key={idx}
                            className="card-idealo overflow-hidden flex flex-col cursor-not-allowed"
                            title={t("landing.common.comingSoon", "Coming soon")}
                        >
                            <div className="relative h-[80px] w-full">
                                <img src={deal.imageUrl} alt={deal.to} className="w-full h-full object-cover" />
                                <div className="absolute top-0 left-0 bg-[#F17720] text-white text-[10px] font-bold px-1 py-0.5 m-1 rounded-[3px]">
                                    {deal.discount}
                                </div>
                                <div className="absolute bottom-1 left-2 text-white text-[11px] font-medium drop-shadow-md">
                                    {deal.destSub}
                                </div>
                            </div>

                            <div className="p-3 flex flex-col flex-grow">
                                <h3 className="text-[14px] font-bold text-[#212121] leading-tight mb-1 truncate">
                                    {deal.from} ↔ {deal.to}
                                </h3>
                                <p className="text-[11px] text-[#666666] mb-2">{deal.dates}</p>

                                <div className="mt-auto">
                                    <p className="text-[10px] text-[#666666] leading-snug mb-2">
                                        {deal.type}
                                    </p>

                                    <div className="flex justify-between items-baseline">
                                        <span className="text-[11px] text-[#666666] line-through">
                                            {t("landing.common.from", "from")} {deal.oldPrice}
                                        </span>
                                        <span className="text-[16px] font-bold text-[#F17720]">
                                            {t("landing.common.from", "from")} {deal.currentPrice}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <h2 className="text-[16px] font-bold text-[#212121] mb-4">
                    {t(
                        "landing.flights.linksTitle",
                        "Compare flight offers from airlines worldwide"
                    )}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2">
                    {flightLinks.map((link, idx) => (
                        <button
                            key={idx}
                            type="button"
                            className="flex justify-between items-center py-2 px-3 bg-[#F1F3F5] rounded-[4px] border border-transparent hover:border-[#CED4DA] transition-colors group cursor-not-allowed text-left"
                            aria-disabled="true"
                            title={t("landing.common.comingSoon", "Coming soon")}
                        >
                            <div className="flex items-center gap-2">
                                <Plane size={14} className="text-[#666666] rotate-45 group-hover:text-[var(--color-link)]" />
                                <span className="text-[13px] text-[#212121] font-medium">{link.name}</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <span className="text-[12px] text-[#666666]">
                                    {t("landing.common.from", "from")} {link.price}
                                </span>
                                <ChevronRight size={14} className="text-[#ADB5BD]" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}