"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);

    async function logout() {
        setLoading(true);
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin");
        router.refresh();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="border-b bg-white">
                <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/cards" className="text-lg font-semibold text-gray-900">
                            {t("admin.shell.title", "Ideolo Admin")}
                        </Link>
                        <nav className="flex items-center gap-3 text-sm">
                            <Link href="/admin/cards" className="text-gray-700 hover:text-gray-900">
                                {t("admin.shell.navCards", "Cards")}
                            </Link>
                            <Link href="/admin/cards/new" className="text-gray-700 hover:text-gray-900">
                                {t("admin.shell.navAddCard", "Add Card")}
                            </Link>
                        </nav>
                    </div>
                    <button
                        onClick={logout}
                        disabled={loading}
                        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60 cursor-pointer"
                    >
                        {loading
                            ? t("admin.shell.loggingOut", "Logging out...")
                            : t("admin.shell.logout", "Logout")}
                    </button>
                </div>
            </header>
            <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </div>
    );
}
