/**
 * Certificate Stock Mutation Hooks (Admin)
 * React Query hooks untuk certificate stock operations
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { certificateApi } from "@/api";
import { getErrorMessage } from "@/utils/api/errorHandler";
import { toast } from "sonner";

/**
 * Bulk create certificates mutation
 * @returns {Object} Mutation object
 *
 * @example
 * const { mutate: bulkCreate, isPending } = useBulkCreateCertificates();
 *
 * bulkCreate({
 *   startNumber: 1,
 *   endNumber: 100
 * });
 */
export const useBulkCreateCertificates = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: certificateApi.bulkCreateCertificates,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      toast.success(`${data.count} certificates created successfully`);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Migrate certificates mutation
 * @returns {Object} Mutation object
 *
 * @example
 * const { mutate: migrate, isPending } = useMigrateCertificates();
 *
 * migrate({
 *   startNumber: 1,
 *   endNumber: 50,
 *   toBranchId: 2
 * });
 */
export const useMigrateCertificates = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: certificateApi.migrateCertificates,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      toast.success(`${data.migratedCount} certificates migrated successfully`);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};
