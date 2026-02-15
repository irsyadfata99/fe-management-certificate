/**
 * Profile Page
 * User profile management with 2 cards:
 * - Card 1: Account Information (read-only)
 * - Card 2: Security Settings (Change Username | Change Password)
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Key, Shield, Building2, Layers } from "lucide-react";
import { toast } from "sonner";

// Hooks
import { useChangePassword, useChangeUsername } from "@/hooks/auth/useAuth";
import { useAuthStore } from "@/store/authStore";

// UI Components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Button,
  FormField,
  FormLabel,
  Badge,
} from "@/components/ui";

// Validation
import { z } from "zod";

// Custom schemas for profile page
// Current password validation is relaxed (allows admin123)
const currentPasswordSchema = z.string().min(1, "Current password is required");

const newPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
  .max(100, "Password must not exceed 100 characters");

const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(50, "Username must not exceed 50 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores",
  )
  .trim();

// Custom change username schema (relaxed current password)
const customChangeUsernameSchema = z.object({
  newUsername: usernameSchema,
  password: currentPasswordSchema,
});

// Custom change password schema (relaxed current password)
const customChangePasswordSchema = z
  .object({
    currentPassword: currentPasswordSchema,
    newPassword: newPasswordSchema,
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

// Format
import { getRoleLabel } from "@/utils/constants/roles";

export default function ProfilePage() {
  const { user } = useAuthStore();

  // ============================================================================
  // MUTATIONS
  // ============================================================================
  const { mutate: changePassword, isPending: isChangingPassword } =
    useChangePassword();
  const { mutate: changeUsername, isPending: isChangingUsername } =
    useChangeUsername();

  // ============================================================================
  // CHANGE USERNAME FORM
  // ============================================================================
  const {
    register: registerUsername,
    handleSubmit: handleSubmitUsername,
    formState: { errors: errorsUsername },
    reset: resetUsername,
  } = useForm({
    resolver: zodResolver(customChangeUsernameSchema),
    defaultValues: {
      newUsername: "",
      password: "",
    },
  });

  const onSubmitUsername = (data) => {
    changeUsername(data, {
      onSuccess: () => {
        toast.success("Username changed successfully");
        resetUsername();
      },
    });
  };

  // ============================================================================
  // CHANGE PASSWORD FORM
  // ============================================================================
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
    reset: resetPassword,
  } = useForm({
    resolver: zodResolver(customChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmitPassword = (data) => {
    changePassword(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          toast.success("Password changed successfully");
          resetPassword();
        },
      },
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Profile Settings
        </h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Manage your account information and security
        </p>
      </div>

      {/* ====================================================================== */}
      {/* CARD 1: ACCOUNT INFORMATION (READ-ONLY) */}
      {/* ====================================================================== */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            Your current account details and role
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Username
              </label>
              <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <p className="text-sm text-neutral-900 dark:text-neutral-100 font-mono">
                  {user?.username || "-"}
                </p>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Role
              </label>
              <div>
                <Badge variant="primary" size="md">
                  {getRoleLabel(user)}
                </Badge>
              </div>
            </div>

            {/* Full Name (if exists) */}
            {user?.full_name && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Full Name
                </label>
                <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <p className="text-sm text-neutral-900 dark:text-neutral-100">
                    {user.full_name}
                  </p>
                </div>
              </div>
            )}

            {/* Branch (Admin/Teacher only) */}
            {user?.branch_name && (
              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Branch
                </label>
                <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <p className="text-sm text-neutral-900 dark:text-neutral-100">
                    {user.branch_name}
                  </p>
                  {user.branch_code && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-mono">
                      Code: {user.branch_code}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Division (Admin/Teacher only) */}
            {user?.division_name && (
              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Division
                </label>
                <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <p className="text-sm text-neutral-900 dark:text-neutral-100">
                    {user.division_name}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ====================================================================== */}
      {/* CARD 2: SECURITY SETTINGS (SPLIT: USERNAME | PASSWORD) */}
      {/* ====================================================================== */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Update your username or password to keep your account secure
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:divide-x lg:divide-neutral-200 dark:lg:divide-neutral-700">
            {/* LEFT SIDE: CHANGE USERNAME */}
            <div className="space-y-4 lg:pr-8">
              <div className="pb-3 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Change Username
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Update your login username
                </p>
              </div>

              <form
                onSubmit={handleSubmitUsername(onSubmitUsername)}
                className="space-y-4"
              >
                {/* New Username */}
                <FormField>
                  <FormLabel required>New Username</FormLabel>
                  <Input
                    {...registerUsername("newUsername")}
                    placeholder="Enter new username"
                    error={!!errorsUsername.newUsername}
                    helperText={
                      errorsUsername.newUsername?.message ||
                      "3-50 characters. Letters, numbers, underscores only."
                    }
                    disabled={isChangingUsername}
                  />
                </FormField>

                {/* Current Password */}
                <FormField>
                  <FormLabel required>Current Password</FormLabel>
                  <Input
                    {...registerUsername("password")}
                    type="password"
                    placeholder="Confirm with your password"
                    error={!!errorsUsername.password}
                    helperText={errorsUsername.password?.message}
                    disabled={isChangingUsername}
                  />
                </FormField>

                {/* Empty spacer to align with password form (which has 3 fields) */}
                <div className="h-[76px]" aria-hidden="true" />

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => resetUsername()}
                    disabled={isChangingUsername}
                    className="flex-1"
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    loading={isChangingUsername}
                    disabled={isChangingUsername}
                    className="flex-1"
                  >
                    Update Username
                  </Button>
                </div>
              </form>
            </div>

            {/* RIGHT SIDE: CHANGE PASSWORD */}
            <div className="space-y-4 lg:pl-8">
              <div className="pb-3 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Change Password
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Update your account password
                </p>
              </div>

              <form
                onSubmit={handleSubmitPassword(onSubmitPassword)}
                className="space-y-4"
              >
                {/* Current Password */}
                <FormField>
                  <FormLabel required>Current Password</FormLabel>
                  <Input
                    {...registerPassword("currentPassword")}
                    type="password"
                    placeholder="Enter current password"
                    error={!!errorsPassword.currentPassword}
                    helperText={errorsPassword.currentPassword?.message}
                    disabled={isChangingPassword}
                  />
                </FormField>

                {/* New Password */}
                <FormField>
                  <FormLabel required>New Password</FormLabel>
                  <Input
                    {...registerPassword("newPassword")}
                    type="password"
                    placeholder="Enter new password"
                    error={!!errorsPassword.newPassword}
                    helperText={
                      errorsPassword.newPassword?.message ||
                      "Min 8 chars, 1 uppercase, 1 special character"
                    }
                    disabled={isChangingPassword}
                  />
                </FormField>

                {/* Confirm Password */}
                <FormField>
                  <FormLabel required>Confirm Password</FormLabel>
                  <Input
                    {...registerPassword("confirmPassword")}
                    type="password"
                    placeholder="Confirm new password"
                    error={!!errorsPassword.confirmPassword}
                    helperText={errorsPassword.confirmPassword?.message}
                    disabled={isChangingPassword}
                  />
                </FormField>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => resetPassword()}
                    disabled={isChangingPassword}
                    className="flex-1"
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    loading={isChangingPassword}
                    disabled={isChangingPassword}
                    className="flex-1"
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
