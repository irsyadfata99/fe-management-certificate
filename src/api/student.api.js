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
 * // Returns matching students for autocomplete
 */
export const searchStudents = async (params) => {
  const { data } = await api.get(API_ENDPOINTS.STUDENTS.SEARCH, { params });
  return data;
};

/**
 * Get all students
 * @param {Object} [params]
 * @param {string} [params.search] - Search by name
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=20] - Items per page
 * @param {boolean} [params.includeInactive=false] - Include inactive students
 * @returns {Promise<{students: Array, pagination: Object}>}
 *
 * @example
 * const result = await getAllStudents({
 *   search: 'john',
 *   page: 1,
 *   limit: 20
 * });
 */
export const getAllStudents = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.STUDENTS.GET_ALL, { params });
  return data;
};

/**
 * Get student by ID
 * @param {number} id - Student ID
 * @returns {Promise<{student: Object}>}
 *
 * @example
 * const { student } = await getStudentById(1);
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
 * const result = await getStudentHistory(1, {
 *   startDate: '2024-01-01',
 *   page: 1
 * });
 */
export const getStudentHistory = async (id, params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.STUDENTS.GET_HISTORY(id), { params });
  return data;
};

/**
 * Get student statistics
 * @param {Object} [params]
 * @param {string} [params.startDate] - Filter by date range
 * @param {string} [params.endDate] - Filter by date range
 * @param {number} [params.moduleId] - Filter by module
 * @returns {Promise<{statistics: Object}>}
 *
 * @example
 * const { statistics } = await getStudentStatistics({
 *   startDate: '2024-01-01',
 *   moduleId: 5
 * });
 */
export const getStudentStatistics = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.STUDENTS.GET_STATISTICS, { params });
  return data;
};

/**
 * Update student
 * @param {number} id - Student ID
 * @param {Object} updates
 * @param {string} updates.name - New student name
 * @returns {Promise<{student: Object, message: string}>}
 *
 * @example
 * const { student } = await updateStudent(1, {
 *   name: 'Updated Name'
 * });
 */
export const updateStudent = async (id, updates) => {
  const { data } = await api.put(API_ENDPOINTS.STUDENTS.UPDATE(id), updates);
  return data;
};

/**
 * Toggle student active status
 * @param {number} id - Student ID
 * @returns {Promise<{student: Object, message: string}>}
 *
 * @example
 * const { student } = await toggleStudentActive(1);
 */
export const toggleStudentActive = async (id) => {
  const { data } = await api.patch(API_ENDPOINTS.STUDENTS.TOGGLE_ACTIVE(id));
  return data;
};
