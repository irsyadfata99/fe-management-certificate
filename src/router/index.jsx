/**
 * Router Configuration
 * App routes dengan role-based protection
 * UPDATED: Added CertificateStockPage
 */

import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "@/components/auth/ProtectedRoute";

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

      // Certificate Management (CRUD operations)
      {
        path: "certificates",
        element: (
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <CertificatesPage />
          </ProtectedRoute>
        ),
      },

      // Certificate Stock Monitoring (Dashboard)
      {
        path: "certificates/stock",
        element: (
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <CertificateStockPage />
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
