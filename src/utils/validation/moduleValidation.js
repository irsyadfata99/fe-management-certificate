import { z } from "zod";

export const moduleCodeSchema = z
  .string()
  .min(2, "Module code must be at least 2 characters")
  .max(20, "Module code must not exceed 20 characters")
  .regex(
    /^[A-Z0-9_-]+$/,
    "Code can only contain uppercase letters, numbers, dashes, and underscores",
  )
  .trim();

export const moduleNameSchema = z
  .string()
  .min(2, "Module name must be at least 2 characters")
  .max(100, "Module name must not exceed 100 characters")
  .trim();

export const createModuleSchema = z.object({
  module_code: moduleCodeSchema,
  name: moduleNameSchema,
  division_id: z.number().positive("Division selection is required"),
  sub_div_id: z.number().positive().optional().nullable(),
});

export const updateModuleSchema = z.object({
  module_code: moduleCodeSchema.optional(),
  name: moduleNameSchema.optional(),
  division_id: z.number().positive("Division selection is required").optional(),
  sub_div_id: z.number().positive().optional().nullable(),
});

export const validateModuleCode = (code) => {
  try {
    moduleCodeSchema.parse(code);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0]?.message };
    }
    return { valid: false, error: "Invalid module code" };
  }
};

export const validateModuleName = (name) => {
  try {
    moduleNameSchema.parse(name);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0]?.message };
    }
    return { valid: false, error: "Invalid module name" };
  }
};
