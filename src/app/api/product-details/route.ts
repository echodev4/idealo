import { NextResponse } from "next/server";

export const runtime = "nodejs";

const BASE_URL = process.env.SCRAPER_API_BASE_URL;

if (!BASE_URL) {
    throw new Error("SCRAPER_API_BASE_URL is not defined");
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const product_url = searchParams.get("product_url");

        if (!product_url) {
            return NextResponse.json(
                { success: false, data: null },
                { status: 400 }
            );
        }

        const res = await fetch(`${BASE_URL}/lookup/by-url`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ product_url }),
            cache: "no-store",
        });

        if (!res.ok) {
            return NextResponse.json(
                { success: false, data: null },
                { status: res.status }
            );
        }

        const data = await res.json();

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (err) {
        console.error("❌ product-details route error:", err);
        return NextResponse.json(
            { success: false, data: null },
            { status: 500 }
        );
    }
}
