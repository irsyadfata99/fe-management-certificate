/**
 * Student Search Hook
 * React Query hook untuk student search dengan debounce
 */

import { useQuery } from "@tanstack/react-query";
import { studentApi } from "@/api";
import { useDebounce } from "@/hooks/shared/useDebounce";

/**
 * Search students with debounce
 * @param {string} searchTerm - Search term
 * @param {number} [delay=300] - Debounce delay in ms
 * @returns {Object} Query object
 *
 * @example
 * const { data: students, isLoading } = useStudentSearch(searchInput);
 */
export const useStudentSearch = (searchTerm, delay = 300) => {
  const debouncedSearch = useDebounce(searchTerm, delay);

  return useQuery({
    queryKey: ["students", "search", debouncedSearch],
    queryFn: () => studentApi.searchStudents({ name: debouncedSearch }),
    select: (data) => data.students,
    enabled: debouncedSearch.length >= 2,
    staleTime: 30 * 1000, // 30 seconds
  });
};
