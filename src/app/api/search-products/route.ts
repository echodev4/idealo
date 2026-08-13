import { NextResponse } from "next/server";

export const runtime = "nodejs";

const BASE_URL = process.env.SCRAPER_API_BASE_URL;

type SuggestionResponse = {
  data?: unknown;
  message?: unknown;
};

function normalizeSuggestions(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const seen = new Set<string>();
  const suggestions: string[] = [];

  for (const item of value) {
    const suggestion = String(item || "").replace(/\s+/g, " ").trim();
    const key = suggestion.toLowerCase();
    if (!suggestion || seen.has(key)) {
      continue;
    }
    seen.add(key);
    suggestions.push(suggestion);
    if (suggestions.length >= 5) {
      break;
    }
  }

  return suggestions;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim() || "";

  if (query.length < 3) {
    return NextResponse.json({
      data: [],
      message: "Type at least 3 characters to get suggestions.",
    });
  }

  if (!BASE_URL) {
    return NextResponse.json(
      {
        data: [query],
        message: "Search suggestion service is not configured.",
      },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${BASE_URL}/search/suggestions?q=${encodeURIComponent(query)}`, {
      cache: "no-store",
    });
    const payload = (await response.json().catch(() => ({}))) as SuggestionResponse;
    const data = normalizeSuggestions(payload.data);
    const message =
      typeof payload.message === "string" && payload.message.trim()
        ? payload.message.trim()
        : response.ok
          ? "Suggestions generated successfully."
          : "Search suggestion service failed.";

    return NextResponse.json(
      {
        data: data.length > 0 ? data : [query],
        message,
      },
      { status: response.ok ? 200 : response.status }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown backend suggestion error";
    console.error("Search suggestion proxy failed:", message);

    return NextResponse.json(
      {
        data: [query],
        message: `Search suggestion service failed: ${message}`,
      },
      { status: 502 }
    );
  }
}
