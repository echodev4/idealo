import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const encoded = searchParams.get("product_url");
    const source = searchParams.get("sourceName");
    if (!encoded) {
      return Response.json({ success: false, message: "Missing product_url" }, { status: 400 });
    }

    const rawUrl = decodeURIComponent(encoded);
    const SCRAPER_API_BASE_URL = process.env.SCRAPER_API_BASE_URL;


    const scraperApiUrl =
      `${SCRAPER_API_BASE_URL}/${source}/api/scrape/details?product_url=${rawUrl}`;

    const scraperResponse = await fetch(scraperApiUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const data = await scraperResponse.json();

    if (!data?.data) {
      return Response.json(
        { success: false, message: "Scraper returned no product data", data },
        { status: 500 }
      );
    }

    return Response.json({ success: true, scraped: data });
  } catch (err: any) {
    console.error("❌ Single Product Route Error:", err);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
