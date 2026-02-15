/**
 * Teacher validation schemas
 */

import { z } from "zod";

/**
 * Username validation
 * Reuse from authValidation pattern
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
 * Full name validation
 */
export const teacherFullNameSchema = z
  .string()
  .min(2, "Full name must be at least 2 characters")
  .max(100, "Full name must not exceed 100 characters")
  .trim();

/**
 * Branch IDs validation (1-10 branches)
 */
export const teacherBranchIdsSchema = z
  .array(z.number().positive("Branch ID must be positive"))
  .min(1, "At least one branch must be selected")
  .max(10, "Maximum 10 branches allowed")
  .refine((ids) => new Set(ids).size === ids.length, {
    message: "Duplicate branch IDs are not allowed",
  });

/**
 * Division IDs validation (1-20 divisions)
 */
export const teacherDivisionIdsSchema = z
  .array(z.number().positive("Division ID must be positive"))
  .min(1, "At least one division must be selected")
  .max(20, "Maximum 20 divisions allowed")
  .refine((ids) => new Set(ids).size === ids.length, {
    message: "Duplicate division IDs are not allowed",
  });

/**
 * Create teacher schema
 */
export const createTeacherSchema = z.object({
  username: teacherUsernameSchema,
  full_name: teacherFullNameSchema,
  branch_ids: teacherBranchIdsSchema,
  division_ids: teacherDivisionIdsSchema,
});

/**
 * Update teacher schema
 */
export const updateTeacherSchema = z.object({
  username: teacherUsernameSchema.optional(),
  full_name: teacherFullNameSchema.optional(),
  branch_ids: teacherBranchIdsSchema.optional(),
  division_ids: teacherDivisionIdsSchema.optional(),
});

/**
 * Update teacher profile schema (teacher own profile)
 * Teacher can only update their full_name
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
    teacherBranchIdsSchema.parse(branchIds);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0]?.message };
    }
    return { valid: false, error: "Invalid branch IDs" };
  }
};

/**
 * Validate division IDs
 * @param {number[]} divisionIds
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateDivisionIds = (divisionIds) => {
  try {
    teacherDivisionIdsSchema.parse(divisionIds);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0]?.message };
    }
    return { valid: false, error: "Invalid division IDs" };
  }
};

/**
 * Validate teacher create data
 * @param {Object} data
 * @returns {{ valid: boolean, errors?: Object }}
 */
export const validateCreateTeacher = (data) => {
  try {
    createTeacherSchema.parse(data);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = {};
      error.errors.forEach((err) => {
        const path = err.path.join(".");
        errors[path] = err.message;
      });
      return { valid: false, errors };
    }
    return { valid: false, errors: { _error: "Validation failed" } };
  }
};

/**
 * Validate teacher update data
 * @param {Object} data
 * @returns {{ valid: boolean, errors?: Object }}
 */
export const validateUpdateTeacher = (data) => {
  try {
    updateTeacherSchema.parse(data);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = {};
      error.errors.forEach((err) => {
        const path = err.path.join(".");
        errors[path] = err.message;
      });
      return { valid: false, errors };
    }
    return { valid: false, errors: { _error: "Validation failed" } };
  }
};
