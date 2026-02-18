import { useMutation, useQueryClient } from "@tanstack/react-query";
import { branchApi } from "@/api";
import { getErrorMessage } from "@/utils/api/errorHandler";
import { toast } from "sonner";

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
