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

export const buildPaginationParams = (page, limit = 20) => {
  return {
    page: Math.max(1, page),
    limit: Math.max(1, Math.min(limit, 100)),
  };
};

export const buildDateRangeParams = (startDate, endDate) => {
  const params = {};

  if (startDate) {
    params.startDate =
      startDate instanceof Date
        ? startDate.toISOString().split("T")[0]
        : startDate;
  }

  if (endDate) {
    params.endDate =
      endDate instanceof Date ? endDate.toISOString().split("T")[0] : endDate;
  }

  return params;
};

export const buildSortParams = (sortBy, order = "asc") => {
  if (!sortBy) return {};

  return {
    sortBy,
    order: order === "desc" ? "desc" : "asc",
  };
};

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

export const mergeParams = (...paramObjects) => {
  return Object.assign({}, ...paramObjects);
};

export const buildQueryParams = (options = {}) => {
  const { page = 1, limit = 20, filters = {}, sortBy, order } = options;

  return mergeParams(
    buildPaginationParams(page, limit),
    buildFilterParams(filters),
    buildSortParams(sortBy, order),
  );
};

export const parseQueryString = (queryString) => {
  if (!queryString || typeof queryString !== "string") {
    return {};
  }

  const cleaned = queryString.startsWith("?")
    ? queryString.slice(1)
    : queryString;

  const params = {};
  const searchParams = new URLSearchParams(cleaned);

  searchParams.forEach((value, key) => {
    if (params[key]) {
      params[key] = Array.isArray(params[key])
        ? [...params[key], value]
        : [params[key], value];
    } else {
      params[key] = value;
    }
  });

  return params;
};
