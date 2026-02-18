import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/utils/api/errorHandler";
import { downloadBlob } from "@/utils/helpers/download";
import { toast } from "sonner";
import api from "@/api/client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";
import { buildQueryString } from "@/utils/api/queryBuilder";

export const useExportMyPrints = () => {
  return useMutation({
    mutationFn: async (params) => {
      const queryString = buildQueryString(params);

      const url = `${API_ENDPOINTS.CERTIFICATES_TEACHER.GET_MY_PRINTS}/export${queryString}`;

      const response = await api.get(url, {
        responseType: "blob",
      });

      const filename = `my-prints-${new Date().toISOString().split("T")[0]}.xlsx`;
      downloadBlob(response.data, filename);

      return { success: true };
    },
    onSuccess: () => {
      toast.success("Print history exported successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};
