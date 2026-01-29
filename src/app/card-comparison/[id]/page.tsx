"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    ChevronRight,
    Briefcase,
    Calendar,
    Percent,
    Building2,
    ArrowRight,
} from "lucide-react";

/* =========================
   Types
========================= */
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

/* =========================
   Helpers
========================= */
const splitList = (text?: string) =>
    text
        ? text
            .split(/\n|;/g)
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

/* =========================
   Page
========================= */
export default function CardDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [card, setCard] = useState<Card | null>(null);
    const [error, setError] = useState("");

    /* =========================
       Fetch card
    ========================= */
    useEffect(() => {
        if (!id) return;

        setLoading(true);
        fetch(`/api/cards/${id}`)
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || "Failed to load card");
                return data.item;
            })
            .then((item) => {
                setCard(item);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || "Something went wrong");
                setLoading(false);
            });
    }, [id]);

    const annualFee = useMemo(
        () => splitList(card?.joiningAnnualFee)[0],
        [card?.joiningAnnualFee]
    );

    if (loading) {
        return <div className="py-20 text-center">Loading card…</div>;
    }

    if (error || !card) {
        return (
            <div className="py-20 text-center">
                <p className="text-red-600 font-semibold mb-4">{error}</p>
                <button
                    onClick={() => router.push("/card-comparison")}
                    className="px-6 py-3 border rounded-md"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <main className="bg-[#faf7f1] min-h-screen">
            <div className="max-w-[1100px] mx-auto px-4 py-8">

                {/* ================= Breadcrumb ================= */}
                <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
                    <Link href="/" className="hover:text-neutral-800">Home</Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href="/card-comparison" className="hover:text-neutral-800">
                        Explore
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-neutral-800 font-medium">
                        {card.bankName} Credit Card
                    </span>
                </nav>

                {/* ================= Hero Card ================= */}
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
                            {card.bankName} Credit Card
                        </h1>

                        {/* ================= Stats ================= */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                            <StatBox
                                icon={<Briefcase />}
                                label="Min. Salary"
                                value="AED 5,000"
                            />
                            <StatBox
                                icon={<Calendar />}
                                label="Annual Fee"
                                value={annualFee || "—"}
                            />
                            <StatBox
                                icon={<Percent />}
                                label="Interest Rate"
                                value={card.apr || "N/A"}
                            />
                            <StatBox
                                icon={<Building2 />}
                                label="Salary Transfer"
                                value={card.salaryTransferRequired ? "Required" : "Not Required"}
                            />
                        </div>

                        {/* ================= Apply ================= */}
                        <div className="mt-8">
                            <a
                                href="#"
                                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700"
                            >
                                Apply for This Card
                                <ArrowRight className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </section>

                {/* ================= Features ================= */}
                <FeaturesSection
                    title="Travel & Lifestyle"
                    items={splitList(card.keyLifestyleBenefits)}
                />

                <FeaturesSection
                    title="Rewards & Cashback"
                    items={[
                        ...splitList(card.earnRates),
                        ...splitList(card.pointsRedemption),
                    ]}
                />

                {card.welcomeBonus && card.welcomeBonus !== "-" && (
                    <FeaturesSection
                        title="Welcome & Special Offers"
                        items={splitList(card.welcomeBonus)}
                    />
                )}

                <FeaturesSection
                    title="Documents Required"
                    items={splitList(card.documentsRequired)}
                />

                {/* ================= Go Back ================= */}
                <div className="flex justify-center mt-12 pb-12">
                    <button
                        onClick={() => router.push("/card-comparison")}
                        className="px-8 py-3 rounded-md border font-semibold bg-white hover:bg-gray-50"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </main>
    );
}

/* =========================
   Small Components
========================= */
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
