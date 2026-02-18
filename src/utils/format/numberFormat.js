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

export const formatCurrency = (amount, showSymbol = true) => {
  if (amount == null || isNaN(amount)) return "-";

  try {
    const formatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

    return showSymbol ? formatted : formatted.replace("Rp", "").trim();
  } catch {
    return String(amount);
  }
};

export const formatFileSize = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return "0 B";
  if (isNaN(bytes)) return "-";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const size = bytes / Math.pow(k, i);

  const formatted = i === 0 ? size.toString() : size.toFixed(decimals);

  return `${formatted} ${sizes[i]}`;
};

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

export const formatCompact = (num, decimals = 1) => {
  if (num == null || isNaN(num)) return "-";
  if (num === 0) return "0";

  const absNum = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  if (absNum >= 1e9) {
    return `${sign}${(absNum / 1e9).toFixed(decimals)} M`;
  }

  if (absNum >= 1e6) {
    return `${sign}${(absNum / 1e6).toFixed(decimals)} jt`;
  }

  if (absNum >= 1e3) {
    return `${sign}${(absNum / 1e3).toFixed(decimals)} rb`;
  }

  return String(num);
};

export const parseFormattedNumber = (formatted) => {
  if (!formatted || typeof formatted !== "string") return null;

  try {
    const cleaned = formatted
      .replace(/\./g, "")
      .replace(/,/g, ".")
      .replace(/[^\d.-]/g, "");

    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  } catch {
    return null;
  }
};

export const formatOrdinal = (num) => {
  if (num == null || isNaN(num)) return "-";
  return `ke-${num}`;
};

export const formatRange = (min, max, separator = " - ") => {
  if (min == null || max == null) return "-";
  return `${formatNumber(min)}${separator}${formatNumber(max)}`;
};

export const roundTo = (num, nearest = 1) => {
  if (num == null || isNaN(num)) return 0;
  return Math.round(num / nearest) * nearest;
};
