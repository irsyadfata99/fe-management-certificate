const STATUS_MESSAGES = {
  400: "Invalid Request.",
  401: "Your session has expired. Please login again.",
  403: "You do not have permission to perform this action.",
  404: "Data not found.",
  409: "A conflict occurred or the data already exists.",
  422: "The provided data is invalid.",
  429: "Too many requests. Please try again later.",
  500: "An internal server error occurred. Please try again.",
  502: "Server is currently unreachable.",
  503: "Service is undergoing maintenance.",
  504: "The server timed out.",
};

const NETWORK_MESSAGES = {
  NETWORK_ERROR:
    "Unable to connect to the server. Please check your internet connection.",
  TIMEOUT: "The request took too long to respond. Please try again.",
  CANCELLED: "Request was cancelled.",
};

export const getErrorMessage = (error) => {
  if (!error.response) {
    if (error.code === "ECONNABORTED") {
      return NETWORK_MESSAGES.TIMEOUT;
    }
    if (error.code === "ERR_CANCELED") {
      return NETWORK_MESSAGES.CANCELLED;
    }
    return NETWORK_MESSAGES.NETWORK_ERROR;
  }

  const { status, data } = error.response;

  if (data?.error && typeof data.error === "string") {
    return data.error;
  }

  if (data?.message && typeof data.message === "string") {
    return data.message;
  }

  if (status === 422 && data?.errors) {
    const firstError = Object.values(data.errors)[0];
    if (firstError) {
      return Array.isArray(firstError) ? firstError[0] : firstError;
    }
  }

  return (
    STATUS_MESSAGES[status] || "An unexpected error occurred. Please try again."
  );
};

export const isAuthError = (error) => {
  return error.response?.status === 401;
};

export const isPermissionError = (error) => {
  return error.response?.status === 403;
};

export const isNotFoundError = (error) => {
  return error.response?.status === 404;
};

export const isConflictError = (error) => {
  return error.response?.status === 409;
};

export const isValidationError = (error) => {
  return error.response?.status === 422;
};

export const isServerError = (error) => {
  const status = error.response?.status;
  return status >= 500 && status < 600;
};

export const isNetworkError = (error) => {
  return !error.response;
};

export const getValidationErrors = (error) => {
  if (!isValidationError(error)) {
    return null;
  }

  return error.response?.data?.errors || null;
};

export const formatErrorForLogging = (error) => {
  return {
    message: getErrorMessage(error),
    status: error.response?.status,
    statusText: error.response?.statusText,
    data: error.response?.data,
    config: {
      url: error.config?.url,
      method: error.config?.method,
      params: error.config?.params,
    },
    timestamp: new Date().toISOString(),
  };
};

export const handleApiError = (error, handlers = {}) => {
  const message = getErrorMessage(error);

  if (isAuthError(error) && handlers.onAuthError) {
    handlers.onAuthError(error);
  } else if (isPermissionError(error) && handlers.onPermissionError) {
    handlers.onPermissionError(error);
  } else if (isNotFoundError(error) && handlers.onNotFound) {
    handlers.onNotFound(error);
  } else if (isValidationError(error) && handlers.onValidationError) {
    handlers.onValidationError(error, getValidationErrors(error));
  } else if (isServerError(error) && handlers.onServerError) {
    handlers.onServerError(error);
  } else if (isNetworkError(error) && handlers.onNetworkError) {
    handlers.onNetworkError(error);
  }

  return message;
};
