/**
 * Students Query Hooks
 * React Query hooks untuk fetching student data
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentApi } from "@/api";
import { getErrorMessage } from "@/utils/api/errorHandler";
import { toast } from "sonner";

/**
 * Get all students
 * @param {Object} [params] - Query parameters
 * @returns {Object} Query object
 *
 * @example
 * const { data, isLoading } = useStudents({
 *   search: 'john',
 *   page: 1,
 *   limit: 20
 * });
 */
export const useStudents = (params = {}) => {
  return useQuery({
    queryKey: ["students", params],
    queryFn: () => studentApi.getAllStudents(params),
    keepPreviousData: true,
  });
};

/**
 * Get student by ID
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
    select: (data) => data.student,
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
 * const { data: history } = useStudentHistory(1, {
 *   startDate: '2024-01-01',
 *   page: 1
 * });
 */
export const useStudentHistory = (id, params = {}) => {
  return useQuery({
    queryKey: ["students", id, "history", params],
    queryFn: () => studentApi.getStudentHistory(id, params),
    enabled: !!id,
    keepPreviousData: true,
  });
};

/**
 * Get student statistics
 * @param {Object} [params] - Query parameters
 * @returns {Object} Query object
 *
 * @example
 * const { data: statistics } = useStudentStatistics({
 *   startDate: '2024-01-01',
 *   moduleId: 5
 * });
 */
export const useStudentStatistics = (params = {}) => {
  return useQuery({
    queryKey: ["students", "statistics", params],
    queryFn: () => studentApi.getStudentStatistics(params),
    select: (data) => data.statistics,
  });
};

/**
 * Update student mutation
 * @returns {Object} Mutation object
 *
 * @example
 * const { mutate: updateStudent } = useUpdateStudent();
 *
 * updateStudent({ id: 1, data: { name: 'Updated Name' } });
 */
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => studentApi.updateStudent(id, data),
    onSuccess: (data, variables) => {
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
 * Toggle student active status
 * @returns {Object} Mutation object
 *
 * @example
 * const { mutate: toggleActive } = useToggleStudentActive();
 *
 * toggleActive(1);
 */
export const useToggleStudentActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentApi.toggleStudentActive,
    onSuccess: (data, id) => {
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
