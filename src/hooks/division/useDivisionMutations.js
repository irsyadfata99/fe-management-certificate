import { useMutation, useQueryClient } from "@tanstack/react-query";
import { divisionApi } from "@/api";
import { getErrorMessage } from "@/utils/api/errorHandler";
import { toast } from "sonner";

export const useCreateDivision = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: divisionApi.createDivision,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["divisions"] });
      toast.success("Division created successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useUpdateDivision = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => divisionApi.updateDivision(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["divisions"] });
      queryClient.invalidateQueries({ queryKey: ["divisions", variables.id] });
      toast.success("Division updated successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useDeleteDivision = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: divisionApi.deleteDivision,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["divisions"] });
      toast.success("Division deleted successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useToggleDivisionActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: divisionApi.toggleDivisionActive,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["divisions"] });
      queryClient.invalidateQueries({ queryKey: ["divisions", id] });
      toast.success("Division status updated successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useCreateSubDivision = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ divisionId, data }) =>
      divisionApi.createSubDivision(divisionId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["divisions"] });
      queryClient.invalidateQueries({
        queryKey: ["divisions", variables.divisionId],
      });
      toast.success("Sub division created successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useUpdateSubDivision = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subId, data }) => divisionApi.updateSubDivision(subId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["divisions"] });
      toast.success("Sub division updated successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useDeleteSubDivision = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: divisionApi.deleteSubDivision,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["divisions"] });
      toast.success("Sub division deleted successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useToggleSubDivisionActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: divisionApi.toggleSubDivisionActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["divisions"] });
      toast.success("Sub division status updated successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};
