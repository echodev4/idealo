"use client";

import AdminShell from "@/components/admin/AdminShell";
import CardForm from "@/components/admin/CardForm";
import { useLanguage } from "@/contexts/language-context";

export default function NewCardPage() {
    const { t } = useLanguage();

    return (
        <AdminShell>
            <h1 className="text-2xl font-semibold text-gray-900">{t("admin.newCard.title", "Add Card")}</h1>
            <div className="mt-5">
                <CardForm mode="create" />
            </div>
        </AdminShell>
    );
}
