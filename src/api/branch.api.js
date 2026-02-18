import api from "./client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

export const getAllBranches = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.BRANCHES.GET_ALL, { params });
  return data;
};

export const getHeadBranches = async () => {
  const { data } = await api.get(API_ENDPOINTS.BRANCHES.GET_HEADS);
  return data;
};

export const getBranchById = async (id) => {
  const { data } = await api.get(API_ENDPOINTS.BRANCHES.GET_BY_ID(id));
  return data;
};

export const createBranch = async (branchData) => {
  const { data } = await api.post(API_ENDPOINTS.BRANCHES.CREATE, branchData);
  return data;
};

export const updateBranch = async (id, updates) => {
  const { data } = await api.put(API_ENDPOINTS.BRANCHES.UPDATE(id), updates);
  return data;
};

export const deleteBranch = async (id) => {
  const { data } = await api.delete(API_ENDPOINTS.BRANCHES.DELETE(id));
  return data;
};

export const toggleBranchActive = async (id) => {
  const { data } = await api.patch(API_ENDPOINTS.BRANCHES.TOGGLE_ACTIVE(id));
  return data;
};

export const toggleBranchHead = async (id, payload) => {
  const { data } = await api.patch(
    API_ENDPOINTS.BRANCHES.TOGGLE_HEAD(id),
    payload,
  );
  return data;
};

export const resetBranchAdminPassword = async (id) => {
  const { data } = await api.post(
    API_ENDPOINTS.BRANCHES.RESET_ADMIN_PASSWORD(id),
  );
  return data;
};
