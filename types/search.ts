export interface SearchIntent {
  keywords: string[];
  requirements: string[];
}

export interface RepositoryCandidate {
  fullName: string;
  name: string;
  owner: string;
  description: string | null;
  htmlUrl: string;
  topics: string[];
  language: string | null;
  stars: number;
  updatedAt: string;
  readmeContent: string | null;
}

export interface RepositoryEvaluation {
  matchScore: number;
  technologiesDetected: string[];
  summary: string;
  strengths: string[];
  missingRequirements: string[];
  recommendationReason: string;
}

export interface RankedRepository extends RepositoryCandidate, RepositoryEvaluation {}

export interface SearchRequest {
  query: string;
}

export interface SearchResponse {
  query: string;
  keywords: string[];
  repositories: RankedRepository[];
}

export type SearchStatus = "idle" | "loading" | "success" | "error" | "empty";

export type SearchProgressStep =
  | "understanding"
  | "keywords"
  | "searching"
  | "selecting"
  | "readmes"
  | "evaluating"
  | "ranking";

export type SearchProgressItemStatus = "pending" | "active" | "complete";

export interface SearchProgressItem {
  id: SearchProgressStep;
  message: string;
  detail?: string;
  status: SearchProgressItemStatus;
}

export interface SearchProgress {
  steps: SearchProgressItem[];
  currentMessage: string;
}

export interface SearchProgressEvent {
  type: "progress";
  step: SearchProgressStep;
  message: string;
  detail?: string;
}

export interface SearchCompleteEvent {
  type: "complete";
  data: SearchResponse;
}

export interface SearchErrorEvent {
  type: "error";
  error: string;
  code: string;
}

export type SearchStreamEvent =
  | SearchProgressEvent
  | SearchCompleteEvent
  | SearchErrorEvent;

export interface SearchState {
  status: SearchStatus;
  data: SearchResponse | null;
  error: string | null;
  progress: SearchProgress | null;
}
