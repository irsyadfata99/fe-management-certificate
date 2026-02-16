/**
 * Branches Query Hooks
 * React Query hooks untuk fetching branch data
 */

import { useQuery } from "@tanstack/react-query";
import { branchApi } from "@/api";

/**
 * Get all branches
 * @param {Object} [params] - Query parameters
 * @param {boolean} [params.includeInactive] - Include inactive branches
 * @param {number} [params.page] - Page number for pagination
 * @param {number} [params.limit] - Items per page for pagination
 * @returns {Object} Query object with branches, stats, and pagination
 *
 * @example
 * const { data, isLoading } = useBranches();
 * const { data } = useBranches({ includeInactive: true, page: 1, limit: 5 });
 * // data = { branches: [...], stats: {...}, pagination: {...} }
 */
export const useBranches = (params = {}) => {
  return useQuery({
    queryKey: ["branches", params],
    queryFn: () => branchApi.getAllBranches(params),
    // Return full response object (branches + stats + pagination)
    select: (data) => data,
  });
};

/**
 * Get head branches only
 * @returns {Object} Query object
 *
 * @example
 * const { data: headBranches } = useHeadBranches();
 */
export const useHeadBranches = () => {
  return useQuery({
    queryKey: ["branches", "heads"],
    queryFn: branchApi.getHeadBranches,
    select: (data) => data.branches,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Get branch by ID
 * @param {number} id - Branch ID
 * @param {Object} [options] - Query options
 * @returns {Object} Query object
 *
 * @example
 * const { data: branch, isLoading } = useBranch(1);
 */
export const useBranch = (id, options = {}) => {
  return useQuery({
    queryKey: ["branches", id],
    queryFn: () => branchApi.getBranchById(id),
    select: (data) => data.branch,
    enabled: !!id,
    ...options,
  });
};
