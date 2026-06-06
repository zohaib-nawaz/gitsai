"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { SEARCH_LIMITS } from "@/lib/constants";

export const EXAMPLE_QUERY =
  "I need a multi-tenant SaaS starter using Next.js, Stripe, and Supabase.";

const EXAMPLE_QUERIES = [
  EXAMPLE_QUERY,
  "Python CLI for batch image optimization with progress bars and config files",
  "REST API boilerplate in Go with JWT auth, PostgreSQL, and Docker",
] as const;

interface SearchFormProps {
  size?: "default" | "large";
  showExamples?: boolean;
}

export function SearchForm({
  size = "default",
  showExamples = false,
}: SearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const isLarge = size === "large";

  function validateInput(value: string): string | null {
    const trimmed = value.trim();

    if (trimmed.length < SEARCH_LIMITS.minQueryLength) {
      return `Describe your project in at least ${SEARCH_LIMITS.minQueryLength} characters`;
    }

    if (trimmed.length > SEARCH_LIMITS.maxQueryLength) {
      return `Query must be under ${SEARCH_LIMITS.maxQueryLength} characters`;
    }

    return null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const error = validateInput(query);
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);
    const encodedQuery = encodeURIComponent(query.trim());
    router.push(`/search?q=${encodedQuery}`);
  }

  function applyExample(example: string) {
    setQuery(example);
    setValidationError(null);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={["flex w-full flex-col", isLarge ? "gap-6" : "gap-4"].join(" ")}
    >
      <Textarea
        label="Describe what you want to build"
        hint="Be specific about tech stack, features, and architecture."
        placeholder={EXAMPLE_QUERY}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          if (validationError) {
            setValidationError(null);
          }
        }}
        error={validationError ?? undefined}
        maxLength={SEARCH_LIMITS.maxQueryLength}
        className={isLarge ? "min-h-44 sm:min-h-52" : undefined}
      />

      {showExamples && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
            Try an example
          </p>
          <div className="flex flex-col gap-2">
            {EXAMPLE_QUERIES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => applyExample(example)}
                className="rounded-2xl border border-brand-border/60 bg-brand-bg/40 px-4 py-3 text-left text-sm leading-relaxed text-brand-muted transition-colors hover:border-brand-border hover:bg-brand-bg hover:text-brand"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        {!showExamples && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => applyExample(EXAMPLE_QUERY)}
            className="w-full sm:w-auto"
          >
            Use example
          </Button>
        )}
        <Button type="submit" className="w-full sm:w-auto">
          Discover Repositories
        </Button>
      </div>
    </form>
  );
}
