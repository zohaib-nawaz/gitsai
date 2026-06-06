import { SEARCH_LIMITS } from "@/lib/constants";
import { githubRequestRaw } from "@/services/github/github-client";
import type { RepositoryCandidate } from "@/types/search";

function truncateReadme(content: string): string {
  if (content.length <= SEARCH_LIMITS.readmeMaxLength) {
    return content;
  }
  return `${content.slice(0, SEARCH_LIMITS.readmeMaxLength)}\n\n[README truncated]`;
}

export async function fetchRepositoryReadme(
  owner: string,
  repoName: string,
): Promise<string | null> {
  const rawContent = await githubRequestRaw({
    path: `/repos/${owner}/${repoName}/readme`,
  });

  if (!rawContent) {
    return null;
  }

  return truncateReadme(rawContent);
}

export async function enrichCandidatesWithReadme(
  candidates: RepositoryCandidate[],
): Promise<RepositoryCandidate[]> {
  return Promise.all(
    candidates.map(async (candidate) => {
      const readmeContent = await fetchRepositoryReadme(
        candidate.owner,
        candidate.name,
      );

      return {
        ...candidate,
        readmeContent,
      };
    }),
  );
}
