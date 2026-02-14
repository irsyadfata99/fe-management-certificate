/**
 * Teacher validation schemas
 */

import { z } from "zod";

/**
 * Teacher username schema
 */
export const teacherUsernameSchema = z
  .string()
  .min(3, "Username minimal 3 karakter")
  .max(50, "Username maksimal 50 karakter")
  .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, dan underscore")
  .trim();

/**
 * Teacher full name schema
 */
export const teacherFullNameSchema = z.string().min(2, "Nama lengkap minimal 2 karakter").max(100, "Nama lengkap maksimal 100 karakter").trim();

/**
 * Branch IDs array schema
 */
export const branchIdsSchema = z.array(z.number().positive()).min(1, "Minimal pilih 1 branch").max(10, "Maksimal 10 branch");

/**
 * Division IDs array schema
 */
export const divisionIdsSchema = z.array(z.number().positive()).min(1, "Minimal pilih 1 divisi").max(20, "Maksimal 20 divisi");

/**
 * Create teacher schema
 */
export const createTeacherSchema = z.object({
  username: teacherUsernameSchema,
  full_name: teacherFullNameSchema,
  branch_ids: branchIdsSchema,
  division_ids: divisionIdsSchema,
});

/**
 * Update teacher schema
 */
export const updateTeacherSchema = z.object({
  username: teacherUsernameSchema.optional(),
  full_name: teacherFullNameSchema.optional(),
  branch_ids: branchIdsSchema.optional(),
  division_ids: divisionIdsSchema.optional(),
});

/**
 * Update teacher profile schema (teacher-owned)
 */
export const updateTeacherProfileSchema = z.object({
  full_name: teacherFullNameSchema,
});

/**
 * Validate teacher username
 * @param {string} username
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateTeacherUsername = (username) => {
  try {
    teacherUsernameSchema.parse(username);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0]?.message };
    }
    return { valid: false, error: "Username tidak valid" };
  }
};

/**
 * Validate teacher full name
 * @param {string} fullName
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateTeacherFullName = (fullName) => {
  try {
    teacherFullNameSchema.parse(fullName);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0]?.message };
    }
    return { valid: false, error: "Nama lengkap tidak valid" };
  }
};

/**
 * Validate branch IDs
 * @param {number[]} branchIds
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateBranchIds = (branchIds) => {
  try {
    branchIdsSchema.parse(branchIds);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0]?.message };
    }
    return { valid: false, error: "Branch IDs tidak valid" };
  }
};

/**
 * Validate division IDs
 * @param {number[]} divisionIds
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateDivisionIds = (divisionIds) => {
  try {
    divisionIdsSchema.parse(divisionIds);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0]?.message };
    }
    return { valid: false, error: "Division IDs tidak valid" };
  }
};
