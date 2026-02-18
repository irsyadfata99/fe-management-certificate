import { useQuery } from "@tanstack/react-query";
import { studentApi } from "@/api";
import { useDebounce } from "@/hooks/shared/useDebounce";

export const useStudentSearch = (searchTerm, delay = 300) => {
  const debouncedSearch = useDebounce(searchTerm, delay);

  return useQuery({
    queryKey: ["students", "search", debouncedSearch],
    queryFn: () => studentApi.searchStudents({ name: debouncedSearch }),
    select: (data) => data.students,
    enabled: debouncedSearch.length >= 2,
    staleTime: 30 * 1000,
  });
};
