const KNOWN_TECH_TERMS = [
  "github",
  "vercel",
  "stripe",
  "nextjs",
  "react",
  "vue",
  "saas",
  "dashboard",
  "deployment",
  "monitoring",
  "analytics",
  "admin",
  "supabase",
  "postgres",
  "tailwind",
] as const;

const MAX_KEYWORD_WORDS = 4;

export function shortenSearchKeyword(keyword: string): string {
  return keyword
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, MAX_KEYWORD_WORDS)
    .join(" ");
}

export function extractTechTermsFromQuery(query: string): string[] {
  const lowerQuery = query.toLowerCase();

  return KNOWN_TECH_TERMS.filter((term) => lowerQuery.includes(term));
}

export function buildFallbackSearchQueries(
  keywords: readonly string[],
  userQuery: string,
): string[] {
  const techTerms = extractTechTermsFromQuery(userQuery);
  const queries = new Set<string>();

  for (const keyword of keywords) {
    queries.add(shortenSearchKeyword(keyword));
  }

  if (techTerms.length >= 2) {
    queries.add(`${techTerms[0]} ${techTerms[1]} dashboard`);
    queries.add(`${techTerms[0]} ${techTerms[1]} integration`);
  }

  if (techTerms.includes("saas") && techTerms.includes("dashboard")) {
    queries.add("saas admin dashboard");
  }

  if (techTerms.includes("github") && techTerms.includes("stripe")) {
    queries.add("github stripe dashboard");
  }

  if (techTerms.includes("vercel") && techTerms.includes("github")) {
    queries.add("vercel github dashboard");
  }

  if (techTerms.includes("deployment") || techTerms.includes("monitoring")) {
    queries.add("deployment monitoring dashboard");
  }

  if (queries.size === 0) {
    queries.add(shortenSearchKeyword(userQuery));
  }

  return [...queries].slice(0, 5);
}
