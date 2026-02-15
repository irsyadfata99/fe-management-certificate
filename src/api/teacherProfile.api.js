/**
 * Teacher Profile API
 * Teacher's own profile management endpoints
 * Teacher can only access their own data
 */

import api from "./client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

/**
 * Get teacher own profile
 * @returns {Promise<{teacher: Object}>}
 *
 * @example
 * const { teacher } = await getTeacherProfile();
 * // Returns: { id, username, full_name, branch_ids, division_ids, ... }
 */
export const getTeacherProfile = async () => {
  const { data } = await api.get(API_ENDPOINTS.TEACHERS.PROFILE.GET_ME);
  return data;
};

/**
 * Update teacher own profile
 * Teacher can only update their full_name
 * @param {Object} updates
 * @param {string} updates.full_name - New full name
 * @returns {Promise<{teacher: Object, message: string}>}
 *
 * @example
 * const { teacher } = await updateTeacherProfile({
 *   full_name: 'Updated Name'
 * });
 */
export const updateTeacherProfile = async (updates) => {
  // FIX: Backend menggunakan PATCH, bukan PUT (lihat teacherProfileRoutes.js)
  const { data } = await api.patch(
    API_ENDPOINTS.TEACHERS.PROFILE.UPDATE_ME,
    updates,
  );
  return data;
};

/**
 * Get teacher's assigned branches
 * Returns branches where teacher can operate
 * @returns {Promise<{branches: Array}>}
 *
 * @example
 * const { branches } = await getTeacherBranches();
 * // Use for certificate operations
 */
export const getTeacherBranches = async () => {
  const { data } = await api.get(API_ENDPOINTS.TEACHERS.PROFILE.GET_BRANCHES);
  return data;
};

/**
 * Get teacher's assigned divisions
 * Returns divisions teacher can teach
 * @returns {Promise<{divisions: Array}>}
 *
 * @example
 * const { divisions } = await getTeacherDivisions();
 */
export const getTeacherDivisions = async () => {
  const { data } = await api.get(API_ENDPOINTS.TEACHERS.PROFILE.GET_DIVISIONS);
  return data;
};

/**
 * Get teacher's available modules
 * Filtered by teacher's assigned divisions
 * @returns {Promise<{modules: Array}>}
 *
 * @example
 * const { modules } = await getTeacherModules();
 * // Use for certificate printing (module selection)
 */
export const getTeacherModules = async () => {
  const { data } = await api.get(API_ENDPOINTS.TEACHERS.PROFILE.GET_MODULES);
  return data;
};
