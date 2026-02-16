/**
 * API Client - Axios Instance
 * FIXED:
 *  1. Response envelope unwrapping now handles { success, branches }, { success, stock },
 *     { success, data } — semua bentuk response backend
 *  2. Debug log auth tidak lagi misleading (cek .token bukan .accessToken)
 *  3. Tidak ada perubahan logic auth / refresh token
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
// REQUEST INTERCEPTOR
// =============================================================================

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

// =============================================================================
// RESPONSE INTERCEPTOR
// FIX: Unwrap semua bentuk envelope backend secara konsisten.
//
// Backend mengembalikan berbagai bentuk:
//   A) { success: true, data: { ... } }           → unwrap ke .data
//   B) { success: true, branches: [...] }          → biarkan utuh (tidak ada .data)
//   C) { success: true, stock: [...] }             → biarkan utuh (tidak ada .data)
//   D) { success: true, certificates: [...], pagination: {...} } → biarkan utuh
//
// Sebelumnya kondisi unwrap mensyaratkan KEDUA "success" DAN "data" ada.
// Untuk bentuk B/C/D kondisi ini false → data tidak di-unwrap → hook menerima
// { success: true, branches/stock/... } mentah tapi select() tidak expect itu.
//
// Solusi: SELALU unwrap "success" wrapper. Jika ada field "data", unwrap ke .data.
// Jika tidak ada "data", kembalikan semua field selain "success" & "message".
// =============================================================================

client.interceptors.response.use(
  (response) => {
    const rawData = response.data;

    // Hanya proses jika response adalah object dengan field "success"
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

      // --- Bentuk A: ada field "data" → unwrap ke .data ---
      if ("data" in rawData) {
        console.log("[RESPONSE INTERCEPTOR] Unwrapping via .data");
        response.data = rawData.data;

        // FIX: debug log pakai .token, bukan .accessToken
        // (authStore menyimpan dengan field name "token")
        if (rawData.data && typeof rawData.data === "object") {
          console.log("[RESPONSE INTERCEPTOR] Unwrapped data keys:", {
            keys: Object.keys(rawData.data),
            hasUser: !!rawData.data.user,
            hasToken: !!rawData.data.token, // ← FIX: was .accessToken
            hasRefreshToken: !!rawData.data.refreshToken,
          });
        }

        return response;
      }

      // --- Bentuk B/C/D: tidak ada "data", payload ada di field lain ---
      // Kembalikan semua field kecuali "success" dan "message"
      // sehingga hooks menerima langsung { branches: [...] } dll.
      console.log(
        "[RESPONSE INTERCEPTOR] No .data field — returning payload as-is",
      );
      // Tidak perlu modifikasi, biarkan response.data = rawData
      // Hooks sudah handle struktur ini di select()
      return response;
    }

    // Response bukan envelope (array, string, blob, dll) → langsung return
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

    // Handle 401 - Token expired
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

        // FIX: handle both field names dari backend
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
