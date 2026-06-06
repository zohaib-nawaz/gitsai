import { AI_RETRY, SEARCH_LIMITS } from "@/lib/constants";
import { createLogger } from "@/lib/logger";
import { enrichCandidatesWithReadme } from "@/services/github/github-readme";
import {
  deduplicateCandidates,
  searchGitHubRepositories,
} from "@/services/github/github-search";
import { extractSearchIntent } from "@/services/openai/keyword-extraction";
import { evaluateRepositoryBatch } from "@/services/openai/repository-evaluation";
import type { RankedRepository, RepositoryEvaluation, SearchProgressEvent, SearchResponse } from "@/types/search";
import { sleep } from "@/utils/ai-retry";
import { runWithConcurrencyLimit } from "@/utils/async";
import { selectTopCandidates } from "@/utils/candidate-ranking";
import { buildFallbackSearchQueries } from "@/utils/search-queries";

const log = createLogger("search");

interface SearchContext {
  requestId?: string;
  onProgress?: (event: SearchProgressEvent) => void;
}

function reportProgress(
  context: SearchContext,
  step: SearchProgressEvent["step"],
  message: string,
  detail?: string,
): void {
  context.onProgress?.({ type: "progress", step, message, detail });
}

function chunkCandidates<T>(items: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }

  return chunks;
}

export async function executeRepositorySearch(
  userQuery: string,
  context: SearchContext = {},
): Promise<SearchResponse> {
  const { requestId } = context;
  const startedAt = Date.now();
  log.info("Starting repository search", { requestId, query: userQuery });

  reportProgress(context, "understanding", "Understanding your requirements…");

  const intentStartedAt = Date.now();
  const { keywords, requirements } = await extractSearchIntent(userQuery);
  log.debug("Extracted search intent", {
    requestId,
    keywords,
    requirements,
    durationMs: Date.now() - intentStartedAt,
  });

  reportProgress(
    context,
    "keywords",
    "Built search keywords",
    keywords.join(" · "),
  );

  reportProgress(context, "searching", "Searching GitHub repositories…");

  const githubStartedAt = Date.now();
  let searchQueries = [...new Set(keywords)];

  let searchResults = await Promise.all(
    searchQueries.map((keyword) => searchGitHubRepositories(keyword)),
  );

  let allCandidates = deduplicateCandidates(searchResults.flat());

  if (allCandidates.length === 0) {
    searchQueries = buildFallbackSearchQueries(keywords, userQuery);

    log.info("Primary GitHub search returned no results, trying fallback queries", {
      requestId,
      fallbackQueries: searchQueries,
    });

    reportProgress(
      context,
      "searching",
      "Broadening GitHub search…",
      searchQueries.join(" · "),
    );

    searchResults = await Promise.all(
      searchQueries.map((keyword) => searchGitHubRepositories(keyword)),
    );

    allCandidates = deduplicateCandidates(searchResults.flat());
  }

  const uniqueCandidates = selectTopCandidates(
    allCandidates,
    keywords,
    SEARCH_LIMITS.maxCandidates,
  );

  log.info("Candidates selected", {
    requestId,
    raw: allCandidates.length,
    unique: uniqueCandidates.length,
    durationMs: Date.now() - githubStartedAt,
    repos: uniqueCandidates.map((candidate) => candidate.fullName),
  });

  if (uniqueCandidates.length === 0) {
    reportProgress(context, "selecting", "No matching repositories found on GitHub");
    log.info("No candidates found", {
      requestId,
      durationMs: Date.now() - startedAt,
    });
    return {
      query: userQuery,
      keywords,
      repositories: [],
    };
  }

  reportProgress(
    context,
    "selecting",
    `Found ${uniqueCandidates.length} candidate repositories`,
    uniqueCandidates.map((candidate) => candidate.fullName).join(", "),
  );

  reportProgress(
    context,
    "readmes",
    `Reading README files (${uniqueCandidates.length} repos)…`,
  );

  const readmeStartedAt = Date.now();
  const enrichedCandidates = await runWithConcurrencyLimit(
    uniqueCandidates,
    SEARCH_LIMITS.concurrentReadmeFetches,
    (candidate) =>
      enrichCandidatesWithReadme([candidate]).then((results) => results[0]),
  );

  log.debug("README enrichment complete", {
    requestId,
    count: enrichedCandidates.length,
    durationMs: Date.now() - readmeStartedAt,
  });

  const candidateBatches = chunkCandidates(
    enrichedCandidates,
    SEARCH_LIMITS.evaluationBatchSize,
  );

  const evaluationMap = new Map<string, RepositoryEvaluation>();

  const evaluationStartedAt = Date.now();

  log.debug("Evaluating candidates", {
    requestId,
    batches: candidateBatches.length,
    batchSize: SEARCH_LIMITS.evaluationBatchSize,
  });

  if (candidateBatches.length === 1) {
    reportProgress(context, "evaluating", "Analyzing repositories with AI…");
  }

  for (const [batchIndex, batch] of candidateBatches.entries()) {
    if (batchIndex > 0) {
      await sleep(AI_RETRY.delayBetweenBatchMs);
    }

    const batchStartedAt = Date.now();

    if (candidateBatches.length > 1) {
      reportProgress(
        context,
        "evaluating",
        `Analyzing repositories (batch ${batchIndex + 1} of ${candidateBatches.length})…`,
        batch.map((candidate) => candidate.fullName).join(", "),
      );
    }

    log.debug("Evaluating batch", {
      requestId,
      batch: batchIndex + 1,
      total: candidateBatches.length,
      repos: batch.map((candidate) => candidate.fullName),
    });

    const batchEvaluations = await evaluateRepositoryBatch(
      userQuery,
      requirements,
      batch,
    );

    for (const [fullName, evaluation] of batchEvaluations) {
      evaluationMap.set(fullName, evaluation);
    }

    log.debug("Batch evaluation complete", {
      requestId,
      batch: batchIndex + 1,
      durationMs: Date.now() - batchStartedAt,
      scores: batch.map((candidate) => ({
        fullName: candidate.fullName,
        matchScore: batchEvaluations.get(candidate.fullName)?.matchScore,
      })),
    });
  }

  log.info("AI evaluation complete", {
    requestId,
    durationMs: Date.now() - evaluationStartedAt,
  });

  reportProgress(context, "ranking", "Ranking and selecting top results…");

  const evaluatedRepositories: RankedRepository[] = enrichedCandidates.map(
    (candidate) => ({
      ...candidate,
      ...(evaluationMap.get(candidate.fullName) ?? {
        matchScore: 50,
        technologiesDetected: [],
        summary: candidate.description ?? "",
        strengths: [],
        missingRequirements: [],
        recommendationReason: "Review this repository on GitHub.",
      }),
    }),
  );

  const sortedRepositories = evaluatedRepositories
    .sort((first, second) => second.matchScore - first.matchScore)
    .filter(
      (repository) => repository.matchScore >= SEARCH_LIMITS.minMatchScore,
    );

  const topRepositories =
    sortedRepositories.length > 0
      ? sortedRepositories.slice(0, SEARCH_LIMITS.maxResults)
      : evaluatedRepositories
          .sort((first, second) => second.matchScore - first.matchScore)
          .slice(0, SEARCH_LIMITS.maxResults);

  log.info("Search complete", {
    requestId,
    durationMs: Date.now() - startedAt,
    results: topRepositories.length,
    topMatch: topRepositories[0]?.fullName,
    topMatchScore: topRepositories[0]?.matchScore,
  });

  return {
    query: userQuery,
    keywords,
    repositories: topRepositories,
  };
}
