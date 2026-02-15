/**
 * API Client - Axios Instance
 * Configured dengan interceptors untuk:
 * - Auto attach token
 * - Auto refresh token on 401
 * - Error handling
 */

import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

/**
 * Base API URL dari environment variable
 */
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Axios instance
 */
const client = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Flag untuk prevent multiple refresh calls
 */
let isRefreshing = false;

/**
 * Queue untuk pending requests saat token refresh
 */
let failedQueue = [];

/**
 * Process queued requests
 * @param {Error|null} error - Error if refresh failed
 * @param {string|null} token - New token if refresh success
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// =============================================================================
// REQUEST INTERCEPTOR
// =============================================================================

/**
 * Attach token to every request
 */
client.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// =============================================================================
// RESPONSE INTERCEPTOR
// =============================================================================

/**
 * Handle token refresh on 401 errors
 */
client.interceptors.response.use(
  (response) => {
    // Auto-unwrap ResponseHelper envelope: { success, message, data: {...} }
    // Semua api file melakukan: const { data } = await api.post(...)
    // yang mengambil axios response.data (= envelope).
    // Interceptor ini memastikan response.data langsung berisi payload-nya.
    if (
      response.data &&
      typeof response.data === "object" &&
      "success" in response.data &&
      "data" in response.data
    ) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh for certain endpoints
    const skipRefreshEndpoints = [
      API_ENDPOINTS.AUTH.LOGIN,
      API_ENDPOINTS.AUTH.REFRESH,
      API_ENDPOINTS.AUTH.LOGOUT,
    ];

    const isSkipEndpoint = skipRefreshEndpoints.some((endpoint) =>
      originalRequest.url?.includes(endpoint),
    );

    // Handle 401 - Token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isSkipEndpoint
    ) {
      if (isRefreshing) {
        // Add to queue if already refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return client(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = useAuthStore.getState().refreshToken;

      if (!refreshToken) {
        // No refresh token - force logout
        isRefreshing = false;
        useAuthStore.getState().logout();
        processQueue(new Error("No refresh token available"), null);
        return Promise.reject(error);
      }

      try {
        // Call refresh endpoint
        const response = await axios.post(
          `${BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
          { refreshToken },
        );

        // FIX: Backend mengembalikan { accessToken, refreshToken }
        // bukan { token, refreshToken }
        const { accessToken: newToken, refreshToken: newRefreshToken } =
          response.data;

        // Update tokens in store
        useAuthStore.getState().setTokens(newToken, newRefreshToken);

        // Update header for original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Process queued requests
        processQueue(null, newToken);

        isRefreshing = false;

        // Retry original request
        return client(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout
        processQueue(refreshError, null);
        isRefreshing = false;
        useAuthStore.getState().logout();

        return Promise.reject(refreshError);
      }
    }

    // For other errors, just reject
    return Promise.reject(error);
  },
);

/**
 * Export axios instance
 */
export default client;

/**
 * Export base URL for reference
 */
export { BASE_URL };
