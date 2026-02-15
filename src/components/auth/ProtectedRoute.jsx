/**
 * Protected Route Component
 * Handles authentication and role-based authorization
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { hasRole } from "@/utils/constants/roles";

/**
 * Protected Route Wrapper
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {string|string[]} [props.allowedRoles] - Allowed roles (optional)
 * @param {string} [props.redirectTo="/login"] - Redirect path if not authenticated
 *
 * @example
 * // Allow all authenticated users
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 *
 * @example
 * // Only SuperAdmin
 * <ProtectedRoute allowedRoles="superAdmin">
 *   <BranchManagement />
 * </ProtectedRoute>
 *
 * @example
 * // SuperAdmin or Admin
 * <ProtectedRoute allowedRoles={['superAdmin', 'admin']}>
 *   <TeacherManagement />
 * </ProtectedRoute>
 */
export const ProtectedRoute = ({
  children,
  allowedRoles = null,
  redirectTo = "/login",
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Authenticated but no user data (shouldn't happen, but safety check)
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role authorization if allowedRoles specified
  if (allowedRoles) {
    const authorized = hasRole(user, allowedRoles);

    if (!authorized) {
      // Unauthorized - redirect to unauthorized page
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Authorized - render children
  return children;
};

/**
 * Public Route Wrapper
 * Redirects to dashboard if already authenticated
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} [props.redirectTo="/dashboard"] - Redirect path if authenticated
 *
 * @example
 * <PublicRoute>
 *   <LoginPage />
 * </PublicRoute>
 */
export const PublicRoute = ({ children, redirectTo = "/dashboard" }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

/**
 * Role-based Route Wrapper
 * Shorthand untuk ProtectedRoute dengan specific roles
 */

/**
 * SuperAdmin Only Route
 */
export const SuperAdminRoute = ({ children }) => {
  return <ProtectedRoute allowedRoles="superAdmin">{children}</ProtectedRoute>;
};

/**
 * Admin Route (SuperAdmin + Admin)
 */
export const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={["superAdmin", "admin"]}>
      {children}
    </ProtectedRoute>
  );
};

/**
 * Teacher Route
 */
export const TeacherRoute = ({ children }) => {
  return <ProtectedRoute allowedRoles="teacher">{children}</ProtectedRoute>;
};

export default ProtectedRoute;
