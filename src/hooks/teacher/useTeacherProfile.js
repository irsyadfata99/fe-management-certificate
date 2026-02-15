/**
 * Teacher Profile Hooks
 * React Query hooks untuk teacher's own profile (Teacher role)
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherProfileApi } from "@/api";
import { getErrorMessage } from "@/utils/api/errorHandler";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

/**
 * Get teacher own profile
 * @returns {Object} Query object
 *
 * @example
 * const { data: profile } = useTeacherProfile();
 */
export const useTeacherProfile = () => {
  return useQuery({
    queryKey: ["teacher", "profile"],
    queryFn: teacherProfileApi.getTeacherProfile,
    select: (data) => data.teacher,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Get teacher's assigned branches
 * @returns {Object} Query object
 *
 * @example
 * const { data: branches } = useTeacherBranches();
 */
export const useTeacherBranches = () => {
  return useQuery({
    queryKey: ["teacher", "branches"],
    queryFn: teacherProfileApi.getTeacherBranches,
    select: (data) => data.branches,
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Get teacher's assigned divisions
 * @returns {Object} Query object
 *
 * @example
 * const { data: divisions } = useTeacherDivisions();
 */
export const useTeacherDivisions = () => {
  return useQuery({
    queryKey: ["teacher", "divisions"],
    queryFn: teacherProfileApi.getTeacherDivisions,
    select: (data) => data.divisions,
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Get teacher's available modules
 * @returns {Object} Query object
 *
 * @example
 * const { data: modules } = useTeacherModules();
 */
export const useTeacherModules = () => {
  return useQuery({
    queryKey: ["teacher", "modules"],
    queryFn: teacherProfileApi.getTeacherModules,
    select: (data) => data.modules,
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Update teacher own profile mutation
 * @returns {Object} Mutation object
 *
 * @example
 * const { mutate: updateProfile } = useUpdateTeacherProfile();
 *
 * updateProfile({ full_name: 'Updated Name' });
 */
export const useUpdateTeacherProfile = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: teacherProfileApi.updateTeacherProfile,
    onSuccess: (data) => {
      if (data.teacher) {
        setUser(data.teacher);
      }
      queryClient.invalidateQueries({ queryKey: ["teacher", "profile"] });
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};
