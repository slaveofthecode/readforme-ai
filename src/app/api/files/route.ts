import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const files = await prisma.file.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        size: true,
        status: true,
        pageCount: true,
        errorMessage: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ files });
  } catch (error) {
    console.error("List files error:", error);
    return NextResponse.json(
      { error: "Failed to list files" },
      { status: 500 },
    );
  }
}
