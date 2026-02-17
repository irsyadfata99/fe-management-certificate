/**
 * Router Configuration
 * App routes dengan role-based protection
 * UPDATED: Added Teacher routes matched to sidebarConfig paths
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
import CertificateLogsPage from "@/pages/certificates/CertificateLogsPage";

// Division pages
import DivisionsPage from "@/pages/divisions/DivisionsPage";

// Modules pages
import ModulesPage from "@/pages/modules/ModulesPage";

// Backup pages
import BackupPage from "@/pages/backup/BackupPage";

// Showcase (Development)
import ComponentShowcasePage from "@/pages/showcase/ComponentShowcasePage";

// Error Pages
import NotFoundPage from "@/pages/errors/NotFoundPage";
import UnauthorizedPage from "@/pages/errors/UnauthorizedPage";

// Teacher Pages — paths matched to sidebarConfig:
//   /certificates/print        → TeacherPrintsPage
//   /certificates/reservations → MyReservation
//   /certificates/history      → MyHistory (file: PrintHistory.jsx)
//   /students                  → StudentsPage
import TeacherPrintsPage from "@/pages/teacher/TeacherPrintsPage";
import MyReservation from "@/pages/teacher/MyReservation";
import MyHistory from "@/pages/teacher/PrintHistory";
import StudentsPage from "@/pages/teacher/StudentsPage";

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
      // ADMIN + SUPERADMIN ROUTES
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

      {
        path: "certificates/stock",
        element: (
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <CertificateStockPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "certificates/logs",
        element: (
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <CertificateLogsPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "divisions",
        element: (
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <DivisionsPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "modules",
        element: (
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <ModulesPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "backup",
        element: (
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <BackupPage />
          </ProtectedRoute>
        ),
      },

      // ======================================================================
      // TEACHER ONLY ROUTES
      // Paths harus cocok persis dengan sidebarConfig.jsx:
      //   /certificates/print        → Print Certificate
      //   /certificates/reservations → My Reservations
      //   /certificates/history      → Print History
      //   /students                  → Students
      // ======================================================================
      {
        path: "certificates/print",
        element: (
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherPrintsPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "certificates/reservations",
        element: (
          <ProtectedRoute allowedRoles={["teacher"]}>
            <MyReservation />
          </ProtectedRoute>
        ),
      },

      {
        path: "certificates/history",
        element: (
          <ProtectedRoute allowedRoles={["teacher"]}>
            <MyHistory />
          </ProtectedRoute>
        ),
      },

      {
        path: "students",
        element: (
          <ProtectedRoute allowedRoles={["teacher"]}>
            <StudentsPage />
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
