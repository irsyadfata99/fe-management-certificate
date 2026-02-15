/**
 * Teachers Query Hooks (Admin)
 * React Query hooks untuk fetching teacher data
 */

import { useQuery } from "@tanstack/react-query";
import { teacherApi } from "@/api";

/**
 * Get all teachers
 * @param {Object} [params] - Query parameters
 * @returns {Object} Query object
 *
 * @example
 * const { data: teachers, isLoading } = useTeachers();
 */
export const useTeachers = (params = {}) => {
  return useQuery({
    queryKey: ["teachers", params],
    queryFn: () => teacherApi.getAllTeachers(params),
    select: (data) => data.teachers,
  });
};

/**
 * Get teacher by ID
 * @param {number} id - Teacher ID
 * @param {Object} [options] - Query options
 * @returns {Object} Query object
 *
 * @example
 * const { data: teacher } = useTeacher(1);
 */
export const useTeacher = (id, options = {}) => {
  return useQuery({
    queryKey: ["teachers", id],
    queryFn: () => teacherApi.getTeacherById(id),
    select: (data) => data.teacher,
    enabled: !!id,
    ...options,
  });
};
