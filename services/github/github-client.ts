import { getGitHubToken } from "@/lib/env";
import { GitHubApiError, RateLimitError } from "@/lib/errors";
import { createLogger } from "@/lib/logger";
import type { GitHubRateLimitHeaders } from "@/types/github";

const GITHUB_API_BASE_URL = "https://api.github.com";

const log = createLogger("github");

interface GitHubRequestOptions {
  path: string;
  accept?: string;
}

export async function githubRequest<T>({
  path,
  accept = "application/vnd.github+json",
}: GitHubRequestOptions): Promise<{ data: T; rateLimit: GitHubRateLimitHeaders }> {
  const token = getGitHubToken();

  const response = await fetch(`${GITHUB_API_BASE_URL}${path}`, {
    headers: {
      Accept: accept,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    next: { revalidate: 0 },
  });

  const remaining = Number(response.headers.get("x-ratelimit-remaining") ?? "0");
  const reset = Number(response.headers.get("x-ratelimit-reset") ?? "0");

  if (response.status === 403 && remaining === 0) {
    throw new RateLimitError(
      "GitHub API rate limit exceeded. Add GITHUB_TOKEN to increase limits.",
    );
  }

  if (!response.ok) {
    const errorBody = await response.text();
    throw new GitHubApiError(
      `GitHub API request failed: ${errorBody || response.statusText}`,
      response.status,
    );
  }

  const data = (await response.json()) as T;

  log.debug("GitHub API request succeeded", {
    path,
    remaining,
  });

  return {
    data,
    rateLimit: { remaining, reset },
  };
}

export async function githubRequestRaw({
  path,
  accept = "application/vnd.github.raw",
}: GitHubRequestOptions): Promise<string | null> {
  const token = getGitHubToken();

  const response = await fetch(`${GITHUB_API_BASE_URL}${path}`, {
    headers: {
      Accept: accept,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    next: { revalidate: 0 },
  });

  if (response.status === 404) {
    return null;
  }

  const remaining = Number(response.headers.get("x-ratelimit-remaining") ?? "0");

  if (response.status === 403 && remaining === 0) {
    throw new RateLimitError(
      "GitHub API rate limit exceeded. Add GITHUB_TOKEN to increase limits.",
    );
  }

  if (!response.ok) {
    return null;
  }

  return response.text();
}
