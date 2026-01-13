import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const BASE_URL = process.env.SCRAPER_API_BASE_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!BASE_URL) {
  throw new Error("SCRAPER_API_BASE_URL is not defined");
}

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined");
}


const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q")?.trim() || "";
    const limit = Number(searchParams.get("limit") || "12");

    if (q.length < 2) {
      return NextResponse.json({
        count: 0,
        products: [],
      });
    }

    /* =========================
       CREATE EMBEDDING (NODE)
    ========================= */

    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: q,
    });

    const vector = embeddingResponse.data[0].embedding;

    /* =========================
       CALL PYTHON FAISS
    ========================= */

    const faissResponse = await fetch(
      `${BASE_URL}/faiss/search_by_vector`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vector,
          limit,
        }),
        cache: "no-store",
      }
    );

    if (!faissResponse.ok) {
      const errorText = await faissResponse.text();
      console.error("FAISS backend error:", errorText);

      return NextResponse.json(
        {
          count: 0,
          products: [],
        },
        { status: 500 }
      );
    }

    const data = await faissResponse.json();

    /* =========================
       FILTER INVALID PRODUCTS
    ========================= */

    const products = Array.isArray(data.products)
      ? data.products.filter((p: any) => {
        return (
          typeof p._id === "string" &&
          typeof p.product_url === "string" &&
          p.product_url.startsWith("http") &&
          typeof p.source === "string" &&
          typeof p.product_name === "string" &&
          typeof p.image_url === "string" &&
          p.image_url.startsWith("http") &&
          typeof p.price === "string" &&
          p.price.trim() !== ""
        );
      })
      : [];

    return NextResponse.json({
      count: products.length,
      products,
    });

  } catch (error) {
    console.error("API /products error:", error);

    return NextResponse.json(
      {
        count: 0,
        products: [],
      },
      { status: 500 }
    );
  }
}
