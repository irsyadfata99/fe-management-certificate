/**
 * Certificate API - Admin
 * Certificate management endpoints (Admin only)
 */

import api from "./client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

/**
 * Bulk create certificates
 * @param {Object} payload
 * @param {number} payload.startNumber - Start certificate number
 * @param {number} payload.endNumber - End certificate number
 * @returns {Promise<{certificates: Array, count: number, message: string}>}
 *
 * @example
 * const result = await bulkCreateCertificates({
 *   startNumber: 1,
 *   endNumber: 100
 * });
 * // Creates certificates No. 000001 to No. 000100
 */
export const bulkCreateCertificates = async (payload) => {
  const { data } = await api.post(API_ENDPOINTS.CERTIFICATES.BULK_CREATE, payload);
  return data;
};

/**
 * Get all certificates with filters
 * @param {Object} [params]
 * @param {string} [params.status] - Filter by status (in_stock, reserved, printed, migrated)
 * @param {number} [params.currentBranchId] - Filter by branch
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=20] - Items per page
 * @returns {Promise<{certificates: Array, pagination: Object}>}
 *
 * @example
 * const result = await getAllCertificates({
 *   status: 'in_stock',
 *   currentBranchId: 1,
 *   page: 1,
 *   limit: 20
 * });
 */
export const getAllCertificates = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.CERTIFICATES.GET_ALL, { params });
  return data;
};

/**
 * Get certificate stock summary for all branches
 * @returns {Promise<{stock: Array}>}
 *
 * @example
 * const { stock } = await getCertificateStock();
 * // [{branch_id, branch_name, in_stock, reserved, printed, total}]
 */
export const getCertificateStock = async () => {
  const { data } = await api.get(API_ENDPOINTS.CERTIFICATES.GET_STOCK);
  return data;
};

/**
 * Get stock alerts (branches with low stock)
 * @param {Object} [params]
 * @param {number} [params.threshold=10] - Alert threshold
 * @returns {Promise<{alerts: Array}>}
 *
 * @example
 * const { alerts } = await getStockAlerts({ threshold: 5 });
 * // Returns branches with in_stock <= 5
 */
export const getStockAlerts = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.CERTIFICATES.GET_STOCK_ALERTS, { params });
  return data;
};

/**
 * Migrate certificates to another branch
 * @param {Object} payload
 * @param {number} payload.startNumber - Start certificate number
 * @param {number} payload.endNumber - End certificate number
 * @param {number} payload.toBranchId - Target branch ID
 * @returns {Promise<{migratedCount: number, migration: Object, message: string}>}
 *
 * @example
 * const result = await migrateCertificates({
 *   startNumber: 1,
 *   endNumber: 50,
 *   toBranchId: 2
 * });
 */
export const migrateCertificates = async (payload) => {
  const { data } = await api.post(API_ENDPOINTS.CERTIFICATES.MIGRATE, payload);
  return data;
};

/**
 * Get certificate statistics
 * @param {Object} [params]
 * @param {string} [params.startDate] - Start date (YYYY-MM-DD)
 * @param {string} [params.endDate] - End date (YYYY-MM-DD)
 * @returns {Promise<{statistics: Object}>}
 *
 * @example
 * const { statistics } = await getCertificateStatistics({
 *   startDate: '2024-01-01',
 *   endDate: '2024-12-31'
 * });
 */
export const getCertificateStatistics = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.CERTIFICATES.GET_STATISTICS, { params });
  return data;
};
