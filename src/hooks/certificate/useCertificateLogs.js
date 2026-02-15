/**
 * Certificate Logs Hooks
 * React Query hooks untuk certificate logs dan export
 */

import { useQuery, useMutation } from "@tanstack/react-query";
import { certificateLogApi } from "@/api";
import { getErrorMessage } from "@/utils/api/errorHandler";
import { downloadBlob } from "@/utils/helpers/download";
import { toast } from "sonner";
import api from "@/api/client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";
import { buildQueryString } from "@/utils/api/queryBuilder";

/**
 * Get certificate logs
 * @param {Object} [params] - Query parameters
 * @returns {Object} Query object
 *
 * @example
 * const { data, isLoading } = useCertificateLogs({
 *   actionType: 'print',
 *   startDate: '2024-01-01',
 *   page: 1
 * });
 */
export const useCertificateLogs = (params = {}) => {
  return useQuery({
    queryKey: ["certificates", "logs", params],
    queryFn: () => certificateLogApi.getCertificateLogs(params),
    keepPreviousData: true,
  });
};

/**
 * Get certificate migrations
 * @param {Object} [params] - Query parameters
 * @returns {Object} Query object
 *
 * @example
 * const { data: migrations } = useCertificateMigrations({
 *   fromBranchId: 1,
 *   toBranchId: 2
 * });
 */
export const useCertificateMigrations = (params = {}) => {
  return useQuery({
    queryKey: ["certificates", "migrations", params],
    queryFn: () => certificateLogApi.getCertificateMigrations(params),
    keepPreviousData: true,
  });
};

/**
 * Export certificate logs mutation
 * @returns {Object} Mutation object
 *
 * @example
 * const { mutate: exportLogs, isPending } = useExportCertificateLogs();
 *
 * exportLogs({
 *   actionType: 'print',
 *   startDate: '2024-01-01'
 * });
 */
export const useExportCertificateLogs = () => {
  return useMutation({
    mutationFn: async (params) => {
      const queryString = buildQueryString(params);
      const response = await api.get(
        `${API_ENDPOINTS.CERTIFICATES.EXPORT_LOGS}${queryString}`,
        {
          responseType: "blob",
        },
      );

      const filename = `certificate-logs-${new Date().toISOString().split("T")[0]}.xlsx`;
      downloadBlob(response.data, filename);

      return { success: true };
    },
    onSuccess: () => {
      toast.success("Certificate logs exported successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};
