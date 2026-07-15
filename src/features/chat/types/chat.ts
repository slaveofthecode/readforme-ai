export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface ChatRequest {
  message: string;
  fileIds: string[];
}

export interface ChatSource {
  fileName: string;
  pageNumber: number;
  text: string;
}

export interface ChatResponse {
  content: string;
  sources: ChatSource[];
}
