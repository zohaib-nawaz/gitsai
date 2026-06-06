import type { AiProvider } from "@/types/ai";
import { GEMINI_DEFAULT_MODEL } from "@/lib/constants";

function getOptionalEnv(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

function resolveAiProvider(): AiProvider {
  const explicitProvider = process.env.AI_PROVIDER?.toLowerCase();

  if (explicitProvider === "openai" || explicitProvider === "gemini") {
    return explicitProvider;
  }

  const hasGeminiKey =
    Boolean(process.env.GEMINI_API_KEY) ||
    Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

  const hasOpenAiKey = Boolean(process.env.OPENAI_API_KEY);

  if (hasGeminiKey && hasOpenAiKey) {
    throw new Error(
      "Both GEMINI_API_KEY and OPENAI_API_KEY are set. Set AI_PROVIDER to 'openai' or 'gemini'.",
    );
  }

  if (hasGeminiKey) {
    return "gemini";
  }

  if (hasOpenAiKey) {
    return "openai";
  }

  if (process.env.AI_API_KEY) {
    throw new Error(
      "AI_API_KEY is set but AI_PROVIDER is missing. Set AI_PROVIDER to 'openai' or 'gemini'.",
    );
  }

  throw new Error(
    "Missing AI configuration. Set AI_PROVIDER + AI_API_KEY, or GEMINI_API_KEY, or OPENAI_API_KEY.",
  );
}

function resolveAiApiKey(provider: AiProvider): string {
  const unifiedKey = process.env.AI_API_KEY?.trim();
  if (unifiedKey) {
    return unifiedKey;
  }

  if (provider === "gemini") {
    const geminiKey =
      process.env.GEMINI_API_KEY?.trim() ??
      process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();

    if (geminiKey) {
      return geminiKey;
    }

    throw new Error(
      "Missing Gemini API key. Set AI_API_KEY or GEMINI_API_KEY.",
    );
  }

  const openAiKey = process.env.OPENAI_API_KEY?.trim();
  if (openAiKey) {
    return openAiKey;
  }

  throw new Error(
    "Missing OpenAI API key. Set AI_API_KEY or OPENAI_API_KEY.",
  );
}

export function getAiProvider(): AiProvider {
  return resolveAiProvider();
}

export function getAiApiKey(): string {
  return resolveAiApiKey(getAiProvider());
}

export function getAiModel(): string {
  const explicitModel = process.env.AI_MODEL?.trim();
  if (explicitModel) {
    return explicitModel;
  }

  const provider = getAiProvider();
  return provider === "gemini" ? GEMINI_DEFAULT_MODEL : "gpt-4o-mini";
}

export function getGitHubToken(): string | undefined {
  return process.env.GITHUB_TOKEN;
}

/** @deprecated Use getAiApiKey() */
export function getOpenAiApiKey(): string {
  return getAiApiKey();
}

/** @deprecated Use getAiModel() */
export function getOpenAiModel(): string {
  return getAiModel();
}
