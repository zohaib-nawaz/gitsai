"use client";

import { useCallback, useState } from "react";

import type { SearchResponse, SearchState } from "@/types/search";
import {
  applySearchProgressEvent,
  INITIAL_SEARCH_PROGRESS,
  readSearchStreamEvents,
} from "@/utils/search-progress";

const INITIAL_STATE: SearchState = {
  status: "idle",
  data: null,
  error: null,
  progress: null,
};

export function useRepositorySearch() {
  const [state, setState] = useState<SearchState>(INITIAL_STATE);

  const search = useCallback(async (query: string) => {
    setState({
      status: "loading",
      data: null,
      error: null,
      progress: INITIAL_SEARCH_PROGRESS,
    });

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok && !response.body) {
        setState({
          status: "error",
          data: null,
          error: "Search failed",
          progress: null,
        });
        return;
      }

      let latestProgress = INITIAL_SEARCH_PROGRESS;
      let finalResult: SearchResponse | null = null;
      let streamErrorMessage: string | null = null;

      await readSearchStreamEvents(response, (event) => {
        if (event.type === "progress") {
          latestProgress = applySearchProgressEvent(latestProgress, event);
          setState({
            status: "loading",
            data: null,
            error: null,
            progress: latestProgress,
          });
          return;
        }

        if (event.type === "complete") {
          finalResult = event.data;
          return;
        }

        streamErrorMessage = event.error;
      });

      if (streamErrorMessage) {
        setState({
          status: "error",
          data: null,
          error: streamErrorMessage,
          progress: null,
        });
        return;
      }

      if (!finalResult) {
        setState({
          status: "error",
          data: null,
          error: "Search ended without a result",
          progress: null,
        });
        return;
      }

      const searchResult: SearchResponse = finalResult;

      if (searchResult.repositories.length === 0) {
        setState({
          status: "empty",
          data: searchResult,
          error: null,
          progress: null,
        });
        return;
      }

      setState({
        status: "success",
        data: searchResult,
        error: null,
        progress: null,
      });
    } catch {
      setState({
        status: "error",
        data: null,
        error: "Network error. Please check your connection and try again.",
        progress: null,
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return { state, search, reset };
}
