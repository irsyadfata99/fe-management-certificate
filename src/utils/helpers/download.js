export const downloadBlob = (blob, filename) => {
  try {
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
    throw new Error("Gagal mendownload file");
  }
};

export const getFilenameFromHeader = (header) => {
  if (!header) return "download";

  try {
    const rfc5987Match = /filename\*=UTF-8''(.+)/i.exec(header);
    if (rfc5987Match && rfc5987Match[1]) {
      return decodeURIComponent(rfc5987Match[1]);
    }

    const standardMatch = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i.exec(
      header,
    );
    if (standardMatch && standardMatch[1]) {
      let filename = standardMatch[1].trim();

      filename = filename.replace(/['"]/g, "");
      try {
        filename = decodeURIComponent(filename);
      } catch {
        // If decode fails, use as-is
      }

      return filename;
    }

    return "download";
  } catch (error) {
    console.error("Failed to extract filename:", error);
    return "download";
  }
};

export const downloadFile = async (url, filename = null) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Download failed");
    }

    const blob = await response.blob();

    const finalFilename =
      filename ||
      getFilenameFromHeader(response.headers.get("content-disposition"));

    downloadBlob(blob, finalFilename);
  } catch (error) {
    console.error("Download failed:", error);
    throw new Error("Failed to download file");
  }
};

export const getFileExtension = (filename) => {
  if (!filename) return "";

  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
};

export const getMimeType = (extension) => {
  const mimeTypes = {
    pdf: "application/pdf",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xls: "application/vnd.ms-excel",
    csv: "text/csv",
    zip: "application/zip",
    json: "application/json",
    txt: "text/plain",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
  };

  return mimeTypes[extension.toLowerCase()] || "application/octet-stream";
};

export const validateFileType = (file, allowedTypes) => {
  if (!file || !allowedTypes || allowedTypes.length === 0) return false;
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file, maxSizeInMB) => {
  if (!file) return false;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};
