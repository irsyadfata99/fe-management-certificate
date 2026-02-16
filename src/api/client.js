/**
 * API Client - Axios Instance
 * FIXED: Better token handling and extensive logging
 */

import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

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
// REQUEST INTERCEPTOR - FIXED WITH LOGGING
// =============================================================================

client.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    // 🔍 DEBUG LOGGING
    console.log("[REQUEST INTERCEPTOR]", {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : "NO TOKEN",
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("[REQUEST INTERCEPTOR] ⚠️ NO TOKEN AVAILABLE for:", config.url);
    }

    return config;
  },
  (error) => {
    console.error("[REQUEST INTERCEPTOR ERROR]", error);
    return Promise.reject(error);
  },
);

// =============================================================================
// RESPONSE INTERCEPTOR - FIXED WITH BETTER UNWRAPPING
// =============================================================================

client.interceptors.response.use(
  (response) => {
    // 🔍 DEBUG: Log original response
    console.log("[RESPONSE INTERCEPTOR]", {
      url: response.config.url,
      status: response.status,
      dataType: typeof response.data,
      hasSuccess: response.data?.success,
      hasData: "data" in (response.data || {}),
    });

    // ✅ FIX: Better envelope detection and unwrapping
    if (response.data && typeof response.data === "object" && "success" in response.data && "data" in response.data) {
      console.log("[RESPONSE INTERCEPTOR] Unwrapping envelope");

      // Store original for debugging
      const originalData = response.data;

      // Unwrap
      response.data = response.data.data;

      // 🔍 DEBUG: Log unwrapped data structure
      console.log("[RESPONSE INTERCEPTOR] Unwrapped data:", {
        hasUser: !!response.data?.user,
        hasToken: !!response.data?.token,
        hasAccessToken: !!response.data?.accessToken,
        hasRefreshToken: !!response.data?.refreshToken,
        keys: Object.keys(response.data || {}),
      });
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error("[RESPONSE INTERCEPTOR ERROR]", {
      url: originalRequest?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
    });

    const skipRefreshEndpoints = [API_ENDPOINTS.AUTH.LOGIN, API_ENDPOINTS.AUTH.REFRESH, API_ENDPOINTS.AUTH.LOGOUT];

    const isSkipEndpoint = skipRefreshEndpoints.some((endpoint) => originalRequest.url?.includes(endpoint));

    // Handle 401 - Token expired
    if (error.response?.status === 401 && !originalRequest._retry && !isSkipEndpoint) {
      console.warn("[RESPONSE INTERCEPTOR] 401 Unauthorized - Attempting token refresh");

      if (isRefreshing) {
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
        console.error("[RESPONSE INTERCEPTOR] No refresh token - forcing logout");
        isRefreshing = false;
        useAuthStore.getState().logout();
        processQueue(new Error("No refresh token available"), null);
        return Promise.reject(error);
      }

      try {
        console.log("[RESPONSE INTERCEPTOR] Calling refresh endpoint...");

        const response = await axios.post(`${BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`, { refreshToken });

        console.log("[RESPONSE INTERCEPTOR] Refresh response:", {
          hasAccessToken: !!response.data?.accessToken,
          hasToken: !!response.data?.token,
          hasRefreshToken: !!response.data?.refreshToken,
        });

        // ✅ FIX: Handle both "accessToken" and "token" field names
        const newToken = response.data?.accessToken || response.data?.token;
        const newRefreshToken = response.data?.refreshToken;

        if (!newToken) {
          throw new Error("No access token in refresh response");
        }

        console.log("[RESPONSE INTERCEPTOR] ✅ Token refreshed successfully");

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
        console.error("[RESPONSE INTERCEPTOR] ❌ Token refresh failed:", refreshError);

        processQueue(refreshError, null);
        isRefreshing = false;
        useAuthStore.getState().logout();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default client;
export { BASE_URL };
