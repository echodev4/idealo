import { NextResponse } from "next/server";

export const runtime = "nodejs";

const BASE_URL = process.env.SCRAPER_API_BASE_URL;

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const product_url =
            typeof body?.product_url === "string" ? body.product_url.trim() : "";
        const source =
            typeof body?.source === "string" ? body.source.trim() : "";
        const product_name =
            typeof body?.product_name === "string" ? body.product_name.trim() : "";

        const rawLimit = Number(body?.limit);
        const limit =
            Number.isFinite(rawLimit) && rawLimit > 0
                ? Math.min(Math.max(Math.floor(rawLimit), 1), 10)
                : 10;

        if (!product_url) {
            return NextResponse.json(
                { success: false, error: "product_url is required", products: [] },
                { status: 400 }
            );
        }

        if (!BASE_URL) {
            console.error("SCRAPER_API_BASE_URL is not defined");
            return NextResponse.json(
                { success: false, error: "Backend base URL is missing", products: [] },
                { status: 500 }
            );
        }

        const res = await fetch(`${BASE_URL}/offers/variants-by-product`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                product_url,
                source,
                product_name,
                limit,
            }),
            cache: "no-store",
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("product-variants backend error:", errorText);

            return NextResponse.json(
                { success: false, error: "Backend error", products: [] },
                { status: res.status }
            );
        }

        const data = await res.json();

        return NextResponse.json({
            success: Boolean(data?.success),
            products: Array.isArray(data?.products) ? data.products : [],
        });
    } catch (err) {
        console.error("product-variants route error:", err);

        return NextResponse.json(
            { success: false, error: "Internal server error", products: [] },
            { status: 500 }
        );
    }
}