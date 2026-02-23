import React from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-context";

const trendingItems = [
    {
        id: 1,
        titleKey: "landing.trending.item1",
        fallback: "Snow shovel",
        image:
            "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c4edb08b-0b16-4a29-bec7-c89ea14040c9-idealo-de/assets/images/240x200-29.jpg",
    },
    {
        id: 2,
        titleKey: "landing.trending.item2",
        fallback: "Snow blower",
        image:
            "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c4edb08b-0b16-4a29-bec7-c89ea14040c9-idealo-de/assets/images/240x200-30.jpg",
    },
    {
        id: 3,
        titleKey: "landing.trending.item3",
        fallback: "Game consoles",
        image:
            "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c4edb08b-0b16-4a29-bec7-c89ea14040c9-idealo-de/assets/images/roborock-saros-10r-21.jpg",
    },
    {
        id: 4,
        titleKey: "landing.trending.item4",
        fallback: "Study books",
        image:
            "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c4edb08b-0b16-4a29-bec7-c89ea14040c9-idealo-de/assets/images/240x200-29.jpg",
    },
    {
        id: 5,
        titleKey: "landing.trending.item5",
        fallback: "Cookbooks",
        image:
            "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c4edb08b-0b16-4a29-bec7-c89ea14040c9-idealo-de/assets/images/240x200-30.jpg",
    },
    {
        id: 6,
        titleKey: "landing.trending.item6",
        fallback: "Storage drives",
        image:
            "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c4edb08b-0b16-4a29-bec7-c89ea14040c9-idealo-de/assets/images/roborock-saros-10r-21.jpg",
    },
];

const TrendingProducts = () => {
    const { t } = useLanguage();

    return (
        <section className="home-band bg-white overflow-hidden">
            <div className="container">
                <h2 className="text-[20px] font-bold text-[#212121] mb-4">
                    {t("landing.trending.title", "Trending now")}
                </h2>

                <div className="relative group">
                    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar scroll-smooth">
                        {trendingItems.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                className="flex-shrink-0 w-[140px] md:w-[160px] cursor-not-allowed group/item text-left"
                                aria-disabled="true"
                                title={t("landing.common.comingSoon", "Coming soon")}
                            >
                                <div className="relative w-full aspect-square mb-2 bg-[var(--background)] rounded-[4px] border border-[#E0E0E0] p-4 flex items-center justify-center transition-shadow hover:shadow-card">
                                    <div className="w-full h-full relative">
                                        <Image
                                            src={item.image}
                                            alt={t(item.titleKey, item.fallback)}
                                            fill
                                            className="object-contain mix-blend-multiply"
                                            sizes="(max-width: 768px) 140px, 160px"
                                        />
                                    </div>
                                </div>

                                <p className="text-[14px] leading-[1.4] text-center text-[#212121] group-hover/item:text-[var(--color-link)] transition-colors line-clamp-2">
                                    {t(item.titleKey, item.fallback)}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrendingProducts;