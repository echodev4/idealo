"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import type { AdminCard } from "@/types/admin-card";

type ApiList = {
    items: (AdminCard & { _id: string })[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export default function AdminCardsPage() {
    const [data, setData] = useState<ApiList | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 10;

    async function load(p: number) {
        setLoading(true);
        const res = await fetch(`/api/admin/cards?page=${p}&limit=${limit}`, { cache: "no-store" });
        if (!res.ok) {
            setData(null);
            setLoading(false);
            return;
        }
        const j = (await res.json()) as ApiList;
        setData(j);
        setLoading(false);
    }

    useEffect(() => {
        load(page);
    }, [page]);

    const rows = useMemo(() => data?.items || [], [data]);

    async function remove(id: string) {
        if (!confirm("Delete this card?")) return;
        const res = await fetch(`/api/admin/cards/${id}`, { method: "DELETE" });
        if (res.ok) load(page);
    }

    return (
        <AdminShell>
            <div className="flex items-center justify-between gap-3">
                <h1 className="text-2xl font-semibold text-gray-900">Cards</h1>
                <Link href="/admin/cards/new" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                    Add Card
                </Link>
            </div>

            <div className="mt-5 rounded-lg border bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 text-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold">Bank</th>
                                <th className="px-4 py-3 text-left font-semibold">Joining / Annual Fee</th>
                                <th className="px-4 py-3 text-left font-semibold">APR</th>
                                <th className="px-4 py-3 text-left font-semibold">Salary Transfer</th>
                                <th className="px-4 py-3 text-left font-semibold">Image</th>
                                <th className="px-4 py-3 text-right font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td className="px-4 py-6 text-gray-600" colSpan={6}>
                                        Loading...
                                    </td>
                                </tr>
                            ) : rows.length === 0 ? (
                                <tr>
                                    <td className="px-4 py-6 text-gray-600" colSpan={6}>
                                        No cards found
                                    </td>
                                </tr>
                            ) : (
                                rows.map((c) => (
                                    <tr key={c._id} className="border-t">
                                        <td className="px-4 py-3 font-medium text-gray-900">{c.bankName}</td>
                                        <td className="px-4 py-3 text-gray-700">{c.joiningAnnualFee}</td>
                                        <td className="px-4 py-3 text-gray-700">{c.apr}</td>
                                        <td className="px-4 py-3 text-gray-700">{c.salaryTransferRequired ? "Yes" : "No"}</td>
                                        <td className="px-4 py-3 text-gray-700">
                                            <a className="text-blue-600 hover:underline" href={c.cardImageUrl} target="_blank" rel="noreferrer">
                                                View
                                            </a>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/cards/${c._id}/edit`}
                                                    className="rounded-md border px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-50"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => remove(c._id)}
                                                    className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 cursor-pointer"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {data ? (
                    <div className="flex items-center justify-between px-4 py-3 border-t bg-white">
                        <div className="text-sm text-gray-700">
                            Page <span className="font-semibold">{data.page}</span> of <span className="font-semibold">{data.totalPages}</span> • Total{" "}
                            <span className="font-semibold">{data.total}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className="rounded-md border px-3 py-1.5 text-sm font-semibold disabled:opacity-50"
                            >
                                Prev
                            </button>
                            <button
                                disabled={page >= data.totalPages}
                                onClick={() => setPage((p) => p + 1)}
                                className="rounded-md border px-3 py-1.5 text-sm font-semibold disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
        </AdminShell>
    );
}
