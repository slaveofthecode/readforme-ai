import { Skeleton } from "@/components/ui/skeleton";

export function ChatLoading() {
  return (
    <div className="flex gap-3">
      <Skeleton className="h-6 w-6 rounded-full shrink-0" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}
