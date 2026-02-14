/**
 * Teacher API
 * Teacher management endpoints (Admin + Teacher profile)
 */

import api from "./client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

// =============================================================================
// ADMIN - TEACHER MANAGEMENT
// =============================================================================

/**
 * Get all teachers
 * @param {Object} [params]
 * @param {boolean} [params.includeInactive=false] - Include inactive teachers
 * @returns {Promise<{teachers: Array}>}
 *
 * @example
 * const { teachers } = await getAllTeachers({ includeInactive: true });
 */
export const getAllTeachers = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.TEACHERS.GET_ALL, { params });
  return data;
};

/**
 * Get teacher by ID
 * @param {number} id - Teacher ID
 * @returns {Promise<{teacher: Object}>}
 *
 * @example
 * const { teacher } = await getTeacherById(1);
 */
export const getTeacherById = async (id) => {
  const { data } = await api.get(API_ENDPOINTS.TEACHERS.GET_BY_ID(id));
  return data;
};

/**
 * Create new teacher
 * @param {Object} teacherData
 * @param {string} teacherData.username - Teacher username
 * @param {string} teacherData.full_name - Teacher full name
 * @param {number[]} teacherData.branch_ids - Array of branch IDs (min 1, max 10)
 * @param {number[]} teacherData.division_ids - Array of division IDs (min 1, max 20)
 * @returns {Promise<{teacher: Object, password: string, message: string}>}
 *
 * @example
 * const result = await createTeacher({
 *   username: 'teacher1',
 *   full_name: 'John Doe',
 *   branch_ids: [1, 2],
 *   division_ids: [1, 2, 3]
 * });
 * // Returns auto-generated password
 */
export const createTeacher = async (teacherData) => {
  const { data } = await api.post(API_ENDPOINTS.TEACHERS.CREATE, teacherData);
  return data;
};

/**
 * Update teacher
 * @param {number} id - Teacher ID
 * @param {Object} updates
 * @param {string} [updates.username] - New username
 * @param {string} [updates.full_name] - New full name
 * @param {number[]} [updates.branch_ids] - New branch IDs
 * @param {number[]} [updates.division_ids] - New division IDs
 * @returns {Promise<{teacher: Object, message: string}>}
 *
 * @example
 * const { teacher } = await updateTeacher(1, {
 *   full_name: 'Jane Doe',
 *   branch_ids: [1, 2, 3]
 * });
 */
export const updateTeacher = async (id, updates) => {
  const { data } = await api.put(API_ENDPOINTS.TEACHERS.UPDATE(id), updates);
  return data;
};

/**
 * Reset teacher password
 * @param {number} id - Teacher ID
 * @returns {Promise<{password: string, message: string}>}
 *
 * @example
 * const { password } = await resetTeacherPassword(1);
 * // Returns new auto-generated password
 */
export const resetTeacherPassword = async (id) => {
  const { data } = await api.post(API_ENDPOINTS.TEACHERS.RESET_PASSWORD(id));
  return data;
};

/**
 * Toggle teacher active status
 * @param {number} id - Teacher ID
 * @returns {Promise<{teacher: Object, message: string}>}
 *
 * @example
 * const { teacher } = await toggleTeacherActive(1);
 */
export const toggleTeacherActive = async (id) => {
  const { data } = await api.patch(API_ENDPOINTS.TEACHERS.TOGGLE_ACTIVE(id));
  return data;
};
