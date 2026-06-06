export const SEARCH_LIMITS = {
  maxQueryLength: 500,
  minQueryLength: 10,
  keywordsPerSearch: 3,
  reposPerKeyword: 10,
  maxCandidates: 8,
  maxResults: 5,
  minMatchScore: 35,
  readmeMaxLength: 1200,
  concurrentReadmeFetches: 3,
  evaluationBatchSize: 4,
} as const;

export const GEMINI_DEFAULT_MODEL = "gemini-2.5-flash-lite";

export const GEMINI_MODEL_FALLBACKS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
] as const;

export const AI_RETRY = {
  maxAttemptsPerModel: 3,
  initialDelayMs: 2000,
  backoffMultiplier: 2,
  delayBetweenBatchMs: 1500,
} as const;
