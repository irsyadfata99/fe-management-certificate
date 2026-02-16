/**
 * Auth Hooks
 * FIXED: Better login data handling and extensive debugging
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api";
import { useAuthStore } from "@/store/authStore";
import { getErrorMessage } from "@/utils/api/errorHandler";
import { toast } from "sonner";

/**
 * Login mutation - FIXED VERSION
 */
export const useLogin = () => {
  const { login: loginStore } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      try {
        // 🔍 EXTENSIVE DEBUG LOGGING
        console.group("🔐 [useLogin] Processing login response");
        console.log("Raw data:", data);
        console.log("Data type:", typeof data);
        console.log("Data keys:", data ? Object.keys(data) : "null");

        // ✅ FIX: Better validation with multiple field name support
        const hasUser = !!data?.user;
        const hasToken = !!(data?.accessToken || data?.token);
        const hasRefreshToken = !!(data?.refreshToken || data?.refresh_token);

        console.log("Validation:", {
          hasUser,
          hasToken,
          hasRefreshToken,
          userRole: data?.user?.role,
          tokenField: data?.accessToken ? "accessToken" : data?.token ? "token" : "MISSING",
          refreshField: data?.refreshToken ? "refreshToken" : data?.refresh_token ? "refresh_token" : "MISSING",
        });

        // Validate response structure
        if (!data || typeof data !== "object") {
          console.error("❌ Invalid response format:", data);
          console.groupEnd();
          toast.error("Invalid login response from server");
          return;
        }

        if (!hasUser) {
          console.error("❌ Missing user data");
          console.groupEnd();
          toast.error("No user data in login response");
          return;
        }

        if (!hasToken) {
          console.error("❌ Missing access token");
          console.groupEnd();
          toast.error("No access token in login response");
          return;
        }

        if (!hasRefreshToken) {
          console.error("❌ Missing refresh token");
          console.groupEnd();
          toast.error("No refresh token in login response");
          return;
        }

        // ✅ FIX: Normalize field names before passing to store
        const normalizedData = {
          user: data.user,
          accessToken: data.accessToken || data.token,
          refreshToken: data.refreshToken || data.refresh_token,
        };

        console.log("Normalized data for store:", {
          hasUser: !!normalizedData.user,
          hasAccessToken: !!normalizedData.accessToken,
          hasRefreshToken: !!normalizedData.refreshToken,
          tokenPreview: normalizedData.accessToken?.substring(0, 20) + "...",
        });

        // Login to store
        loginStore(normalizedData);

        // ✅ VERIFY: Check if tokens were actually saved
        const storeState = useAuthStore.getState();
        console.log("Store state after login:", {
          hasUser: !!storeState.user,
          hasToken: !!storeState.token,
          hasRefreshToken: !!storeState.refreshToken,
          isAuthenticated: storeState.isAuthenticated,
          tokenPreview: storeState.token?.substring(0, 20) + "...",
        });

        if (!storeState.token || !storeState.refreshToken) {
          console.error("❌ CRITICAL: Tokens not saved to store!");
          console.groupEnd();
          toast.error("Failed to save authentication tokens");
          return;
        }

        // Invalidate all queries on login
        queryClient.invalidateQueries();

        // Success notification
        toast.success("Login successful");

        console.log("✅ Login completed successfully");
        console.groupEnd();
      } catch (error) {
        console.error("❌ [useLogin] Error processing login response:", error);
        console.groupEnd();
        toast.error("Failed to process login data");
      }
    },
    onError: (error) => {
      console.error("❌ [useLogin] Login API call failed:", error);
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Logout mutation
 */
export const useLogout = () => {
  const { logout: logoutStore } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      console.log("[useLogout] Logout API call successful");
      logoutStore();
      queryClient.clear();
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      console.warn("[useLogout] Logout API call failed, clearing local state anyway:", error);
      logoutStore();
      queryClient.clear();
      const message = getErrorMessage(error);
      toast.error(message);
    },
    onSettled: () => {
      console.log("[useLogout] Logout process completed");
    },
  });
};

/**
 * Change password mutation
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      console.log("[useChangePassword] Password changed successfully");
      toast.success("Password changed successfully");
    },
    onError: (error) => {
      console.error("[useChangePassword] Password change failed:", error);
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Change username mutation
 */
export const useChangeUsername = () => {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.changeUsername,
    onSuccess: (data) => {
      try {
        console.log("[useChangeUsername] Username change response:", data);

        if (data?.user) {
          setUser(data.user);
          console.log("[useChangeUsername] User updated in store");
        }

        queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
        toast.success("Username changed successfully");
      } catch (error) {
        console.error("[useChangeUsername] Error updating username:", error);
        toast.error("Username changed but failed to update locally");
      }
    },
    onError: (error) => {
      console.error("[useChangeUsername] Username change failed:", error);
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};
