export const formatCertificateNumber = (num) => {
  if (!num) return "-";

  if (typeof num === "string" && num.startsWith("No.")) {
    return num;
  }

  const digits = String(num).replace(/\D/g, "");

  const padded = digits.padStart(6, "0");

  return `No. ${padded}`;
};

export const parseCertificateNumber = (certNumber) => {
  if (!certNumber) return 0;

  const digits = String(certNumber).replace(/\D/g, "");

  return parseInt(digits, 10) || 0;
};

export const formatCertificateRange = (start, end) => {
  if (!start || !end) return "-";

  const formattedStart = formatCertificateNumber(start);
  const formattedEnd = formatCertificateNumber(end);

  return `${formattedStart} - ${formattedEnd}`;
};

export const getCertificateCount = (start, end) => {
  const startNum = parseCertificateNumber(start);
  const endNum = parseCertificateNumber(end);

  if (startNum <= 0 || endNum <= 0 || endNum < startNum) {
    return 0;
  }

  return endNum - startNum + 1;
};

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

export const getNextCertificateNumber = (current, increment = 1) => {
  const currentNum = parseCertificateNumber(current);
  const nextNum = currentNum + increment;
  return formatCertificateNumber(nextNum);
};
