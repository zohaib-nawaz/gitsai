"use client";

import { Suspense, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { EmptyState } from "@/components/search/EmptyState";
import { ErrorState } from "@/components/search/ErrorState";
import { LoadingState } from "@/components/search/LoadingState";
import { RepositoryCard } from "@/components/search/RepositoryCard";
import { SearchPageForm } from "@/components/search/SearchPageForm";
import { useRepositorySearch } from "@/features/search/hooks/useRepositorySearch";
import { SEARCH_PAGE_WIDTH } from "@/lib/search-layout";

function SearchResultsHeader({
  query,
  keywords,
  resultCount,
}: {
  query: string;
  keywords?: string[];
  resultCount?: number;
}) {
  return (
    <header className="mb-8 sm:mb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-muted transition-colors hover:text-brand"
        >
          ← New search
        </Link>
        {resultCount !== undefined && (
          <p className="text-sm text-brand-muted">
            {resultCount} {resultCount === 1 ? "repository" : "repositories"} ranked
            by AI
          </p>
        )}
      </div>

      <div className="mt-6 rounded-3xl border border-brand-border/70 bg-brand-surface p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] gradient-text">
          Search results
        </p>
        <h1 className="mt-3 text-xl font-bold leading-snug text-brand sm:text-2xl">
          &ldquo;{query}&rdquo;
        </h1>

        {keywords && keywords.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2 border-t border-brand-border/50 pt-5">
            <span className="mr-1 self-center text-xs font-medium text-brand-muted">
              Keywords:
            </span>
            {keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full bg-brand-bg px-3 py-1 text-xs font-medium text-brand"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

function SearchResultsView({ query }: { query: string }) {
  const { state, search } = useRepositorySearch();
  const lastSearchedQuery = useRef<string | null>(null);

  useEffect(() => {
    if (query === lastSearchedQuery.current) {
      return;
    }

    lastSearchedQuery.current = query;
    void search(query);
  }, [query, search]);

  if (state.status === "loading" || state.status === "idle") {
    return <LoadingState progress={state.progress} query={query} />;
  }

  if (state.status === "error") {
    return (
      <div className="flex flex-col gap-8">
        <SearchResultsHeader query={query} />
        <ErrorState
          message={state.error ?? "Search failed"}
          onRetry={() => void search(query)}
        />
      </div>
    );
  }

  if (state.status === "empty") {
    return (
      <div className="flex flex-col gap-8">
        <SearchResultsHeader query={query} keywords={state.data?.keywords} />
        <EmptyState query={query} />
      </div>
    );
  }

  const repositories = state.data?.repositories ?? [];

  return (
    <div className="flex flex-col gap-8">
      <SearchResultsHeader
        query={query}
        keywords={state.data?.keywords}
        resultCount={repositories.length}
      />

      <div className="flex flex-col gap-6 sm:gap-8">
        {repositories.map((repository, index) => (
          <RepositoryCard
            key={repository.fullName}
            repository={repository}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return <SearchPageForm />;
  }

  return (
    <main className={`py-10 sm:py-14 ${SEARCH_PAGE_WIDTH}`}>
      <SearchResultsView query={query} />
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageForm />}>
      <SearchPageContent />
    </Suspense>
  );
}
