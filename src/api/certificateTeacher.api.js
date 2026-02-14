/**
 * Certificate Teacher API
 * Certificate operations for Teacher role
 */

import api from "./client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

/**
 * Check certificate availability at teacher's branch
 * @returns {Promise<{available: boolean, count: number, branch: Object}>}
 *
 * @example
 * const { available, count } = await checkCertificateAvailability();
 */
export const checkCertificateAvailability = async () => {
  const { data } = await api.get(API_ENDPOINTS.CERTIFICATES_TEACHER.GET_AVAILABLE);
  return data;
};

/**
 * Reserve a certificate
 * @param {Object} payload
 * @param {number} payload.branchId - Branch ID to reserve from
 * @returns {Promise<{certificate: Object, reservation: Object, message: string}>}
 *
 * @example
 * const result = await reserveCertificate({ branchId: 1 });
 * // Returns reserved certificate + reservation record
 */
export const reserveCertificate = async (payload) => {
  const { data } = await api.post(API_ENDPOINTS.CERTIFICATES_TEACHER.RESERVE, payload);
  return data;
};

/**
 * Print certificate (create print record)
 * @param {Object} payload
 * @param {number} payload.certificateId - Certificate ID (from reservation)
 * @param {string} payload.studentName - Student name
 * @param {number} payload.moduleId - Module ID
 * @param {string} payload.ptcDate - PTC date (YYYY-MM-DD)
 * @returns {Promise<{print: Object, student: Object, message: string}>}
 *
 * @example
 * const result = await printCertificate({
 *   certificateId: 123,
 *   studentName: 'John Doe',
 *   moduleId: 5,
 *   ptcDate: '2024-02-14'
 * });
 */
export const printCertificate = async (payload) => {
  const { data } = await api.post(API_ENDPOINTS.CERTIFICATES_TEACHER.PRINT, payload);
  return data;
};

/**
 * Release certificate reservation manually
 * @param {number} certificateId - Certificate ID
 * @returns {Promise<{certificate: Object, message: string}>}
 *
 * @example
 * await releaseCertificate(123);
 * // Certificate back to in_stock, reservation deleted
 */
export const releaseCertificate = async (certificateId) => {
  const { data } = await api.post(API_ENDPOINTS.CERTIFICATES_TEACHER.RELEASE(certificateId));
  return data;
};

/**
 * Get teacher's active reservations
 * @returns {Promise<{reservations: Array}>}
 *
 * @example
 * const { reservations } = await getMyReservations();
 * // Max 5 active reservations per teacher
 */
export const getMyReservations = async () => {
  const { data } = await api.get(API_ENDPOINTS.CERTIFICATES_TEACHER.GET_MY_RESERVATIONS);
  return data;
};

/**
 * Get teacher's print history
 * @param {Object} [params]
 * @param {string} [params.startDate] - Filter by date range
 * @param {string} [params.endDate] - Filter by date range
 * @param {number} [params.moduleId] - Filter by module
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=20] - Items per page
 * @returns {Promise<{prints: Array, pagination: Object}>}
 *
 * @example
 * const result = await getMyPrints({
 *   startDate: '2024-01-01',
 *   moduleId: 5,
 *   page: 1
 * });
 */
export const getMyPrints = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.CERTIFICATES_TEACHER.GET_MY_PRINTS, { params });
  return data;
};
