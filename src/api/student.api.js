/**
 * Student API
 * Student management and search endpoints
 */

import api from "./client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

/**
 * Search students by name
 * @param {Object} params
 * @param {string} params.name - Search query (min 2 chars)
 * @returns {Promise<{students: Array}>}
 *
 * @example
 * const { students } = await searchStudents({ name: 'john' });
 */
export const searchStudents = async (params) => {
  const { data } = await api.get(API_ENDPOINTS.STUDENTS.SEARCH, { params });
  return data;
};

/**
 * Get all students with full detail
 * Response includes: division, sub_division, current_module, current_teacher, last_issued_certificate
 *
 * @param {Object} [params]
 * @param {string} [params.search] - Search by name
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=20] - Items per page
 * @param {boolean} [params.includeInactive=false] - Include inactive students
 * @returns {Promise<{students: Array, pagination: Object}>}
 *
 * @example
 * const result = await getAllStudents({ search: 'john', page: 1 });
 * // students[0]: { id, name, division, sub_division, current_module, current_teacher, last_issued_certificate }
 */
export const getAllStudents = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.STUDENTS.GET_ALL, { params });
  return data;
};

/**
 * Get student by ID with full detail
 * @param {number} id - Student ID
 * @returns {Promise<Object>}
 *
 * @example
 * const student = await getStudentById(1);
 */
export const getStudentById = async (id) => {
  const { data } = await api.get(API_ENDPOINTS.STUDENTS.GET_BY_ID(id));
  return data;
};

/**
 * Get student certificate history
 * @param {number} id - Student ID
 * @param {Object} [params]
 * @param {string} [params.startDate] - Filter by date range
 * @param {string} [params.endDate] - Filter by date range
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=20] - Items per page
 * @returns {Promise<{history: Array, pagination: Object}>}
 *
 * @example
 * const result = await getStudentHistory(1, { startDate: '2024-01-01' });
 */
export const getStudentHistory = async (id, params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.STUDENTS.GET_HISTORY(id), { params });
  return data;
};

/**
 * Get student statistics
 * @param {Object} [params]
 * @returns {Promise<{statistics: Object}>}
 *
 * @example
 * const { statistics } = await getStudentStatistics();
 */
export const getStudentStatistics = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.STUDENTS.GET_STATISTICS, { params });
  return data;
};

/**
 * Update student name
 * @param {number} id - Student ID
 * @param {Object} updates
 * @param {string} updates.name - New student name
 * @returns {Promise<Object>}
 *
 * @example
 * await updateStudent(1, { name: 'Updated Name' });
 */
export const updateStudent = async (id, updates) => {
  const { data } = await api.put(API_ENDPOINTS.STUDENTS.UPDATE(id), updates);
  return data;
};

/**
 * Toggle student active status
 * @param {number} id - Student ID
 * @returns {Promise<Object>}
 *
 * @example
 * await toggleStudentActive(1);
 */
export const toggleStudentActive = async (id) => {
  const { data } = await api.patch(API_ENDPOINTS.STUDENTS.TOGGLE_ACTIVE(id));
  return data;
};

/**
 * Migrate student to another sub-branch within the same head branch
 * Head branch tidak berubah; hanya sub-branch assignment yang berpindah.
 * Future certificate prints akan menggunakan target branch.
 *
 * @param {number} id - Student ID
 * @param {Object} payload
 * @param {number} payload.target_branch_id - Target sub-branch ID (harus 1 head branch yang sama)
 * @returns {Promise<Object>}
 *
 * @example
 * const result = await migrateStudent(1, { target_branch_id: 3 });
 * // result.migrated_to_branch: { id, code, name }
 * // result.note: "Student migration recorded..."
 */
export const migrateStudent = async (id, payload) => {
  const { data } = await api.post(API_ENDPOINTS.STUDENTS.MIGRATE(id), payload);
  return data;
};
