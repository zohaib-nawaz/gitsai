import { ValidationError } from "@/lib/errors";
import { SEARCH_LIMITS } from "@/lib/constants";

export function validateSearchQuery(query: unknown): string {
  if (typeof query !== "string") {
    throw new ValidationError("Search query must be a text string");
  }

  const trimmedQuery = query.trim();

  if (trimmedQuery.length < SEARCH_LIMITS.minQueryLength) {
    throw new ValidationError(
      `Search query must be at least ${SEARCH_LIMITS.minQueryLength} characters`,
    );
  }

  if (trimmedQuery.length > SEARCH_LIMITS.maxQueryLength) {
    throw new ValidationError(
      `Search query must be at most ${SEARCH_LIMITS.maxQueryLength} characters`,
    );
  }

  return trimmedQuery;
}

export function clampMatchScore(score: number): number {
  return Math.min(100, Math.max(0, Math.round(score)));
}
