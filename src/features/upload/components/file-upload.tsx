"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Upload, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface UploadState {
  id: string;
  name: string;
  progress: number;
  status: "uploading" | "processing" | "ready" | "error";
  error?: string;
}

export function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const pollFileStatus = useCallback(
    async (fileId: string) => {
      const maxAttempts = 60;
      let attempts = 0;

      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        try {
          const response = await fetch(`/api/files/${fileId}`);
          if (!response.ok) continue;

          const data = await response.json();

          if (data.status === "ready" || data.status === "error") {
            setUploads((prev) =>
              prev.map((u) =>
                u.id === fileId
                  ? {
                      ...u,
                      status: data.status,
                      error: data.errorMessage,
                    }
                  : u,
              ),
            );
            if (data.status === "ready") {
              queryClient.invalidateQueries({ queryKey: ["files"] });
            }
            return;
          }
        } catch {
          // Continue polling
        }

        attempts++;
      }

      setUploads((prev) =>
        prev.map((u) =>
          u.id === fileId
            ? { ...u, status: "error", error: "Processing timeout" }
            : u,
        ),
      );
    },
    [queryClient],
  );

  const handleFile = useCallback(
    async (file: File) => {
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are allowed");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB limit");
        return;
      }

      const uploadId = crypto.randomUUID();
      const uploadState: UploadState = {
        id: uploadId,
        name: file.name,
        progress: 0,
        status: "uploading",
      };

      setUploads((prev) => [...prev, uploadState]);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const xhr = new XMLHttpRequest();

        const result = await new Promise<{
          id: string;
          name: string;
          status: string;
        }>((resolve, reject) => {
          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              const progress = Math.round((e.loaded / e.total) * 100);
              setUploads((prev) =>
                prev.map((u) => (u.id === uploadId ? { ...u, progress } : u)),
              );
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject(new Error("Upload failed"));
            }
          });

          xhr.addEventListener("error", () =>
            reject(new Error("Upload failed")),
          );

          xhr.open("POST", "/api/upload");
          xhr.send(formData);
        });

        setUploads((prev) =>
          prev.map((u) =>
            u.id === uploadId
              ? { ...u, id: result.id, status: "processing", progress: 100 }
              : u,
          ),
        );

        pollFileStatus(result.id);
      } catch {
        setUploads((prev) =>
          prev.map((u) =>
            u.id === uploadId
              ? { ...u, status: "error", error: "Upload failed" }
              : u,
          ),
        );
      }
    },
    [pollFileStatus],
  );

  useEffect(() => {
    const readyIds = uploads
      .filter((u) => u.status === "ready")
      .map((u) => u.id);
    if (readyIds.length === 0) return;

    const timer = setTimeout(() => {
      setUploads((prev) => prev.filter((u) => !readyIds.includes(u.id)));
    }, 5000);

    return () => clearTimeout(timer);
  }, [uploads]);

  const removeUpload = useCallback((id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      files.forEach(handleFile);
    },
    [handleFile],
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(handleFile);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleInputChange}
        multiple
      />

      <button
        type="button"
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "w-full p-4 border-2 border-dashed rounded-lg transition-colors",
          "text-center text-sm text-muted-foreground",
          "hover:border-primary/50 hover:bg-accent/50",
          isDragging && "border-primary bg-accent/50",
        )}
      >
        <Upload className="h-6 w-6 mx-auto mb-2" />
        <p>Drop PDF here or click to upload</p>
        <p className="text-xs mt-1">Max 10MB</p>
      </button>

      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map((upload) => (
            <div
              key={upload.id}
              className="p-3 bg-card border border-border rounded-lg"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{upload.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {upload.status === "uploading" && (
                      <>
                        <Progress value={upload.progress} className="flex-1" />
                        <span className="text-xs text-muted-foreground">
                          {upload.progress}%
                        </span>
                      </>
                    )}
                    {upload.status === "processing" && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Processing...
                      </div>
                    )}
                    {upload.status === "ready" && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle2 className="h-3 w-3" />
                        Ready
                      </div>
                    )}
                    {upload.status === "error" && (
                      <div className="flex items-center gap-1 text-xs text-red-600">
                        <AlertCircle className="h-3 w-3" />
                        {upload.error || "Error"}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeUpload(upload.id)}
                  className="p-1 hover:bg-accent rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Files are automatically deleted after 24 hours
      </p>
    </div>
  );
}
