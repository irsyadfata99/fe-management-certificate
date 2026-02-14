/**
 * Certificate PDF API
 * PDF upload, download, and management endpoints
 */

import api from "./client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

/**
 * Upload certificate PDF
 * @param {number} printId - Print record ID
 * @param {File} pdfFile - PDF file
 * @returns {Promise<{pdf_path: string, message: string}>}
 *
 * @example
 * const file = event.target.files[0]; // From input[type="file"]
 * const result = await uploadCertificatePdf(123, file);
 */
export const uploadCertificatePdf = async (printId, pdfFile) => {
  const formData = new FormData();
  formData.append("pdf", pdfFile);

  const { data } = await api.post(
    API_ENDPOINTS.CERTIFICATE_PDF.UPLOAD(printId),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data;
};

/**
 * Download certificate PDF
 * @param {number} printId - Print record ID
 * @returns {Promise<Blob>} PDF file blob
 *
 * @example
 * import { downloadBlob, getFilenameFromHeader } from '@/utils/helpers/download';
 *
 * // Get blob and headers
 * const response = await api.get(
 *   API_ENDPOINTS.CERTIFICATE_PDF.DOWNLOAD(printId),
 *   { responseType: 'blob' }
 * );
 *
 * // Extract filename from Content-Disposition header
 * const filename = getFilenameFromHeader(response.headers['content-disposition']);
 *
 * // Download
 * downloadBlob(response.data, filename);
 */
export const downloadCertificatePdf = async (printId) => {
  const response = await api.get(
    API_ENDPOINTS.CERTIFICATE_PDF.DOWNLOAD(printId),
    {
      responseType: "blob",
    },
  );
  return response.data;
};

/**
 * Download certificate PDF with full response (includes headers)
 * Use this when you need to extract filename from Content-Disposition
 * @param {number} printId - Print record ID
 * @returns {Promise<{data: Blob, headers: Object}>}
 *
 * @example
 * import { downloadBlob, getFilenameFromHeader } from '@/utils/helpers/download';
 *
 * const response = await downloadCertificatePdfWithHeaders(123);
 * const filename = getFilenameFromHeader(response.headers['content-disposition']);
 * downloadBlob(response.data, filename);
 */
export const downloadCertificatePdfWithHeaders = async (printId) => {
  const response = await api.get(
    API_ENDPOINTS.CERTIFICATE_PDF.DOWNLOAD(printId),
    {
      responseType: "blob",
    },
  );
  return {
    data: response.data,
    headers: response.headers,
  };
};

/**
 * Delete certificate PDF
 * @param {number} printId - Print record ID
 * @returns {Promise<{message: string}>}
 *
 * @example
 * await deleteCertificatePdf(123);
 */
export const deleteCertificatePdf = async (printId) => {
  const { data } = await api.delete(
    API_ENDPOINTS.CERTIFICATE_PDF.DELETE(printId),
  );
  return data;
};

/**
 * List all certificate PDFs (Admin only)
 * @param {Object} [params]
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=20] - Items per page
 * @param {number} [params.teacherId] - Filter by teacher
 * @returns {Promise<{pdfs: Array, pagination: Object}>}
 *
 * @example
 * const result = await listCertificatePdfs({
 *   teacherId: 5,
 *   page: 1,
 *   limit: 20
 * });
 */
export const listCertificatePdfs = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.CERTIFICATE_PDF.LIST, {
    params,
  });
  return data;
};
