const EMBEDDING_MODEL = "gemini-embedding-001"
const EMBEDDING_DIMENSIONS = 768
const BATCH_SIZE = 100
const MAX_RETRIES = 3
const INITIAL_RETRY_DELAY = 1000

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta"

interface EmbeddingRequest {
  model: string
  content: { parts: { text: string }[] }
  taskType: string
  outputDimensionality?: number
}

interface EmbeddingResponse {
  embeddings: { values: number[] }[]
}

async function embedBatchWithRetry(
  texts: string[],
  retryCount = 0
): Promise<number[][]> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set")

  const requests: EmbeddingRequest[] = texts.map((text) => ({
    model: `models/${EMBEDDING_MODEL}`,
    content: { parts: [{ text }] },
    taskType: "RETRIEVAL_DOCUMENT",
    outputDimensionality: EMBEDDING_DIMENSIONS,
  }))

  try {
    const response = await fetch(
      `${GEMINI_API_URL}/models/${EMBEDDING_MODEL}:batchEmbedContents?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requests }),
      }
    )

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(
        `Gemini API error: ${response.status} ${response.statusText} - ${errorBody}`
      )
    }

    const data: EmbeddingResponse = await response.json()
    return data.embeddings.map((e) => e.values)
  } catch (error: unknown) {
    const isRateLimit =
      error instanceof Error && error.message.includes("429")

    if (isRateLimit && retryCount < MAX_RETRIES) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount)
      await new Promise((resolve) => setTimeout(resolve, delay))
      return embedBatchWithRetry(texts, retryCount + 1)
    }

    throw error
  }
}

export async function generateEmbeddings(
  texts: string[]
): Promise<number[][]> {
  const allEmbeddings: number[][] = []

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE)
    const batchEmbeddings = await embedBatchWithRetry(batch)
    allEmbeddings.push(...batchEmbeddings)
  }

  return allEmbeddings
}
