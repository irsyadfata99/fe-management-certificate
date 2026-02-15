/**
 * Branch Mutation Hooks
 * React Query hooks untuk branch CRUD operations (SuperAdmin only)
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { branchApi } from "@/api";
import { getErrorMessage } from "@/utils/api/errorHandler";
import { toast } from "sonner";

/**
 * Create branch mutation
 * @returns {Object} Mutation object
 *
 * @example
 * const { mutate: createBranch, isPending } = useCreateBranch();
 *
 * createBranch({
 *   code: 'HQ',
 *   name: 'Head Quarter',
 *   is_head_branch: true,
 *   admin_username: 'admin_hq'
 * });
 */
export const useCreateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: branchApi.createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast.success("Branch created successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Update branch mutation
 * @returns {Object} Mutation object
 *
 * @example
 * const { mutate: updateBranch } = useUpdateBranch();
 *
 * updateBranch({
 *   id: 1,
 *   data: { name: 'Updated Name' }
 * });
 */
export const useUpdateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => branchApi.updateBranch(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      queryClient.invalidateQueries({ queryKey: ["branches", variables.id] });
      toast.success("Branch updated successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Delete branch mutation
 * @returns {Object} Mutation object
 *
 * @example
 * const { mutate: deleteBranch } = useDeleteBranch();
 *
 * deleteBranch(5);
 */
export const useDeleteBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: branchApi.deleteBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast.success("Branch deleted successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Toggle branch active status
 * @returns {Object} Mutation object
 *
 * @example
 * const { mutate: toggleActive } = useToggleBranchActive();
 *
 * toggleActive(1);
 */
export const useToggleBranchActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: branchApi.toggleBranchActive,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      queryClient.invalidateQueries({ queryKey: ["branches", id] });

      const status = data.branch?.is_active ? "activated" : "deactivated";
      toast.success(`Branch ${status} successfully`);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Toggle branch head status
 * @returns {Object} Mutation object
 *
 * @example
 * const { mutate: toggleHead } = useToggleBranchHead();
 *
 * toggleHead({
 *   id: 2,
 *   payload: { is_head_branch: true, admin_username: 'admin_branch2' }
 * });
 */
export const useToggleBranchHead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => branchApi.toggleBranchHead(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      queryClient.invalidateQueries({ queryKey: ["branches", variables.id] });

      const status = data.branch?.is_head_branch ? "head branch" : "sub branch";
      toast.success(`Branch converted to ${status} successfully`);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Reset branch admin password
 * @returns {Object} Mutation object
 *
 * @example
 * const { mutate: resetPassword } = useResetBranchAdminPassword();
 *
 * resetPassword(1, {
 *   onSuccess: (data) => {
 *     console.log('New password:', data.password);
 *   }
 * });
 */
export const useResetBranchAdminPassword = () => {
  return useMutation({
    mutationFn: branchApi.resetBranchAdminPassword,
    onSuccess: () => {
      toast.success("Admin password reset successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};
