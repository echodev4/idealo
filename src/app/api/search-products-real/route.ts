import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export const runtime = "nodejs";

type Product = {
    product_url: string;
    source: string;
    product_name: string;
    image_url: string;
    price: string;
    old_price?: string;
    discount?: string;
};

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";

    if (q.length < 3) {
        return NextResponse.json({ data: [] });
    }

    try {
        const conn = await connectDB();
        const db = conn.connection.db;

        const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

        const items = await db
            .collection("products_catalog")
            .find(
                { product_name: { $regex: regex } },
                {
                    projection: {
                        product_url: 1,
                        source: 1,
                        product_name: 1,
                        image_url: 1,
                        price: 1,
                        old_price: 1,
                        discount: 1,
                    },
                }
            )
            .limit(5)
            .toArray();

        return NextResponse.json({ data: (items as Product[]) || [] });
    } catch (error) {
        console.error("search-products-real error:", error);
        return NextResponse.json({ data: [] }, { status: 500 });
    }
}
