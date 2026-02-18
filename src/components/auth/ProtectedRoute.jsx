import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/unauthorized",
}) {
  const { isAuthenticated, user, token } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

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

export function PublicRoute({ children }) {
  const { isAuthenticated, user, token } = useAuthStore();
  const location = useLocation();

  if (isAuthenticated && user && token) {
    const from = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  return children;
}

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
