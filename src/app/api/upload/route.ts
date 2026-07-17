import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processUpload } from "@/lib/upload-processor";
import { randomUUID } from "crypto";

export const maxDuration = 60;

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 413 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileId = randomUUID();

    const dbFile = await prisma.file.create({
      data: {
        id: fileId,
        name: file.name,
        size: file.size,
        status: "processing",
      },
    });

    await processUpload(fileId, buffer);

    return NextResponse.json({
      id: dbFile.id,
      name: dbFile.name,
      status: "ready",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}
