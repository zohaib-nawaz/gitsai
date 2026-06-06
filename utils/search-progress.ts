import type {
  SearchProgress,
  SearchProgressEvent,
  SearchProgressItem,
  SearchStreamEvent,
} from "@/types/search";

export const INITIAL_SEARCH_PROGRESS: SearchProgress = {
  steps: [],
  currentMessage: "Starting search…",
};

export function applySearchProgressEvent(
  progress: SearchProgress,
  event: SearchProgressEvent,
): SearchProgress {
  const steps = progress.steps.map((step) =>
    step.status === "active" && step.id !== event.step
      ? { ...step, status: "complete" as const }
      : step,
  );

  const nextStep: SearchProgressItem = {
    id: event.step,
    message: event.message,
    detail: event.detail,
    status: "active",
  };

  const existingIndex = steps.findIndex((step) => step.id === event.step);

  if (existingIndex >= 0) {
    steps[existingIndex] = nextStep;
  } else {
    steps.push(nextStep);
  }

  return {
    steps,
    currentMessage: event.message,
  };
}

export function finalizeSearchProgress(progress: SearchProgress): SearchProgress {
  return {
    steps: progress.steps.map((step) =>
      step.status === "active" ? { ...step, status: "complete" as const } : step,
    ),
    currentMessage: progress.currentMessage,
  };
}

export async function readSearchStreamEvents(
  response: Response,
  onEvent: (event: SearchStreamEvent) => void,
): Promise<void> {
  if (!response.body) {
    throw new Error("Search response stream is unavailable");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (!trimmedLine) {
        continue;
      }

      onEvent(JSON.parse(trimmedLine) as SearchStreamEvent);
    }
  }

  const remainingLine = buffer.trim();

  if (remainingLine) {
    onEvent(JSON.parse(remainingLine) as SearchStreamEvent);
  }
}
