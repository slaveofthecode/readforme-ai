import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileIds } = body as { fileIds: string[] };

    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      return NextResponse.json(
        { error: "fileIds must be a non-empty array" },
        { status: 400 },
      );
    }

    const result = await prisma.file.updateMany({
      where: {
        id: { in: fileIds },
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ deleted: result.count });
  } catch (error) {
    console.error("Batch delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete files" },
      { status: 500 },
    );
  }
}
