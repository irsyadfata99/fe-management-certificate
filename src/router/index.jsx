/**
 * Router Configuration
 * App routes dengan role-based protection
 * UPDATED: Added BranchesPage, TeachersPage, CertificatesPage
 */

import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "@/components/auth/ProtectedRoute";

// Layouts
import { Layout } from "@/components/layout/Layout";

// Auth Pages
import LoginPage from "@/pages/auth/LoginPage";

// Dashboard
import DashboardPage from "@/pages/DashboardPage";

// SuperAdmin Pages
import BranchesPage from "@/pages/branches/BranchesPage";

// Admin Pages
import TeachersPage from "@/pages/teachers/TeachersPage";
import CertificatesPage from "@/pages/certificates/CertificatesPage";

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
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
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

      // ======================================================================
      // SUPERADMIN ONLY ROUTES
      // ======================================================================
      {
        path: "branches",
        element: (
          <ProtectedRoute allowedRoles={["superadmin"]}>
            <BranchesPage />
          </ProtectedRoute>
        ),
      },

      // ======================================================================
      // ADMIN ONLY ROUTES
      // ======================================================================
      {
        path: "teachers",
        element: (
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <TeachersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "certificates",
        element: (
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <CertificatesPage />
          </ProtectedRoute>
        ),
      },

      // Alternative route for certificates (matching sidebar config)
      {
        path: "certificates/stock",
        element: (
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <CertificatesPage />
          </ProtectedRoute>
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
