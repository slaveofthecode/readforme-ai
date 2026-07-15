"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
      <div className="rounded-lg bg-destructive/10 p-6 max-w-md">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          An unexpected error occurred. Please try again.
        </p>
        <Button onClick={reset} variant="outline" size="sm">
          Try Again
        </Button>
      </div>
    </div>
  );
}
