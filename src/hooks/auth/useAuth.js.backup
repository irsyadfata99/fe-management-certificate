/**
 * Auth Hooks
 * React Query hooks untuk authentication operations
 * PRODUCTION-READY: Works with improved authStore
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api";
import { useAuthStore } from "@/store/authStore";
import { getErrorMessage } from "@/utils/api/errorHandler";
import { toast } from "sonner";

/**
 * Login mutation - PRODUCTION READY
 * Handles login with proper error handling and data validation
 *
 * @returns {Object} Mutation object
 *
 * @example
 * const { mutate: login, isPending } = useLogin();
 *
 * const handleLogin = (data) => {
 *   login(data, {
 *     onSuccess: () => {
 *       navigate('/dashboard');
 *     }
 *   });
 * };
 */
export const useLogin = () => {
  const { login: loginStore } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      try {
        // Data structure from API: { user, accessToken, refreshToken }
        // client.js interceptor already auto-unwraps { success, message, data } envelope

        // Debug logging
        console.log("[useLogin] Login response:", {
          hasUser: !!data?.user,
          hasAccessToken: !!data?.accessToken,
          hasRefreshToken: !!data?.refreshToken,
          userRole: data?.user?.role,
        });

        // Validate response structure
        if (!data || typeof data !== "object") {
          console.error("[useLogin] Invalid response format:", data);
          toast.error("Invalid login response from server");
          return;
        }

        if (!data.user || !data.accessToken || !data.refreshToken) {
          console.error("[useLogin] Missing required fields in response:", {
            hasUser: !!data.user,
            hasAccessToken: !!data.accessToken,
            hasRefreshToken: !!data.refreshToken,
          });
          toast.error("Incomplete login data received");
          return;
        }

        // Login to store (accepts single object)
        loginStore(data);

        // Invalidate all queries on login
        queryClient.invalidateQueries();

        // Success notification
        toast.success("Login successful");

        console.log("[useLogin] Login completed successfully");
      } catch (error) {
        console.error("[useLogin] Error processing login response:", error);
        toast.error("Failed to process login data");
      }
    },
    onError: (error) => {
      console.error("[useLogin] Login failed:", error);
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Logout mutation - PRODUCTION READY
 * Handles logout with cleanup
 *
 * @returns {Object} Mutation object
 *
 * @example
 * const { mutate: logout } = useLogout();
 *
 * const handleLogout = () => {
 *   logout();
 * };
 */
export const useLogout = () => {
  const { logout: logoutStore } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      console.log("[useLogout] Logout API call successful");

      // Clear auth store
      logoutStore();

      // Clear all cached queries
      queryClient.clear();

      toast.success("Logged out successfully");
    },
    onError: (error) => {
      console.warn(
        "[useLogout] Logout API call failed, clearing local state anyway:",
        error,
      );

      // Even if API fails, still logout locally
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
 * @returns {Object} Mutation object
 *
 * @example
 * const { mutate: changePassword, isPending } = useChangePassword();
 *
 * const handleSubmit = (data) => {
 *   changePassword(data, {
 *     onSuccess: () => {
 *       reset();
 *     }
 *   });
 * };
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
 * @returns {Object} Mutation object
 *
 * @example
 * const { mutate: changeUsername, isPending } = useChangeUsername();
 *
 * const handleSubmit = (data) => {
 *   changeUsername(data, {
 *     onSuccess: (response) => {
 *       // User object updated in response
 *     }
 *   });
 * };
 */
export const useChangeUsername = () => {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.changeUsername,
    onSuccess: (data) => {
      try {
        console.log("[useChangeUsername] Username change response:", data);

        // Update user in store if new user data provided
        if (data?.user) {
          setUser(data.user);
          console.log("[useChangeUsername] User updated in store");
        }

        // Invalidate current user query
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
