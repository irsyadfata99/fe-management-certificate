/**
 * Router Configuration
 * App routes dengan role-based protection
 */

import { createBrowserRouter, Navigate } from "react-router-dom";
import {
  ProtectedRoute,
  PublicRoute,
  SuperAdminRoute,
  AdminRoute,
  TeacherRoute,
} from "@/components/auth/ProtectedRoute";

// Layouts
import AppLayout from "@/components/layout/AppLayout";

// Auth Pages
import LoginPage from "@/pages/auth/LoginPage";

// Dashboard
import DashboardPage from "@/pages/DashboardPage";

// SuperAdmin Pages
import BranchesPage from "@/pages/branches/BranchesPage";

// Admin Pages
import DivisionsPage from "@/pages/divisions/DivisionsPage";
import ModulesPage from "@/pages/modules/ModulesPage";
import TeachersPage from "@/pages/teachers/TeachersPage";
import CertificatesPage from "@/pages/certificates/CertificatesPage";
import CertificateStockPage from "@/pages/certificates/CertificateStockPage";
import CertificateLogsPage from "@/pages/certificates/CertificateLogsPage";
import StudentsPage from "@/pages/students/StudentsPage";
import BackupPage from "@/pages/backup/BackupPage";

// Teacher Pages
import TeacherDashboardPage from "@/pages/teacher/TeacherDashboardPage";
import TeacherCertificatesPage from "@/pages/teacher/TeacherCertificatesPage";
import TeacherPrintsPage from "@/pages/teacher/TeacherPrintsPage";
import TeacherProfilePage from "@/pages/teacher/TeacherProfilePage";

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
  // PROTECTED ROUTES - ALL AUTHENTICATED USERS
  // ==========================================================================
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      // Root redirect to dashboard
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },

      // Dashboard
      {
        path: "dashboard",
        element: <DashboardPage />,
      },

      // =======================================================================
      // SUPERADMIN ONLY ROUTES
      // =======================================================================
      {
        path: "branches",
        element: (
          <SuperAdminRoute>
            <BranchesPage />
          </SuperAdminRoute>
        ),
      },

      // =======================================================================
      // ADMIN ROUTES (SuperAdmin + Admin)
      // =======================================================================
      {
        path: "divisions",
        element: (
          <AdminRoute>
            <DivisionsPage />
          </AdminRoute>
        ),
      },
      {
        path: "modules",
        element: (
          <AdminRoute>
            <ModulesPage />
          </AdminRoute>
        ),
      },
      {
        path: "teachers",
        element: (
          <AdminRoute>
            <TeachersPage />
          </AdminRoute>
        ),
      },
      {
        path: "certificates",
        children: [
          {
            index: true,
            element: (
              <AdminRoute>
                <CertificatesPage />
              </AdminRoute>
            ),
          },
          {
            path: "stock",
            element: (
              <AdminRoute>
                <CertificateStockPage />
              </AdminRoute>
            ),
          },
          {
            path: "logs",
            element: (
              <AdminRoute>
                <CertificateLogsPage />
              </AdminRoute>
            ),
          },
        ],
      },
      {
        path: "students",
        element: (
          <AdminRoute>
            <StudentsPage />
          </AdminRoute>
        ),
      },
      {
        path: "backup",
        element: (
          <AdminRoute>
            <BackupPage />
          </AdminRoute>
        ),
      },

      // =======================================================================
      // TEACHER ROUTES
      // =======================================================================
      {
        path: "teacher",
        children: [
          {
            index: true,
            element: (
              <TeacherRoute>
                <TeacherDashboardPage />
              </TeacherRoute>
            ),
          },
          {
            path: "certificates",
            element: (
              <TeacherRoute>
                <TeacherCertificatesPage />
              </TeacherRoute>
            ),
          },
          {
            path: "prints",
            element: (
              <TeacherRoute>
                <TeacherPrintsPage />
              </TeacherRoute>
            ),
          },
          {
            path: "profile",
            element: (
              <TeacherRoute>
                <TeacherProfilePage />
              </TeacherRoute>
            ),
          },
        ],
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
