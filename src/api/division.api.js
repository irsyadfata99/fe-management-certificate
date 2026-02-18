import api from "./client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

export const getAllDivisions = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.DIVISIONS.GET_ALL, { params });
  return data;
};

export const getDivisionById = async (id) => {
  const { data } = await api.get(API_ENDPOINTS.DIVISIONS.GET_BY_ID(id));
  return data;
};

export const createDivision = async (divisionData) => {
  const { data } = await api.post(API_ENDPOINTS.DIVISIONS.CREATE, divisionData);
  return data;
};

export const updateDivision = async (id, updates) => {
  const { data } = await api.put(API_ENDPOINTS.DIVISIONS.UPDATE(id), updates);
  return data;
};

export const toggleDivisionActive = async (id) => {
  const { data } = await api.patch(API_ENDPOINTS.DIVISIONS.TOGGLE_ACTIVE(id));
  return data;
};

export const deleteDivision = async (id) => {
  const { data } = await api.delete(API_ENDPOINTS.DIVISIONS.DELETE(id));
  return data;
};

export const createSubDivision = async (divisionId, subDivisionData) => {
  const { data } = await api.post(
    API_ENDPOINTS.DIVISIONS.CREATE_SUB(divisionId),
    subDivisionData,
  );
  return data;
};

export const updateSubDivision = async (subId, updates) => {
  const { data } = await api.put(
    API_ENDPOINTS.DIVISIONS.UPDATE_SUB(subId),
    updates,
  );
  return data;
};

export const toggleSubDivisionActive = async (subId) => {
  const { data } = await api.patch(
    API_ENDPOINTS.DIVISIONS.TOGGLE_SUB_ACTIVE(subId),
  );
  return data;
};

export const deleteSubDivision = async (subId) => {
  const { data } = await api.delete(API_ENDPOINTS.DIVISIONS.DELETE_SUB(subId));
  return data;
};
