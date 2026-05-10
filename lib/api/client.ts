import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

import type { ApiError, ApiResponse } from "@/lib/types";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/lib/auth/token-storage";
import { toCamelCase } from "./case-transform";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30_000,
});

// Request interceptor — attach the bearer token from storage to every outgoing call.
// FormData uploads inherit the same header; axios sets the multipart Content-Type itself.
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// Response interceptor (1 of 2) — normalize backend's snake_case JSON to camelCase
// so the rest of the frontend (types, hooks, components) can stay camelCase end-to-end.
// Runs before the 401-refresh interceptor; blob/binary responses (exports) are skipped.
apiClient.interceptors.response.use((response) => {
  if (response.config.responseType === "blob") return response;
  if (response.data && typeof response.data === "object") {
    response.data = toCamelCase(response.data);
  }
  return response;
});

// Response interceptor (2 of 2) — on 401, rotate tokens via /auth/refresh and replay the original request.
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Don't recurse: a 401 on an auth endpoint is terminal — never try to refresh those.
    const skipRefreshPaths = [
      "/auth/login",
      "/auth/register",
      "/auth/refresh",
      "/auth/logout",
    ];
    if (skipRefreshPaths.some((path) => originalRequest.url?.includes(path))) {
      return Promise.reject(error);
    }

    // No refresh token in storage → can't refresh. Drop straight to redirect.
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      redirectToLoginIfProtected();
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
      const refreshResponse = await apiClient.post<
        ApiResponse<{ accessToken: string; refreshToken: string }>
      >("/auth/refresh", { refreshToken });
      const { accessToken: newAccess, refreshToken: newRefresh } =
        refreshResponse.data.data;
      setTokens(newAccess, newRefresh);
      processQueue(null);
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      clearTokens();
      redirectToLoginIfProtected();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

function redirectToLoginIfProtected() {
  if (typeof window === "undefined") return;
  const publicPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/",
  ];
  if (!publicPaths.includes(window.location.pathname)) {
    window.location.href = "/login";
  }
}

/**
 * Extract typed error from an Axios error response.
 */
export function extractApiError(error: unknown): {
  code: string;
  message: string;
} {
  // Check if error is already extracted
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    "message" in error &&
    typeof (error as { code: unknown }).code === "string"
  ) {
    return error as { code: string; message: string };
  }

  if (axios.isAxiosError(error)) {
    const requestUrl = error.config?.url ?? "";
    if (error.response?.status === 401) {
      if (requestUrl.includes("/auth/login")) {
        return {
          code: "AUTH_REQUIRED",
          message: "Invalid email or password. Please check your details and try again.",
        };
      }

      return {
        code: "AUTH_REQUIRED",
        message: "Your session has expired. Please sign in again to continue.",
      };
    }

    const data = error.response?.data as
      | ApiError
      | { error?: { code?: unknown; message?: unknown }; message?: unknown; code?: unknown }
      | undefined;

    if (data?.error && typeof data.error === "object") {
      const code =
        typeof data.error.code === "string"
          ? data.error.code
          : statusToError(error.response?.status).code;
      const message =
        typeof data.error.message === "string" && data.error.message.trim()
          ? data.error.message
          : statusToError(error.response?.status).message;

      return { code, message };
    }

    if (data && "message" in data && typeof data.message === "string" && data.message.trim()) {
      return {
        code: typeof data.code === "string" ? data.code : statusToError(error.response?.status).code,
        message: data.message,
      };
    }

    if (!error.response) {
      return {
        code: "NETWORK_ERROR",
        message: "We could not reach the server. Please check your connection and try again.",
      };
    }

    return statusToError(error.response.status);
  }
  return { code: "UNKNOWN_ERROR", message: "An unexpected error occurred" };
}

function statusToError(status?: number): { code: string; message: string } {
  switch (status) {
    case 400:
      return { code: "BAD_REQUEST", message: "Please check the details you entered and try again." };
    case 403:
      return { code: "FORBIDDEN", message: "You do not have permission to perform this action." };
    case 404:
      return { code: "NOT_FOUND", message: "We could not find what you were looking for." };
    case 409:
      return {
        code: "CONFLICT",
        message: "This action conflicts with an existing record. Please refresh and try again.",
      };
    case 413:
      return { code: "FILE_TOO_LARGE", message: "That file is too large. Please upload a smaller file." };
    case 429:
      return { code: "RATE_LIMITED", message: "Please wait a moment before trying again." };
    default:
      if (status && status >= 500) {
        return {
          code: "SERVER_ERROR",
          message: "Something went wrong on our end. Please try again shortly.",
        };
      }
      return { code: "REQUEST_FAILED", message: "We could not complete that request. Please try again." };
  }
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
