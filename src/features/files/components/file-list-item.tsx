"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { useFileSelection } from "@/stores/file-selection";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { formatFileSize } from "@/lib/format";
import type { FileListItem } from "../hooks/use-file-list";

interface FileListItemProps {
  file: FileListItem;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" }
> = {
  processing: { label: "Processing", variant: "secondary" },
  uploading: { label: "Uploading", variant: "secondary" },
  error: { label: "Error", variant: "destructive" },
};

export function FileListItem({ file }: FileListItemProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { toggleFile, isSelected } = useFileSelection();
  const statusConfig = STATUS_CONFIG[file.status];

  return (
    <>
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted group">
        <Checkbox
          checked={isSelected(file.id)}
          onCheckedChange={() => toggleFile(file.id)}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate text-foreground">
            {file.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.size)}
          </p>
        </div>
        {statusConfig && (
          <Badge variant={statusConfig.variant} className="shrink-0">
            {statusConfig.label}
          </Badge>
        )}
        <button
          type="button"
          className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </button>
      </div>
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        fileId={file.id}
        fileName={file.name}
      />
    </>
  );
}
