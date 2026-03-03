"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import ApplyCardModal from "@/components/card-comparison/ApplyCardModal";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import {
    ChevronRight,
    Briefcase,
    Calendar,
    Percent,
    Building2,
    ArrowRight,
} from "lucide-react";

type Card = {
    _id: string;
    bankName: string;
    joiningAnnualFee: string;
    apr: string;
    salaryTransferRequired: boolean;
    welcomeBonus: string;
    earnRates: string;
    keyLifestyleBenefits: string;
    pointsRedemption: string;
    documentsRequired: string;
    cardImageUrl: string;
};

const splitList = (text?: string) =>
    text
        ? text
            .split(/\n|;/g)
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

export default function CardDetailsPage() {
    const { t } = useLanguage();
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [card, setCard] = useState<Card | null>(null);
    const [error, setError] = useState("");
    const [openApply, setOpenApply] = useState(false);

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        fetch(`/api/cards/${id}`)
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || t("cardComparison.cardDetails.errors.failedToLoad", "Failed to load card"));
                return data.item;
            })
            .then((item) => {
                setCard(item);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || t("cardComparison.cardDetails.errors.somethingWentWrong", "Something went wrong"));
                setLoading(false);
            });
    }, [id, t]);

    const annualFee = useMemo(
        () => splitList(card?.joiningAnnualFee)[0],
        [card?.joiningAnnualFee]
    );

    if (loading) {
        return <div className="py-20 text-center">{t("cardComparison.cardDetails.loading", "Loading card...")}</div>;
    }

    if (error || !card) {
        return (
            <div className="py-20 text-center">
                <p className="text-red-600 font-semibold mb-4">{error}</p>
                <button
                    onClick={() => router.push("/card-comparison")}
                    className="px-6 py-3 border rounded-md"
                >
                    {t("cardComparison.cardDetails.goBack", "Go Back")}
                </button>
            </div>
        );
    }

    return (
        <main className="bg-[#faf7f1] min-h-screen">
            {card && (
                <ApplyCardModal
                    open={openApply}
                    onClose={() => {
                        setOpenApply(false);
                    }}
                    card={{
                        _id: card._id,
                        bankName: card.bankName,
                        cardImageUrl: card.cardImageUrl,
                        title: `${card.bankName} ${t("cardComparison.cardDetails.creditCard", "Credit Card")}`,
                        minSalaryText: t("cardComparison.cardDetails.minSalaryValue", "AED 5,000"),
                    }}
                />
            )}

            <div className="max-w-[1100px] mx-auto px-4 py-8">
                <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
                    <Link href="/" className="hover:text-neutral-800">{t("cardComparison.cardDetails.breadcrumb.home", "Home")}</Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href="/card-comparison" className="hover:text-neutral-800">
                        {t("cardComparison.cardDetails.breadcrumb.explore", "Explore")}
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-neutral-800 font-medium">
                        {card.bankName} {t("cardComparison.cardDetails.creditCard", "Credit Card")}
                    </span>
                </nav>

                <section className="bg-white rounded-2xl border shadow-sm p-6 md:p-10">
                    <div className="flex justify-center">
                        <div className="max-w-[520px] w-full">
                            <Image
                                src={card.cardImageUrl}
                                alt={card.bankName}
                                width={520}
                                height={320}
                                className="w-full object-contain rounded-xl"
                                priority
                            />
                        </div>
                    </div>

                    <div className="mt-8">
                        <p className="text-sm text-neutral-500">{card.bankName}</p>
                        <h1 className="text-3xl md:text-4xl font-bold mt-2">
                            {card.bankName} {t("cardComparison.cardDetails.creditCard", "Credit Card")}
                        </h1>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                            <StatBox
                                icon={<Briefcase />}
                                label={t("cardComparison.cardDetails.stats.minSalary", "Min. Salary")}
                                value={t("cardComparison.cardDetails.minSalaryValue", "AED 5,000")}
                            />
                            <StatBox
                                icon={<Calendar />}
                                label={t("cardComparison.cardDetails.stats.annualFee", "Annual Fee")}
                                value={annualFee || t("cardComparison.cardDetails.emptyValue", "—")}
                            />
                            <StatBox
                                icon={<Percent />}
                                label={t("cardComparison.cardDetails.stats.interestRate", "Interest Rate")}
                                value={card.apr || t("cardComparison.cardDetails.na", "N/A")}
                            />
                            <StatBox
                                icon={<Building2 />}
                                label={t("cardComparison.cardDetails.stats.salaryTransfer", "Salary Transfer")}
                                value={card.salaryTransferRequired
                                    ? t("cardComparison.cardDetails.required", "Required")
                                    : t("cardComparison.cardDetails.notRequired", "Not Required")}
                            />
                        </div>

                        <div className="mt-8">
                            <p
                                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 cursor-pointer"
                                onClick={() => setOpenApply(true)}
                            >
                                {t("cardComparison.cardDetails.applyForCard", "Apply for This Card")}
                                <ArrowRight className="w-5 h-5" />
                            </p>
                        </div>
                    </div>
                </section>

                <FeaturesSection
                    title={t("cardComparison.cardDetails.sections.travelLifestyle", "Travel & Lifestyle")}
                    items={splitList(card.keyLifestyleBenefits)}
                />

                <FeaturesSection
                    title={t("cardComparison.cardDetails.sections.rewardsCashback", "Rewards & Cashback")}
                    items={[
                        ...splitList(card.earnRates),
                        ...splitList(card.pointsRedemption),
                    ]}
                />

                {card.welcomeBonus && card.welcomeBonus !== "-" && (
                    <FeaturesSection
                        title={t("cardComparison.cardDetails.sections.welcomeOffers", "Welcome & Special Offers")}
                        items={splitList(card.welcomeBonus)}
                    />
                )}

                <FeaturesSection
                    title={t("cardComparison.cardDetails.sections.documentsRequired", "Documents Required")}
                    items={splitList(card.documentsRequired)}
                />

                <div className="flex justify-center mt-12 pb-12">
                    <button
                        onClick={() => router.push("/card-comparison")}
                        className="px-8 py-3 rounded-md border font-semibold bg-white hover:bg-gray-50 cursor-pointer"
                    >
                        {t("cardComparison.cardDetails.goBack", "Go Back")}
                    </button>
                </div>
            </div>
        </main>
    );
}

function StatBox({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="bg-[#f6f4ef] rounded-xl p-4 flex gap-3">
            <div className="text-neutral-600 mt-1">{icon}</div>
            <div>
                <p className="text-sm text-neutral-500">{label}</p>
                <p className="font-bold mt-1">{value}</p>
            </div>
        </div>
    );
}

function FeaturesSection({
    title,
    items,
}: {
    title: string;
    items: string[];
}) {
    if (!items.length) return null;

    return (
        <section className="mt-10 bg-white rounded-xl border overflow-hidden">
            <div className="px-6 py-4 bg-[#f6f4ef] font-semibold">
                {title}
            </div>
            <div className="p-6 space-y-3">
                {items.map((item, i) => (
                    <div key={i} className="flex gap-3">
                        <span className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                            ✓
                        </span>
                        <p>{item}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
