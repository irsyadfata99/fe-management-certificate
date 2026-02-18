import api from "./client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

export const checkCertificateAvailability = async () => {
  const { data } = await api.get(
    API_ENDPOINTS.CERTIFICATES_TEACHER.GET_AVAILABLE,
  );
  return data;
};

export const reserveCertificate = async (payload) => {
  const { data } = await api.post(
    API_ENDPOINTS.CERTIFICATES_TEACHER.RESERVE,
    payload,
  );
  return data;
};

export const printCertificate = async (payload) => {
  const { data } = await api.post(
    API_ENDPOINTS.CERTIFICATES_TEACHER.PRINT,
    payload,
  );
  return data;
};

export const releaseCertificate = async (certificateId) => {
  const { data } = await api.post(
    API_ENDPOINTS.CERTIFICATES_TEACHER.RELEASE(certificateId),
  );
  return data;
};

export const getMyReservations = async () => {
  const { data } = await api.get(
    API_ENDPOINTS.CERTIFICATES_TEACHER.GET_MY_RESERVATIONS,
  );
  return data;
};

export const getMyPrints = async (params = {}) => {
  const { data } = await api.get(
    API_ENDPOINTS.CERTIFICATES_TEACHER.GET_MY_PRINTS,
    { params },
  );
  return data;
};
