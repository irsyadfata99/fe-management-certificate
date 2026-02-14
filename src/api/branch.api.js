/**
 * Branch API
 * Branch management endpoints (SuperAdmin only)
 */

import api from "./client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

/**
 * Get all branches
 * @param {Object} [params]
 * @param {boolean} [params.includeInactive=false] - Include inactive branches
 * @returns {Promise<{branches: Array}>}
 *
 * @example
 * const { branches } = await getAllBranches({ includeInactive: true });
 */
export const getAllBranches = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.BRANCHES.GET_ALL, { params });
  return data;
};

/**
 * Get head branches only (for dropdowns)
 * @returns {Promise<{branches: Array}>}
 *
 * @example
 * const { branches } = await getHeadBranches();
 */
export const getHeadBranches = async () => {
  const { data } = await api.get(API_ENDPOINTS.BRANCHES.GET_HEADS);
  return data;
};

/**
 * Get branch by ID
 * @param {number} id - Branch ID
 * @returns {Promise<{branch: Object}>}
 *
 * @example
 * const { branch } = await getBranchById(1);
 */
export const getBranchById = async (id) => {
  const { data } = await api.get(API_ENDPOINTS.BRANCHES.GET_BY_ID(id));
  return data;
};

/**
 * Create new branch
 * @param {Object} branchData
 * @param {string} branchData.code - Branch code (2-10 chars, uppercase)
 * @param {string} branchData.name - Branch name
 * @param {boolean} branchData.is_head_branch - Is head branch?
 * @param {number} [branchData.parent_id] - Parent branch ID (required if not head)
 * @param {string} [branchData.admin_username] - Admin username (for head branch)
 * @returns {Promise<{branch: Object, admin?: Object, message: string}>}
 *
 * @example
 * // Create head branch
 * const result = await createBranch({
 *   code: 'HQ',
 *   name: 'Head Quarter',
 *   is_head_branch: true,
 *   admin_username: 'admin_hq'
 * });
 *
 * @example
 * // Create sub branch
 * const result = await createBranch({
 *   code: 'SUB1',
 *   name: 'Sub Branch 1',
 *   is_head_branch: false,
 *   parent_id: 1
 * });
 */
export const createBranch = async (branchData) => {
  const { data } = await api.post(API_ENDPOINTS.BRANCHES.CREATE, branchData);
  return data;
};

/**
 * Update branch
 * @param {number} id - Branch ID
 * @param {Object} updates
 * @param {string} [updates.code] - New branch code
 * @param {string} [updates.name] - New branch name
 * @param {number} [updates.parent_id] - New parent ID
 * @returns {Promise<{branch: Object, message: string}>}
 *
 * @example
 * const { branch } = await updateBranch(1, {
 *   name: 'Updated Name',
 *   code: 'NEWCODE'
 * });
 */
export const updateBranch = async (id, updates) => {
  const { data } = await api.put(API_ENDPOINTS.BRANCHES.UPDATE(id), updates);
  return data;
};

/**
 * Delete branch
 * @param {number} id - Branch ID
 * @returns {Promise<{message: string}>}
 *
 * @example
 * await deleteBranch(5);
 */
export const deleteBranch = async (id) => {
  const { data } = await api.delete(API_ENDPOINTS.BRANCHES.DELETE(id));
  return data;
};

/**
 * Toggle branch active status
 * @param {number} id - Branch ID
 * @returns {Promise<{branch: Object, message: string}>}
 *
 * @example
 * const { branch } = await toggleBranchActive(1);
 * // branch.is_active toggled
 */
export const toggleBranchActive = async (id) => {
  const { data } = await api.patch(API_ENDPOINTS.BRANCHES.TOGGLE_ACTIVE(id));
  return data;
};

/**
 * Toggle branch head status
 * @param {number} id - Branch ID
 * @param {Object} payload
 * @param {boolean} payload.is_head_branch - New head status
 * @param {number} [payload.parent_id] - Parent ID (required if becoming sub branch)
 * @param {string} [payload.admin_username] - Admin username (required if becoming head)
 * @returns {Promise<{branch: Object, admin?: Object, message: string}>}
 *
 * @example
 * // Convert to head branch
 * const result = await toggleBranchHead(2, {
 *   is_head_branch: true,
 *   admin_username: 'admin_branch2'
 * });
 *
 * @example
 * // Convert to sub branch
 * const result = await toggleBranchHead(3, {
 *   is_head_branch: false,
 *   parent_id: 1
 * });
 */
export const toggleBranchHead = async (id, payload) => {
  const { data } = await api.patch(API_ENDPOINTS.BRANCHES.TOGGLE_HEAD(id), payload);
  return data;
};

/**
 * Reset branch admin password
 * @param {number} id - Branch ID
 * @returns {Promise<{password: string, message: string}>}
 *
 * @example
 * const { password } = await resetBranchAdminPassword(1);
 * // Returns new generated password
 */
export const resetBranchAdminPassword = async (id) => {
  const { data } = await api.post(API_ENDPOINTS.BRANCHES.RESET_ADMIN_PASSWORD(id));
  return data;
};
