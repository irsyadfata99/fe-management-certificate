/**
 * Teachers Query Hooks (Admin)
 * React Query hooks untuk fetching teacher data
 * ✅ FIXED: Proper pagination and filter support
 */

import { useQuery } from "@tanstack/react-query";
import { teacherApi } from "@/api";

/**
 * Get all teachers
 * ✅ UPDATED: Now properly handles pagination response from backend
 *
 * @param {Object} [params] - Query parameters
 * @param {boolean} [params.includeInactive] - Include inactive teachers
 * @param {string} [params.search] - Search by username or name
 * @param {string|number} [params.branchId] - Filter by branch ID
 * @param {string|number} [params.divisionId] - Filter by division ID
 * @param {number} [params.page] - Page number (default: 1)
 * @param {number} [params.limit] - Items per page (default: 8)
 * @returns {Object} Query object with { teachers: [], pagination: {} }
 *
 * @example
 * const { data, isLoading } = useTeachers({
 *   search: 'john',
 *   branchId: 1,
 *   divisionId: 2,
 *   page: 1,
 *   limit: 8
 * });
 *
 * // Access data:
 * const teachers = data?.teachers || [];
 * const pagination = data?.pagination || {};
 */
export const useTeachers = (params = {}) => {
  return useQuery({
    queryKey: ["teachers", params],
    queryFn: () => teacherApi.getAllTeachers(params),
    // ✅ FIX: Properly handle pagination response
    select: (data) => {
      // Backend returns: { success: true, teachers: [...], pagination?: {...} }
      // OR just: { teachers: [...] }
      // OR legacy: [...]

      if (data?.teachers && Array.isArray(data.teachers)) {
        return {
          teachers: data.teachers,
          pagination: data.pagination || {
            total: data.teachers.length,
            page: params.page || 1,
            limit: params.limit || 8,
            totalPages: Math.ceil(data.teachers.length / (params.limit || 8)),
          },
        };
      }

      // Legacy: direct array response
      if (Array.isArray(data)) {
        return {
          teachers: data,
          pagination: {
            total: data.length,
            page: params.page || 1,
            limit: params.limit || 8,
            totalPages: Math.ceil(data.length / (params.limit || 8)),
          },
        };
      }

      // Fallback
      return {
        teachers: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 8,
          totalPages: 0,
        },
      };
    },
    // Keep previous data while fetching (smooth pagination)
    placeholderData: (previousData) => previousData,
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
