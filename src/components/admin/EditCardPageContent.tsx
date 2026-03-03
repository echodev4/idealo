"use client";

import CardForm from "@/components/admin/CardForm";
import type { AdminCard } from "@/types/admin-card";
import { useLanguage } from "@/contexts/language-context";

type Props = {
    id: string;
    item: AdminCard | null;
    invalidId: boolean;
};

export default function EditCardPageContent({ id, item, invalidId }: Props) {
    const { t } = useLanguage();

    if (invalidId) {
        return <div className="rounded-md border bg-white p-6">{t("admin.editCard.invalidId", "Invalid ID")}</div>;
    }

    return (
        <>
            <h1 className="text-2xl font-semibold text-gray-900">{t("admin.editCard.title", "Edit Card")}</h1>
            <div className="mt-5">
                {item ? (
                    <CardForm mode="edit" id={id} initial={item} />
                ) : (
                    <div className="rounded-md border bg-white p-6">{t("admin.editCard.notFound", "Not found")}</div>
                )}
            </div>
        </>
    );
}
