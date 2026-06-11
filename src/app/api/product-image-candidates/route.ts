import { NextResponse } from "next/server";

export const runtime = "nodejs";

const BASE_URL = process.env.SCRAPER_API_BASE_URL;
const DEFAULT_LIMIT = 10;

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const product_url =
            typeof body?.product_url === "string" ? body.product_url.trim() : "";
        const source =
            typeof body?.source === "string" ? body.source.trim() : "";

        if (!product_url) {
            return NextResponse.json(
                {
                    success: false,
                    error: "product_url is required",
                    products: [],
                    candidate_count: 0,
                },
                { status: 400 }
            );
        }

        if (!BASE_URL) {
            console.error("SCRAPER_API_BASE_URL is not defined");
            return NextResponse.json(
                {
                    success: false,
                    error: "Backend base URL is missing",
                    products: [],
                    candidate_count: 0,
                },
                { status: 500 }
            );
        }

        const res = await fetch(`${BASE_URL}/offers/sharaf-image-candidates`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                product_url,
                source,
                limit: DEFAULT_LIMIT,
            }),
            cache: "no-store",
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("product-image-candidates backend error:", errorText);

            return NextResponse.json(
                {
                    success: false,
                    error: "Backend error",
                    products: [],
                    candidate_count: 0,
                },
                { status: res.status }
            );
        }

        const data = await res.json();

        return NextResponse.json({
            success: Boolean(data?.success),
            candidate_count: Number(data?.candidate_count || 0),
            products: Array.isArray(data?.products) ? data.products : [],
        });
    } catch (err) {
        console.error("product-image-candidates route error:", err);

        return NextResponse.json(
            {
                success: false,
                error: "Internal server error",
                products: [],
                candidate_count: 0,
            },
            { status: 500 }
        );
    }
}
