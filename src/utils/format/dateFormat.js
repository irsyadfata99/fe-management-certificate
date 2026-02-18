import { format, formatDistanceToNow, parseISO, isValid } from "date-fns";
import { id } from "date-fns/locale";

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

export const formatDate = (date, fallback = "-") => {
  const parsed = parseDate(date);
  if (!parsed) return fallback;

  try {
    return format(parsed, "dd/MM/yyyy", { locale: id });
  } catch {
    return fallback;
  }
};

export const formatDateTime = (date, fallback = "-") => {
  const parsed = parseDate(date);
  if (!parsed) return fallback;

  try {
    return format(parsed, "dd/MM/yyyy HH:mm", { locale: id });
  } catch {
    return fallback;
  }
};

export const formatDateTimeFull = (date, fallback = "-") => {
  const parsed = parseDate(date);
  if (!parsed) return fallback;

  try {
    return format(parsed, "dd/MM/yyyy HH:mm:ss", { locale: id });
  } catch {
    return fallback;
  }
};

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

export const formatDateInput = (date) => {
  const parsed = parseDate(date);
  if (!parsed) return "";

  try {
    return format(parsed, "yyyy-MM-dd");
  } catch {
    return "";
  }
};

export const formatDateID = (date, fallback = "-") => {
  const parsed = parseDate(date);
  if (!parsed) return fallback;

  try {
    return format(parsed, "dd MMMM yyyy", { locale: id });
  } catch {
    return fallback;
  }
};

export const formatDateIDShort = (date, fallback = "-") => {
  const parsed = parseDate(date);
  if (!parsed) return fallback;

  try {
    return format(parsed, "dd MMM yyyy", { locale: id });
  } catch {
    return fallback;
  }
};

export const formatTime = (date, fallback = "-") => {
  const parsed = parseDate(date);
  if (!parsed) return fallback;

  try {
    return format(parsed, "HH:mm", { locale: id });
  } catch {
    return fallback;
  }
};

export const getTodayDateInput = () => {
  return formatDateInput(new Date());
};

export const isToday = (date) => {
  const parsed = parseDate(date);
  if (!parsed) return false;

  const today = new Date();
  return (
    parsed.getDate() === today.getDate() &&
    parsed.getMonth() === today.getMonth() &&
    parsed.getFullYear() === today.getFullYear()
  );
};

export const daysDifference = (date) => {
  const parsed = parseDate(date);
  if (!parsed) return null;

  const now = new Date();
  const diffTime = parsed.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatDuration = (hours) => {
  if (!hours || hours <= 0) return "-";

  if (hours >= 1) {
    return `${hours} jam`;
  }

  const minutes = Math.round(hours * 60);
  return `${minutes} menit`;
};
