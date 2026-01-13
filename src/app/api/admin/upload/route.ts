import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
    const data = await req.formData();
    const file = data.get("file") as File | null;

    if (!file) {
        return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/uploads/cards");
    await mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.name);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);

    return NextResponse.json({
        path: `/uploads/cards/${filename}`,
    });
}
