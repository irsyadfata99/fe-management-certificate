import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { certificatePdfApi } from "@/api";
import { getErrorMessage } from "@/utils/api/errorHandler";
import { downloadBlob, getFilenameFromHeader } from "@/utils/helpers/download";
import { toast } from "sonner";
import api from "@/api/client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

export const useCertificatePdfs = (params = {}) => {
  return useQuery({
    queryKey: ["certificate-pdfs", params],
    queryFn: () => certificatePdfApi.listCertificatePdfs(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useUploadCertificatePdf = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ printId, file }) => certificatePdfApi.uploadCertificatePdf(printId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-prints"] });
      queryClient.invalidateQueries({
        queryKey: ["certificates"],
        exact: false,
      });
      toast.success("PDF uploaded successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useDownloadCertificatePdf = () => {
  return useMutation({
    // ← Ubah: terima { printId, filename } instead of printId
    mutationFn: async ({ printId, filename }) => {
      const response = await api.get(API_ENDPOINTS.CERTIFICATE_PDF.DOWNLOAD(printId), { responseType: "blob" });

      // Gunakan filename custom, fallback ke header/default
      const finalFilename = filename || getFilenameFromHeader(response.headers["content-disposition"]) || `certificate-${printId}.pdf`;

      downloadBlob(response.data, finalFilename);
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

export const useDeleteCertificatePdf = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: certificatePdfApi.deleteCertificatePdf,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificate-pdfs"] });
      queryClient.invalidateQueries({
        queryKey: ["certificates"],
        exact: false,
      });
      toast.success("PDF deleted successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};
