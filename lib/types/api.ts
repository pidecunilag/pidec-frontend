export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginationMeta {
  cursor?: string;
  offset?: number;
  limit: number;
  hasMore: boolean;
  total?: number;
}

export interface PaginationParams {
  cursor?: string;
  limit?: number;
  offset?: number;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;
