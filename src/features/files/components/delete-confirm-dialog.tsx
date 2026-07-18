"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  useDeleteFile,
  useDeleteMultipleFiles,
} from "@/features/upload/hooks/use-file-upload";
import { toast } from "sonner";
import { useFileList } from "../hooks/use-file-list";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileId?: string;
  fileName?: string;
  fileIds?: string[];
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  fileId,
  fileName,
  fileIds,
}: DeleteConfirmDialogProps) {
  const deleteFile = useDeleteFile();
  const deleteMultipleFiles = useDeleteMultipleFiles();
  const { data } = useFileList();

  const isBulk = Array.isArray(fileIds) && fileIds.length > 0;
  const files = data?.files ?? [];
  const selectedFiles = isBulk
    ? files.filter((f) => fileIds.includes(f.id))
    : [];
  const displayCount = isBulk ? selectedFiles.length : 1;
  const displayNames = isBulk
    ? selectedFiles.map((f) => f.name)
    : [fileName ?? ""];

  const handleDelete = async () => {
    try {
      if (isBulk) {
        await deleteMultipleFiles.mutateAsync(fileIds);
      } else if (fileId) {
        await deleteFile.mutateAsync(fileId);
      }
      onOpenChange(false);
    } catch {
      toast.error("Failed to delete file(s). Please try again.");
    }
  };

  const isPending = isBulk
    ? deleteMultipleFiles.isPending
    : deleteFile.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete {displayCount > 1 ? `${displayCount} files` : "File"}
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            {displayCount > 1
              ? `these ${displayCount} files`
              : `\u201c${fileName}\u201d`}
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {displayCount > 1 && (
          <div className="max-h-32 overflow-y-auto space-y-1 text-sm text-foreground">
            {displayNames.map((name) => (
              <div key={name} className="flex items-center gap-2">
                <span className="truncate">{name}</span>
              </div>
            ))}
          </div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
