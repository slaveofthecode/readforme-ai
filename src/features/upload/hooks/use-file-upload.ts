"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

interface FileData {
  id: string
  name: string
  status: "uploading" | "processing" | "ready" | "error"
  pageCount?: number
  errorMessage?: string
  createdAt: string
}

export function useFileStatus(fileId: string | null) {
  return useQuery<FileData>({
    queryKey: ["file", fileId],
    queryFn: async () => {
      const response = await fetch(`/api/files/${fileId}`)
      if (!response.ok) throw new Error("Failed to fetch file")
      return response.json()
    },
    enabled: !!fileId,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status === "processing" || status === "uploading") {
        return 2000
      }
      return false
    },
  })
}

export function useDeleteFile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (fileId: string) => {
      const response = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete file")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] })
    },
  })
}
