/**
 * Protected Route & Public Route Components
 * Handle authentication and role-based access control
 * UPDATED: ProtectedRoute now supports allowedRoles prop
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

/**
 * Protected Route - Requires authentication + optional role check
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {string|string[]} [props.allowedRoles] - Allowed roles (optional)
 * @param {string} [props.redirectTo="/unauthorized"] - Redirect if role not allowed
 *
 * @example
 * // Auth only
 * <ProtectedRoute>
 *   <Layout />
 * </ProtectedRoute>
 *
 * @example
 * // Auth + role check
 * <ProtectedRoute allowedRoles={["teacher"]}>
 *   <TeacherPrintsPage />
 * </ProtectedRoute>
 */
export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/unauthorized",
}) {
  const { isAuthenticated, user, token } = useAuthStore();
  const location = useLocation();

  // Check authentication
  if (!isAuthenticated || !user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if allowedRoles is provided
  if (allowedRoles?.length) {
    const userRole = user.role?.toLowerCase().replace(/[_\s-]/g, "") ?? "";
    const normalizedAllowed = (
      Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
    ).map((r) => r.toLowerCase().replace(/[_\s-]/g, ""));

    if (!normalizedAllowed.includes(userRole)) {
      return <Navigate to={redirectTo} replace />;
    }
  }

  return children;
}

/**
 * Public Route - Only accessible when NOT authenticated
 * Redirects to dashboard if already logged in
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 *
 * @example
 * <PublicRoute>
 *   <LoginPage />
 * </PublicRoute>
 */
export function PublicRoute({ children }) {
  const { isAuthenticated, user, token } = useAuthStore();
  const location = useLocation();

  if (isAuthenticated && user && token) {
    const from = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

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
 *
 * @example
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

  const userRole = user.role.toLowerCase().replace(/[_\s-]/g, "");
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const normalizedAllowedRoles = roles.map((r) =>
    r.toLowerCase().replace(/[_\s-]/g, ""),
  );

  if (!normalizedAllowedRoles.includes(userRole)) {
    return <Navigate to={redirectTo} replace />;
  }

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
 *
 * @example
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

  const roleHierarchy = {
    teacher: 0,
    admin: 1,
    superadmin: 2,
  };

  const userRole = user.role.toLowerCase().replace(/[_\s-]/g, "");
  const minRole = minimumRole.toLowerCase().replace(/[_\s-]/g, "");

  const userLevel = roleHierarchy[userRole] ?? -1;
  const minLevel = roleHierarchy[minRole] ?? Infinity;

  if (userLevel < minLevel) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

export default ProtectedRoute;
