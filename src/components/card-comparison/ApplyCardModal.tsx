"use client";

import Image from "next/image";
import { X, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type ApplyCardModalProps = {
    open: boolean;
    onClose: () => void;
    card: {
        _id: string;
        bankName: string;
        cardImageUrl: string;
        title?: string;
        minSalaryText?: string;
    };
};

type FormState = {
    fullName: string;
    email: string;
    phone: string;
    phoneCountry: string; // "AE"
    phoneCode: string; // "+971"
    salary: string;
    nationality: string;
    consent: boolean;
};

export default function ApplyCardModal({ open, onClose, card }: ApplyCardModalProps) {
    const [form, setForm] = useState<FormState>({
        fullName: "",
        email: "",
        phone: "",
        phoneCountry: "AE",
        phoneCode: "+971",
        salary: "",
        nationality: "",
        consent: false,
    });

    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [submitted, setSubmitted] = useState(false);

    // Reset when opening
    useEffect(() => {
        if (open) {
            setSubmitted(false);
            setTouched({});
        }
    }, [open]);

    const errors = useMemo(() => {
        const e: Record<string, string> = {};
        if (!form.fullName.trim()) e.fullName = "Full name is required";
        if (!form.email.trim()) e.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "Enter a valid email";
        if (!form.phone.trim()) e.phone = "Phone is required";
        if (!form.salary.trim()) e.salary = "Monthly salary is required";
        if (!form.consent) e.consent = "Consent is required";
        return e;
    }, [form]);

    const showError = (key: string) => (submitted || touched[key]) && !!errors[key];

    const handleSubmit = () => {
        setSubmitted(true);
        if (Object.keys(errors).length > 0) return;

        onClose();
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 px-3"
            onMouseDown={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="w-full max-w-[640px] rounded-2xl bg-[#F7F4EE] shadow-2xl"
                onMouseDown={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative px-6 pt-6">
                    <button
                        onClick={onClose}
                        className="absolute right-5 top-5 text-neutral-600 hover:text-neutral-900 cursor-pointer"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-start gap-4">
                        <div className="relative h-[44px] w-[70px] shrink-0 overflow-hidden rounded-md bg-white">
                            <Image
                                src={card.cardImageUrl}
                                alt={card.bankName}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-[18px] font-bold text-neutral-900 leading-tight">
                                {card.title ?? `${card.bankName} Credit Card`}
                            </h2>
                            <p className="text-sm text-neutral-600">{card.bankName}</p>

                            {/* Min salary badge (optional) */}
                            {card.minSalaryText && (
                                <div className="mt-3 inline-flex items-center rounded-md bg-[#EFEDE6] px-3 py-1 text-sm text-neutral-700">
                                    Min. salary: <span className="ml-1 font-semibold">{card.minSalaryText}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Body (scrollable) */}
                <div className="mt-4 px-6 pb-6">
                    <div className="max-h-[70vh] overflow-y-auto pr-1">
                        <div className="space-y-5">
                            {/* Full Name */}
                            <Field
                                label="Full Name *"
                                placeholder="Your full name"
                                value={form.fullName}
                                onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
                                onChange={(v) => setForm((s) => ({ ...s, fullName: v }))}
                                error={showError("fullName") ? errors.fullName : ""}
                            />

                            {/* Email */}
                            <Field
                                label="Email *"
                                placeholder="email@example.com"
                                value={form.email}
                                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                                onChange={(v) => setForm((s) => ({ ...s, email: v }))}
                                error={showError("email") ? errors.email : ""}
                            />

                            {/* Phone row (AE +971 + input) */}
                            <div>
                                <label className="block text-sm font-semibold text-neutral-800 mb-2">
                                    Phone *
                                </label>

                                <div
                                    className={[
                                        "flex h-12 overflow-hidden rounded-xl border bg-white",
                                        showError("phone") ? "border-red-400" : "border-neutral-200",
                                    ].join(" ")}
                                >
                                    <button
                                        type="button"
                                        className="flex items-center gap-2 px-3 border-r border-neutral-200 text-sm text-neutral-800 bg-white"
                                        onClick={() => { }}
                                    >
                                        <span className="font-medium">{form.phoneCountry}</span>
                                        <span className="text-neutral-500">{form.phoneCode}</span>
                                        <ChevronDown className="h-4 w-4 text-neutral-500" />
                                    </button>

                                    <input
                                        value={form.phone}
                                        onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                                        onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                                        placeholder="50 123 4567"
                                        className="flex-1 px-4 text-sm outline-none"
                                    />
                                </div>

                                {showError("phone") && (
                                    <p className="mt-2 text-sm text-red-500">{errors.phone}</p>
                                )}
                            </div>

                            {/* Salary + Nationality row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field
                                    label="Monthly Salary (AED) *"
                                    placeholder="15,000"
                                    value={form.salary}
                                    onBlur={() => setTouched((t) => ({ ...t, salary: true }))}
                                    onChange={(v) => setForm((s) => ({ ...s, salary: v }))}
                                    error={showError("salary") ? errors.salary : ""}
                                />

                                <SelectField
                                    label="Nationality"
                                    value={form.nationality}
                                    onChange={(v) => setForm((s) => ({ ...s, nationality: v }))}
                                    options={[
                                        { label: "Select", value: "" },
                                        { label: "UAE", value: "UAE" },
                                        { label: "Pakistan", value: "Pakistan" },
                                        { label: "India", value: "India" },
                                        { label: "Other", value: "Other" },
                                    ]}
                                />
                            </div>

                            {/* Consent */}
                            <div>
                                <label className="flex items-start gap-3 text-sm text-neutral-700">
                                    <input
                                        type="checkbox"
                                        checked={form.consent}
                                        onChange={(e) => setForm((s) => ({ ...s, consent: e.target.checked }))}
                                        onBlur={() => setTouched((t) => ({ ...t, consent: true }))}
                                        className={[
                                            "mt-1 h-4 w-4 rounded border-neutral-300",
                                            "accent-green-600",
                                        ].join(" ")}
                                    />
                                    <span>
                                        I agree to be contacted by Credit Match and partners regarding my credit card.{" "}
                                        <span className="text-red-500">*</span>
                                    </span>
                                </label>

                                {showError("consent") && (
                                    <p className="mt-2 text-sm text-red-500">{errors.consent}</p>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="mt-2 w-full h-12 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition cursor-pointer"
                            >
                                Submit Application
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* =========================
   Small UI Components
========================= */

function Field({
    label,
    value,
    placeholder,
    onChange,
    onBlur,
    error,
}: {
    label: string;
    value: string;
    placeholder?: string;
    onChange: (v: string) => void;
    onBlur?: () => void;
    error?: string;
}) {
    return (
        <div>
            <label className="block text-sm font-semibold text-neutral-800 mb-2">
                {label}
            </label>

            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                placeholder={placeholder}
                className={[
                    "w-full h-12 rounded-xl border bg-white px-4 text-sm outline-none",
                    "focus:ring-2 focus:ring-green-600/30 focus:border-green-600",
                    error ? "border-red-400" : "border-neutral-200",
                ].join(" ")}
            />

            {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
        </div>
    );
}

function SelectField({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: { label: string; value: string }[];
}) {
    return (
        <div>
            <label className="block text-sm font-semibold text-neutral-800 mb-2">
                {label}
            </label>

            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={[
                        "w-full h-12 rounded-xl border border-neutral-200 bg-white px-4 text-sm outline-none",
                        "appearance-none focus:ring-2 focus:ring-green-600/30 focus:border-green-600",
                    ].join(" ")}
                >
                    {options.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            </div>
        </div>
    );
}
