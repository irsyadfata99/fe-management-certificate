import { z } from "zod";

export const teacherUsernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(50, "Username must not exceed 50 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores",
  )
  .trim();

export const teacherFullNameSchema = z
  .string()
  .min(2, "Full name must be at least 2 characters")
  .max(100, "Full name must not exceed 100 characters")
  .trim();

export const teacherBranchIdsSchema = z
  .array(z.number().positive("Branch ID must be positive"))
  .min(1, "At least one branch must be selected")
  .max(10, "Maximum 10 branches allowed")
  .refine((ids) => new Set(ids).size === ids.length, {
    message: "Duplicate branch IDs are not allowed",
  });

export const teacherDivisionIdsSchema = z
  .array(z.number().positive("Division ID must be positive"))
  .min(1, "At least one division must be selected")
  .max(20, "Maximum 20 divisions allowed")
  .refine((ids) => new Set(ids).size === ids.length, {
    message: "Duplicate division IDs are not allowed",
  });

export const createTeacherSchema = z.object({
  username: teacherUsernameSchema,
  full_name: teacherFullNameSchema,
  branch_ids: teacherBranchIdsSchema,
  division_ids: teacherDivisionIdsSchema,
});

export const updateTeacherSchema = z.object({
  username: teacherUsernameSchema.optional(),
  full_name: teacherFullNameSchema.optional(),
  branch_ids: teacherBranchIdsSchema.optional(),
  division_ids: teacherDivisionIdsSchema.optional(),
});

export const updateTeacherProfileSchema = z.object({
  full_name: teacherFullNameSchema,
});

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
