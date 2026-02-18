import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { certificateTeacherApi } from "@/api";
import { getErrorMessage } from "@/utils/api/errorHandler";
import { toast } from "sonner";

export const useCertificateAvailability = () => {
  return useQuery({
    queryKey: ["certificates", "availability"],
    queryFn: certificateTeacherApi.checkCertificateAvailability,
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useMyReservations = () => {
  return useQuery({
    queryKey: ["certificates", "my-reservations"],
    queryFn: certificateTeacherApi.getMyReservations,
    select: (data) => data.reservations,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useMyPrints = (params = {}) => {
  return useQuery({
    queryKey: ["certificates", "my-prints", params],
    queryFn: () => certificateTeacherApi.getMyPrints(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useReserveCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: certificateTeacherApi.reserveCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["certificates", "my-reservations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["certificates", "availability"],
      });
      toast.success("Certificate reserved successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

export const usePrintCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: certificateTeacherApi.printCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["certificates", "my-reservations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["certificates", "my-prints"],
      });
      toast.success("Certificate printed successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useReleaseCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: certificateTeacherApi.releaseCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["certificates", "my-reservations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["certificates", "availability"],
      });
      toast.success("Certificate released successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};
