export interface ApiErrorResponse {
  error: string;
  code: string;
}

export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };
