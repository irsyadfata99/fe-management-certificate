/**
 * Branches Query Hooks
 * FIXED: Handle backend response structure { head_branch, sub_branches }
 */

import { useQuery } from "@tanstack/react-query";
import { branchApi } from "@/api";

/**
 * Get all branches
 * FIXED: Backend returns { head_branch: [...], sub_branches: [...] }
 * We need to merge them into single branches array
 */
export const useBranches = (params = {}) => {
  return useQuery({
    queryKey: ["branches", params],
    queryFn: () => branchApi.getAllBranches(params),
    // ✅ FIX: Transform response to match expected structure
    select: (data) => {
      console.log("[useBranches] Raw data:", data);

      // Backend returns: { head_branch: [...], sub_branches: [...] }
      // OR could return: { branches: [...] }

      let branches = [];
      let stats = {};
      let pagination = {};

      // Handle new backend structure
      if (data.head_branch && data.sub_branches) {
        console.log("[useBranches] Using head_branch + sub_branches structure");

        // Merge head and sub branches
        branches = [...(Array.isArray(data.head_branch) ? data.head_branch : []), ...(Array.isArray(data.sub_branches) ? data.sub_branches : [])];

        // Calculate stats
        stats = {
          total: branches.length,
          active: branches.filter((b) => b.is_active).length,
          inactive: branches.filter((b) => !b.is_active).length,
          head: branches.filter((b) => b.is_head_branch).length,
          sub: branches.filter((b) => !b.is_head_branch).length,
        };
      }
      // Handle old backend structure (if exists)
      else if (data.branches) {
        console.log("[useBranches] Using branches array structure");
        branches = data.branches;
        stats = data.stats || {};
        pagination = data.pagination || {};
      }
      // Fallback: treat data as array
      else if (Array.isArray(data)) {
        console.log("[useBranches] Data is array, using directly");
        branches = data;
      }

      console.log("[useBranches] Processed branches:", {
        count: branches.length,
        hasStats: Object.keys(stats).length > 0,
        hasPagination: Object.keys(pagination).length > 0,
      });

      return {
        branches,
        stats,
        pagination,
      };
    },
  });
};

/**
 * Get head branches only
 * FIXED: Extract from head_branch field or filter
 */
export const useHeadBranches = () => {
  return useQuery({
    queryKey: ["branches", "heads"],
    queryFn: branchApi.getHeadBranches,
    // ✅ FIX: Handle response structure
    select: (data) => {
      console.log("[useHeadBranches] Raw data:", data);

      let branches = [];

      // Backend might return: { head_branch: [...] }
      if (data.head_branch) {
        branches = data.head_branch;
      }
      // OR: { branches: [...] }
      else if (data.branches) {
        branches = data.branches;
      }
      // OR: direct array
      else if (Array.isArray(data)) {
        branches = data;
      }

      console.log("[useHeadBranches] Processed branches:", branches.length);

      return branches;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Get branch by ID
 */
export const useBranch = (id, options = {}) => {
  return useQuery({
    queryKey: ["branches", id],
    queryFn: () => branchApi.getBranchById(id),
    select: (data) => {
      console.log("[useBranch] Raw data for ID", id, ":", data);

      // Backend returns: { branch: {...} }
      return data.branch || data;
    },
    enabled: !!id,
    ...options,
  });
};
