import api from "./client";
import { API_ENDPOINTS } from "@/utils/constants/endpoints";

export const uploadCertificatePdf = async (printId, pdfFile) => {
  const formData = new FormData();
  formData.append("pdf", pdfFile);

  const { data } = await api.post(
    API_ENDPOINTS.CERTIFICATE_PDF.UPLOAD(printId),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data;
};

export const downloadCertificatePdf = async (printId) => {
  const response = await api.get(
    API_ENDPOINTS.CERTIFICATE_PDF.DOWNLOAD(printId),
    {
      responseType: "blob",
    },
  );
  return response.data;
};

export const downloadCertificatePdfWithHeaders = async (printId) => {
  const response = await api.get(
    API_ENDPOINTS.CERTIFICATE_PDF.DOWNLOAD(printId),
    {
      responseType: "blob",
    },
  );
  return {
    data: response.data,
    headers: response.headers,
  };
};

export const deleteCertificatePdf = async (printId) => {
  const { data } = await api.delete(
    API_ENDPOINTS.CERTIFICATE_PDF.DELETE(printId),
  );
  return data;
};

export const listCertificatePdfs = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.CERTIFICATE_PDF.LIST, {
    params,
  });
  return data;
};
