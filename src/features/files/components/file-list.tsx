"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { useFileList } from "../hooks/use-file-list";
import { useFileSelection } from "@/stores/file-selection";
import { FileListItem } from "./file-list-item";
import { EmptyFileList } from "./empty-file-list";

export function FileList() {
  const { data, isLoading } = useFileList();
  const { selectedFileIds, selectAll, clearAll } = useFileSelection();

  const files = data?.files ?? [];
  const readyFileIds = files
    .filter((f) => f.status === "ready")
    .map((f) => f.id);
  const allSelected =
    readyFileIds.length > 0 &&
    readyFileIds.every((id) => selectedFileIds.includes(id));

  const handleSelectAll = () => {
    if (allSelected) {
      clearAll();
    } else {
      selectAll(readyFileIds);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2 px-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (files.length === 0) {
    return <EmptyFileList />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-2 py-1.5">
        <Checkbox checked={allSelected} onCheckedChange={handleSelectAll} />
        <span className="text-sm font-medium text-foreground">Files</span>
        <span className="text-xs text-muted-foreground">
          ({selectedFileIds.length} selected)
        </span>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-0.5">
          {files.map((file) => (
            <FileListItem key={file.id} file={file} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
