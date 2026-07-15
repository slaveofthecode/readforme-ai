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
import { useDeleteFile } from "@/features/upload/hooks/use-file-upload";
import { toast } from "sonner";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileId: string;
  fileName: string;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  fileId,
  fileName,
}: DeleteConfirmDialogProps) {
  const deleteFile = useDeleteFile();

  const handleDelete = async () => {
    try {
      await deleteFile.mutateAsync(fileId);
      onOpenChange(false);
    } catch {
      toast.error(`Failed to delete "${fileName}". Please try again.`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete File</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &ldquo;{fileName}&rdquo;? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteFile.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteFile.isPending}
          >
            {deleteFile.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
