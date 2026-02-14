/**
 * Division and Sub Division validation schemas
 */

import { z } from "zod";

/**
 * Division name schema
 */
export const divisionNameSchema = z.string().min(2, "Nama divisi minimal 2 karakter").max(100, "Nama divisi maksimal 100 karakter").trim();

/**
 * Age range schema
 */
export const ageSchema = z.number().int("Umur harus bilangan bulat").min(1, "Umur minimal 1 tahun").max(100, "Umur maksimal 100 tahun");

/**
 * Sub division schema
 */
export const subDivisionSchema = z
  .object({
    name: divisionNameSchema,
    age_min: ageSchema,
    age_max: ageSchema,
  })
  .refine((data) => data.age_min <= data.age_max, {
    message: "Umur minimum harus <= umur maksimum",
    path: ["age_max"],
  });

/**
 * Create division schema
 */
export const createDivisionSchema = z.object({
  name: divisionNameSchema,
  sub_divisions: z.array(subDivisionSchema).optional(),
});

/**
 * Update division schema
 */
export const updateDivisionSchema = z.object({
  name: divisionNameSchema,
});

/**
 * Create sub division schema
 */
export const createSubDivisionSchema = subDivisionSchema;

/**
 * Update sub division schema
 */
export const updateSubDivisionSchema = z.object({
  name: divisionNameSchema.optional(),
  age_min: ageSchema.optional(),
  age_max: ageSchema.optional(),
});

/**
 * Validate division name
 * @param {string} name
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateDivisionName = (name) => {
  try {
    divisionNameSchema.parse(name);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0]?.message };
    }
    return { valid: false, error: "Nama divisi tidak valid" };
  }
};

/**
 * Validate age range
 * @param {number} min
 * @param {number} max
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateAgeRange = (min, max) => {
  try {
    ageSchema.parse(min);
    ageSchema.parse(max);

    if (min > max) {
      return {
        valid: false,
        error: "Umur minimum harus <= umur maksimum",
      };
    }

    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0]?.message };
    }
    return { valid: false, error: "Range umur tidak valid" };
  }
};

/**
 * Validate sub divisions array
 * Check for overlapping age ranges
 * @param {Array} subDivisions
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateSubDivisions = (subDivisions) => {
  if (!Array.isArray(subDivisions) || subDivisions.length === 0) {
    return { valid: true };
  }

  // Validate each sub division
  for (let i = 0; i < subDivisions.length; i++) {
    const sub = subDivisions[i];

    try {
      subDivisionSchema.parse(sub);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          error: `Sub divisi ${i + 1}: ${error.errors[0]?.message}`,
        };
      }
    }
  }

  // Check for overlapping ranges
  for (let i = 0; i < subDivisions.length; i++) {
    for (let j = i + 1; j < subDivisions.length; j++) {
      const sub1 = subDivisions[i];
      const sub2 = subDivisions[j];

      // Check if ranges overlap
      const overlaps = (sub1.age_min <= sub2.age_max && sub1.age_max >= sub2.age_min) || (sub2.age_min <= sub1.age_max && sub2.age_max >= sub1.age_min);

      if (overlaps) {
        return {
          valid: false,
          error: `Range umur "${sub1.name}" dan "${sub2.name}" overlap`,
        };
      }
    }
  }

  return { valid: true };
};
