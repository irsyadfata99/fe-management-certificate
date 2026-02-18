import api from "./client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

export const searchStudents = async (params) => {
  const { data } = await api.get(API_ENDPOINTS.STUDENTS.SEARCH, { params });
  return data;
};

export const getAllStudents = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.STUDENTS.GET_ALL, { params });
  return data;
};

export const getStudentById = async (id) => {
  const { data } = await api.get(API_ENDPOINTS.STUDENTS.GET_BY_ID(id));
  return data;
};

export const getStudentHistory = async (id, params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.STUDENTS.GET_HISTORY(id), {
    params,
  });
  return data;
};

export const getStudentStatistics = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.STUDENTS.GET_STATISTICS, {
    params,
  });
  return data;
};

export const updateStudent = async (id, updates) => {
  const { data } = await api.put(API_ENDPOINTS.STUDENTS.UPDATE(id), updates);
  return data;
};

export const toggleStudentActive = async (id) => {
  const { data } = await api.patch(API_ENDPOINTS.STUDENTS.TOGGLE_ACTIVE(id));
  return data;
};

export const migrateStudent = async (id, payload) => {
  const { data } = await api.post(API_ENDPOINTS.STUDENTS.MIGRATE(id), payload);
  return data;
};
