/**
 * Certificate-specific formatting utilities
 * Format: "No. 000001" - 6 digit dengan leading zeros
 */

/**
 * Format certificate number dengan leading zeros
 * @param {number|string} num - Certificate number
 * @returns {string}
 *
 * @example
 * formatCertificateNumber(1) // "No. 000001"
 * formatCertificateNumber(123) // "No. 000123"
 * formatCertificateNumber("000456") // "No. 000456"
 * formatCertificateNumber("No. 000789") // "No. 000789" (unchanged)
 */
export const formatCertificateNumber = (num) => {
  if (!num) return "-";

  // Already formatted
  if (typeof num === "string" && num.startsWith("No.")) {
    return num;
  }

  // Extract digits
  const digits = String(num).replace(/\D/g, "");

  // Pad with zeros (6 digits)
  const padded = digits.padStart(6, "0");

  return `No. ${padded}`;
};

/**
 * Parse certificate number to integer
 * @param {string} certNumber - Certificate number (e.g., "No. 000001")
 * @returns {number}
 *
 * @example
 * parseCertificateNumber("No. 000001") // 1
 * parseCertificateNumber("No. 000123") // 123
 * parseCertificateNumber("123") // 123
 */
export const parseCertificateNumber = (certNumber) => {
  if (!certNumber) return 0;

  // Extract all digits
  const digits = String(certNumber).replace(/\D/g, "");

  return parseInt(digits, 10) || 0;
};

/**
 * Validate certificate number format
 * @param {string} certNumber - Certificate number
 * @returns {boolean}
 *
 * @example
 * isValidCertificateNumber("No. 000001") // true
 * isValidCertificateNumber("No. 123") // false (too short)
 * isValidCertificateNumber("123456") // false (no prefix)
 */
export const isValidCertificateNumber = (certNumber) => {
  if (!certNumber || typeof certNumber !== "string") return false;

  // Must match: "No. " + 6 digits
  const pattern = /^No\.\s\d{6}$/;
  return pattern.test(certNumber);
};

/**
 * Format certificate range
 * @param {string|number} start - Start number
 * @param {string|number} end - End number
 * @returns {string}
 *
 * @example
 * formatCertificateRange(1, 50) // "No. 000001 - No. 000050"
 * formatCertificateRange("No. 000001", "No. 000050") // "No. 000001 - No. 000050"
 */
export const formatCertificateRange = (start, end) => {
  if (!start || !end) return "-";

  const formattedStart = formatCertificateNumber(start);
  const formattedEnd = formatCertificateNumber(end);

  return `${formattedStart} - ${formattedEnd}`;
};

/**
 * Calculate certificate count from range
 * @param {string|number} start - Start number
 * @param {string|number} end - End number
 * @returns {number}
 *
 * @example
 * getCertificateCount(1, 50) // 50
 * getCertificateCount("No. 000010", "No. 000030") // 21
 */
export const getCertificateCount = (start, end) => {
  const startNum = parseCertificateNumber(start);
  const endNum = parseCertificateNumber(end);

  if (startNum <= 0 || endNum <= 0 || endNum < startNum) {
    return 0;
  }

  return endNum - startNum + 1;
};

/**
 * Generate certificate number array
 * @param {string|number} start - Start number
 * @param {string|number} end - End number
 * @returns {string[]} Array of formatted certificate numbers
 *
 * @example
 * generateCertificateNumbers(1, 3)
 * // ["No. 000001", "No. 000002", "No. 000003"]
 */
export const generateCertificateNumbers = (start, end) => {
  const startNum = parseCertificateNumber(start);
  const endNum = parseCertificateNumber(end);

  if (startNum <= 0 || endNum <= 0 || endNum < startNum) {
    return [];
  }

  const numbers = [];
  for (let i = startNum; i <= endNum; i++) {
    numbers.push(formatCertificateNumber(i));
  }

  return numbers;
};

/**
 * Validate certificate range
 * @param {string|number} start - Start number
 * @param {string|number} end - End number
 * @param {number} [maxCount=10000] - Maximum allowed count
 * @returns {{ valid: boolean, error?: string }}
 *
 * @example
 * validateCertificateRange(1, 50)
 * // { valid: true }
 *
 * validateCertificateRange(50, 1)
 * // { valid: false, error: "Start number must be <= end number" }
 *
 * validateCertificateRange(1, 20000)
 * // { valid: false, error: "Maximum 10000 certificates per batch" }
 */
export const validateCertificateRange = (start, end, maxCount = 10000) => {
  const startNum = parseCertificateNumber(start);
  const endNum = parseCertificateNumber(end);

  if (startNum <= 0) {
    return {
      valid: false,
      error: "Start number must be positive",
    };
  }

  if (endNum <= 0) {
    return {
      valid: false,
      error: "End number must be positive",
    };
  }

  if (startNum > endNum) {
    return {
      valid: false,
      error: "Start number must be <= end number",
    };
  }

  const count = getCertificateCount(startNum, endNum);
  if (count > maxCount) {
    return {
      valid: false,
      error: `Maximum ${maxCount} certificates per batch`,
    };
  }

  return { valid: true };
};

/**
 * Get next certificate number
 * @param {string|number} current - Current certificate number
 * @param {number} [increment=1] - How many to increment
 * @returns {string}
 *
 * @example
 * getNextCertificateNumber("No. 000001") // "No. 000002"
 * getNextCertificateNumber(1, 5) // "No. 000006"
 */
export const getNextCertificateNumber = (current, increment = 1) => {
  const currentNum = parseCertificateNumber(current);
  const nextNum = currentNum + increment;
  return formatCertificateNumber(nextNum);
};
