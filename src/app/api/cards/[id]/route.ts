import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CardManagement } from "@/models/CardManagement";
import mongoose from "mongoose";

export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "Invalid card id" },
                { status: 400 }
            );
        }

        const item = await CardManagement.findById(id).lean();

        if (!item) {
            return NextResponse.json(
                { message: "Card not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ item });
    } catch (err) {
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}
