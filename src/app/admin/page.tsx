"use client";

import { Suspense } from "react";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { useLanguage } from "@/contexts/language-context";

export default function AdminLoginPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <Suspense fallback={<div>{t("admin.common.loading", "Loading...")}</div>}>
                <AdminLoginForm />
            </Suspense>
        </div>
    );
}
