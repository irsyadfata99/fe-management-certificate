/**
 * Profile Hooks
 * React Query hooks untuk current user profile
 */

import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/api";
import { useAuthStore } from "@/store/authStore";

/**
 * Get current user profile
 * @returns {Object} Query object
 *
 * @example
 * const { data: user, isLoading } = useCurrentUser();
 */
export const useCurrentUser = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    select: (data) => data.user,
  });
};
