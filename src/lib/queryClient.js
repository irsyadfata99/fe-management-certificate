/**
 * React Query Configuration
 * QueryClient setup dengan default options
 */

import { QueryClient } from "@tanstack/react-query";

/**
 * Create QueryClient dengan default options
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry
      retry: 1, // Retry 1 kali jika gagal
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch
      refetchOnWindowFocus: false, // Jangan auto refetch saat window focus
      refetchOnReconnect: true, // Refetch saat internet reconnect
      refetchOnMount: true, // Refetch saat component mount

      // Stale & Cache
      staleTime: 30 * 1000, // Data dianggap stale setelah 30 detik
      gcTime: 5 * 60 * 1000, // Cache garbage collection setelah 5 menit (formerly cacheTime)

      // Error handling
      useErrorBoundary: false, // Jangan throw error ke boundary
    },
    mutations: {
      // Retry
      retry: 0, // Jangan retry mutations

      // Error handling
      useErrorBoundary: false,
    },
  },
});

/**
 * Query keys factory untuk consistency
 */
export const queryKeys = {
  // Auth
  auth: {
    me: ["auth", "me"],
  },

  // Branches
  branches: {
    all: (params = {}) => ["branches", params],
    heads: ["branches", "heads"],
    byId: (id) => ["branches", id],
  },

  // Divisions
  divisions: {
    all: (params = {}) => ["divisions", params],
    byId: (id) => ["divisions", id],
  },

  // Modules
  modules: {
    all: (params = {}) => ["modules", params],
    byId: (id) => ["modules", id],
  },

  // Teachers
  teachers: {
    all: (params = {}) => ["teachers", params],
    byId: (id) => ["teachers", id],
    profile: ["teacher", "profile"],
    branches: ["teacher", "branches"],
    divisions: ["teacher", "divisions"],
    modules: ["teacher", "modules"],
  },

  // Certificates
  certificates: {
    all: (params = {}) => ["certificates", params],
    stock: ["certificates", "stock"],
    alerts: (params = {}) => ["certificates", "alerts", params],
    statistics: (params = {}) => ["certificates", "statistics", params],
    logs: (params = {}) => ["certificates", "logs", params],
    migrations: (params = {}) => ["certificates", "migrations", params],

    // Teacher specific
    availability: ["certificates", "availability"],
    myReservations: ["certificates", "my-reservations"],
    myPrints: (params = {}) => ["certificates", "my-prints", params],
  },

  // Certificate PDFs
  certificatePdfs: {
    all: (params = {}) => ["certificate-pdfs", params],
  },

  // Students
  students: {
    all: (params = {}) => ["students", params],
    byId: (id) => ["students", id],
    history: (id, params = {}) => ["students", id, "history", params],
    statistics: (params = {}) => ["students", "statistics", params],
    search: (query) => ["students", "search", query],
  },

  // Backups
  backups: {
    all: ["backups"],
  },
};

export default queryClient;
