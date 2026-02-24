"use client";

import Image from "next/image";
import { Tag, Award, Trophy, Check } from "lucide-react";

export default function TransparencyTrust() {
    return (
        <section className="bg-white border-t border-[#E0E0E0]">
            <div className="container max-w-[1280px] mx-auto px-3 lg:px-0 py-10 lg:py-14">
                <h2 className="text-[22px] lg:text-[30px] font-normal text-[#6B6B6B] text-center mb-10 lg:mb-14">
                    idealo – The No. 1 in price comparison
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
                    <div className="text-center">
                        <div className="flex justify-center mb-5 text-[#9DB4CC]">
                            <Tag size={54} strokeWidth={1.5} className="rotate-[135deg]" />
                        </div>
                        <h3 className="text-[16px] font-bold text-[#1F1F1F] mb-3">Transparency for you</h3>
                        <p className="text-[14px] leading-[1.7] text-[#6B6B6B] max-w-[360px] mx-auto">
                            It&apos;s important to us that you always feel good about your shopping experience. Our mission is to
                            create transparency for you among millions of online offers. Ensuring you can always confidently make the
                            best purchase decision for everything you need is our top priority. We don&apos;t have to sell you
                            anything and we don&apos;t have a warehouse to clear. That&apos;s why we always give you objective
                            advice. The retailers listed with us pay a small commission for our service. Using idealo is free for you,
                            and it will stay that way.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="flex justify-center mb-5 text-[#9DB4CC]">
                            <Award size={54} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-[16px] font-bold text-[#1F1F1F] mb-3">Endless possibilities</h3>
                        <p className="text-[14px] leading-[1.7] text-[#6B6B6B] max-w-[360px] mx-auto">
                            With over 600 million offers from around 50,000 retailers in our price comparison tool, you have a
                            comprehensive overview of the market. Whatever you&apos;re looking for, we&apos;re sure to have it. At
                            the best price. Finding your perfect offer is easy thanks to our extensive filter and sorting functions.
                            Our test reports, user reviews, and buying guides ensure you&apos;re always making the best purchase
                            decision, because quality, just like price, is essential. Wishlists and price alerts make shopping for
                            bargains simple and convenient. You decide what you want to buy and from whom. Use our app on the go.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="flex justify-center mb-5 text-[#9DB4CC]">
                            <Trophy size={54} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-[16px] font-bold text-[#1F1F1F] mb-3">Excellent</h3>
                        <p className="text-[14px] leading-[1.7] text-[#6B6B6B] max-w-[360px] mx-auto">
                            We excel at what we do and consistently win awards for our reliability and service. Furthermore, TÜV
                            Saarland awarded us the &quot;Certified Comparison Portal&quot; seal for transparency, up-to-dateness,
                            data protection, and quality (06/2024), making us the first price comparison site to receive this
                            distinction. We are delighted that TÜV has certified our work as a price comparison platform. This
                            doesn&apos;t change the fact that around 700 employees from nearly 60 nations work daily to make shopping
                            easy, worry-free, and secure for you, and to continuously improve idealo.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-[#9FB6CD] border-t border-[#0A2B45]">
                <div className="container max-w-[1280px] mx-auto px-3 lg:px-0 py-8 lg:py-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8 lg:gap-12">
                        <div className="relative w-[180px] h-[90px] md:w-[210px] md:h-[105px] flex-shrink-0 bg-white/20">
                            <Image
                                src="https://cdn.idealo.com/storage/ids-assets/png/tuev_saarland_202406.png"
                                alt="TÜV Saarland"
                                fill
                                sizes="210px"
                                className="object-contain"
                            />
                        </div>

                        <div className="flex-1">
                            <div className="text-[#0A2B45] text-[18px] font-bold mb-3">certified quality</div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-10 text-[#0A2B45] text-[14px]">
                                <div className="flex items-center gap-2">
                                    <Check size={16} className="text-[#0A2B45]" strokeWidth={3} />
                                    <span>transparency</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check size={16} className="text-[#0A2B45]" strokeWidth={3} />
                                    <span>Data protection</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check size={16} className="text-[#0A2B45]" strokeWidth={3} />
                                    <span>Timeliness</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check size={16} className="text-[#0A2B45]" strokeWidth={3} />
                                    <span>Search options</span>
                                </div>
                            </div>

                            <div className="mt-3">
                                <span className="text-[#0A2B45] underline cursor-not-allowed select-none">More information</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}