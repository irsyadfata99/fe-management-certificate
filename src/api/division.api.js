/**
 * Division API
 * Division and Sub Division management endpoints (Admin)
 */

import api from "./client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

// =============================================================================
// DIVISIONS
// =============================================================================

/**
 * Get all divisions
 * @param {Object} [params]
 * @param {boolean} [params.includeInactive=false] - Include inactive divisions
 * @returns {Promise<{divisions: Array}>}
 *
 * @example
 * const { divisions } = await getAllDivisions({ includeInactive: true });
 */
export const getAllDivisions = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.DIVISIONS.GET_ALL, { params });
  return data;
};

/**
 * Get division by ID
 * @param {number} id - Division ID
 * @returns {Promise<{division: Object}>}
 *
 * @example
 * const { division } = await getDivisionById(1);
 * // division includes sub_divisions array
 */
export const getDivisionById = async (id) => {
  const { data } = await api.get(API_ENDPOINTS.DIVISIONS.GET_BY_ID(id));
  return data;
};

/**
 * Create new division
 * @param {Object} divisionData
 * @param {string} divisionData.name - Division name
 * @param {Array} [divisionData.sub_divisions] - Sub divisions
 * @returns {Promise<{division: Object, message: string}>}
 *
 * @example
 * const { division } = await createDivision({
 *   name: 'Kids',
 *   sub_divisions: [
 *     { name: 'Beginner', age_min: 5, age_max: 7 },
 *     { name: 'Intermediate', age_min: 8, age_max: 10 }
 *   ]
 * });
 */
export const createDivision = async (divisionData) => {
  const { data } = await api.post(API_ENDPOINTS.DIVISIONS.CREATE, divisionData);
  return data;
};

/**
 * Update division
 * @param {number} id - Division ID
 * @param {Object} updates
 * @param {string} updates.name - New division name
 * @returns {Promise<{division: Object, message: string}>}
 *
 * @example
 * const { division } = await updateDivision(1, { name: 'Updated Kids' });
 */
export const updateDivision = async (id, updates) => {
  const { data } = await api.put(API_ENDPOINTS.DIVISIONS.UPDATE(id), updates);
  return data;
};

/**
 * Toggle division active status
 * @param {number} id - Division ID
 * @returns {Promise<{division: Object, message: string}>}
 *
 * @example
 * const { division } = await toggleDivisionActive(1);
 */
export const toggleDivisionActive = async (id) => {
  const { data } = await api.patch(API_ENDPOINTS.DIVISIONS.TOGGLE_ACTIVE(id));
  return data;
};

/**
 * Delete division
 * @param {number} id - Division ID
 * @returns {Promise<{message: string}>}
 *
 * @example
 * await deleteDivision(5);
 */
export const deleteDivision = async (id) => {
  const { data } = await api.delete(API_ENDPOINTS.DIVISIONS.DELETE(id));
  return data;
};

// =============================================================================
// SUB DIVISIONS
// =============================================================================

/**
 * Create sub division
 * @param {number} divisionId - Parent division ID
 * @param {Object} subDivisionData
 * @param {string} subDivisionData.name - Sub division name
 * @param {number} subDivisionData.age_min - Minimum age
 * @param {number} subDivisionData.age_max - Maximum age
 * @returns {Promise<{sub_division: Object, message: string}>}
 *
 * @example
 * const { sub_division } = await createSubDivision(1, {
 *   name: 'Advanced',
 *   age_min: 11,
 *   age_max: 13
 * });
 */
export const createSubDivision = async (divisionId, subDivisionData) => {
  const { data } = await api.post(API_ENDPOINTS.DIVISIONS.CREATE_SUB(divisionId), subDivisionData);
  return data;
};

/**
 * Update sub division
 * @param {number} subId - Sub division ID
 * @param {Object} updates
 * @param {string} [updates.name] - New name
 * @param {number} [updates.age_min] - New min age
 * @param {number} [updates.age_max] - New max age
 * @returns {Promise<{sub_division: Object, message: string}>}
 *
 * @example
 * const { sub_division } = await updateSubDivision(3, {
 *   name: 'Updated Advanced',
 *   age_min: 12,
 *   age_max: 14
 * });
 */
export const updateSubDivision = async (subId, updates) => {
  const { data } = await api.put(API_ENDPOINTS.DIVISIONS.UPDATE_SUB(subId), updates);
  return data;
};

/**
 * Toggle sub division active status
 * @param {number} subId - Sub division ID
 * @returns {Promise<{sub_division: Object, message: string}>}
 *
 * @example
 * const { sub_division } = await toggleSubDivisionActive(3);
 */
export const toggleSubDivisionActive = async (subId) => {
  const { data } = await api.patch(API_ENDPOINTS.DIVISIONS.TOGGLE_SUB_ACTIVE(subId));
  return data;
};

/**
 * Delete sub division
 * @param {number} subId - Sub division ID
 * @returns {Promise<{message: string}>}
 *
 * @example
 * await deleteSubDivision(3);
 */
export const deleteSubDivision = async (subId) => {
  const { data } = await api.delete(API_ENDPOINTS.DIVISIONS.DELETE_SUB(subId));
  return data;
};
