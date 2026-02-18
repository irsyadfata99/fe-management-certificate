import { useMutation, useQueryClient } from "@tanstack/react-query";
import { certificateApi } from "@/api";
import { getErrorMessage } from "@/utils/api/errorHandler";
import { toast } from "sonner";

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
