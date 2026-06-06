import { createStructuredCompletion } from "@/services/ai/ai-client";
import type { RepositoryCandidate, RepositoryEvaluation } from "@/types/search";
import { stripListMarkerPrefix } from "@/utils/format";
import { clampMatchScore } from "@/utils/validation";

interface EvaluationResponse {
  matchScore: number;
  technologiesDetected: string[];
  summary: string;
  strengths: string[];
  missingRequirements: string[];
  recommendationReason: string;
}

interface BatchEvaluationItem extends EvaluationResponse {
  fullName: string;
}

interface BatchEvaluationResponse {
  evaluations: BatchEvaluationItem[];
}

const EVALUATION_SYSTEM_PROMPT = `You are an expert open-source advisor evaluating GitHub repositories against developer requirements.

Analyze the repository metadata and README excerpt, then score how well it matches the user's needs.

Return valid JSON with this exact shape:
{
  "matchScore": number (0-100),
  "technologiesDetected": ["string"],
  "summary": "string (1-2 sentences)",
  "strengths": ["string (plain phrase only — no bullets or checkmarks)"],
  "missingRequirements": ["string (plain phrase only — no bullets or dashes)"],
  "recommendationReason": "string (1 sentence, direct recommendation)"
}

Scoring guidelines:
- 90-100: Excellent match, production-ready starter/boilerplate covering most requirements
- 70-89: Strong match with minor gaps
- 50-69: Partial match, useful as reference or starter
- 20-49: Weak match, significant gaps
- 0-19: Not a match — curated lists, awesome-lists, interview repos, resource collections, or unrelated projects

Important:
- Curated lists (awesome-*, free-for-dev, design-resources, interview-questions) must score 0-15 even if they mention relevant tech
- Score 70+ for runnable starter projects, dashboards, admin panels, or tools that closely match the user's described product
- Partial matches (e.g. a SaaS dashboard missing one integration) can still score 50-69
- Do not inflate scores based on GitHub stars alone

Be honest about missing requirements. Prefer specific technology names in strengths.`;

const BATCH_EVALUATION_SYSTEM_PROMPT = `${EVALUATION_SYSTEM_PROMPT}

You will receive multiple repositories. Evaluate each one independently.

Return valid JSON with this exact shape:
{
  "evaluations": [
    {
      "fullName": "owner/repo",
      "matchScore": number (0-100),
      "technologiesDetected": ["string"],
      "summary": "string",
      "strengths": ["string"],
      "missingRequirements": ["string"],
      "recommendationReason": "string"
    }
  ]
}

Include one evaluation per repository. Use the exact fullName provided.`;

function buildRequirementsList(requirements: string[]): string {
  if (requirements.length === 0) {
    return "- General fit for the described project";
  }
  return requirements.map((req) => `- ${req}`).join("\n");
}

function buildSingleRepoSection(candidate: RepositoryCandidate): string {
  return `### ${candidate.fullName}
- Description: ${candidate.description ?? "No description"}
- Language: ${candidate.language ?? "Unknown"}
- Topics: ${candidate.topics.join(", ") || "None"}
- Stars: ${candidate.stars}
- Last updated: ${candidate.updatedAt}
- README excerpt:
${candidate.readmeContent ?? "No README available"}`;
}

function buildEvaluationPrompt(
  userQuery: string,
  requirements: string[],
  candidate: RepositoryCandidate,
): string {
  return `User query: ${userQuery}

User requirements:
${buildRequirementsList(requirements)}

Repository:
- Name: ${candidate.fullName}
- Description: ${candidate.description ?? "No description"}
- Language: ${candidate.language ?? "Unknown"}
- Topics: ${candidate.topics.join(", ") || "None"}
- Stars: ${candidate.stars}
- Last updated: ${candidate.updatedAt}

README excerpt:
${candidate.readmeContent ?? "No README available"}`;
}

function buildBatchEvaluationPrompt(
  userQuery: string,
  requirements: string[],
  candidates: RepositoryCandidate[],
): string {
  const repoSections = candidates.map(buildSingleRepoSection).join("\n\n");

  return `User query: ${userQuery}

User requirements:
${buildRequirementsList(requirements)}

Evaluate each repository below:

${repoSections}`;
}

function normalizeEvaluation(response: EvaluationResponse): RepositoryEvaluation {
  return {
    matchScore: clampMatchScore(response.matchScore),
    technologiesDetected: Array.isArray(response.technologiesDetected)
      ? response.technologiesDetected.filter(
          (tech): tech is string => typeof tech === "string" && tech.trim().length > 0,
        )
      : [],
    summary: response.summary ?? "",
    strengths: Array.isArray(response.strengths)
      ? response.strengths
          .filter((s): s is string => typeof s === "string")
          .map(stripListMarkerPrefix)
          .filter((s) => s.length > 0)
      : [],
    missingRequirements: Array.isArray(response.missingRequirements)
      ? response.missingRequirements
          .filter((s): s is string => typeof s === "string")
          .map(stripListMarkerPrefix)
          .filter((s) => s.length > 0)
      : [],
    recommendationReason: response.recommendationReason ?? "",
  };
}

function createFallbackEvaluation(): RepositoryEvaluation {
  return {
    matchScore: 50,
    technologiesDetected: [],
    summary: "Could not fully evaluate this repository.",
    strengths: [],
    missingRequirements: [],
    recommendationReason: "Review manually on GitHub.",
  };
}

export async function evaluateRepository(
  userQuery: string,
  requirements: string[],
  candidate: RepositoryCandidate,
): Promise<RepositoryEvaluation> {
  const response = await createStructuredCompletion<EvaluationResponse>(
    EVALUATION_SYSTEM_PROMPT,
    buildEvaluationPrompt(userQuery, requirements, candidate),
  );

  return normalizeEvaluation(response);
}

export async function evaluateRepositoryBatch(
  userQuery: string,
  requirements: string[],
  candidates: RepositoryCandidate[],
): Promise<Map<string, RepositoryEvaluation>> {
  if (candidates.length === 0) {
    return new Map();
  }

  if (candidates.length === 1) {
    const evaluation = await evaluateRepository(
      userQuery,
      requirements,
      candidates[0],
    );
    return new Map([[candidates[0].fullName, evaluation]]);
  }

  const response = await createStructuredCompletion<BatchEvaluationResponse>(
    BATCH_EVALUATION_SYSTEM_PROMPT,
    buildBatchEvaluationPrompt(userQuery, requirements, candidates),
  );

  const evaluationMap = new Map<string, RepositoryEvaluation>();

  for (const candidate of candidates) {
    const match = response.evaluations?.find(
      (item) => item.fullName === candidate.fullName,
    );

    evaluationMap.set(
      candidate.fullName,
      match ? normalizeEvaluation(match) : createFallbackEvaluation(),
    );
  }

  return evaluationMap;
}
