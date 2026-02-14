/**
 * API Error Handler
 * Maps HTTP status codes dan backend errors ke user-friendly messages (Indonesian)
 */

/**
 * Default error messages berdasarkan status code
 */
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

/**
 * Network error messages
 */
const NETWORK_MESSAGES = {
  NETWORK_ERROR:
    "Unable to connect to the server. Please check your internet connection.",
  TIMEOUT: "The request took too long to respond. Please try again.",
  CANCELLED: "Request was cancelled.",
};

/**
 * Extract error message from API response
 * Priority: response.data.error > response.data.message > status message
 *
 * @param {Object} error - Axios error object
 * @returns {string} User-friendly error message
 *
 * @example
 * const error = { response: { status: 400, data: { error: 'Invalid input' } } };
 * getErrorMessage(error); // "Invalid input"
 */
export const getErrorMessage = (error) => {
  // Network errors
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

  // Backend error message (prioritas tertinggi)
  if (data?.error && typeof data.error === "string") {
    return data.error;
  }

  // Backend message field
  if (data?.message && typeof data.message === "string") {
    return data.message;
  }

  // Validation errors (422)
  if (status === 422 && data?.errors) {
    // Format: { errors: { field: 'error message' } }
    const firstError = Object.values(data.errors)[0];
    if (firstError) {
      return Array.isArray(firstError) ? firstError[0] : firstError;
    }
  }

  // Default status message
  return (
    STATUS_MESSAGES[status] || "An unexpected error occurred. Please try again."
  );
};

/**
 * Check if error is authentication error (401)
 * @param {Object} error - Axios error object
 * @returns {boolean}
 */
export const isAuthError = (error) => {
  return error.response?.status === 401;
};

/**
 * Check if error is permission error (403)
 * @param {Object} error - Axios error object
 * @returns {boolean}
 */
export const isPermissionError = (error) => {
  return error.response?.status === 403;
};

/**
 * Check if error is not found (404)
 * @param {Object} error - Axios error object
 * @returns {boolean}
 */
export const isNotFoundError = (error) => {
  return error.response?.status === 404;
};

/**
 * Check if error is conflict (409)
 * @param {Object} error - Axios error object
 * @returns {boolean}
 */
export const isConflictError = (error) => {
  return error.response?.status === 409;
};

/**
 * Check if error is validation error (422)
 * @param {Object} error - Axios error object
 * @returns {boolean}
 */
export const isValidationError = (error) => {
  return error.response?.status === 422;
};

/**
 * Check if error is server error (5xx)
 * @param {Object} error - Axios error object
 * @returns {boolean}
 */
export const isServerError = (error) => {
  const status = error.response?.status;
  return status >= 500 && status < 600;
};

/**
 * Check if error is network error
 * @param {Object} error - Axios error object
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
  return !error.response;
};

/**
 * Get validation errors object
 * @param {Object} error - Axios error object
 * @returns {Object|null} Validation errors or null
 *
 * @example
 * const errors = getValidationErrors(error);
 * // { username: 'Username sudah digunakan', email: 'Email tidak valid' }
 */
export const getValidationErrors = (error) => {
  if (!isValidationError(error)) {
    return null;
  }

  return error.response?.data?.errors || null;
};

/**
 * Format error for logging
 * @param {Object} error - Axios error object
 * @returns {Object} Formatted error object
 */
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

/**
 * Handle API error with custom callback
 * @param {Object} error - Axios error object
 * @param {Object} [handlers] - Custom error handlers
 * @param {Function} [handlers.onAuthError] - Called on 401
 * @param {Function} [handlers.onPermissionError] - Called on 403
 * @param {Function} [handlers.onNotFound] - Called on 404
 * @param {Function} [handlers.onValidationError] - Called on 422
 * @param {Function} [handlers.onServerError] - Called on 5xx
 * @param {Function} [handlers.onNetworkError] - Called on network error
 * @returns {string} Error message
 *
 * @example
 * handleApiError(error, {
 *   onAuthError: () => logout(),
 *   onNotFound: () => navigate('/404'),
 * });
 */
export const handleApiError = (error, handlers = {}) => {
  const message = getErrorMessage(error);

  // Call specific handlers
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
