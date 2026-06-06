import Link from "next/link";

interface EmptyStateProps {
  query: string;
}

export function EmptyState({ query }: EmptyStateProps) {
  return (
    <div className="card-float rounded-3xl border border-dashed border-brand-border bg-brand-surface px-6 py-16 text-center sm:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] gradient-text">
        No matches
      </p>
      <h2 className="mt-4 text-xl font-bold text-brand">
        No matching repositories found
      </h2>
      <p className="mt-3 text-brand-muted">
        We could not find strong matches for: &ldquo;{query}&rdquo;
      </p>
      <p className="mt-4 text-sm text-brand-muted">
        Try broadening your description or using different technology names.
      </p>
      <Link
        href="/search"
        className="btn-brand mt-8 inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold"
      >
        Try a new search
      </Link>
    </div>
  );
}
