import { SEARCH_LIMITS } from "@/lib/constants";
import { createLogger } from "@/lib/logger";
import { githubRequest } from "@/services/github/github-client";
import type { GitHubSearchResponse } from "@/types/github";
import type { RepositoryCandidate } from "@/types/search";
import { shortenSearchKeyword } from "@/utils/search-queries";

const log = createLogger("github:search");

const SEARCH_EXCLUSIONS = [
  "awesome",
  "curated",
  "interview",
  "collection",
  "roadmap",
  "cheatsheet",
] as const;

type SearchScope = "name,description" | "name";

function buildSearchQuery(keyword: string, scope: SearchScope, withExclusions: boolean): string {
  const trimmedKeyword = shortenSearchKeyword(keyword);
  const scopeQualifier = scope === "name" ? "in:name" : "in:name,description";

  if (!withExclusions) {
    return `${trimmedKeyword} ${scopeQualifier}`;
  }

  const exclusions = SEARCH_EXCLUSIONS.map((term) => `-${term}`).join(" ");
  return `${trimmedKeyword} ${scopeQualifier} ${exclusions}`;
}

function mapGitHubItemToCandidate(
  item: GitHubSearchResponse["items"][number],
): RepositoryCandidate {
  return {
    fullName: item.full_name,
    name: item.name,
    owner: item.owner.login,
    description: item.description,
    htmlUrl: item.html_url,
    topics: item.topics ?? [],
    language: item.language,
    stars: item.stargazers_count,
    updatedAt: item.updated_at,
    readmeContent: null,
  };
}

async function fetchGitHubSearchResults(query: string): Promise<RepositoryCandidate[]> {
  const encodedQuery = encodeURIComponent(query);
  const perPage = SEARCH_LIMITS.reposPerKeyword;

  const { data } = await githubRequest<GitHubSearchResponse>({
    path: `/search/repositories?q=${encodedQuery}&sort=best-match&order=desc&per_page=${perPage}`,
  });

  return data.items.map(mapGitHubItemToCandidate);
}

export async function searchGitHubRepositories(
  keyword: string,
): Promise<RepositoryCandidate[]> {
  const strategies: Array<{ query: string; label: string }> = [
    {
      query: buildSearchQuery(keyword, "name,description", true),
      label: "strict",
    },
    {
      query: buildSearchQuery(keyword, "name,description", false),
      label: "broad",
    },
    {
      query: buildSearchQuery(keyword, "name", false),
      label: "name-only",
    },
  ];

  for (const strategy of strategies) {
    const results = await fetchGitHubSearchResults(strategy.query);

    if (results.length > 0) {
      log.debug("GitHub keyword search complete", {
        keyword,
        strategy: strategy.label,
        resultCount: results.length,
        repos: results.map((repo) => repo.fullName),
      });
      return results;
    }
  }

  log.debug("GitHub keyword search complete", {
    keyword,
    strategy: "none",
    resultCount: 0,
    repos: [],
  });

  return [];
}

export function deduplicateCandidates(
  candidates: RepositoryCandidate[],
): RepositoryCandidate[] {
  const seen = new Set<string>();
  const uniqueCandidates: RepositoryCandidate[] = [];

  for (const candidate of candidates) {
    if (seen.has(candidate.fullName)) {
      continue;
    }
    seen.add(candidate.fullName);
    uniqueCandidates.push(candidate);
  }

  return uniqueCandidates;
}
