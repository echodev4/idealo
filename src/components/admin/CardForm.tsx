"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { AdminCard } from "@/types/admin-card";

type Props = {
    mode: "create" | "edit";
    initial?: AdminCard;
    id?: string;
};

export default function CardForm({ mode, initial, id }: Props) {
    const router = useRouter();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState<AdminCard>({
        bankName: initial?.bankName || "",
        joiningAnnualFee: initial?.joiningAnnualFee || "",
        apr: initial?.apr || "",
        salaryTransferRequired: initial?.salaryTransferRequired ?? false,
        welcomeBonus: initial?.welcomeBonus || "",
        earnRates: initial?.earnRates || "",
        keyLifestyleBenefits: initial?.keyLifestyleBenefits || "",
        pointsRedemption: initial?.pointsRedemption || "",
        documentsRequired: initial?.documentsRequired || "",
        cardImageUrl: initial?.cardImageUrl || "",
    });

    const canSave = useMemo(() => {
        const s = (v: string) => v.trim().length > 0;
        return (
            s(form.bankName) &&
            s(form.joiningAnnualFee) &&
            s(form.apr) &&
            s(form.welcomeBonus) &&
            s(form.earnRates) &&
            s(form.keyLifestyleBenefits) &&
            s(form.pointsRedemption) &&
            s(form.documentsRequired) &&
            (s(form.cardImageUrl) || imageFile !== null)
        );
    }, [form, imageFile]);


    function set<K extends keyof AdminCard>(key: K, value: AdminCard[K]) {
        setForm((p) => ({ ...p, [key]: value }));
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSaving(true);

        let imagePath = form.cardImageUrl;

        if (imageFile) {
            const fd = new FormData();
            fd.append("file", imageFile);

            const uploadRes = await fetch("/api/admin/upload", {
                method: "POST",
                body: fd,
            });

            if (!uploadRes.ok) {
                setError("Image upload failed");
                setSaving(false);
                return;
            }

            const uploadJson = await uploadRes.json();
            imagePath = uploadJson.path;
        }

        const payload = {
            ...form,
            cardImageUrl: imagePath,
        };

        const url = mode === "create" ? "/api/admin/cards" : `/api/admin/cards/${id}`;
        const method = mode === "create" ? "POST" : "PUT";

        const res = await fetch(url, {
            method,
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
        });

        setSaving(false);

        if (!res.ok) {
            const j = await res.json().catch(() => null);
            setError(j?.error || "Failed");
            return;
        }

        router.push("/admin/cards");
        router.refresh();
    }


    return (
        <form onSubmit={onSubmit} className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Bank Name">
                    <input className="w-full rounded-md border px-3 py-2" value={form.bankName} onChange={(e) => set("bankName", e.target.value)} placeholder="e.g. ADCB" />
                </Field>
                <Field label="Card Image">
                    <input
                        type="file"
                        accept="image/*"
                        className="w-full rounded-md border px-3 py-2"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    />
                    {form.cardImageUrl && (
                        <img src={form.cardImageUrl} className="mt-2 h-20 rounded border" />
                    )}
                </Field>



                <Field label="APR">
                    <input className="w-full rounded-md border px-3 py-2" value={form.apr} onChange={(e) => set("apr", e.target.value)} placeholder="e.g. 3.69% or 18.99%–27.99%" />
                </Field>

                <Field label="Salary Transfer Required">
                    <select
                        className="w-full rounded-md border px-3 py-2"
                        value={form.salaryTransferRequired ? "yes" : "no"}
                        onChange={(e) => set("salaryTransferRequired", e.target.value === "yes")}
                    >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </Field>


                <Field label="Welcome Bonus">
                    <textarea className="w-full rounded-md border px-3 py-2 min-h-[120px]" value={form.welcomeBonus} onChange={(e) => set("welcomeBonus", e.target.value)} placeholder={`Put each condition on a new line:
• AED 2,000 hotel voucher
• AED 15,000 spend in 60 days`}
                    />
                </Field>
                <Field label="Joining / Annual Fee">
                    <textarea className="w-full rounded-md border px-3 py-2 min-h-[120px]" value={form.joiningAnnualFee} onChange={(e) => set("joiningAnnualFee", e.target.value)} placeholder={`Examples:
• Free for life
• Free for 1st year, AED 630 from 2nd year
• AED 1,575`}
                    />
                </Field>

                <Field label="Earn Rates">
                    <textarea className="w-full rounded-md border px-3 py-2 min-h-[120px]" value={form.earnRates} onChange={(e) => set("earnRates", e.target.value)} placeholder={`One earn rate per line:
• 10% on flights and hotels
• 50% on online movies
• 1.5% on other spends`}
                    />
                </Field>

                <Field label="Key Lifestyle Benefits">
                    <textarea className="w-full rounded-md border px-3 py-2 min-h-[120px]" value={form.keyLifestyleBenefits} onChange={(e) => set("keyLifestyleBenefits", e.target.value)}
                        placeholder={`One benefit per line:
• Airport lounge access
• Careem discounts`}

                    />
                </Field>

                <Field label="Points Redemption">
                    <textarea className="w-full rounded-md border px-3 py-2 min-h-[120px]" value={form.pointsRedemption} onChange={(e) => set("pointsRedemption", e.target.value)}
                        placeholder={`One redemption option per line:
• Redeem via Expedia vouchers
• Cashback to card statement
• Airline miles transfer`}

                    />
                </Field>

                <Field label="Documents Required">
                    <textarea className="w-full rounded-md border px-3 py-2 min-h-[120px]" value={form.documentsRequired} onChange={(e) => set("documentsRequired", e.target.value)}
                        placeholder={`Separate each document with a semicolon (;)
Example:
Passport (original + copy); Emirates ID (original + copy); Last 3 months bank statement; Salary certificate (≤ 30 days old)`}

                    />
                </Field>
            </div>

            {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

            <div className="mt-6 flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-md border px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    disabled={!canSave || saving}
                    className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60 cursor-pointer"
                >
                    {saving ? "Saving..." : mode === "create" ? "Create" : "Update"}
                </button>
            </div>
        </form>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block">
            <div className="mb-1 text-sm font-medium text-gray-700">{label}</div>
            {children}
        </label>
    );
}
