import type { RepositoryCandidate } from "@/types/search";

const LIST_NAME_PATTERN =
  /awesome|curated|resources|interview|free-for-dev|collection|awesome-list|design-resources|cheatsheet|roadmap|learning|tutorial-list|must-read|useful-links/i;

const LIST_DESCRIPTION_PATTERN =
  /curated list|collection of|list of|awesome list|free (tier|services|tools)|interview questions|learning resources|useful resources|design resources/i;

const BOILERPLATE_SIGNALS = [
  "boilerplate",
  "starter",
  "template",
  "scaffold",
  "kit",
  "saas",
  "fullstack",
  "monorepo",
  "dashboard",
  "admin",
  "monitoring",
  "analytics",
  "platform",
] as const;

export function isLikelyListRepository(candidate: RepositoryCandidate): boolean {
  const name = candidate.name.toLowerCase();
  const description = (candidate.description ?? "").toLowerCase();
  const topics = candidate.topics.map((topic) => topic.toLowerCase());

  if (LIST_NAME_PATTERN.test(name)) {
    return true;
  }

  if (topics.includes("awesome-list") || topics.includes("awesome")) {
    return true;
  }

  if (LIST_DESCRIPTION_PATTERN.test(description)) {
    return true;
  }

  return false;
}

export function scoreCandidateRelevance(
  candidate: RepositoryCandidate,
  keywords: readonly string[],
): number {
  let score = 0;
  const name = candidate.name.toLowerCase();
  const description = (candidate.description ?? "").toLowerCase();
  const topics = candidate.topics.join(" ").toLowerCase();
  const haystack = `${name} ${description} ${topics}`;

  for (const keyword of keywords) {
    for (const term of keyword.toLowerCase().split(/\s+/)) {
      if (term.length < 3) {
        continue;
      }

      if (name.includes(term)) {
        score += 12;
      }

      if (description.includes(term)) {
        score += 5;
      }

      if (topics.includes(term)) {
        score += 4;
      }
    }
  }

  for (const signal of BOILERPLATE_SIGNALS) {
    if (haystack.includes(signal)) {
      score += 10;
    }
  }

  if (isLikelyListRepository(candidate)) {
    score -= 100;
  }

  return score;
}

export function selectTopCandidates(
  candidates: RepositoryCandidate[],
  keywords: readonly string[],
  limit: number,
): RepositoryCandidate[] {
  const ranked = candidates
    .map((candidate) => ({
      candidate,
      score: scoreCandidateRelevance(candidate, keywords),
    }))
    .sort((first, second) => second.score - first.score);

  const relevant = ranked
    .filter((entry) => !isLikelyListRepository(entry.candidate))
    .slice(0, limit)
    .map((entry) => entry.candidate);

  if (relevant.length >= limit) {
    return relevant;
  }

  const seen = new Set(relevant.map((candidate) => candidate.fullName));
  const backfill = ranked
    .filter((entry) => !seen.has(entry.candidate.fullName))
    .slice(0, limit - relevant.length)
    .map((entry) => entry.candidate);

  return [...relevant, ...backfill];
}
