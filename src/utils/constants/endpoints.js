/**
 * API Endpoints
 * Semua endpoint backend - sync dengan src/routes di backend
 * Format: relative path tanpa base URL
 */

export const API_ENDPOINTS = {
  // ============================================================================
  // AUTH
  // ============================================================================
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REFRESH: "/auth/refresh",
    // FIX: backend menggunakan PATCH, bukan POST (lihat authRoutes.js)
    CHANGE_PASSWORD: "/auth/change-password",
    CHANGE_USERNAME: "/auth/change-username",
  },

  // ============================================================================
  // BRANCHES (SuperAdmin only)
  // ============================================================================
  BRANCHES: {
    /**
     * GET /branches
     * Query params: ?includeInactive=true
     */
    GET_ALL: "/branches",

    /**
     * GET /branches/heads
     * Get head branches only (for dropdowns)
     */
    GET_HEADS: "/branches/heads",

    /**
     * GET /branches/:id
     */
    GET_BY_ID: (id) => `/branches/${id}`,

    /**
     * POST /branches
     * Body: { code, name, is_head_branch, parent_id?, admin_username? }
     */
    CREATE: "/branches",

    /**
     * PUT /branches/:id
     * Body: { code?, name?, parent_id? }
     */
    UPDATE: (id) => `/branches/${id}`,

    /**
     * DELETE /branches/:id
     */
    DELETE: (id) => `/branches/${id}`,

    /**
     * PATCH /branches/:id/toggle-active
     */
    TOGGLE_ACTIVE: (id) => `/branches/${id}/toggle-active`,

    /**
     * PATCH /branches/:id/toggle-head
     * Body: { is_head_branch, parent_id?, admin_username? }
     */
    TOGGLE_HEAD: (id) => `/branches/${id}/toggle-head`,

    /**
     * POST /branches/:id/reset-admin-password
     */
    RESET_ADMIN_PASSWORD: (id) => `/branches/${id}/reset-admin-password`,
  },

  // ============================================================================
  // DIVISIONS (Admin)
  // ============================================================================
  DIVISIONS: {
    /**
     * GET /divisions
     * Query params: ?includeInactive=true
     */
    GET_ALL: "/divisions",

    /**
     * GET /divisions/:id
     */
    GET_BY_ID: (id) => `/divisions/${id}`,

    /**
     * POST /divisions
     * Body: { name, sub_divisions?: [{ name, age_min, age_max }] }
     */
    CREATE: "/divisions",

    /**
     * PUT /divisions/:id
     * Body: { name }
     */
    UPDATE: (id) => `/divisions/${id}`,

    /**
     * PATCH /divisions/:id/toggle-active
     */
    TOGGLE_ACTIVE: (id) => `/divisions/${id}/toggle-active`,

    /**
     * DELETE /divisions/:id
     */
    DELETE: (id) => `/divisions/${id}`,

    // Sub Divisions
    /**
     * POST /divisions/:id/sub-divisions
     * Body: { name, age_min, age_max }
     */
    CREATE_SUB: (divisionId) => `/divisions/${divisionId}/sub-divisions`,

    /**
     * PUT /divisions/sub-divisions/:subId
     * Body: { name?, age_min?, age_max? }
     */
    UPDATE_SUB: (subId) => `/divisions/sub-divisions/${subId}`,

    /**
     * PATCH /divisions/sub-divisions/:subId/toggle-active
     */
    TOGGLE_SUB_ACTIVE: (subId) =>
      `/divisions/sub-divisions/${subId}/toggle-active`,

    /**
     * DELETE /divisions/sub-divisions/:subId
     */
    DELETE_SUB: (subId) => `/divisions/sub-divisions/${subId}`,
  },

  // ============================================================================
  // MODULES (Admin)
  // ============================================================================
  MODULES: {
    /**
     * GET /modules
     * Query params: ?includeInactive=true
     */
    GET_ALL: "/modules",

    /**
     * GET /modules/:id
     */
    GET_BY_ID: (id) => `/modules/${id}`,

    /**
     * POST /modules
     * Body: { module_code, name, division_id, sub_div_id? }
     */
    CREATE: "/modules",

    /**
     * PUT /modules/:id
     * Body: { module_code?, name?, division_id?, sub_div_id? }
     */
    UPDATE: (id) => `/modules/${id}`,

    /**
     * PATCH /modules/:id/toggle-active
     */
    TOGGLE_ACTIVE: (id) => `/modules/${id}/toggle-active`,

    /**
     * DELETE /modules/:id
     */
    DELETE: (id) => `/modules/${id}`,
  },

  // ============================================================================
  // TEACHERS (Admin)
  // ============================================================================
  TEACHERS: {
    /**
     * GET /teachers
     * Query params: ?includeInactive=true
     */
    GET_ALL: "/teachers",

    /**
     * GET /teachers/:id
     */
    GET_BY_ID: (id) => `/teachers/${id}`,

    /**
     * POST /teachers
     * Body: { username, full_name, branch_ids: [], division_ids: [] }
     */
    CREATE: "/teachers",

    /**
     * PUT /teachers/:id
     * Body: { username?, full_name?, branch_ids?, division_ids? }
     */
    UPDATE: (id) => `/teachers/${id}`,

    /**
     * POST /teachers/:id/reset-password
     */
    RESET_PASSWORD: (id) => `/teachers/${id}/reset-password`,

    /**
     * PATCH /teachers/:id/toggle-active
     */
    TOGGLE_ACTIVE: (id) => `/teachers/${id}/toggle-active`,

    // Teacher Profile (Teacher own access)
    // Semua di-mount di /teachers/profile/* via teacherProfileRoutes
    PROFILE: {
      /**
       * GET /teachers/profile/me
       */
      GET_ME: "/teachers/profile/me",

      /**
       * PATCH /teachers/profile/me
       * Body: { full_name }
       * FIX: backend menggunakan PATCH, bukan PUT
       */
      UPDATE_ME: "/teachers/profile/me",

      /**
       * GET /teachers/profile/branches
       */
      GET_BRANCHES: "/teachers/profile/branches",

      /**
       * GET /teachers/profile/divisions
       */
      GET_DIVISIONS: "/teachers/profile/divisions",

      /**
       * GET /teachers/profile/modules
       */
      GET_MODULES: "/teachers/profile/modules",
    },
  },

  // ============================================================================
  // CERTIFICATES - ADMIN
  // ============================================================================
  CERTIFICATES: {
    /**
     * POST /certificates/bulk-create
     * Body: { startNumber, endNumber }
     */
    BULK_CREATE: "/certificates/bulk-create",

    /**
     * GET /certificates
     * Query params: ?status=in_stock&currentBranchId=1&page=1&limit=20
     */
    GET_ALL: "/certificates",

    /**
     * GET /certificates/stock
     * Stock summary untuk semua branches
     */
    GET_STOCK: "/certificates/stock",

    /**
     * GET /certificates/stock-alerts
     * Query params: ?threshold=10
     */
    GET_STOCK_ALERTS: "/certificates/stock-alerts",

    /**
     * POST /certificates/migrate
     * Body: { startNumber, endNumber, toBranchId }
     * NOTE: startNumber & endNumber harus format "No. 000000"
     */
    MIGRATE: "/certificates/migrate",

    /**
     * GET /certificates/statistics
     * Query params: ?startDate=2024-01-01&endDate=2024-12-31
     */
    GET_STATISTICS: "/certificates/statistics",

    /**
     * GET /certificates/migrations
     * Query params: ?startDate&endDate&fromBranchId&toBranchId&page&limit
     */
    GET_MIGRATIONS: "/certificates/migrations",

    // Logs
    /**
     * GET /certificates/logs
     * Query params: ?actionType&actorId&startDate&endDate&certificateNumber&page&limit
     */
    GET_LOGS: "/certificates/logs",

    /**
     * GET /certificates/logs/export
     * Download Excel - Query params sama dengan GET_LOGS
     */
    EXPORT_LOGS: "/certificates/logs/export",
  },

  // ============================================================================
  // CERTIFICATES - TEACHER
  // ============================================================================
  CERTIFICATES_TEACHER: {
    /**
     * GET /certificates/available
     * Cek ketersediaan sertifikat di branch teacher
     */
    GET_AVAILABLE: "/certificates/available",

    /**
     * POST /certificates/reserve
     * Body: { branchId }
     */
    RESERVE: "/certificates/reserve",

    /**
     * POST /certificates/print
     * Body: { certificateId, studentName, moduleId, ptcDate }
     */
    PRINT: "/certificates/print",

    /**
     * POST /certificates/:id/release
     * Batalkan reservasi manual
     */
    RELEASE: (id) => `/certificates/${id}/release`,

    /**
     * GET /certificates/my-reservations
     * Reservasi aktif milik teacher
     */
    GET_MY_RESERVATIONS: "/certificates/my-reservations",

    /**
     * GET /certificates/my-prints
     * Query params: ?startDate&endDate&moduleId&page&limit
     */
    GET_MY_PRINTS: "/certificates/my-prints",
  },

  // ============================================================================
  // CERTIFICATE PDF (Teacher upload, Admin download)
  // ============================================================================
  CERTIFICATE_PDF: {
    /**
     * POST /certificates/prints/:printId/pdf
     * Upload PDF - FormData dengan field name "pdf"
     */
    UPLOAD: (printId) => `/certificates/prints/${printId}/pdf`,

    /**
     * GET /certificates/prints/:printId/pdf
     * Download PDF - returns blob
     */
    DOWNLOAD: (printId) => `/certificates/prints/${printId}/pdf`,

    /**
     * DELETE /certificates/prints/:printId/pdf
     */
    DELETE: (printId) => `/certificates/prints/${printId}/pdf`,

    /**
     * GET /certificates/prints/pdfs
     * List semua PDF (Admin only)
     * Query params: ?page&limit&teacherId
     */
    LIST: "/certificates/prints/pdfs",
  },

  // ============================================================================
  // STUDENTS
  // ============================================================================
  STUDENTS: {
    /**
     * GET /students/search
     * Query params: ?name=xxx (min 2 chars)
     */
    SEARCH: "/students/search",

    /**
     * GET /students
     * Query params: ?search&page&limit&includeInactive
     */
    GET_ALL: "/students",

    /**
     * GET /students/:id
     */
    GET_BY_ID: (id) => `/students/${id}`,

    /**
     * GET /students/:id/history
     * Query params: ?startDate&endDate&page&limit
     */
    GET_HISTORY: (id) => `/students/${id}/history`,

    /**
     * GET /students/statistics
     * Query params: ?startDate&endDate&moduleId
     */
    GET_STATISTICS: "/students/statistics",

    /**
     * PUT /students/:id
     * Body: { name }
     */
    UPDATE: (id) => `/students/${id}`,

    /**
     * PATCH /students/:id/toggle-active
     */
    TOGGLE_ACTIVE: (id) => `/students/${id}/toggle-active`,
  },

  // ============================================================================
  // BACKUP (Admin - Head Branch only)
  // ============================================================================
  BACKUP: {
    /**
     * POST /backup/create
     * Body: { description? }
     */
    CREATE: "/backup/create",

    /**
     * GET /backup/list
     */
    LIST: "/backup/list",

    /**
     * POST /backup/restore
     * Body: { backupId, confirmPassword }
     */
    RESTORE: "/backup/restore",

    /**
     * DELETE /backup/:id
     */
    DELETE: (id) => `/backup/${id}`,

    /**
     * GET /backup/download/:id
     * Download backup file - returns blob
     */
    DOWNLOAD: (id) => `/backup/download/${id}`,
  },

  // ============================================================================
  // HEALTH CHECK
  // ============================================================================
  HEALTH: "/health",
};
