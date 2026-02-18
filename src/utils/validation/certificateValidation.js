import { z } from "zod";
import { validateCertificateRange } from "@/utils/format/certificateFormat";

export const certificateNumberSchema = z
  .number()
  .int("Certificate number must be an integer")
  .positive("Certificate number must be positive")
  .min(1, "Minimum certificate number is 1")
  .max(999999, "Maximum certificate number is 999999");

export const bulkCreateCertificatesSchema = z
  .object({
    startNumber: certificateNumberSchema,
    endNumber: certificateNumberSchema,
  })
  .refine(
    (data) => {
      const validation = validateCertificateRange(
        data.startNumber,
        data.endNumber,
        10000,
      );
      return validation.valid;
    },
    (data) => {
      const validation = validateCertificateRange(
        data.startNumber,
        data.endNumber,
        10000,
      );
      return {
        message: validation.error || "Invalid range",
        path: ["endNumber"],
      };
    },
  );

export const migrateCertificatesSchema = z
  .object({
    startNumber: certificateNumberSchema,
    endNumber: certificateNumberSchema,
    toBranchId: z.number().positive("Target branch is required"),
  })
  .refine(
    (data) => {
      const validation = validateCertificateRange(
        data.startNumber,
        data.endNumber,
        1000,
      );
      return validation.valid;
    },
    (data) => {
      const validation = validateCertificateRange(
        data.startNumber,
        data.endNumber,
        1000,
      );
      return {
        message: validation.error || "Invalid range",
        path: ["endNumber"],
      };
    },
  );

export const printCertificateSchema = z.object({
  certificateId: z.number().positive("Certificate selection is required"),
  studentName: z
    .string()
    .min(2, "Student name must be at least 2 characters")
    .max(100, "Student name must not exceed 100 characters")
    .trim(),
  moduleId: z.number().positive("Module selection is required"),
  ptcDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

export const reserveCertificateSchema = z.object({
  branchId: z.number().positive("Branch selection is required"),
});

export const uploadPdfSchema = z.object({
  pdf: z
    .instanceof(File)
    .refine((file) => file.type === "application/pdf", {
      message: "File must be in PDF format",
    })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "File size must not exceed 10MB",
    }),
});

export const certificateFiltersSchema = z.object({
  status: z.enum(["in_stock", "reserved", "printed", "migrated"]).optional(),
  currentBranchId: z.number().positive().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

export const validateStudentName = (name) => {
  if (!name || typeof name !== "string") {
    return { valid: false, error: "Student name is required" };
  }

  const trimmed = name.trim();

  if (trimmed.length < 2) {
    return {
      valid: false,
      error: "Student name must be at least 2 characters",
    };
  }

  if (trimmed.length > 100) {
    return {
      valid: false,
      error: "Student name must not exceed 100 characters",
    };
  }

  return { valid: true };
};

export const validatePtcDate = (date) => {
  if (!date || typeof date !== "string") {
    return { valid: false, error: "PTC date is required" };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { valid: false, error: "Invalid date format (YYYY-MM-DD)" };
  }

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: "Invalid date" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (dateObj > today) {
    return { valid: false, error: "PTC date cannot be in the future" };
  }

  return { valid: true };
};

export const validatePdfFile = (file) => {
  if (!file) {
    return { valid: false, error: "PDF file selection is required" };
  }

  if (!(file instanceof File)) {
    return { valid: false, error: "Invalid file" };
  }

  if (file.type !== "application/pdf") {
    return { valid: false, error: "File must be in PDF format" };
  }

  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: "File size must not exceed 10MB" };
  }

  return { valid: true };
};
