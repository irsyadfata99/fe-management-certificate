import api from "./client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

export const getAllTeachers = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.TEACHERS.GET_ALL, { params });
  return data;
};

export const getTeacherById = async (id) => {
  const { data } = await api.get(API_ENDPOINTS.TEACHERS.GET_BY_ID(id));
  return data;
};

export const createTeacher = async (teacherData) => {
  const { data } = await api.post(API_ENDPOINTS.TEACHERS.CREATE, teacherData);
  return data;
};

export const updateTeacher = async (id, updates) => {
  const { data } = await api.put(API_ENDPOINTS.TEACHERS.UPDATE(id), updates);
  return data;
};

export const resetTeacherPassword = async (id) => {
  const { data } = await api.post(API_ENDPOINTS.TEACHERS.RESET_PASSWORD(id));
  return data;
};

export const toggleTeacherActive = async (id) => {
  const { data } = await api.patch(API_ENDPOINTS.TEACHERS.TOGGLE_ACTIVE(id));
  return data;
};

export const migrateTeacher = async (id, payload) => {
  const { data } = await api.post(API_ENDPOINTS.TEACHERS.MIGRATE(id), payload);
  return data;
};
