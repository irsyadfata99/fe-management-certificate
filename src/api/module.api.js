/**
 * Module API
 * Module management endpoints (Admin)
 */

import api from "./client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

/**
 * Get all modules
 * @param {Object} [params]
 * @param {boolean} [params.includeInactive=false] - Include inactive modules
 * @returns {Promise<{modules: Array}>}
 *
 * @example
 * const { modules } = await getAllModules({ includeInactive: true });
 */
export const getAllModules = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.MODULES.GET_ALL, { params });
  return data;
};

/**
 * Get module by ID
 * @param {number} id - Module ID
 * @returns {Promise<{module: Object}>}
 *
 * @example
 * const { module } = await getModuleById(1);
 */
export const getModuleById = async (id) => {
  const { data } = await api.get(API_ENDPOINTS.MODULES.GET_BY_ID(id));
  return data;
};

/**
 * Create new module
 * @param {Object} moduleData
 * @param {string} moduleData.module_code - Module code (2-20 chars, uppercase)
 * @param {string} moduleData.name - Module name
 * @param {number} moduleData.division_id - Division ID
 * @param {number} [moduleData.sub_div_id] - Sub division ID (optional)
 * @returns {Promise<{module: Object, message: string}>}
 *
 * @example
 * const { module } = await createModule({
 *   module_code: 'KID-BEG',
 *   name: 'Kids Beginner Module',
 *   division_id: 1,
 *   sub_div_id: 2
 * });
 */
export const createModule = async (moduleData) => {
  const { data } = await api.post(API_ENDPOINTS.MODULES.CREATE, moduleData);
  return data;
};

/**
 * Update module
 * @param {number} id - Module ID
 * @param {Object} updates
 * @param {string} [updates.module_code] - New module code
 * @param {string} [updates.name] - New module name
 * @param {number} [updates.division_id] - New division ID
 * @param {number} [updates.sub_div_id] - New sub division ID
 * @returns {Promise<{module: Object, message: string}>}
 *
 * @example
 * const { module } = await updateModule(1, {
 *   name: 'Updated Module Name'
 * });
 */
export const updateModule = async (id, updates) => {
  const { data } = await api.put(API_ENDPOINTS.MODULES.UPDATE(id), updates);
  return data;
};

/**
 * Toggle module active status
 * @param {number} id - Module ID
 * @returns {Promise<{module: Object, message: string}>}
 *
 * @example
 * const { module } = await toggleModuleActive(1);
 */
export const toggleModuleActive = async (id) => {
  const { data } = await api.patch(API_ENDPOINTS.MODULES.TOGGLE_ACTIVE(id));
  return data;
};

/**
 * Delete module
 * @param {number} id - Module ID
 * @returns {Promise<{message: string}>}
 *
 * @example
 * await deleteModule(5);
 */
export const deleteModule = async (id) => {
  const { data } = await api.delete(API_ENDPOINTS.MODULES.DELETE(id));
  return data;
};
