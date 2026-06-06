import Link from "next/link";

import { Button } from "@/components/ui/Button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      className="card-float rounded-3xl border border-red-200 bg-red-50/80 px-6 py-10 text-center sm:px-10"
      role="alert"
    >
      <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
      <p className="mt-2 text-red-700">{message}</p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {onRetry && (
          <Button type="button" onClick={onRetry}>
            Try again
          </Button>
        )}
        <Link
          href="/search"
          className="text-sm font-medium text-brand-muted transition-colors hover:text-brand"
        >
          Start a new search
        </Link>
      </div>
    </div>
  );
}
