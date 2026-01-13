export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CardManagement } from "@/models/CardManagement";
import mongoose from "mongoose";

function requireString(v: any) {
    return typeof v === "string" && v.trim().length > 0;
}

function isValidObjectId(id: string) {
    return mongoose.Types.ObjectId.isValid(id);
}

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
    req: Request,
    { params }: RouteContext
) {
    await connectDB();
    const { id } = await params;

    if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const item = await CardManagement.findById(id).lean();
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ item });
}

export async function PUT(
    req: NextRequest,
    { params }: RouteContext
) {
    await connectDB();
    const { id } = await params;

    if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

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

    const updated = await CardManagement.findByIdAndUpdate(id, payload, { new: true }).lean();
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ item: updated });
}

export async function DELETE(
    _: NextRequest,
    { params }: RouteContext
) {
    await connectDB();
    const { id } = await params;

    if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const deleted = await CardManagement.findByIdAndDelete(id).lean();
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ ok: true });
}
