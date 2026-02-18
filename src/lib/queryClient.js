import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,

      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,

      useErrorBoundary: false,
    },
    mutations: {
      retry: 0,

      useErrorBoundary: false,
    },
  },
});

export const queryKeys = {
  auth: {
    me: ["auth", "me"],
  },

  branches: {
    all: (params = {}) => ["branches", params],
    heads: ["branches", "heads"],
    byId: (id) => ["branches", id],
  },

  divisions: {
    all: (params = {}) => ["divisions", params],
    byId: (id) => ["divisions", id],
  },

  modules: {
    all: (params = {}) => ["modules", params],
    byId: (id) => ["modules", id],
  },

  teachers: {
    all: (params = {}) => ["teachers", params],
    byId: (id) => ["teachers", id],
    profile: ["teacher", "profile"],
    branches: ["teacher", "branches"],
    divisions: ["teacher", "divisions"],
    modules: ["teacher", "modules"],
  },

  certificates: {
    all: (params = {}) => ["certificates", params],
    stock: ["certificates", "stock"],
    alerts: (params = {}) => ["certificates", "alerts", params],
    statistics: (params = {}) => ["certificates", "statistics", params],
    logs: (params = {}) => ["certificates", "logs", params],
    migrations: (params = {}) => ["certificates", "migrations", params],

    availability: ["certificates", "availability"],
    myReservations: ["certificates", "my-reservations"],
    myPrints: (params = {}) => ["certificates", "my-prints", params],
  },

  certificatePdfs: {
    all: (params = {}) => ["certificate-pdfs", params],
  },

  students: {
    all: (params = {}) => ["students", params],
    byId: (id) => ["students", id],
    history: (id, params = {}) => ["students", id, "history", params],
    statistics: (params = {}) => ["students", "statistics", params],
    search: (query) => ["students", "search", query],
  },

  backups: {
    all: ["backups"],
  },
};

export default queryClient;
