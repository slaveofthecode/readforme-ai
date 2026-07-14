# SKILL: LLM INTEGRATION (GOOGLE GEMINI)

## 1. SDK Setup

- Use `@google/generative-ai` SDK for Gemini API integration.
- Initialize the client with the API key from environment variables:

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
```

## 2. Model Selection

- **Gemini 1.5 Flash:** Default for chat responses (fast, cost-effective, free tier).
- **Gemini 1.5 Pro:** For complex queries requiring deeper reasoning.
- **text-embedding-004:** For generating embeddings for vector search.
- Configure model via environment variable so it can be changed without code changes.

## 3. Prompt Engineering

- System prompt must be separate from user message (Gemini supports system instructions).
- Include retrieved context in the system prompt for RAG.
- Set appropriate safety settings to prevent harmful content.
- Use structured output (JSON mode) when the response needs to be parsed programmatically.

## 4. Streaming

- Use `generateContentStream()` for streaming responses in the chat interface.
- Stream directly to the client via Server-Sent Events (SSE) or WebSocket.
- Handle backpressure: if the client disconnects, stop the stream.

## 5. Rate Limits & Free Tier

- Gemini free tier: 60 requests per minute, 1500 requests per day (limits may vary).
- Implement exponential backoff for rate limit errors (HTTP 429).
- Cache common queries to reduce API calls.
- Monitor usage and log warnings when approaching free tier limits.
- Consider implementing a queue for concurrent requests.

## 6. Error Handling

- Handle API errors gracefully: rate limits, model overload, invalid requests.
- Retry with backoff on transient errors (5xx status codes).
- Log errors with enough context for debugging without exposing API keys.
- Fall back gracefully if the LLM is unavailable.
