import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "ideolo_admin";
const ONE_DAY_SECONDS = 60 * 60 * 24;

function getSecret() {
    const s = process.env.ADMIN_SESSION_SECRET;
    if (!s) throw new Error("ADMIN_SESSION_SECRET is missing");
    return s;
}

function base64url(input: Buffer | string) {
    const b = Buffer.isBuffer(input) ? input : Buffer.from(input);
    return b
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}

function sign(data: string) {
    return base64url(crypto.createHmac("sha256", getSecret()).update(data).digest());
}

export function createAdminToken(expiresInSeconds = ONE_DAY_SECONDS) {
    const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const payload = base64url(JSON.stringify({ exp }));
    const sig = sign(payload);
    return `${payload}.${sig}`;
}

export function verifyAdminToken(token?: string | null) {
    if (!token) return false;
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [payload, sig] = parts;
    if (sign(payload) !== sig) return false;

    try {
        const json = JSON.parse(Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
        if (!json?.exp) return false;
        return Math.floor(Date.now() / 1000) < Number(json.exp);
    } catch {
        return false;
    }
}

export function setAdminCookie(res: NextResponse, token: string) {
    res.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
    });
}

export function clearAdminCookie(res: NextResponse) {
    res.cookies.set(COOKIE_NAME, "", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });
}

export function isAdminRequest(req: NextRequest) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    return verifyAdminToken(token);
}

export function getAdminCookieName() {
    return COOKIE_NAME;
}
