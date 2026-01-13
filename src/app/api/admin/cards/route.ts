
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CardManagement } from "@/models/CardManagement";

function requireString(v: any) {
    return typeof v === "string" && v.trim().length > 0;
}

export async function GET(req: NextRequest) {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || 10)));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        CardManagement.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        CardManagement.countDocuments(),
    ]);

    return NextResponse.json({
        items,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    });
}

export async function POST(req: NextRequest) {
    await connectDB();

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

    const payload = {
        bankName: body.bankName,
        joiningAnnualFee: body.joiningAnnualFee,
        apr: body.apr,
        salaryTransferRequired: body.salaryTransferRequired,
        welcomeBonus: body.welcomeBonus,
        earnRates: body.earnRates,
        keyLifestyleBenefits: body.keyLifestyleBenefits,
        pointsRedemption: body.pointsRedemption,
        documentsRequired: body.documentsRequired,
        cardImageUrl: body.cardImageUrl,
    };

    const ok =
        requireString(payload.bankName) &&
        requireString(payload.joiningAnnualFee) &&
        requireString(payload.apr) &&
        typeof payload.salaryTransferRequired === "boolean" &&
        requireString(payload.welcomeBonus) &&
        requireString(payload.earnRates) &&
        requireString(payload.keyLifestyleBenefits) &&
        requireString(payload.pointsRedemption) &&
        requireString(payload.documentsRequired) &&
        requireString(payload.cardImageUrl);

    if (!ok) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const created = await CardManagement.create(payload);
    return NextResponse.json({ item: created }, { status: 201 });
}
