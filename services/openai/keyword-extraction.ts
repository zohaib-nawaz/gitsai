import { SEARCH_LIMITS } from "@/lib/constants";
import { createStructuredCompletion } from "@/services/ai/ai-client";
import type { SearchIntent } from "@/types/search";
import { shortenSearchKeyword } from "@/utils/search-queries";

interface KeywordExtractionResponse {
  keywords: string[];
  requirements: string[];
}

const KEYWORD_EXTRACTION_SYSTEM_PROMPT = `You are an expert at translating developer requirements into GitHub repository search queries.

Given a natural language description of what a developer wants to build, extract:
1. keywords: 3 SHORT GitHub search phrases (2-4 words each)
2. requirements: key technical and functional requirements from the description

Return valid JSON with this exact shape:
{
  "keywords": ["string"],
  "requirements": ["string"]
}

Rules:
- Keep each keyword SHORT (2-4 words). GitHub search uses AND logic — long phrases return zero results
- Match the user's intent:
  - Building a new app → use starter/boilerplate/template keywords
  - Building a dashboard/product → use product-type keywords (e.g. "saas admin dashboard", "github analytics dashboard")
  - Integrating services → use integration keywords (e.g. "stripe github integration", "vercel deployment dashboard")
- Use the most distinctive tech names from the query (GitHub, Vercel, Stripe, Next.js, etc.)
- Good examples: "saas admin dashboard", "stripe billing dashboard", "github deployment monitor"
- Bad examples: "nextjs saas dashboard template react admin boilerplate" (too long)
- Avoid generic single-word keywords (auth, analytics) that match curated lists
- Use common tech names (Next.js -> nextjs, PostgreSQL -> postgres)
- Requirements should be concrete and checkable
- Do not include explanations outside the JSON`;

export async function extractSearchIntent(
  userQuery: string,
): Promise<SearchIntent> {
  const response = await createStructuredCompletion<KeywordExtractionResponse>(
    KEYWORD_EXTRACTION_SYSTEM_PROMPT,
    userQuery,
  );

  const keywords = response.keywords
    .filter((keyword): keyword is string => typeof keyword === "string")
    .map((keyword) => shortenSearchKeyword(keyword))
    .filter(Boolean)
    .slice(0, SEARCH_LIMITS.keywordsPerSearch);

  const requirements = response.requirements
    .filter((req): req is string => typeof req === "string")
    .map((req) => req.trim())
    .filter(Boolean);

  if (keywords.length === 0) {
    throw new Error("Failed to extract search keywords from query");
  }

  return { keywords, requirements };
}
