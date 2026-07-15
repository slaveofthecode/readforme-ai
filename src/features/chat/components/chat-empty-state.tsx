import { MessageSquare } from "lucide-react";

export function ChatEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <MessageSquare className="h-10 w-10 mb-3 text-muted-foreground" />
      <h3 className="text-lg font-medium text-foreground mb-1">
        Start a conversation
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Select PDF files from the sidebar and ask questions about their content.
      </p>
    </div>
  );
}
