export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createAdminToken, setAdminCookie } from "@/lib/admin-session";

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);
    const password = body?.password;

    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) {
        return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    if (!password || password !== expected) {
        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = createAdminToken();
    const res = NextResponse.json({ ok: true });
    setAdminCookie(res, token);
    return res;
}
