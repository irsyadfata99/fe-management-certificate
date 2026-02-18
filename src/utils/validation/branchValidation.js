import { z } from "zod";

export const branchCodeSchema = z
  .string()
  .min(2, "Branch code must be at least 2 characters")
  .max(10, "Branch code must not exceed 10 characters")
  .regex(/^[A-Z0-9]+$/, "Code can only contain uppercase letters and numbers")
  .trim();

export const branchNameSchema = z
  .string()
  .min(3, "Branch name must be at least 3 characters")
  .max(100, "Branch name must not exceed 100 characters")
  .trim();

export const createHeadBranchSchema = z.object({
  code: branchCodeSchema,
  name: branchNameSchema,
  is_head_branch: z.literal(true),
  admin_username: z
    .string()
    .min(3, "Admin username must be at least 3 characters")
    .max(50, "Admin username must not exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    )
    .optional(),
});

export const createSubBranchSchema = z.object({
  code: branchCodeSchema,
  name: branchNameSchema,
  is_head_branch: z.literal(false),
  parent_id: z.number().positive("Parent branch is required"),
});

export const updateBranchSchema = z.object({
  code: branchCodeSchema.optional(),
  name: branchNameSchema.optional(),
  parent_id: z
    .union([
      z.number().positive(),
      z.string().length(0),
      z.null(),
      z.undefined(),
    ])
    .transform((val) => {
      if (val === "" || val === undefined) return null;
      if (typeof val === "string") return parseInt(val, 10);
      return val;
    })
    .pipe(
      z
        .number()
        .positive("Parent branch must be a valid ID")
        .optional()
        .nullable(),
    )
    .optional()
    .nullable(),
});

export const toggleHeadBranchSchema = z.object({
  is_head_branch: z.boolean(),
  parent_id: z
    .union([
      z.number().positive(),
      z.string().length(0),
      z.null(),
      z.undefined(),
    ])
    .transform((val) => {
      if (val === "" || val === undefined) return null;
      if (typeof val === "string") return parseInt(val, 10);
      return val;
    })
    .pipe(
      z
        .number()
        .positive("Parent branch must be a valid ID")
        .optional()
        .nullable(),
    )
    .optional()
    .nullable(),
  admin_username: z
    .string()
    .min(3, "Admin username must be at least 3 characters")
    .max(50, "Admin username must not exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    )
    .optional(),
});

export const validateBranchCode = (code) => {
  try {
    branchCodeSchema.parse(code);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0]?.message };
    }
    return { valid: false, error: "Invalid branch code" };
  }
};
export const validateBranchName = (name) => {
  try {
    branchNameSchema.parse(name);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0]?.message };
    }
    return { valid: false, error: "Invalid branch name" };
  }
};
