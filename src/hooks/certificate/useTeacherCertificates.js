/**
 * Teacher Certificate Hooks
 * React Query hooks untuk certificate operations (Teacher role)
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { certificateTeacherApi } from "@/api";
import { getErrorMessage } from "@/utils/api/errorHandler";
import { toast } from "sonner";

/**
 * Check certificate availability
 * @returns {Object} Query object
 *
 * @example
 * const { data, isLoading } = useCertificateAvailability();
 */
export const useCertificateAvailability = () => {
  return useQuery({
    queryKey: ["certificates", "availability"],
    queryFn: certificateTeacherApi.checkCertificateAvailability,
    refetchInterval: 60000, // Refetch every minute
  });
};

/**
 * Get teacher's active reservations
 * @returns {Object} Query object
 *
 * @example
 * const { data: reservations } = useMyReservations();
 */
export const useMyReservations = () => {
  return useQuery({
    queryKey: ["certificates", "my-reservations"],
    queryFn: certificateTeacherApi.getMyReservations,
    select: (data) => data.reservations,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

/**
 * Get teacher's print history
 * @param {Object} [params] - Query parameters
 * @returns {Object} Query object
 *
 * @example
 * const { data: prints } = useMyPrints({
 *   startDate: '2024-01-01',
 *   page: 1
 * });
 */
export const useMyPrints = (params = {}) => {
  return useQuery({
    queryKey: ["certificates", "my-prints", params],
    queryFn: () => certificateTeacherApi.getMyPrints(params),
    keepPreviousData: true,
  });
};

/**
 * Reserve certificate mutation
 * @returns {Object} Mutation object
 *
 * @example
 * const { mutate: reserve, isPending } = useReserveCertificate();
 *
 * reserve({ branchId: 1 });
 */
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

/**
 * Print certificate mutation
 * @returns {Object} Mutation object
 *
 * @example
 * const { mutate: print, isPending } = usePrintCertificate();
 *
 * print({
 *   certificateId: 123,
 *   studentName: 'John Doe',
 *   moduleId: 5,
 *   ptcDate: '2024-02-14'
 * });
 */
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

/**
 * Release certificate mutation
 * @returns {Object} Mutation object
 *
 * @example
 * const { mutate: release } = useReleaseCertificate();
 *
 * release(123);
 */
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
