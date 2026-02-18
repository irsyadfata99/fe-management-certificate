import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { backupApi } from "@/api";
import { getErrorMessage } from "@/utils/api/errorHandler";
import { downloadBlob, getFilenameFromHeader } from "@/utils/helpers/download";
import { toast } from "sonner";
import api from "@/api/client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

export const useBackups = () => {
  return useQuery({
    queryKey: ["backups"],
    queryFn: backupApi.listBackups,
    select: (data) => data.backups,
  });
};

export const useCreateBackup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: backupApi.createBackup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backups"] });
      toast.success("Backup created successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useDeleteBackup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: backupApi.deleteBackup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backups"] });
      toast.success("Backup deleted successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useRestoreBackup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: backupApi.restoreBackup,
    onSuccess: () => {
      queryClient.clear();
      toast.success("Database restored successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useDownloadBackup = () => {
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.get(API_ENDPOINTS.BACKUP.DOWNLOAD(id), {
        responseType: "blob",
      });

      const filename =
        getFilenameFromHeader(response.headers["content-disposition"]) ||
        `backup-${id}.sql`;

      downloadBlob(response.data, filename);

      return { success: true };
    },
    onSuccess: () => {
      toast.success("Backup downloaded successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};
