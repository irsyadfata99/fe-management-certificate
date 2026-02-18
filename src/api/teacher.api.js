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
 * @param {string} [params.search] - Search by username or full_name
 * @param {number} [params.branchId] - Filter by branch ID
 * @param {number} [params.divisionId] - Filter by division ID
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=50] - Items per page
 * @returns {Promise<{teachers: Array, pagination: Object}>}
 *
 * @example
 * const { teachers } = await getAllTeachers({ search: 'john', branchId: 1 });
 */
export const getAllTeachers = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.TEACHERS.GET_ALL, { params });
  return data;
};

/**
 * Get teacher by ID
 * @param {number} id - Teacher ID
 * @returns {Promise<Object>}
 *
 * @example
 * const teacher = await getTeacherById(1);
 */
export const getTeacherById = async (id) => {
  const { data } = await api.get(API_ENDPOINTS.TEACHERS.GET_BY_ID(id));
  return data;
};

/**
 * Create new teacher
 * @param {Object} teacherData
 * @param {string} teacherData.username
 * @param {string} teacherData.full_name
 * @param {number[]} teacherData.branch_ids
 * @param {number[]} teacherData.division_ids
 * @returns {Promise<{teacher: Object, temporaryPassword: string}>}
 *
 * @example
 * const result = await createTeacher({
 *   username: 'teacher1',
 *   full_name: 'John Doe',
 *   branch_ids: [1, 2],
 *   division_ids: [1]
 * });
 */
export const createTeacher = async (teacherData) => {
  const { data } = await api.post(API_ENDPOINTS.TEACHERS.CREATE, teacherData);
  return data;
};

/**
 * Update teacher
 * @param {number} id - Teacher ID
 * @param {Object} updates
 * @param {string} [updates.username]
 * @param {string} [updates.full_name]
 * @param {number[]} [updates.branch_ids]
 * @param {number[]} [updates.division_ids]
 * @returns {Promise<Object>}
 *
 * @example
 * await updateTeacher(1, { full_name: 'Jane Doe', branch_ids: [1, 2, 3] });
 */
export const updateTeacher = async (id, updates) => {
  const { data } = await api.put(API_ENDPOINTS.TEACHERS.UPDATE(id), updates);
  return data;
};

/**
 * Reset teacher password
 * @param {number} id - Teacher ID
 * @returns {Promise<{temporaryPassword: string}>}
 *
 * @example
 * const { temporaryPassword } = await resetTeacherPassword(1);
 */
export const resetTeacherPassword = async (id) => {
  const { data } = await api.post(API_ENDPOINTS.TEACHERS.RESET_PASSWORD(id));
  return data;
};

/**
 * Toggle teacher active status
 * @param {number} id - Teacher ID
 * @returns {Promise<Object>}
 *
 * @example
 * await toggleTeacherActive(1);
 */
export const toggleTeacherActive = async (id) => {
  const { data } = await api.patch(API_ENDPOINTS.TEACHERS.TOGGLE_ACTIVE(id));
  return data;
};

/**
 * Migrate teacher to a new primary branch within the same head branch.
 * Updates primary branch (users.branch_id) dan menambahkan target branch
 * ke teacher_branches jika belum ada.
 *
 * @param {number} id - Teacher ID
 * @param {Object} payload
 * @param {number} payload.target_branch_id - Target branch ID (harus 1 head branch yang sama)
 * @returns {Promise<Object>} Updated teacher object
 *
 * @example
 * const teacher = await migrateTeacher(1, { target_branch_id: 3 });
 * // teacher.branch_id === 3
 */
export const migrateTeacher = async (id, payload) => {
  const { data } = await api.post(API_ENDPOINTS.TEACHERS.MIGRATE(id), payload);
  return data;
};
