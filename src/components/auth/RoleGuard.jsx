/**
 * RoleGuard Component
 * Restricts access to components based on user roles
 * Used to wrap components that require specific role permissions
 */

import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

/**
 * Role hierarchy for permission checks
 * Higher index = higher permission level
 */
const ROLE_HIERARCHY = {
  teacher: 0,
  admin: 1,
  superadmin: 2,
};

/**
 * RoleGuard wrapper component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string|string[]} props.allowedRoles - Role(s) that can access this component
 * @param {string} props.redirectTo - Where to redirect unauthorized users (default: /unauthorized)
 * @param {React.ReactNode} props.fallback - Component to render if unauthorized (instead of redirect)
 */
export default function RoleGuard({
  children,
  allowedRoles = [],
  redirectTo = "/unauthorized",
  fallback = null,
}) {
  const { user, isAuthenticated } = useAuthStore();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Normalize allowedRoles to array
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  // Get user's role level
  const userRole = user?.role?.toLowerCase();
  const userRoleLevel = ROLE_HIERARCHY[userRole] ?? -1;

  /**
   * Check if user has permission
   * User has permission if:
   * 1. No roles specified (allow all authenticated users), OR
   * 2. User's role is in the allowed roles list, OR
   * 3. User's role level is higher than any allowed role (hierarchy-based)
   */
  const hasPermission = () => {
    // If no roles specified, allow all authenticated users
    if (roles.length === 0) {
      return true;
    }

    // Check if user's role is explicitly in allowed roles
    if (roles.includes(userRole)) {
      return true;
    }

    // Check hierarchy: if user has higher role level than minimum required
    const minRequiredLevel = Math.min(
      ...roles.map((role) => ROLE_HIERARCHY[role.toLowerCase()] ?? Infinity),
    );

    return userRoleLevel >= minRequiredLevel;
  };

  // Check permission
  if (!hasPermission()) {
    // If fallback component provided, render it
    if (fallback) {
      return fallback;
    }

    // Otherwise, redirect to unauthorized page
    return <Navigate to={redirectTo} replace />;
  }

  // User has permission, render children
  return children;
}
