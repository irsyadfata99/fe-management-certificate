/**
 * Auth validation rules untuk React Hook Form + Zod
 */

import { z } from "zod";

/**
 * Username validation rules
 */
export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(50, "Username must not exceed 50 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores",
  )
  .trim();

/**
 * Password validation rules
 */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
  .max(100, "Password must not exceed 100 characters");

/**
 * New password with confirmation
 */
export const newPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Login schema
 */
export const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

/**
 * Change password schema
 */
export const changePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from the current password",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Change username schema
 */
export const changeUsernameSchema = z.object({
  newUsername: usernameSchema,
  password: passwordSchema,
});

/**
 * Validate username format (untuk real-time validation)
 * @param {string} username
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateUsername = (username) => {
  try {
    usernameSchema.parse(username);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0]?.message };
    }
    return { valid: false, error: "Invalid username format" };
  }
};

/**
 * Validate password format
 * @param {string} password
 * @returns {{ valid: boolean, error?: string }}
 */
export const validatePassword = (password) => {
  try {
    passwordSchema.parse(password);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0]?.message };
    }
    return { valid: false, error: "Invalid password format" };
  }
};

/**
 * Check password strength
 * @param {string} password
 * @returns {{ strength: 'weak'|'medium'|'strong', score: number }}
 */
export const checkPasswordStrength = (password) => {
  if (!password) {
    return { strength: "weak", score: 0 };
  }

  let score = 0;

  // Length
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Complexity
  if (/[a-z]/.test(password)) score += 1; // lowercase
  if (/[A-Z]/.test(password)) score += 1; // uppercase
  if (/[0-9]/.test(password)) score += 1; // numbers
  if (/[^a-zA-Z0-9]/.test(password)) score += 1; // special chars

  // Determine strength
  if (score <= 2) {
    return { strength: "weak", score };
  } else if (score <= 4) {
    return { strength: "medium", score };
  } else {
    return { strength: "strong", score };
  }
};
