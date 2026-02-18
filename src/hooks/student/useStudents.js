/**
 * Students Query & Mutation Hooks
 * React Query hooks untuk fetching dan mutating student data
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentApi } from "@/api";
import { getErrorMessage } from "@/utils/api/errorHandler";
import { toast } from "sonner";

/**
 * Get all students with full detail columns:
 * name, division, sub_division, current_module, current_teacher, last_issued_certificate
 *
 * @param {Object} [params] - Query parameters
 * @returns {Object} Query object
 *
 * @example
 * const { data, isLoading } = useStudents({ search: 'john', page: 1 });
 * const students = data?.students || [];
 * const pagination = data?.pagination || {};
 */
export const useStudents = (params = {}) => {
  return useQuery({
    queryKey: ["students", params],
    queryFn: () => studentApi.getAllStudents(params),
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Get student by ID with full detail
 * @param {number} id - Student ID
 * @param {Object} [options] - Query options
 * @returns {Object} Query object
 *
 * @example
 * const { data: student } = useStudent(1);
 */
export const useStudent = (id, options = {}) => {
  return useQuery({
    queryKey: ["students", id],
    queryFn: () => studentApi.getStudentById(id),
    enabled: !!id,
    ...options,
  });
};

/**
 * Get student certificate history
 * @param {number} id - Student ID
 * @param {Object} [params] - Query parameters
 * @returns {Object} Query object
 *
 * @example
 * const { data } = useStudentHistory(1, { startDate: '2024-01-01' });
 * const { history, pagination } = data || {};
 */
export const useStudentHistory = (id, params = {}) => {
  return useQuery({
    queryKey: ["students", id, "history", params],
    queryFn: () => studentApi.getStudentHistory(id, params),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Get student statistics
 * @param {Object} [params] - Query parameters
 * @returns {Object} Query object
 *
 * @example
 * const { data } = useStudentStatistics();
 * const { statistics } = data || {};
 */
export const useStudentStatistics = (params = {}) => {
  return useQuery({
    queryKey: ["students", "statistics", params],
    queryFn: () => studentApi.getStudentStatistics(params),
    select: (data) => data.statistics,
  });
};

/**
 * Update student name mutation
 * @returns {Object} Mutation object
 *
 * @example
 * const { mutate: updateStudent } = useUpdateStudent();
 * updateStudent({ id: 1, data: { name: 'Updated Name' } });
 */
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

/**
 * Toggle student active status mutation
 * @returns {Object} Mutation object
 *
 * @example
 * const { mutate: toggleActive } = useToggleStudentActive();
 * toggleActive(1);
 */
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

/**
 * Migrate student to another sub-branch within the same head branch.
 *
 * @returns {Object} Mutation object
 *
 * @example
 * const { mutate: migrateStudent, isPending } = useMigrateStudent();
 *
 * migrateStudent(
 *   { id: 1, target_branch_id: 3 },
 *   {
 *     onSuccess: (data) => {
 *       console.log('Migrated to:', data.migrated_to_branch.name);
 *     }
 *   }
 * );
 */
export const useMigrateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, target_branch_id }) => studentApi.migrateStudent(id, { target_branch_id }),
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
