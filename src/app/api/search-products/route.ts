import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 3) {
    return NextResponse.json({ data: [] });
  }

  try {
    const prompt = `
You are generating autocomplete suggestions for an e-commerce search bar.

STRICT RULES (DO NOT BREAK):
1. ALWAYS include the exact query as the FIRST suggestion.
2. If the query looks like a product name, prioritize PRODUCT VARIANTS
   (e.g., Pro, Pro Max, Plus, Ultra) BEFORE accessories.
3. Only include accessories IF fewer than 5 product or variant suggestions exist.
4. Suggestions must be short (1–4 words).
5. Return EXACTLY 5 suggestions (no more, no less).
6. Do NOT invent unrelated products.
7. Do NOT repeat the same intent (avoid multiple accessories if variants are possible).

Query: "${query}"

Return ONLY valid JSON in this format:
{"data":["s1","s2","s3","s4","s5"]}
`;



    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      max_tokens: 80,
    });

    const content = response.choices[0].message?.content ?? "{}";

    let parsed: { data?: string[] } = {};
    try {
      parsed = JSON.parse(content);
    } catch {
      console.warn("⚠️ Invalid JSON from OpenAI:", content);
    }

    return NextResponse.json({
      data: Array.isArray(parsed.data) ? parsed.data.slice(0, 5) : [],
    });
  } catch (error) {
    console.error("❌ AI search suggestion error:", error);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
