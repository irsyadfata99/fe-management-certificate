/**
 * Certificate PDF Hooks
 * React Query hooks untuk certificate PDF operations
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { certificatePdfApi } from "@/api";
import { getErrorMessage } from "@/utils/api/errorHandler";
import { downloadBlob, getFilenameFromHeader } from "@/utils/helpers/download";
import { toast } from "sonner";
import api from "@/api/client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

/**
 * List all certificate PDFs (Admin only)
 * @param {Object} [params] - Query parameters
 * @returns {Object} Query object
 *
 * @example
 * const { data: pdfs, isLoading } = useCertificatePdfs({
 *   teacherId: 5,
 *   page: 1
 * });
 */
export const useCertificatePdfs = (params = {}) => {
  return useQuery({
    queryKey: ["certificate-pdfs", params],
    queryFn: () => certificatePdfApi.listCertificatePdfs(params),
    keepPreviousData: true,
  });
};

/**
 * Upload certificate PDF mutation
 * @returns {Object} Mutation object
 *
 * @example
 * const { mutate: uploadPdf, isPending } = useUploadCertificatePdf();
 *
 * uploadPdf({
 *   printId: 123,
 *   file: pdfFile
 * });
 */
export const useUploadCertificatePdf = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ printId, file }) =>
      certificatePdfApi.uploadCertificatePdf(printId, file),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["certificate-pdfs"] });
      queryClient.invalidateQueries({
        queryKey: ["certificates", "my-prints"],
      });
      toast.success("PDF uploaded successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Download certificate PDF mutation
 * @returns {Object} Mutation object
 *
 * @example
 * const { mutate: downloadPdf, isPending } = useDownloadCertificatePdf();
 *
 * downloadPdf(123);
 */
export const useDownloadCertificatePdf = () => {
  return useMutation({
    mutationFn: async (printId) => {
      const response = await api.get(
        API_ENDPOINTS.CERTIFICATE_PDF.DOWNLOAD(printId),
        {
          responseType: "blob",
        },
      );

      const filename =
        getFilenameFromHeader(response.headers["content-disposition"]) ||
        `certificate-${printId}.pdf`;

      downloadBlob(response.data, filename);

      return { success: true };
    },
    onSuccess: () => {
      toast.success("PDF downloaded successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Delete certificate PDF mutation
 * @returns {Object} Mutation object
 *
 * @example
 * const { mutate: deletePdf } = useDeleteCertificatePdf();
 *
 * deletePdf(123);
 */
export const useDeleteCertificatePdf = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: certificatePdfApi.deleteCertificatePdf,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificate-pdfs"] });
      queryClient.invalidateQueries({
        queryKey: ["certificates", "my-prints"],
      });
      toast.success("PDF deleted successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};
