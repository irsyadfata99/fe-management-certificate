import { useQuery } from "@tanstack/react-query";
import {
  getAllBranches,
  getBranchById,
  getHeadBranches,
} from "../../api/branch.api";
import { getCertificateBranches } from "../../api/certificate.api";
import { useAuthStore } from "../../store/authStore";

export const useBranches = (includeInactive = false) => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "admin";

  return useQuery({
    queryKey: ["branches", { includeInactive, role: user?.role }],
    queryFn: async () => {
      if (isAdmin) {
        const response = await getCertificateBranches();

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

      return await getAllBranches(includeInactive);
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!user,
  });
};

export const useHeadBranches = () => {
  const user = useAuthStore((state) => state.user);
  const isSuperAdmin = user?.role === "superAdmin";

  return useQuery({
    queryKey: ["branches", "heads"],
    queryFn: getHeadBranches,
    staleTime: 5 * 60 * 1000,
    enabled: isSuperAdmin,
  });
};

export const useBranch = (id, options = {}) => {
  return useQuery({
    queryKey: ["branches", id],
    queryFn: () => getBranchById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};
