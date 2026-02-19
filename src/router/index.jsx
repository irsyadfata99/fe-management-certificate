import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "@/components/auth/ProtectedRoute";

import { Layout } from "@/components/layout/Layout";

import LoginPage from "@/pages/auth/LoginPage";
import ProfilePage from "@/pages/auth/ProfilePage";

import DashboardPage from "@/pages/DashboardPage";

import BranchesPage from "@/pages/branches/BranchesPage";

import TeachersPage from "@/pages/teachers/TeachersPage";
import CertificatesPage from "@/pages/certificates/CertificatesPage";
import CertificateStockPage from "@/pages/certificates/CertificateStockPage";
import CertificateLogsPage from "@/pages/certificates/CertificateLogsPage";

import DivisionsPage from "@/pages/divisions/DivisionsPage";

import ModulesPage from "@/pages/modules/ModulesPage";

import BackupPage from "@/pages/backup/BackupPage";

import ComponentShowcasePage from "@/pages/showcase/ComponentShowcasePage";

import NotFoundPage from "@/pages/errors/NotFoundPage";
import UnauthorizedPage from "@/pages/errors/UnauthorizedPage";

import TeacherPrintsPage from "@/pages/teacher/TeacherPrintsPage";
import MyReservation from "@/pages/teacher/MyReservation";
import StudentsPage from "@/pages/teacher/StudentsPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },

  {
    path: "/showcase",
    element: <ComponentShowcasePage />,
  },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },

      {
        path: "dashboard",
        element: <DashboardPage />,
      },

      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "branches",
        element: (
          <ProtectedRoute allowedRoles={["superadmin"]}>
            <BranchesPage />
          </ProtectedRoute>
        ),
      },
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
        path: "students",
        element: (
          <ProtectedRoute allowedRoles={["teacher"]}>
            <StudentsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
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
