/**
 * Module Mutation Hooks
 * React Query hooks untuk module CRUD operations (Admin)
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moduleApi } from "@/api";
import { getErrorMessage } from "@/utils/api/errorHandler";
import { toast } from "sonner";

export const useCreateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: moduleApi.createModule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      toast.success("Module created successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useUpdateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => moduleApi.updateModule(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      queryClient.invalidateQueries({ queryKey: ["modules", variables.id] });
      toast.success("Module updated successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useDeleteModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: moduleApi.deleteModule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      toast.success("Module deleted successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useToggleModuleActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: moduleApi.toggleModuleActive,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      queryClient.invalidateQueries({ queryKey: ["modules", id] });
      toast.success("Module status updated successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};
