export class AppError extends Error {
  readonly code: string;
  readonly statusCode: number;

  constructor(message: string, code: string, statusCode: number) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}

export class GitHubApiError extends AppError {
  constructor(message: string, statusCode: number) {
    super(message, "GITHUB_API_ERROR", statusCode);
    this.name = "GitHubApiError";
  }
}

export class AiApiError extends AppError {
  constructor(message: string, statusCode: number = 502) {
    super(message, "AI_API_ERROR", statusCode);
    this.name = "AiApiError";
  }
}

/** @deprecated Use AiApiError */
export class OpenAiApiError extends AiApiError {
  constructor(message: string, statusCode: number = 502) {
    super(message, statusCode);
    this.name = "OpenAiApiError";
  }
}

export class RateLimitError extends AppError {
  constructor(message: string) {
    super(message, "RATE_LIMIT_ERROR", 429);
    this.name = "RateLimitError";
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}

export function getErrorCode(error: unknown): string {
  if (error instanceof AppError) {
    return error.code;
  }
  return "INTERNAL_ERROR";
}

export function getErrorStatusCode(error: unknown): number {
  if (error instanceof AppError) {
    return error.statusCode;
  }
  return 500;
}
