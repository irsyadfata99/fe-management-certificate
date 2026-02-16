/**
 * Certificate API Layer
 *
 * FIX — Konsistensi nama fungsi:
 *   useCertificates.js memanggil certificateApi.getAllCertificates()
 *   tapi fungsi ini tidak ada — namanya getCertificates().
 *   Ini menyebabkan TypeError silent yang membuat queryFn selalu gagal.
 *
 *   Solusi: ekspor KEDUA nama (alias) agar backward-compatible,
 *   sehingga tidak perlu ubah semua pemanggil sekaligus.
 */

import api from "./client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

// ============================================================================
// ADMIN - Certificate Management
// ============================================================================

/**
 * Get branches list for certificate management (Admin)
 * Endpoint khusus Admin untuk dropdown branches
 * @returns {Promise<{ success: boolean, branches: Array }>}
 */
export const getCertificateBranches = async () => {
  const { data } = await api.get(API_ENDPOINTS.CERTIFICATES.GET_BRANCHES);
  return data;
};

/**
 * Bulk create certificates
 * @param {{ startNumber: number, endNumber: number }} payload
 */
export const bulkCreateCertificates = async (payload) => {
  const { data } = await api.post(
    API_ENDPOINTS.CERTIFICATES.BULK_CREATE,
    payload,
  );
  return data;
};

/**
 * Get all certificates with filters
 * @param {{ status?: string, currentBranchId?: number, page?: number, limit?: number }} params
 */
export const getCertificates = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.CERTIFICATES.GET_ALL, {
    params,
  });
  return data;
};

/**
 * Alias untuk backward-compatibility
 * useCertificates.js memanggil certificateApi.getAllCertificates()
 * FIX: tambah alias agar tidak perlu ubah semua hook sekaligus
 */
export const getAllCertificates = getCertificates;

/**
 * Get stock summary for all branches
 * @returns {Promise<{ success: boolean, stock: Array }>}
 */
export const getCertificateStock = async () => {
  const { data } = await api.get(API_ENDPOINTS.CERTIFICATES.GET_STOCK);
  return data;
};

/**
 * Get stock alerts (branches with low stock)
 * @param {number} threshold
 */
export const getStockAlerts = async (threshold = 10) => {
  const { data } = await api.get(API_ENDPOINTS.CERTIFICATES.GET_STOCK_ALERTS, {
    params: { threshold },
  });
  return data;
};

/**
 * Migrate certificates to another branch
 * @param {{ startNumber: string, endNumber: string, toBranchId: number }} payload
 * NOTE: startNumber & endNumber harus format "No. 000000"
 */
export const migrateCertificates = async (payload) => {
  const { data } = await api.post(API_ENDPOINTS.CERTIFICATES.MIGRATE, payload);
  return data;
};

/**
 * Get certificate statistics
 * @param {{ startDate?: string, endDate?: string }} params
 */
export const getCertificateStatistics = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.CERTIFICATES.GET_STATISTICS, {
    params,
  });
  return data;
};

/**
 * Get migration history
 * @param {{ startDate?, endDate?, fromBranchId?, toBranchId?, page?, limit? }} params
 */
export const getCertificateMigrations = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.CERTIFICATES.GET_MIGRATIONS, {
    params,
  });
  return data;
};

/**
 * Get certificate logs
 * @param {{ actionType?, actorId?, startDate?, endDate?, certificateNumber?, page?, limit? }} params
 */
export const getCertificateLogs = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.CERTIFICATES.GET_LOGS, {
    params,
  });
  return data;
};

/**
 * Export certificate logs to Excel
 * @returns {Promise<Blob>}
 */
export const exportCertificateLogs = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.CERTIFICATES.EXPORT_LOGS, {
    params,
    responseType: "blob",
  });
  return data;
};

// ============================================================================
// TEACHER - Certificate Operations
// ============================================================================

export const getAvailableCertificates = async () => {
  const { data } = await api.get(
    API_ENDPOINTS.CERTIFICATES_TEACHER.GET_AVAILABLE,
  );
  return data;
};

export const reserveCertificate = async (payload) => {
  const { data } = await api.post(
    API_ENDPOINTS.CERTIFICATES_TEACHER.RESERVE,
    payload,
  );
  return data;
};

export const printCertificate = async (payload) => {
  const { data } = await api.post(
    API_ENDPOINTS.CERTIFICATES_TEACHER.PRINT,
    payload,
  );
  return data;
};

export const releaseCertificate = async (certificateId) => {
  const { data } = await api.post(
    API_ENDPOINTS.CERTIFICATES_TEACHER.RELEASE(certificateId),
  );
  return data;
};

export const getMyReservations = async () => {
  const { data } = await api.get(
    API_ENDPOINTS.CERTIFICATES_TEACHER.GET_MY_RESERVATIONS,
  );
  return data;
};

export const getMyPrints = async (params = {}) => {
  const { data } = await api.get(
    API_ENDPOINTS.CERTIFICATES_TEACHER.GET_MY_PRINTS,
    { params },
  );
  return data;
};

// ============================================================================
// CERTIFICATE PDF Management
// ============================================================================

export const uploadCertificatePDF = async (printId, pdfFile) => {
  const formData = new FormData();
  formData.append("pdf", pdfFile);

  const { data } = await api.post(
    API_ENDPOINTS.CERTIFICATE_PDF.UPLOAD(printId),
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
};

export const downloadCertificatePDF = async (printId) => {
  const { data } = await api.get(
    API_ENDPOINTS.CERTIFICATE_PDF.DOWNLOAD(printId),
    { responseType: "blob" },
  );
  return data;
};

export const deleteCertificatePDF = async (printId) => {
  const { data } = await api.delete(
    API_ENDPOINTS.CERTIFICATE_PDF.DELETE(printId),
  );
  return data;
};

export const listCertificatePDFs = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.CERTIFICATE_PDF.LIST, {
    params,
  });
  return data;
};
