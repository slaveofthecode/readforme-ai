import { NextRequest } from "next/server";
import { gemini } from "@/lib/gemini";
import { generateQueryEmbedding } from "@/lib/embedding";
import { searchSimilarChunks } from "@/lib/vector-search";

const CHAT_MODEL = "gemini-1.5-flash";

function buildPrompt(question: string, context: string): string {
  return `You are an assistant that answers questions based on the provided documents.
Answer only using the context below. If the answer is not in the context,
say "I cannot find this information in the selected documents."
Be concise and accurate. Cite page numbers when relevant.

Context:
${context}

Question: ${question}`;
}

export async function POST(request: NextRequest) {
  try {
    const { message, fileIds } = (await request.json()) as {
      message: string;
      fileIds: string[];
    };

    if (!message || typeof message !== "string") {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return Response.json(
        { error: "At least one file must be selected" },
        { status: 400 },
      );
    }

    const queryEmbedding = await generateQueryEmbedding(message);
    const chunks = await searchSimilarChunks(queryEmbedding, fileIds, 5);

    const context = chunks
      .map((c, i) => `[${i + 1}] (${c.fileName}, p.${c.pageNumber}) ${c.text}`)
      .join("\n\n");

    const prompt = buildPrompt(message, context);

    const model = gemini.getGenerativeModel({ model: CHAT_MODEL });
    const result = await model.generateContentStream(prompt);

    const sources = chunks.map((c) => ({
      fileName: c.fileName,
      pageNumber: c.pageNumber,
      text: c.text.slice(0, 200),
    }));

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(
                new TextEncoder().encode(
                  `data: ${JSON.stringify({ text })}\n\n`,
                ),
              );
            }
          }
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ sources })}\n\n`,
            ),
          );
          controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
        } catch (error) {
          console.error("Stream error:", error);
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ error: "Stream interrupted" })}\n\n`,
            ),
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return Response.json(
      { error: "Failed to process message" },
      { status: 500 },
    );
  }
}
