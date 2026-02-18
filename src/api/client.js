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

client.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    console.log("[REQUEST INTERCEPTOR]", {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : "NO TOKEN",
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn(
        "[REQUEST INTERCEPTOR] ⚠️ NO TOKEN AVAILABLE for:",
        config.url,
      );
    }

    return config;
  },
  (error) => {
    console.error("[REQUEST INTERCEPTOR ERROR]", error);
    return Promise.reject(error);
  },
);

client.interceptors.response.use(
  (response) => {
    const rawData = response.data;

    if (
      rawData &&
      typeof rawData === "object" &&
      !Array.isArray(rawData) &&
      "success" in rawData
    ) {
      console.log("[RESPONSE INTERCEPTOR]", {
        url: response.config.url,
        status: response.status,
        success: rawData.success,
        topLevelKeys: Object.keys(rawData),
      });

      if ("data" in rawData) {
        console.log("[RESPONSE INTERCEPTOR] Unwrapping via .data");
        response.data = rawData.data;

        if (rawData.data && typeof rawData.data === "object") {
          console.log("[RESPONSE INTERCEPTOR] Unwrapped data keys:", {
            keys: Object.keys(rawData.data),
            hasUser: !!rawData.data.user,
            hasToken: !!rawData.data.token,
            hasRefreshToken: !!rawData.data.refreshToken,
          });
        }

        return response;
      }
      console.log(
        "[RESPONSE INTERCEPTOR] No .data field — returning payload as-is",
      );
      return response;
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

    const skipRefreshEndpoints = [
      API_ENDPOINTS.AUTH.LOGIN,
      API_ENDPOINTS.AUTH.REFRESH,
      API_ENDPOINTS.AUTH.LOGOUT,
    ];

    const isSkipEndpoint = skipRefreshEndpoints.some((endpoint) =>
      originalRequest.url?.includes(endpoint),
    );
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isSkipEndpoint
    ) {
      console.warn(
        "[RESPONSE INTERCEPTOR] 401 Unauthorized - Attempting token refresh",
      );

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return client(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = useAuthStore.getState().refreshToken;

      if (!refreshToken) {
        console.error(
          "[RESPONSE INTERCEPTOR] No refresh token - forcing logout",
        );
        isRefreshing = false;
        useAuthStore.getState().logout();
        processQueue(new Error("No refresh token available"), null);
        return Promise.reject(error);
      }

      try {
        console.log("[RESPONSE INTERCEPTOR] Calling refresh endpoint...");

        const response = await axios.post(
          `${BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
          { refreshToken },
        );

        const newToken =
          response.data?.accessToken ||
          response.data?.token ||
          response.data?.data?.accessToken ||
          response.data?.data?.token;

        const newRefreshToken =
          response.data?.refreshToken || response.data?.data?.refreshToken;

        if (!newToken) {
          throw new Error("No access token in refresh response");
        }

        console.log("[RESPONSE INTERCEPTOR] ✅ Token refreshed successfully");

        useAuthStore.getState().setTokens(newToken, newRefreshToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        isRefreshing = false;

        return client(originalRequest);
      } catch (refreshError) {
        console.error(
          "[RESPONSE INTERCEPTOR] ❌ Token refresh failed:",
          refreshError,
        );
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
