/**
 * Teacher validation schemas
 */

import { z } from "zod";

/**
 * Teacher username schema
 */
export const teacherUsernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(50, "Username must not exceed 50 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores",
  )
  .trim();

/**
 * Teacher full name schema
 */
export const teacherFullNameSchema = z
  .string()
  .min(2, "Full name must be at least 2 characters")
  .max(100, "Full name must not exceed 100 characters")
  .trim();

/**
 * Branch IDs array schema
 */
export const branchIdsSchema = z
  .array(z.number().positive())
  .min(1, "Select at least 1 branch")
  .max(10, "A maximum of 10 branches can be selected");

/**
 * Division IDs array schema
 */
export const divisionIdsSchema = z
  .array(z.number().positive())
  .min(1, "Select at least 1 division")
  .max(20, "A maximum of 20 divisions can be selected");

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
    return { valid: false, error: "Invalid username" };
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
    return { valid: false, error: "Invalid full name" };
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
    return { valid: false, error: "Invalid branch selection" };
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
    return { valid: false, error: "Invalid division selection" };
  }
};
