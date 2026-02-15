/**
 * Protected Route & Public Route Components
 * Handle authentication and role-based access control
 * PRODUCTION-READY: Clean, no debug logs, ESLint compliant
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

/**
 * Protected Route - Requires authentication
 * Redirects to login if not authenticated
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactNode}
 *
 * @example
 * <ProtectedRoute>
 *   <Layout />
 * </ProtectedRoute>
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, user, token } = useAuthStore();
  const location = useLocation();

  // Check authentication
  if (!isAuthenticated || !user || !token) {
    // Save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated - render protected content
  return children;
}

/**
 * Public Route - Only accessible when NOT authenticated
 * Redirects to dashboard if already logged in
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactNode}
 *
 * @example
 * <PublicRoute>
 *   <LoginPage />
 * </PublicRoute>
 */
export function PublicRoute({ children }) {
  const { isAuthenticated, user, token } = useAuthStore();
  const location = useLocation();

  // If already authenticated, redirect to dashboard
  if (isAuthenticated && user && token) {
    // Get the page they were trying to access before login
    const from = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  // Not authenticated - show public content (login page)
  return children;
}

/**
 * Role Guard Component
 * Restricts access based on user role
 * Use this INSIDE protected routes for role-specific pages
 *
 * @param {Object} props
 * @param {string|string[]} props.allowedRoles - Allowed role(s)
 * @param {React.ReactNode} props.children - Child components
 * @param {string} [props.redirectTo="/unauthorized"] - Where to redirect if not allowed
 * @returns {React.ReactNode}
 *
 * @example
 * // Single role
 * <RoleGuard allowedRoles="admin">
 *   <AdminPanel />
 * </RoleGuard>
 *
 * @example
 * // Multiple roles
 * <RoleGuard allowedRoles={['admin', 'superadmin']}>
 *   <ManagementPanel />
 * </RoleGuard>
 */
export function RoleGuard({
  allowedRoles,
  children,
  redirectTo = "/unauthorized",
}) {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user || !user.role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Normalize roles
  const userRole = user.role.toLowerCase().replace(/[_\s-]/g, "");
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const normalizedAllowedRoles = roles.map((r) =>
    r.toLowerCase().replace(/[_\s-]/g, ""),
  );

  // Check if user has required role
  const hasAccess = normalizedAllowedRoles.includes(userRole);

  if (!hasAccess) {
    return <Navigate to={redirectTo} replace />;
  }

  // Has access - render protected content
  return children;
}

/**
 * Permission Guard Component
 * Uses role hierarchy instead of exact role match
 * SuperAdmin > Admin > Teacher
 *
 * @param {Object} props
 * @param {string} props.minimumRole - Minimum required role
 * @param {React.ReactNode} props.children - Child components
 * @param {string} [props.redirectTo="/unauthorized"] - Where to redirect if not allowed
 * @returns {React.ReactNode}
 *
 * @example
 * // Admin and SuperAdmin can access
 * <PermissionGuard minimumRole="admin">
 *   <AdminPanel />
 * </PermissionGuard>
 */
export function PermissionGuard({
  minimumRole,
  children,
  redirectTo = "/unauthorized",
}) {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user || !user.role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role hierarchy
  const roleHierarchy = {
    teacher: 0,
    admin: 1,
    superadmin: 2,
  };

  const userRole = user.role.toLowerCase().replace(/[_\s-]/g, "");
  const minRole = minimumRole.toLowerCase().replace(/[_\s-]/g, "");

  const userLevel = roleHierarchy[userRole] ?? -1;
  const minLevel = roleHierarchy[minRole] ?? Infinity;

  const hasAccess = userLevel >= minLevel;

  if (!hasAccess) {
    return <Navigate to={redirectTo} replace />;
  }

  // Has permission - render protected content
  return children;
}

// Export default
export default ProtectedRoute;
