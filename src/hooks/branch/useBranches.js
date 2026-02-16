import { useQuery } from "@tanstack/react-query";
import {
  getAllBranches,
  getBranchById,
  getHeadBranches,
} from "../../api/branch.api";
import { getCertificateBranches } from "../../api/certificate.api";
import { useAuthStore } from "../../store/authStore";

// ============================================================================
// QUERY: Get All Branches (with role-based endpoint selection)
// ============================================================================

/**
 * ✅ FIXED: Hook untuk get branches dengan role-based endpoint
 * - SuperAdmin: uses /branches endpoint
 * - Admin: uses /certificates/branches endpoint (NEW!)
 *
 * @param {boolean} includeInactive - Include inactive branches (default: false)
 */
export const useBranches = (includeInactive = false) => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "admin";

  return useQuery({
    queryKey: ["branches", { includeInactive, role: user?.role }],
    queryFn: async () => {
      // Admin uses /certificates/branches endpoint
      if (isAdmin) {
        const response = await getCertificateBranches();

        // Transform to match expected structure
        return {
          branches: response.branches || [],
          stats: {
            total: response.branches?.length || 0,
            active: response.branches?.filter((b) => b.is_active).length || 0,
            inactive:
              response.branches?.filter((b) => !b.is_active).length || 0,
            headBranches:
              response.branches?.filter((b) => b.is_head_branch).length || 0,
            subBranches:
              response.branches?.filter((b) => !b.is_head_branch).length || 0,
          },
          pagination: {
            page: 1,
            limit: response.branches?.length || 0,
            totalPages: 1,
            totalRecords: response.branches?.length || 0,
          },
        };
      }

      // SuperAdmin uses /branches endpoint
      return await getAllBranches(includeInactive);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!user, // Only fetch when user is authenticated
  });
};

// ============================================================================
// QUERY: Get Head Branches (for dropdowns)
// ============================================================================

/**
 * Hook untuk get head branches only (untuk dropdown parent selection)
 * Only accessible by SuperAdmin
 */
export const useHeadBranches = () => {
  const user = useAuthStore((state) => state.user);
  const isSuperAdmin = user?.role === "superAdmin";

  return useQuery({
    queryKey: ["branches", "heads"],
    queryFn: getHeadBranches,
    staleTime: 5 * 60 * 1000,
    enabled: isSuperAdmin, // Only SuperAdmin can access this
  });
};

// ============================================================================
// QUERY: Get Branch by ID
// ============================================================================

/**
 * Hook untuk get single branch by ID
 * @param {number} id - Branch ID
 */
export const useBranch = (id, options = {}) => {
  return useQuery({
    queryKey: ["branches", id],
    queryFn: () => getBranchById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};
