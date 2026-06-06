export interface GitHubSearchRepositoryItem {
  id: number;
  full_name: string;
  name: string;
  owner: {
    login: string;
  };
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubSearchRepositoryItem[];
}

export interface GitHubRateLimitHeaders {
  remaining: number;
  reset: number;
}
