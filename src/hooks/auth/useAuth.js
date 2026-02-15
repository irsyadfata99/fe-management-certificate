/**
 * Auth Hooks
 * React Query hooks untuk authentication operations
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api";
import { useAuthStore } from "@/store/authStore";
import { getErrorMessage } from "@/utils/api/errorHandler";
import { toast } from "sonner";

/**
 * Login mutation
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
      // client.js interceptor sudah auto-unwrap envelope { success, message, data }
      // sehingga di sini "data" sudah berisi { user, accessToken, refreshToken } langsung
      loginStore(data);

      // Invalidate all queries on login
      queryClient.invalidateQueries();

      toast.success("Login successful");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Logout mutation
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
      // Clear auth store
      logoutStore();

      // Clear all cached queries
      queryClient.clear();

      toast.success("Logged out successfully");
    },
    onError: (error) => {
      // Even if API fails, still logout locally
      logoutStore();
      queryClient.clear();

      const message = getErrorMessage(error);
      toast.error(message);
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
      toast.success("Password changed successfully");
    },
    onError: (error) => {
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
      // client.js interceptor sudah auto-unwrap envelope
      if (data?.user) {
        setUser(data.user);
      }

      // Invalidate current user query
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

      toast.success("Username changed successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};
