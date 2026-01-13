"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginForm() {
    const router = useRouter();
    const sp = useSearchParams();
    const next = sp.get("next") || "/admin/cards";

    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setLoading(true);

        const res = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ password }),
        });

        setLoading(false);

        if (!res.ok) {
            const j = await res.json().catch(() => null);
            setErr(j?.error || "Login failed");
            return;
        }

        router.push(next);
        router.refresh();
    }

    return (
        <form onSubmit={onSubmit} className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg border">
            <h1 className="text-2xl font-semibold text-gray-900">Confirm us that you are the right person!</h1>

            <div className="mt-6">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full rounded-md border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {err ? <p className="mt-3 text-sm text-red-600">{err}</p> : null}

            <button
                disabled={loading || !password}
                className="mt-6 w-full rounded-md bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
                {loading ? "Logging in..." : "LOGIN"}
            </button>
        </form>
    );
}
