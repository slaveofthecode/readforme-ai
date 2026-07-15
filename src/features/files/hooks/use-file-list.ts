"use client";

import { useQuery } from "@tanstack/react-query";

export interface FileListItem {
  id: string;
  name: string;
  size: number;
  status: "uploading" | "processing" | "ready" | "error";
  pageCount: number | null;
  errorMessage: string | null;
  createdAt: string;
}

interface FileListResponse {
  files: FileListItem[];
}

export function useFileList() {
  return useQuery<FileListResponse>({
    queryKey: ["files"],
    queryFn: async () => {
      const response = await fetch("/api/files");
      if (!response.ok) throw new Error("Failed to fetch files");
      return response.json();
    },
  });
}
