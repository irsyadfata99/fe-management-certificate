import { format, formatDistanceToNow, parseISO, isValid } from "date-fns";
import { id } from "date-fns/locale";

/**
 * Date formatting utilities dengan locale Indonesia
 * Semua function sudah handle null/invalid dates
 */

/**
 * Safe date parser
 * @param {string|Date} date
 * @returns {Date|null}
 */
const parseDate = (date) => {
  if (!date) return null;

  try {
    if (date instanceof Date) {
      return isValid(date) ? date : null;
    }

    const parsed = typeof date === "string" ? parseISO(date) : new Date(date);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

/**
 * Format date ke DD/MM/YYYY
 * @param {string|Date} date
 * @param {string} [fallback='-'] - Fallback jika date invalid
 * @returns {string}
 *
 * @example
 * formatDate('2024-01-15') // "15/01/2024"
 * formatDate(new Date()) // "14/02/2026"
 * formatDate(null) // "-"
 * formatDate(null, 'N/A') // "N/A"
 */
export const formatDate = (date, fallback = "-") => {
  const parsed = parseDate(date);
  if (!parsed) return fallback;

  try {
    return format(parsed, "dd/MM/yyyy", { locale: id });
  } catch {
    return fallback;
  }
};

/**
 * Format datetime ke DD/MM/YYYY HH:mm
 * @param {string|Date} date
 * @param {string} [fallback='-'] - Fallback jika date invalid
 * @returns {string}
 *
 * @example
 * formatDateTime('2024-01-15T14:30:00') // "15/01/2024 14:30"
 * formatDateTime(new Date()) // "14/02/2026 10:15"
 */
export const formatDateTime = (date, fallback = "-") => {
  const parsed = parseDate(date);
  if (!parsed) return fallback;

  try {
    return format(parsed, "dd/MM/yyyy HH:mm", { locale: id });
  } catch {
    return fallback;
  }
};

/**
 * Format datetime dengan detik (DD/MM/YYYY HH:mm:ss)
 * @param {string|Date} date
 * @param {string} [fallback='-']
 * @returns {string}
 *
 * @example
 * formatDateTimeFull('2024-01-15T14:30:45') // "15/01/2024 14:30:45"
 */
export const formatDateTimeFull = (date, fallback = "-") => {
  const parsed = parseDate(date);
  if (!parsed) return fallback;

  try {
    return format(parsed, "dd/MM/yyyy HH:mm:ss", { locale: id });
  } catch {
    return fallback;
  }
};

/**
 * Format relative time (e.g., "2 jam yang lalu")
 * @param {string|Date} date
 * @param {string} [fallback='-']
 * @returns {string}
 *
 * @example
 * formatRelative('2024-02-14T08:00:00') // "2 jam yang lalu"
 * formatRelative('2024-02-13T10:00:00') // "1 hari yang lalu"
 */
export const formatRelative = (date, fallback = "-") => {
  const parsed = parseDate(date);
  if (!parsed) return fallback;

  try {
    return formatDistanceToNow(parsed, {
      addSuffix: true,
      locale: id,
    });
  } catch {
    return fallback;
  }
};

/**
 * Format date untuk input[type="date"] (YYYY-MM-DD)
 * @param {string|Date} date
 * @returns {string}
 *
 * @example
 * formatDateInput(new Date('2024-01-15')) // "2024-01-15"
 */
export const formatDateInput = (date) => {
  const parsed = parseDate(date);
  if (!parsed) return "";

  try {
    return format(parsed, "yyyy-MM-dd");
  } catch {
    return "";
  }
};

/**
 * Format tanggal Indonesia (15 Januari 2024)
 * @param {string|Date} date
 * @param {string} [fallback='-']
 * @returns {string}
 *
 * @example
 * formatDateID('2024-01-15') // "15 Januari 2024"
 */
export const formatDateID = (date, fallback = "-") => {
  const parsed = parseDate(date);
  if (!parsed) return fallback;

  try {
    return format(parsed, "dd MMMM yyyy", { locale: id });
  } catch {
    return fallback;
  }
};

/**
 * Format tanggal Indonesia pendek (15 Jan 2024)
 * @param {string|Date} date
 * @param {string} [fallback='-']
 * @returns {string}
 *
 * @example
 * formatDateIDShort('2024-01-15') // "15 Jan 2024"
 */
export const formatDateIDShort = (date, fallback = "-") => {
  const parsed = parseDate(date);
  if (!parsed) return fallback;

  try {
    return format(parsed, "dd MMM yyyy", { locale: id });
  } catch {
    return fallback;
  }
};

/**
 * Format waktu saja (HH:mm)
 * @param {string|Date} date
 * @param {string} [fallback='-']
 * @returns {string}
 *
 * @example
 * formatTime('2024-01-15T14:30:00') // "14:30"
 */
export const formatTime = (date, fallback = "-") => {
  const parsed = parseDate(date);
  if (!parsed) return fallback;

  try {
    return format(parsed, "HH:mm", { locale: id });
  } catch {
    return fallback;
  }
};

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string}
 *
 * @example
 * getTodayDateInput() // "2026-02-14"
 */
export const getTodayDateInput = () => {
  return formatDateInput(new Date());
};

/**
 * Check if date is today
 * @param {string|Date} date
 * @returns {boolean}
 *
 * @example
 * isToday(new Date()) // true
 * isToday('2024-01-15') // false
 */
export const isToday = (date) => {
  const parsed = parseDate(date);
  if (!parsed) return false;

  const today = new Date();
  return parsed.getDate() === today.getDate() && parsed.getMonth() === today.getMonth() && parsed.getFullYear() === today.getFullYear();
};

/**
 * Calculate days difference from now
 * @param {string|Date} date
 * @returns {number|null} Positive = future, Negative = past
 *
 * @example
 * daysDifference('2026-02-15') // 1 (tomorrow)
 * daysDifference('2026-02-13') // -1 (yesterday)
 */
export const daysDifference = (date) => {
  const parsed = parseDate(date);
  if (!parsed) return null;

  const now = new Date();
  const diffTime = parsed.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Format duration in hours
 * @param {number} hours - Duration in hours
 * @returns {string}
 *
 * @example
 * formatDuration(24) // "24 jam"
 * formatDuration(1.5) // "1.5 jam"
 * formatDuration(0.5) // "30 menit"
 */
export const formatDuration = (hours) => {
  if (!hours || hours <= 0) return "-";

  if (hours >= 1) {
    return `${hours} jam`;
  }

  const minutes = Math.round(hours * 60);
  return `${minutes} menit`;
};
