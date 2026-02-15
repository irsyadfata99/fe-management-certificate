/**
 * Auth Utilities Index
 * Central export for all auth-related components and utilities
 */

// Components
export { default as ProtectedRoute } from "./ProtectedRoute";
export { default as PublicRoute } from "./PublicRoute";
export { default as RoleGuard } from "./RoleGuard";

// Hooks (from hooks folder)
export { useRoleGuard } from "@/hooks/useRoleGuard";

// HOC (from utils folder)
export { withRoleGuard } from "@/utils/withRoleGuard";
