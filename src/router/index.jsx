/**
 * Router Configuration
 * App routes dengan role-based protection
 * ✅ FIXED: Using RoleGuard instead of ProtectedRoute for role-specific routes
 */

import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute, RoleGuard } from "@/components/auth/ProtectedRoute";

// Layouts
import { Layout } from "@/components/layout/Layout";

// Auth Pages
import LoginPage from "@/pages/auth/LoginPage";
import ProfilePage from "@/pages/auth/ProfilePage";

// Dashboard
import DashboardPage from "@/pages/DashboardPage";

// SuperAdmin Pages
import BranchesPage from "@/pages/branches/BranchesPage";

// Admin Pages
import TeachersPage from "@/pages/teachers/TeachersPage";
import CertificatesPage from "@/pages/certificates/CertificatesPage";
import CertificateStockPage from "@/pages/certificates/CertificateStockPage";

// Showcase (Development)
import ComponentShowcasePage from "@/pages/showcase/ComponentShowcasePage";

// Error Pages
import NotFoundPage from "@/pages/errors/NotFoundPage";
import UnauthorizedPage from "@/pages/errors/UnauthorizedPage";

/**
 * Router Configuration
 */
export const router = createBrowserRouter([
  // ==========================================================================
  // PUBLIC ROUTES
  // ==========================================================================
  {
    path: "/login",
    element: <LoginPage />,
  },

  // ==========================================================================
  // SHOWCASE (DEVELOPMENT)
  // ==========================================================================
  {
    path: "/showcase",
    element: <ComponentShowcasePage />,
  },

  // ==========================================================================
  // PROTECTED ROUTES - ALL AUTHENTICATED USERS
  // ==========================================================================
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      // Root redirect to dashboard
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },

      // Dashboard (All Roles)
      {
        path: "dashboard",
        element: <DashboardPage />,
      },

      // Profile (All Roles)
      {
        path: "profile",
        element: <ProfilePage />,
      },

      // ======================================================================
      // SUPERADMIN ONLY ROUTES
      // ======================================================================
      {
        path: "branches",
        element: (
          <RoleGuard allowedRoles={["superadmin"]}>
            <BranchesPage />
          </RoleGuard>
        ),
      },

      // ======================================================================
      // ADMIN ONLY ROUTES (Admin + SuperAdmin)
      // ✅ FIXED: Using RoleGuard instead of ProtectedRoute
      // ======================================================================
      {
        path: "teachers",
        element: (
          <RoleGuard allowedRoles={["admin", "superadmin"]}>
            <TeachersPage />
          </RoleGuard>
        ),
      },

      // Certificate Management (CRUD operations)
      {
        path: "certificates",
        element: (
          <RoleGuard allowedRoles={["admin", "superadmin"]}>
            <CertificatesPage />
          </RoleGuard>
        ),
      },

      // Certificate Stock Monitoring (Dashboard)
      {
        path: "certificates/stock",
        element: (
          <RoleGuard allowedRoles={["admin", "superadmin"]}>
            <CertificateStockPage />
          </RoleGuard>
        ),
      },
    ],
  },

  // ==========================================================================
  // ERROR ROUTES
  // ==========================================================================
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
