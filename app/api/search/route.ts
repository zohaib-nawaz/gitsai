import {
  getErrorCode,
  getErrorMessage,
  getErrorStatusCode,
} from "@/lib/errors";
import { createLogger } from "@/lib/logger";
import { executeRepositorySearch } from "@/services/search/search-orchestrator";
import type { SearchRequest, SearchStreamEvent } from "@/types/search";
import { validateSearchQuery } from "@/utils/validation";

const log = createLogger("api:search");

export const maxDuration = 60;

function truncateQuery(query: string, maxLength = 100): string {
  if (query.length <= maxLength) {
    return query;
  }

  return `${query.slice(0, maxLength)}...`;
}

function encodeStreamEvent(event: SearchStreamEvent): Uint8Array {
  return new TextEncoder().encode(`${JSON.stringify(event)}\n`);
}

export async function POST(request: Request): Promise<Response> {
  const startedAt = Date.now();
  const requestId = crypto.randomUUID().slice(0, 8);

  log.info("POST /api/search started", { requestId });

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: SearchStreamEvent) => {
        controller.enqueue(encodeStreamEvent(event));
      };

      try {
        let body: SearchRequest;

        try {
          body = (await request.json()) as SearchRequest;
        } catch {
          const durationMs = Date.now() - startedAt;

          log.warn("Invalid JSON body", { requestId, durationMs });

          send({
            type: "error",
            error: "Invalid request body. Expected JSON with a query field.",
            code: "VALIDATION_ERROR",
          });
          controller.close();
          return;
        }

        const query = validateSearchQuery(body.query);

        log.info("Search request validated", {
          requestId,
          queryLength: query.length,
          queryPreview: truncateQuery(query),
        });

        const result = await executeRepositorySearch(query, {
          requestId,
          onProgress: send,
        });

        const durationMs = Date.now() - startedAt;

        log.info("Search request succeeded", {
          requestId,
          durationMs,
          keywords: result.keywords,
          repositoryCount: result.repositories.length,
          topResults: result.repositories.map((repository) => ({
            fullName: repository.fullName,
            matchScore: repository.matchScore,
            stars: repository.stars,
          })),
        });

        send({ type: "complete", data: result });
        controller.close();
      } catch (error) {
        const status = getErrorStatusCode(error);
        const durationMs = Date.now() - startedAt;

        log.error("Search request failed", {
          requestId,
          durationMs,
          status,
          message: getErrorMessage(error),
          code: getErrorCode(error),
        });

        send({
          type: "error",
          error: getErrorMessage(error),
          code: getErrorCode(error),
        });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
