import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, fileIds } = (await request.json()) as {
      message: string;
      fileIds: string[];
    };

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return NextResponse.json(
        { error: "At least one file must be selected" },
        { status: 400 },
      );
    }

    // Stub response - feat/007 will wire RAG pipeline
    const content = `I received your question: "${message}". The RAG pipeline will be implemented in the next feature to provide accurate answers based on your ${fileIds.length} selected document(s).`;

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 },
    );
  }
}
