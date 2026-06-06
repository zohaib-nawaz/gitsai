import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

import {
  AI_RETRY,
  GEMINI_MODEL_FALLBACKS,
} from "@/lib/constants";
import { getAiApiKey, getAiModel, getAiProvider } from "@/lib/env";
import { AiApiError } from "@/lib/errors";
import { createLogger } from "@/lib/logger";
import type { AiProvider } from "@/types/ai";
import {
  isFatalAiError,
  isRetryableAiError,
  sleep,
  toUserFriendlyAiError,
  uniqueModels,
} from "@/utils/ai-retry";

let openAiClient: OpenAI | null = null;
let geminiClient: GoogleGenerativeAI | null = null;

const log = createLogger("ai");

function getOpenAiClient(): OpenAI {
  if (!openAiClient) {
    openAiClient = new OpenAI({ apiKey: getAiApiKey() });
  }
  return openAiClient;
}

function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiClient) {
    geminiClient = new GoogleGenerativeAI(getAiApiKey());
  }
  return geminiClient;
}

function getGeminiModelsToTry(): string[] {
  const primaryModel = getAiModel();
  return uniqueModels([primaryModel, ...GEMINI_MODEL_FALLBACKS]);
}

async function createOpenAiStructuredCompletion<T>(
  systemPrompt: string,
  userPrompt: string,
): Promise<T> {
  const client = getOpenAiClient();
  let delayMs = AI_RETRY.initialDelayMs;
  let lastError: unknown;

  for (let attempt = 0; attempt <= AI_RETRY.maxAttemptsPerModel; attempt += 1) {
    try {
      const response = await client.chat.completions.create({
        model: getAiModel(),
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new AiApiError("OpenAI returned an empty response");
      }

      return JSON.parse(content) as T;
    } catch (error) {
      lastError = error;

      if (
        error instanceof AiApiError ||
        isFatalAiError(error) ||
        !isRetryableAiError(error) ||
        attempt === AI_RETRY.maxAttemptsPerModel
      ) {
        break;
      }

      log.warn("Retrying OpenAI request", {
        model: getAiModel(),
        attempt: attempt + 1,
        delayMs,
      });

      await sleep(delayMs);
      delayMs *= AI_RETRY.backoffMultiplier;
    }
  }

  throw lastError;
}

async function generateGeminiContent(
  modelName: string,
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({
    model: modelName,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent(userPrompt);
  const content = result.response.text();

  if (!content) {
    throw new AiApiError("Gemini returned an empty response");
  }

  return content;
}

async function createGeminiStructuredCompletion<T>(
  systemPrompt: string,
  userPrompt: string,
): Promise<T> {
  const modelsToTry = getGeminiModelsToTry();
  let lastError: unknown;

  for (const modelName of modelsToTry) {
    let delayMs = AI_RETRY.initialDelayMs;

    for (let attempt = 0; attempt <= AI_RETRY.maxAttemptsPerModel; attempt += 1) {
      try {
        const content = await generateGeminiContent(
          modelName,
          systemPrompt,
          userPrompt,
        );
        return JSON.parse(content) as T;
      } catch (error) {
        lastError = error;

        const canRetry =
          isRetryableAiError(error) && attempt < AI_RETRY.maxAttemptsPerModel;

        if (canRetry) {
          log.warn("Retrying Gemini request", {
            model: modelName,
            attempt: attempt + 1,
            delayMs,
          });

          await sleep(delayMs);
          delayMs *= AI_RETRY.backoffMultiplier;
          continue;
        }

        if (isFatalAiError(error)) {
          throw error;
        }

        break;
      }
    }

    if (isFatalAiError(lastError)) {
      throw lastError;
    }

    log.debug("Gemini model failed, trying fallback", { model: modelName });
  }

  throw lastError;
}

const providerHandlers: Record<
  AiProvider,
  (systemPrompt: string, userPrompt: string) => Promise<unknown>
> = {
  openai: createOpenAiStructuredCompletion,
  gemini: createGeminiStructuredCompletion,
};

export async function createStructuredCompletion<T>(
  systemPrompt: string,
  userPrompt: string,
): Promise<T> {
  const provider = getAiProvider();
  const handler = providerHandlers[provider];

  log.debug("Creating structured completion", { provider, model: getAiModel() });

  try {
    return (await handler(systemPrompt, userPrompt)) as T;
  } catch (error) {
    log.error("Structured completion failed", { provider, error });

    if (error instanceof AiApiError) {
      throw error;
    }

    throw new AiApiError(toUserFriendlyAiError(error));
  }
}
