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
    onSuccess: (_, variables) => {
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
    onSuccess: (_, id) => {
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

/**
 * Migrate teacher to a new primary branch within the same head branch.
 * Setelah berhasil, teacher list di-refresh otomatis.
 *
 * @returns {Object} Mutation object
 *
 * @example
 * const { mutate: migrateTeacher, isPending } = useMigrateTeacher();
 *
 * migrateTeacher(
 *   { id: 1, target_branch_id: 3 },
 *   {
 *     onSuccess: (teacher) => {
 *       console.log('New primary branch:', teacher.branch_id);
 *     }
 *   }
 * );
 */
export const useMigrateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, target_branch_id }) => teacherApi.migrateTeacher(id, { target_branch_id }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["teachers", variables.id] });
      toast.success("Teacher migrated successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};
