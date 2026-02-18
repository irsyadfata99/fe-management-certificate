import api from "./client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

export const getTeacherProfile = async () => {
  const { data } = await api.get(API_ENDPOINTS.TEACHERS.PROFILE.GET_ME);
  return data;
};

export const updateTeacherProfile = async (updates) => {
  const { data } = await api.patch(
    API_ENDPOINTS.TEACHERS.PROFILE.UPDATE_ME,
    updates,
  );
  return data;
};

export const getTeacherBranches = async () => {
  const { data } = await api.get(API_ENDPOINTS.TEACHERS.PROFILE.GET_BRANCHES);
  return data;
};

export const getTeacherDivisions = async () => {
  const { data } = await api.get(API_ENDPOINTS.TEACHERS.PROFILE.GET_DIVISIONS);
  return data;
};

export const getTeacherModules = async () => {
  const { data } = await api.get(API_ENDPOINTS.TEACHERS.PROFILE.GET_MODULES);
  return data;
};
