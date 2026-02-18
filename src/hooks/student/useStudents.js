import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentApi } from "@/api";
import { getErrorMessage } from "@/utils/api/errorHandler";
import { toast } from "sonner";

export const useStudents = (params = {}) => {
  return useQuery({
    queryKey: ["students", params],
    queryFn: () => studentApi.getAllStudents(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useStudent = (id, options = {}) => {
  return useQuery({
    queryKey: ["students", id],
    queryFn: () => studentApi.getStudentById(id),
    enabled: !!id,
    ...options,
  });
};

export const useStudentHistory = (id, params = {}) => {
  return useQuery({
    queryKey: ["students", id, "history", params],
    queryFn: () => studentApi.getStudentHistory(id, params),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
  });
};

export const useStudentStatistics = (params = {}) => {
  return useQuery({
    queryKey: ["students", "statistics", params],
    queryFn: () => studentApi.getStudentStatistics(params),
    select: (data) => data.statistics,
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => studentApi.updateStudent(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["students", variables.id] });
      toast.success("Student updated successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useToggleStudentActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentApi.toggleStudentActive,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["students", id] });
      toast.success("Student status updated successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useMigrateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, target_branch_id }) =>
      studentApi.migrateStudent(id, { target_branch_id }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["students", variables.id] });
      const branchName = data?.migrated_to_branch?.name || "target branch";
      toast.success(`Student migrated to ${branchName}`);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};
