/**
 * File download utilities
 * Handle blob downloads dan filename extraction
 */

/**
 * Download blob as file
 * @param {Blob} blob - File blob
 * @param {string} filename - Filename dengan extension
 *
 * @example
 * const pdfBlob = new Blob([data], { type: 'application/pdf' });
 * downloadBlob(pdfBlob, 'certificate.pdf');
 *
 * @example
 * const excelBlob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
 * downloadBlob(excelBlob, 'report.xlsx');
 */
export const downloadBlob = (blob, filename) => {
  try {
    // Create object URL
    const url = window.URL.createObjectURL(blob);

    // Create temporary link element
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup object URL
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
    throw new Error("Gagal mendownload file");
  }
};

/**
 * Extract filename from Content-Disposition header
 * @param {string} header - Content-Disposition header value
 * @returns {string} Extracted filename or 'download'
 *
 * @example
 * const header = 'attachment; filename="report_2024.xlsx"';
 * getFilenameFromHeader(header); // "report_2024.xlsx"
 *
 * @example
 * const header = 'attachment; filename*=UTF-8\'\'%E6%8A%A5%E5%91%8A.pdf';
 * getFilenameFromHeader(header); // "报告.pdf"
 */
export const getFilenameFromHeader = (header) => {
  if (!header) return "download";

  try {
    // Try RFC 5987 format first (filename*=UTF-8''encoded-name)
    const rfc5987Match = /filename\*=UTF-8''(.+)/i.exec(header);
    if (rfc5987Match && rfc5987Match[1]) {
      return decodeURIComponent(rfc5987Match[1]);
    }

    // Try standard format (filename="name" or filename=name)
    const standardMatch = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i.exec(header);
    if (standardMatch && standardMatch[1]) {
      let filename = standardMatch[1].trim();

      // Remove quotes if present
      filename = filename.replace(/['"]/g, "");

      // Decode if URL-encoded
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

/**
 * Download file from URL
 * Fetch file dan trigger download
 *
 * @param {string} url - File URL
 * @param {string} [filename] - Optional filename override
 * @returns {Promise<void>}
 *
 * @example
 * await downloadFile('https://example.com/report.pdf');
 *
 * @example
 * await downloadFile('https://example.com/file', 'custom-name.xlsx');
 */
export const downloadFile = async (url, filename = null) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Download failed");
    }

    const blob = await response.blob();

    // Extract filename from header if not provided
    const finalFilename = filename || getFilenameFromHeader(response.headers.get("content-disposition"));

    downloadBlob(blob, finalFilename);
  } catch (error) {
    console.error("Download failed:", error);
    throw new Error("Gagal mendownload file");
  }
};

/**
 * Get file extension from filename
 * @param {string} filename
 * @returns {string} Extension without dot
 *
 * @example
 * getFileExtension('report.pdf'); // "pdf"
 * getFileExtension('data.backup.xlsx'); // "xlsx"
 */
export const getFileExtension = (filename) => {
  if (!filename) return "";

  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
};

/**
 * Get MIME type from extension
 * @param {string} extension - File extension
 * @returns {string} MIME type
 *
 * @example
 * getMimeType('pdf'); // "application/pdf"
 * getMimeType('xlsx'); // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
 */
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

/**
 * Validate file type
 * @param {File} file - File object
 * @param {string[]} allowedTypes - Allowed MIME types
 * @returns {boolean}
 *
 * @example
 * validateFileType(file, ['application/pdf']);
 * validateFileType(file, ['image/png', 'image/jpeg']);
 */
export const validateFileType = (file, allowedTypes) => {
  if (!file || !allowedTypes || allowedTypes.length === 0) return false;
  return allowedTypes.includes(file.type);
};

/**
 * Validate file size
 * @param {File} file - File object
 * @param {number} maxSizeInMB - Max size in megabytes
 * @returns {boolean}
 *
 * @example
 * validateFileSize(file, 10); // Max 10MB
 */
export const validateFileSize = (file, maxSizeInMB) => {
  if (!file) return false;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};
