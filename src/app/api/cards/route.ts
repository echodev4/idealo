import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CardManagement } from "@/models/CardManagement";

export async function GET() {
    await connectDB();

    const items = await CardManagement
        .find({})
        .sort({ bankName: 1 })
        .lean();

    return NextResponse.json({ items });
}
