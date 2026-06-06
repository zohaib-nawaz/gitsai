const RETRYABLE_STATUS_PATTERN =
  /\b(429|500|502|503|504)\b|high demand|unavailable|overloaded|quota|rate limit/i;

const FATAL_ERROR_PATTERN =
  /\b(400|401|403)\b|api key expired|api_key_invalid|invalid api key|authentication|permission denied|please renew the api key/i;

const EXHAUSTED_QUOTA_PATTERN = /limit:\s*0|quota exceeded for metric/i;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function getAiErrorStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null || !("status" in error)) {
    return undefined;
  }

  const status = Number((error as { status: unknown }).status);
  return Number.isFinite(status) ? status : undefined;
}

export function isFatalAiError(error: unknown): boolean {
  const status = getAiErrorStatus(error);

  if (status === 400 || status === 401 || status === 403) {
    return true;
  }

  const message = getErrorMessage(error);
  return FATAL_ERROR_PATTERN.test(message);
}

export function isRetryableAiError(error: unknown): boolean {
  if (isFatalAiError(error)) {
    return false;
  }

  const message = getErrorMessage(error);

  if (EXHAUSTED_QUOTA_PATTERN.test(message)) {
    return false;
  }

  return RETRYABLE_STATUS_PATTERN.test(message);
}

export function toUserFriendlyAiError(error: unknown): string {
  const message = getErrorMessage(error);

  if (/expired|renew the api key/i.test(message)) {
    return "Your AI API key has expired. Generate a new key and update .env.local.";
  }

  if (/503|high demand|unavailable|overloaded/i.test(message)) {
    return "The AI service is temporarily busy. Please wait a moment and try again.";
  }

  if (/429|quota|rate limit/i.test(message)) {
    return "AI rate limit reached. Please wait a minute and try again.";
  }

  if (/401|403|API key|authentication|permission|invalid/i.test(message)) {
    return "Invalid or unauthorized AI API key. Check your .env.local configuration.";
  }

  return "AI request failed. Please try again in a moment.";
}

export function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export function uniqueModels(models: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const model of models) {
    if (seen.has(model)) {
      continue;
    }
    seen.add(model);
    result.push(model);
  }

  return result;
}
