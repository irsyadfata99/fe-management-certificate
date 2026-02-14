/**
 * Status constants untuk certificates, reservations, dll
 */

// ============================================================================
// CERTIFICATE STATUS
// ============================================================================

export const CERTIFICATE_STATUS = {
  IN_STOCK: "in_stock",
  RESERVED: "reserved",
  PRINTED: "printed",
  MIGRATED: "migrated",
};

/**
 * Status labels (bahasa Indonesia)
 */
export const CERTIFICATE_STATUS_LABELS = {
  [CERTIFICATE_STATUS.IN_STOCK]: "Tersedia",
  [CERTIFICATE_STATUS.RESERVED]: "Direservasi",
  [CERTIFICATE_STATUS.PRINTED]: "Tercetak",
  [CERTIFICATE_STATUS.MIGRATED]: "Dimigrasi",
};

/**
 * Status badge variants (Tailwind classes)
 */
export const CERTIFICATE_STATUS_VARIANTS = {
  [CERTIFICATE_STATUS.IN_STOCK]: "bg-green-100 text-green-800 border-green-200",
  [CERTIFICATE_STATUS.RESERVED]: "bg-yellow-100 text-yellow-800 border-yellow-200",
  [CERTIFICATE_STATUS.PRINTED]: "bg-blue-100 text-blue-800 border-blue-200",
  [CERTIFICATE_STATUS.MIGRATED]: "bg-gray-100 text-gray-800 border-gray-200",
};

/**
 * Get certificate status label
 * @param {string} status - Certificate status
 * @returns {string}
 */
export const getCertificateStatusLabel = (status) => {
  return CERTIFICATE_STATUS_LABELS[status] || status;
};

// ============================================================================
// RESERVATION STATUS
// ============================================================================

export const RESERVATION_STATUS = {
  ACTIVE: "active",
  RELEASED: "released",
  COMPLETED: "completed",
};

export const RESERVATION_STATUS_LABELS = {
  [RESERVATION_STATUS.ACTIVE]: "Aktif",
  [RESERVATION_STATUS.RELEASED]: "Dibatalkan",
  [RESERVATION_STATUS.COMPLETED]: "Selesai",
};

export const RESERVATION_STATUS_VARIANTS = {
  [RESERVATION_STATUS.ACTIVE]: "bg-blue-100 text-blue-800 border-blue-200",
  [RESERVATION_STATUS.RELEASED]: "bg-gray-100 text-gray-800 border-gray-200",
  [RESERVATION_STATUS.COMPLETED]: "bg-green-100 text-green-800 border-green-200",
};

// ============================================================================
// ACTION TYPES (untuk logs)
// ============================================================================

export const ACTION_TYPES = {
  BULK_CREATE: "bulk_create",
  MIGRATE: "migrate",
  RESERVE: "reserve",
  PRINT: "print",
  RELEASE: "release",
};

export const ACTION_TYPE_LABELS = {
  [ACTION_TYPES.BULK_CREATE]: "Bulk Create",
  [ACTION_TYPES.MIGRATE]: "Migrasi",
  [ACTION_TYPES.RESERVE]: "Reservasi",
  [ACTION_TYPES.PRINT]: "Cetak",
  [ACTION_TYPES.RELEASE]: "Release",
};

export const ACTION_TYPE_VARIANTS = {
  [ACTION_TYPES.BULK_CREATE]: "bg-purple-100 text-purple-800",
  [ACTION_TYPES.MIGRATE]: "bg-indigo-100 text-indigo-800",
  [ACTION_TYPES.RESERVE]: "bg-yellow-100 text-yellow-800",
  [ACTION_TYPES.PRINT]: "bg-blue-100 text-blue-800",
  [ACTION_TYPES.RELEASE]: "bg-gray-100 text-gray-800",
};

// ============================================================================
// STOCK ALERT SEVERITY
// ============================================================================

export const STOCK_ALERT_SEVERITY = {
  CRITICAL: "critical", // Out of stock
  HIGH: "high", // <= 5
  MEDIUM: "medium", // <= threshold (default 10)
};

export const STOCK_ALERT_SEVERITY_LABELS = {
  [STOCK_ALERT_SEVERITY.CRITICAL]: "Kritis",
  [STOCK_ALERT_SEVERITY.HIGH]: "Tinggi",
  [STOCK_ALERT_SEVERITY.MEDIUM]: "Sedang",
};

export const STOCK_ALERT_SEVERITY_VARIANTS = {
  [STOCK_ALERT_SEVERITY.CRITICAL]: "bg-red-100 text-red-800 border-red-300",
  [STOCK_ALERT_SEVERITY.HIGH]: "bg-orange-100 text-orange-800 border-orange-300",
  [STOCK_ALERT_SEVERITY.MEDIUM]: "bg-yellow-100 text-yellow-800 border-yellow-300",
};
