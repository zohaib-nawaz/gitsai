import type { SearchProgress, SearchProgressItemStatus } from "@/types/search";

import { SEARCH_PAGE_WIDTH } from "@/lib/search-layout";

interface LoadingStateProps {
  progress?: SearchProgress | null;
  message?: string;
  query?: string;
}

function StepRow({
  status,
  message,
  detail,
}: {
  status: SearchProgressItemStatus;
  message: string;
  detail?: string;
}) {
  const isActive = status === "active";
  const isComplete = status === "complete";

  return (
    <li
      className={[
        "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm",
        isActive
          ? "bg-brand text-white shadow-md shadow-brand/15"
          : "bg-brand-bg/60 text-brand-muted",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs",
          isActive
            ? "bg-white/20"
            : isComplete
              ? "bg-brand/10 text-brand"
              : "bg-brand-secondary/50",
        ].join(" ")}
        aria-hidden="true"
      >
        {isComplete ? "✓" : isActive ? (
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          "·"
        )}
      </span>
      <div className="min-w-0 flex-1 text-left">
        <p className={isActive ? "font-medium text-white" : ""}>{message}</p>
        {detail && (
          <p
            className={[
              "mt-0.5 break-words text-xs leading-relaxed",
              isActive ? "text-white/70" : "text-brand-muted",
            ].join(" ")}
          >
            {detail}
          </p>
        )}
      </div>
    </li>
  );
}

export function LoadingState({
  progress,
  message = "Searching GitHub and analyzing repositories…",
  query,
}: LoadingStateProps) {
  const currentMessage = progress?.currentMessage ?? message;
  const steps = progress?.steps ?? [];

  return (
    <div
      className={`py-10 sm:py-14 ${SEARCH_PAGE_WIDTH}`}
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex w-full max-w-xl flex-col gap-8 sm:max-w-2xl">
        {query && (
          <div className="rounded-3xl border border-brand-border/70 bg-brand-surface px-6 py-5 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] gradient-text">
              Analyzing
            </p>
            <p className="mt-3 text-lg font-semibold leading-snug text-brand sm:text-xl">
              &ldquo;{query}&rdquo;
            </p>
          </div>
        )}

        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-bg">
            <span className="h-6 w-6 animate-spin rounded-full border-[3px] border-brand-border border-t-brand" />
          </div>

          <div className="space-y-2">
            <p className="text-base font-medium text-brand">{currentMessage}</p>
            <p className="text-sm text-brand-muted">
              This usually takes 15–30 seconds
            </p>
          </div>
        </div>

        {steps.length > 0 ? (
          <ol className="card-float space-y-3 rounded-3xl border border-brand-border/70 bg-brand-surface p-5 text-left sm:p-6">
            {steps.map((step) => (
              <StepRow
                key={step.id}
                status={step.status}
                message={step.message}
                detail={step.detail}
              />
            ))}
          </ol>
        ) : (
          <ol className="card-float space-y-3 rounded-3xl border border-brand-border/70 bg-brand-surface p-5 text-left sm:p-6">
            <StepRow status="active" message={currentMessage} />
          </ol>
        )}
      </div>
    </div>
  );
}
