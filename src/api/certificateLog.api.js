/**
 * Certificate Log API
 * Certificate logs and export endpoints
 */

import api from "./client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";
import { buildQueryString } from "@/utils/api/queryBuilder";

/**
 * Get certificate logs
 * @param {Object} [params]
 * @param {string} [params.actionType] - Filter by action (bulk_create, migrate, reserve, print, release)
 * @param {number} [params.actorId] - Filter by user ID
 * @param {string} [params.startDate] - Filter by date range (YYYY-MM-DD)
 * @param {string} [params.endDate] - Filter by date range (YYYY-MM-DD)
 * @param {string} [params.certificateNumber] - Search by certificate number
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=20] - Items per page
 * @returns {Promise<{logs: Array, pagination: Object}>}
 *
 * @example
 * const result = await getCertificateLogs({
 *   actionType: 'print',
 *   startDate: '2024-01-01',
 *   endDate: '2024-12-31',
 *   page: 1,
 *   limit: 20
 * });
 */
export const getCertificateLogs = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.CERTIFICATES.GET_LOGS, { params });
  return data;
};

/**
 * Export certificate logs to Excel
 * @param {Object} [params] - Same params as getCertificateLogs
 * @param {string} [params.actionType] - Filter by action
 * @param {number} [params.actorId] - Filter by user ID
 * @param {string} [params.startDate] - Filter by date range
 * @param {string} [params.endDate] - Filter by date range
 * @param {string} [params.certificateNumber] - Search by certificate number
 * @returns {Promise<Blob>} Excel file blob
 *
 * @example
 * import { downloadBlob, getFilenameFromHeader } from '@/utils/helpers/download';
 *
 * const blob = await exportCertificateLogs({
 *   actionType: 'print',
 *   startDate: '2024-01-01'
 * });
 *
 * // Download with proper filename
 * downloadBlob(blob, 'certificate-logs.xlsx');
 */
export const exportCertificateLogs = async (params = {}) => {
  const queryString = buildQueryString(params);
  const response = await api.get(`${API_ENDPOINTS.CERTIFICATES.EXPORT_LOGS}${queryString}`, {
    responseType: "blob",
  });
  return response.data;
};

/**
 * Get certificate migrations history
 * @param {Object} [params]
 * @param {string} [params.startDate] - Filter by date range
 * @param {string} [params.endDate] - Filter by date range
 * @param {number} [params.fromBranchId] - Filter by source branch
 * @param {number} [params.toBranchId] - Filter by target branch
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=20] - Items per page
 * @returns {Promise<{migrations: Array, pagination: Object}>}
 *
 * @example
 * const result = await getCertificateMigrations({
 *   fromBranchId: 1,
 *   toBranchId: 2,
 *   page: 1
 * });
 */
export const getCertificateMigrations = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.CERTIFICATES.GET_MIGRATIONS, { params });
  return data;
};
