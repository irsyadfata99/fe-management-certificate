/**
 * Query string builder untuk API requests
 * Handle pagination, filters, sorting, dll
 */

/**
 * Build query string from params object
 * Skip null/undefined values
 *
 * @param {Object} params - Query parameters
 * @returns {string} Query string (e.g., "?page=1&limit=20")
 *
 * @example
 * buildQueryString({ page: 1, limit: 20, search: 'test' })
 * // "?page=1&limit=20&search=test"
 *
 * @example
 * buildQueryString({ status: 'active', empty: null, undef: undefined })
 * // "?status=active"
 */
export const buildQueryString = (params) => {
  if (!params || typeof params !== "object") {
    return "";
  }

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    // Skip null, undefined, dan empty string
    if (value !== null && value !== undefined && value !== "") {
      // Handle arrays
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== null && item !== undefined && item !== "") {
            searchParams.append(key, String(item));
          }
        });
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

/**
 * Build pagination params
 * @param {number} page - Page number (1-indexed)
 * @param {number} [limit=20] - Items per page
 * @returns {Object}
 *
 * @example
 * buildPaginationParams(1, 20)
 * // { page: 1, limit: 20 }
 */
export const buildPaginationParams = (page, limit = 20) => {
  return {
    page: Math.max(1, page),
    limit: Math.max(1, Math.min(limit, 100)), // Max 100
  };
};

/**
 * Build date range params
 * @param {string|Date} startDate
 * @param {string|Date} endDate
 * @returns {Object}
 *
 * @example
 * buildDateRangeParams('2024-01-01', '2024-12-31')
 * // { startDate: '2024-01-01', endDate: '2024-12-31' }
 */
export const buildDateRangeParams = (startDate, endDate) => {
  const params = {};

  if (startDate) {
    params.startDate = startDate instanceof Date ? startDate.toISOString().split("T")[0] : startDate;
  }

  if (endDate) {
    params.endDate = endDate instanceof Date ? endDate.toISOString().split("T")[0] : endDate;
  }

  return params;
};

/**
 * Build sort params
 * @param {string} sortBy - Field to sort by
 * @param {'asc'|'desc'} [order='asc'] - Sort order
 * @returns {Object}
 *
 * @example
 * buildSortParams('createdAt', 'desc')
 * // { sortBy: 'createdAt', order: 'desc' }
 */
export const buildSortParams = (sortBy, order = "asc") => {
  if (!sortBy) return {};

  return {
    sortBy,
    order: order === "desc" ? "desc" : "asc",
  };
};

/**
 * Build filter params with automatic null/undefined removal
 * @param {Object} filters - Filter object
 * @returns {Object} Cleaned filters
 *
 * @example
 * buildFilterParams({ status: 'active', search: '', category: null })
 * // { status: 'active' }
 */
export const buildFilterParams = (filters) => {
  if (!filters || typeof filters !== "object") {
    return {};
  }

  const cleaned = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      cleaned[key] = value;
    }
  });

  return cleaned;
};

/**
 * Merge multiple param objects
 * @param {...Object} paramObjects - Param objects to merge
 * @returns {Object} Merged params
 *
 * @example
 * mergeParams(
 *   { page: 1, limit: 20 },
 *   { search: 'test' },
 *   { status: 'active' }
 * )
 * // { page: 1, limit: 20, search: 'test', status: 'active' }
 */
export const mergeParams = (...paramObjects) => {
  return Object.assign({}, ...paramObjects);
};

/**
 * Build complete query params with pagination, filters, and sort
 * @param {Object} options
 * @param {number} [options.page=1]
 * @param {number} [options.limit=20]
 * @param {Object} [options.filters={}]
 * @param {string} [options.sortBy]
 * @param {'asc'|'desc'} [options.order]
 * @returns {Object}
 *
 * @example
 * buildQueryParams({
 *   page: 1,
 *   limit: 20,
 *   filters: { status: 'active', search: 'test' },
 *   sortBy: 'createdAt',
 *   order: 'desc'
 * })
 */
export const buildQueryParams = (options = {}) => {
  const { page = 1, limit = 20, filters = {}, sortBy, order } = options;

  return mergeParams(buildPaginationParams(page, limit), buildFilterParams(filters), buildSortParams(sortBy, order));
};

/**
 * Parse query string to params object
 * @param {string} queryString - Query string (with or without ?)
 * @returns {Object}
 *
 * @example
 * parseQueryString('?page=1&limit=20&status=active')
 * // { page: '1', limit: '20', status: 'active' }
 */
export const parseQueryString = (queryString) => {
  if (!queryString || typeof queryString !== "string") {
    return {};
  }

  // Remove leading ?
  const cleaned = queryString.startsWith("?") ? queryString.slice(1) : queryString;

  const params = {};
  const searchParams = new URLSearchParams(cleaned);

  searchParams.forEach((value, key) => {
    // Handle duplicate keys (convert to array)
    if (params[key]) {
      params[key] = Array.isArray(params[key]) ? [...params[key], value] : [params[key], value];
    } else {
      params[key] = value;
    }
  });

  return params;
};
