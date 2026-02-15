/**
 * Protected Route Component - DEBUGGING VERSION
 * Handles authentication and role-based authorization
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { hasRole } from "@/utils/constants/roles";
import { useEffect, useRef } from "react";

/**
 * Protected Route Wrapper
 */
export const ProtectedRoute = ({
  children,
  allowedRoles = null,
  redirectTo = "/login",
}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  // Debug counter to detect infinite loops
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    console.log(`[ProtectedRoute] Render #${renderCount.current}`, {
      path: location.pathname,
      isAuthenticated,
      hasUser: !!user,
      userRole: user?.role,
      allowedRoles,
    });

    // Alert if too many renders
    if (renderCount.current > 10) {
      console.error("⛔ INFINITE LOOP DETECTED in ProtectedRoute");
    }
  });

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    console.log("[ProtectedRoute] Not authenticated, redirecting to login");
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Authenticated but no user data
  if (!user) {
    console.log(
      "[ProtectedRoute] Authenticated but no user, redirecting to login",
    );
    return <Navigate to={redirectTo} replace />;
  }

  // Check role authorization if allowedRoles specified
  if (allowedRoles) {
    const authorized = hasRole(user, allowedRoles);

    console.log("[ProtectedRoute] Checking authorization", {
      userRole: user.role,
      allowedRoles,
      authorized,
    });

    if (!authorized) {
      console.log(
        "[ProtectedRoute] Not authorized, redirecting to /unauthorized",
      );
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Authorized - render children
  console.log("[ProtectedRoute] ✅ Authorized, rendering children");
  return children;
};

/**
 * Public Route Wrapper
 */
export const PublicRoute = ({ children, redirectTo = "/dashboard" }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    console.log(`[PublicRoute] Render #${renderCount.current}`, {
      isAuthenticated,
    });

    if (renderCount.current > 10) {
      console.error("⛔ INFINITE LOOP DETECTED in PublicRoute");
    }
  });

  if (isAuthenticated) {
    console.log(
      "[PublicRoute] Already authenticated, redirecting to",
      redirectTo,
    );
    return <Navigate to={redirectTo} replace />;
  }

  console.log("[PublicRoute] Not authenticated, rendering login");
  return children;
};

/**
 * Role-based Route Wrappers
 */

export const SuperAdminRoute = ({ children }) => {
  console.log("[SuperAdminRoute] Rendering");
  return <ProtectedRoute allowedRoles="superAdmin">{children}</ProtectedRoute>;
};

export const AdminRoute = ({ children }) => {
  console.log("[AdminRoute] Rendering");
  return (
    <ProtectedRoute allowedRoles={["superAdmin", "admin"]}>
      {children}
    </ProtectedRoute>
  );
};

export const TeacherRoute = ({ children }) => {
  console.log("[TeacherRoute] Rendering");
  return <ProtectedRoute allowedRoles="teacher">{children}</ProtectedRoute>;
};

export default ProtectedRoute;
