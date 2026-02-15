/**
 * Teacher Mutation Hooks (Admin)
 * React Query hooks untuk teacher CRUD operations
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherApi } from "@/api";
import { getErrorMessage } from "@/utils/api/errorHandler";
import { toast } from "sonner";

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teacherApi.createTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Teacher created successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => teacherApi.updateTeacher(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["teachers", variables.id] });
      toast.success("Teacher updated successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useResetTeacherPassword = () => {
  return useMutation({
    mutationFn: teacherApi.resetTeacherPassword,
    onSuccess: () => {
      toast.success("Password reset successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useToggleTeacherActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teacherApi.toggleTeacherActive,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["teachers", id] });
      toast.success("Teacher status updated successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};
