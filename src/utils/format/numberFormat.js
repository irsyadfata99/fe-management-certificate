/**
 * Number formatting utilities dengan locale Indonesia
 */

/**
 * Format number dengan thousand separator
 * @param {number} num - Number to format
 * @param {number} [decimals=0] - Decimal places
 * @returns {string}
 *
 * @example
 * formatNumber(1234567) // "1.234.567"
 * formatNumber(1234.56, 2) // "1.234,56"
 * formatNumber(null) // "-"
 */
export const formatNumber = (num, decimals = 0) => {
  if (num == null || isNaN(num)) return "-";

  try {
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  } catch {
    return String(num);
  }
};

/**
 * Format currency (Rupiah)
 * @param {number} amount - Amount in rupiah
 * @param {boolean} [showSymbol=true] - Show Rp symbol
 * @returns {string}
 *
 * @example
 * formatCurrency(1234567) // "Rp 1.234.567"
 * formatCurrency(1234567.89) // "Rp 1.234.568" (rounded)
 * formatCurrency(1234567, false) // "1.234.567"
 */
export const formatCurrency = (amount, showSymbol = true) => {
  if (amount == null || isNaN(amount)) return "-";

  try {
    const formatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

    // Remove Rp symbol if not needed
    return showSymbol ? formatted : formatted.replace("Rp", "").trim();
  } catch {
    return String(amount);
  }
};

/**
 * Format file size to human readable
 * @param {number} bytes - Size in bytes
 * @param {number} [decimals=2] - Decimal places
 * @returns {string}
 *
 * @example
 * formatFileSize(1024) // "1 KB"
 * formatFileSize(1536) // "1.5 KB"
 * formatFileSize(1048576) // "1 MB"
 * formatFileSize(0) // "0 B"
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return "0 B";
  if (isNaN(bytes)) return "-";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const size = bytes / Math.pow(k, i);

  // Don't show decimals for bytes
  const formatted = i === 0 ? size.toString() : size.toFixed(decimals);

  return `${formatted} ${sizes[i]}`;
};

/**
 * Format percentage
 * @param {number} value - Value (0-100 or 0-1)
 * @param {number} [decimals=1] - Decimal places
 * @param {boolean} [isDecimal=false] - Input is 0-1 instead of 0-100
 * @returns {string}
 *
 * @example
 * formatPercentage(75) // "75%"
 * formatPercentage(75.5, 1) // "75,5%"
 * formatPercentage(0.755, 1, true) // "75,5%"
 */
export const formatPercentage = (value, decimals = 1, isDecimal = false) => {
  if (value == null || isNaN(value)) return "-";

  const percentage = isDecimal ? value * 100 : value;

  try {
    return new Intl.NumberFormat("id-ID", {
      style: "percent",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(percentage / 100);
  } catch {
    return `${percentage}%`;
  }
};

/**
 * Format compact number (K, M, B)
 * @param {number} num - Number to format
 * @param {number} [decimals=1] - Decimal places
 * @returns {string}
 *
 * @example
 * formatCompact(1234) // "1,2 rb"
 * formatCompact(1234567) // "1,2 jt"
 * formatCompact(1234567890) // "1,2 M"
 */
export const formatCompact = (num, decimals = 1) => {
  if (num == null || isNaN(num)) return "-";
  if (num === 0) return "0";

  const absNum = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  // Billion
  if (absNum >= 1e9) {
    return `${sign}${(absNum / 1e9).toFixed(decimals)} M`;
  }

  // Million (juta)
  if (absNum >= 1e6) {
    return `${sign}${(absNum / 1e6).toFixed(decimals)} jt`;
  }

  // Thousand (ribu)
  if (absNum >= 1e3) {
    return `${sign}${(absNum / 1e3).toFixed(decimals)} rb`;
  }

  return String(num);
};

/**
 * Parse formatted number back to number
 * @param {string} formatted - Formatted number string
 * @returns {number|null}
 *
 * @example
 * parseFormattedNumber("1.234.567") // 1234567
 * parseFormattedNumber("1.234,56") // 1234.56
 */
export const parseFormattedNumber = (formatted) => {
  if (!formatted || typeof formatted !== "string") return null;

  try {
    // Remove thousand separators and replace comma with dot
    const cleaned = formatted
      .replace(/\./g, "") // Remove dots (thousand separator)
      .replace(/,/g, ".") // Replace comma with dot (decimal separator)
      .replace(/[^\d.-]/g, ""); // Remove non-numeric except dot and minus

    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  } catch {
    return null;
  }
};

/**
 * Format ordinal number (1st, 2nd, 3rd, etc in Indonesian)
 * @param {number} num
 * @returns {string}
 *
 * @example
 * formatOrdinal(1) // "ke-1"
 * formatOrdinal(2) // "ke-2"
 * formatOrdinal(21) // "ke-21"
 */
export const formatOrdinal = (num) => {
  if (num == null || isNaN(num)) return "-";
  return `ke-${num}`;
};

/**
 * Format range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} [separator=' - '] - Separator
 * @returns {string}
 *
 * @example
 * formatRange(1, 10) // "1 - 10"
 * formatRange(1000, 5000) // "1.000 - 5.000"
 */
export const formatRange = (min, max, separator = " - ") => {
  if (min == null || max == null) return "-";
  return `${formatNumber(min)}${separator}${formatNumber(max)}`;
};

/**
 * Round to nearest value
 * @param {number} num - Number to round
 * @param {number} [nearest=1] - Round to nearest X
 * @returns {number}
 *
 * @example
 * roundTo(123, 10) // 120
 * roundTo(127, 10) // 130
 * roundTo(123, 5) // 125
 */
export const roundTo = (num, nearest = 1) => {
  if (num == null || isNaN(num)) return 0;
  return Math.round(num / nearest) * nearest;
};
