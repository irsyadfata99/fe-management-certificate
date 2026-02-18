/**
 * Export My Prints Hook
 * React Query hook untuk export teacher's print history to Excel
 */

import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/utils/api/errorHandler";
import { downloadBlob } from "@/utils/helpers/download";
import { toast } from "sonner";
import api from "@/api/client";
import { buildQueryString } from "@/utils/api/queryBuilder";

/**
 * Export my prints to Excel
 * @returns {Object} Mutation object
 *
 * @example
 * const { mutate: exportPrints, isPending } = useExportMyPrints();
 *
 * exportPrints({
 *   startDate: '2024-01-01',
 *   endDate: '2024-12-31',
 *   moduleId: 5
 * });
 */
export const useExportMyPrints = () => {
  return useMutation({
    mutationFn: async (params) => {
      const queryString = buildQueryString(params);
      const response = await api.get(`/certificates/my-prints/export${queryString}`, {
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
