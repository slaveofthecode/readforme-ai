import { FileX } from "lucide-react";

export function EmptyFileList() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <FileX className="h-8 w-8 mb-2 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">No files uploaded yet</p>
      <p className="text-xs text-muted-foreground mt-1">
        Upload a PDF to get started
      </p>
    </div>
  );
}
