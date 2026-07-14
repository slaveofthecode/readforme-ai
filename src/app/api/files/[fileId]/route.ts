import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import fs from "fs/promises"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params

    const file = await prisma.file.findUnique({
      where: { id: fileId },
      select: {
        id: true,
        name: true,
        status: true,
        pageCount: true,
        errorMessage: true,
        createdAt: true,
      },
    })

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    return NextResponse.json(file)
  } catch (error) {
    console.error("Get file error:", error)
    return NextResponse.json(
      { error: "Failed to get file" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params

    const file = await prisma.file.findUnique({
      where: { id: fileId },
    })

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    if (file.filePath) {
      await fs.unlink(file.filePath).catch(() => {})
    }

    await prisma.file.update({
      where: { id: fileId },
      data: { deletedAt: new Date() },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    )
  }
}
