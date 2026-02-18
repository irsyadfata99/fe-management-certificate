import { useQuery, useMutation } from "@tanstack/react-query";
import { certificateLogApi } from "@/api";
import { getErrorMessage } from "@/utils/api/errorHandler";
import { downloadBlob } from "@/utils/helpers/download";
import { toast } from "sonner";
import api from "@/api/client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";
import { buildQueryString } from "@/utils/api/queryBuilder";

export const useCertificateLogs = (params = {}) => {
  return useQuery({
    queryKey: ["certificates", "logs", params],
    queryFn: () => certificateLogApi.getCertificateLogs(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useCertificateMigrations = (params = {}) => {
  return useQuery({
    queryKey: ["certificates", "migrations", params],
    queryFn: () => certificateLogApi.getCertificateMigrations(params),
    placeholderData: (previousData) => previousData,
  });
};

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
