/**
 * Module validation schemas
 */

import { z } from "zod";

/**
 * Module code schema
 * Format: 2-20 karakter alfanumerik dengan dash/underscore
 */
export const moduleCodeSchema = z
  .string()
  .min(2, "Kode modul minimal 2 karakter")
  .max(20, "Kode modul maksimal 20 karakter")
  .regex(/^[A-Z0-9_-]+$/, "Kode hanya boleh huruf kapital, angka, dash, dan underscore")
  .trim();

/**
 * Module name schema
 */
export const moduleNameSchema = z.string().min(2, "Nama modul minimal 2 karakter").max(100, "Nama modul maksimal 100 karakter").trim();

/**
 * Create module schema
 */
export const createModuleSchema = z.object({
  module_code: moduleCodeSchema,
  name: moduleNameSchema,
  division_id: z.number().positive("Divisi wajib dipilih"),
  sub_div_id: z.number().positive().optional().nullable(),
});

/**
 * Update module schema
 */
export const updateModuleSchema = z.object({
  module_code: moduleCodeSchema.optional(),
  name: moduleNameSchema.optional(),
  division_id: z.number().positive("Divisi wajib dipilih").optional(),
  sub_div_id: z.number().positive().optional().nullable(),
});

/**
 * Validate module code
 * @param {string} code
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateModuleCode = (code) => {
  try {
    moduleCodeSchema.parse(code);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0]?.message };
    }
    return { valid: false, error: "Kode modul tidak valid" };
  }
};

/**
 * Validate module name
 * @param {string} name
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateModuleName = (name) => {
  try {
    moduleNameSchema.parse(name);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0]?.message };
    }
    return { valid: false, error: "Nama modul tidak valid" };
  }
};
