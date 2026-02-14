/**
 * Branch validation schemas
 */

import { z } from "zod";

/**
 * Branch code validation
 * Format: 2-10 karakter alfanumerik
 */
export const branchCodeSchema = z
  .string()
  .min(2, "Kode branch minimal 2 karakter")
  .max(10, "Kode branch maksimal 10 karakter")
  .regex(/^[A-Z0-9]+$/, "Kode hanya boleh huruf kapital dan angka")
  .trim();

/**
 * Branch name validation
 */
export const branchNameSchema = z.string().min(3, "Nama branch minimal 3 karakter").max(100, "Nama branch maksimal 100 karakter").trim();

/**
 * Create head branch schema
 */
export const createHeadBranchSchema = z.object({
  code: branchCodeSchema,
  name: branchNameSchema,
  is_head_branch: z.literal(true),
  admin_username: z
    .string()
    .min(3, "Username admin minimal 3 karakter")
    .max(50, "Username admin maksimal 50 karakter")
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, dan underscore")
    .optional(),
});

/**
 * Create sub branch schema
 */
export const createSubBranchSchema = z.object({
  code: branchCodeSchema,
  name: branchNameSchema,
  is_head_branch: z.literal(false),
  parent_id: z.number().positive("Parent branch wajib dipilih"),
});

/**
 * Update branch schema
 */
export const updateBranchSchema = z.object({
  code: branchCodeSchema.optional(),
  name: branchNameSchema.optional(),
  parent_id: z.number().positive().optional().nullable(),
});

/**
 * Toggle head status schema
 */
export const toggleHeadBranchSchema = z.object({
  is_head_branch: z.boolean(),
  parent_id: z.number().positive().optional().nullable(),
  admin_username: z
    .string()
    .min(3, "Username admin minimal 3 karakter")
    .max(50, "Username admin maksimal 50 karakter")
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, dan underscore")
    .optional(),
});

/**
 * Validate branch code format
 * @param {string} code
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateBranchCode = (code) => {
  try {
    branchCodeSchema.parse(code);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0]?.message };
    }
    return { valid: false, error: "Kode branch tidak valid" };
  }
};

/**
 * Validate branch name
 * @param {string} name
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateBranchName = (name) => {
  try {
    branchNameSchema.parse(name);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0]?.message };
    }
    return { valid: false, error: "Nama branch tidak valid" };
  }
};
