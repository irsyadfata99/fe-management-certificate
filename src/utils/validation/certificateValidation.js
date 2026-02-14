/**
 * Certificate validation schemas
 */

import { z } from "zod";
import { validateCertificateRange } from "@/utils/format/certificateFormat";

/**
 * Certificate number schema
 * Must be positive integer
 */
export const certificateNumberSchema = z.number().int("Nomor sertifikat harus bilangan bulat").positive("Nomor sertifikat harus positif").min(1, "Nomor sertifikat minimal 1").max(999999, "Nomor sertifikat maksimal 999999");

/**
 * Bulk create schema
 */
export const bulkCreateCertificatesSchema = z
  .object({
    startNumber: certificateNumberSchema,
    endNumber: certificateNumberSchema,
  })
  .refine(
    (data) => {
      const validation = validateCertificateRange(data.startNumber, data.endNumber, 10000);
      return validation.valid;
    },
    (data) => {
      const validation = validateCertificateRange(data.startNumber, data.endNumber, 10000);
      return {
        message: validation.error || "Range tidak valid",
        path: ["endNumber"],
      };
    },
  );

/**
 * Migrate certificates schema
 */
export const migrateCertificatesSchema = z
  .object({
    startNumber: certificateNumberSchema,
    endNumber: certificateNumberSchema,
    toBranchId: z.number().positive("Branch tujuan wajib dipilih"),
  })
  .refine(
    (data) => {
      const validation = validateCertificateRange(
        data.startNumber,
        data.endNumber,
        1000, // Max 1000 per migration
      );
      return validation.valid;
    },
    (data) => {
      const validation = validateCertificateRange(data.startNumber, data.endNumber, 1000);
      return {
        message: validation.error || "Range tidak valid",
        path: ["endNumber"],
      };
    },
  );

/**
 * Print certificate schema
 */
export const printCertificateSchema = z.object({
  certificateId: z.number().positive("Sertifikat wajib dipilih"),
  studentName: z.string().min(2, "Nama siswa minimal 2 karakter").max(100, "Nama siswa maksimal 100 karakter").trim(),
  moduleId: z.number().positive("Modul wajib dipilih"),
  ptcDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid"),
});

/**
 * Reserve certificate schema
 */
export const reserveCertificateSchema = z.object({
  branchId: z.number().positive("Branch wajib dipilih"),
});

/**
 * Upload PDF schema
 */
export const uploadPdfSchema = z.object({
  pdf: z
    .instanceof(File)
    .refine((file) => file.type === "application/pdf", {
      message: "File harus berformat PDF",
    })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "Ukuran file maksimal 10MB",
    }),
});

/**
 * Certificate filters schema (untuk query params)
 */
export const certificateFiltersSchema = z.object({
  status: z.enum(["in_stock", "reserved", "printed", "migrated"]).optional(),
  currentBranchId: z.number().positive().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

/**
 * Validate student name
 * @param {string} name
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateStudentName = (name) => {
  if (!name || typeof name !== "string") {
    return { valid: false, error: "Nama siswa wajib diisi" };
  }

  const trimmed = name.trim();

  if (trimmed.length < 2) {
    return { valid: false, error: "Nama siswa minimal 2 karakter" };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: "Nama siswa maksimal 100 karakter" };
  }

  return { valid: true };
};

/**
 * Validate PTC date
 * @param {string} date - Format: YYYY-MM-DD
 * @returns {{ valid: boolean, error?: string }}
 */
export const validatePtcDate = (date) => {
  if (!date || typeof date !== "string") {
    return { valid: false, error: "Tanggal PTC wajib diisi" };
  }

  // Check format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { valid: false, error: "Format tanggal tidak valid (YYYY-MM-DD)" };
  }

  // Check if valid date
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: "Tanggal tidak valid" };
  }

  // Cannot be future date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (dateObj > today) {
    return { valid: false, error: "Tanggal PTC tidak boleh di masa depan" };
  }

  return { valid: true };
};

/**
 * Validate PDF file
 * @param {File} file
 * @returns {{ valid: boolean, error?: string }}
 */
export const validatePdfFile = (file) => {
  if (!file) {
    return { valid: false, error: "File PDF wajib dipilih" };
  }

  if (!(file instanceof File)) {
    return { valid: false, error: "File tidak valid" };
  }

  if (file.type !== "application/pdf") {
    return { valid: false, error: "File harus berformat PDF" };
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: "Ukuran file maksimal 10MB" };
  }

  return { valid: true };
};
