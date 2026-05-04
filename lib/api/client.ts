import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';

import type { ApiError, ApiResponse } from '@/lib/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://pidec-api.onrender.com/api/v1';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

function processQueue(error: unknown) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(undefined);
    }
  });
  failedQueue = [];
}

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30_000,
});

// Response interceptor — handle 401 refresh flow
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Skip refresh attempts for auth endpoints to prevent loops
    const skipRefreshPaths = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];
    if (skipRefreshPaths.some((path) => originalRequest.url?.includes(path))) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => apiClient(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await apiClient.post('/auth/refresh');
      processQueue(null);
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      // Redirect to login on refresh failure (client-side only)
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

/**
 * Extract typed error from an Axios error response.
 */
export function extractApiError(error: unknown): { code: string; message: string } {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError | undefined;
    if (data?.error) {
      return { code: data.error.code, message: data.error.message };
    }
    return { code: 'NETWORK_ERROR', message: error.message };
  }
  return { code: 'UNKNOWN_ERROR', message: 'An unexpected error occurred' };
}

/**
 * Unwrap the SuccessResponse envelope, returning just the data.
 */
export function unwrap<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data;
}

/**
 * Unwrap the full response including pagination meta.
 */
export function unwrapWithMeta<T>(response: { data: ApiResponse<T> }) {
  return { data: response.data.data, meta: response.data.meta };
}

export { apiClient };
