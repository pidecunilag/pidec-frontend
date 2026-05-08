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
    const data = error.response?.data as ApiError | undefined;
    if (data?.error) {
      return { code: data.error.code, message: data.error.message };
    }
    return { code: "NETWORK_ERROR", message: error.message };
  }
  return { code: "UNKNOWN_ERROR", message: "An unexpected error occurred" };
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
