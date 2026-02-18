import { useQuery } from "@tanstack/react-query";
import { teacherApi } from "@/api";

export const useTeachers = (params = {}) => {
  return useQuery({
    queryKey: ["teachers", params],
    queryFn: () => teacherApi.getAllTeachers(params),
    select: (data) => {
      if (data?.teachers && Array.isArray(data.teachers)) {
        return {
          teachers: data.teachers,
          pagination: data.pagination || {
            total: data.teachers.length,
            page: params.page || 1,
            limit: params.limit || 8,
            totalPages: Math.ceil(data.teachers.length / (params.limit || 8)),
          },
        };
      }

      if (Array.isArray(data)) {
        return {
          teachers: data,
          pagination: {
            total: data.length,
            page: params.page || 1,
            limit: params.limit || 8,
            totalPages: Math.ceil(data.length / (params.limit || 8)),
          },
        };
      }

      return {
        teachers: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 8,
          totalPages: 0,
        },
      };
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useTeacher = (id, options = {}) => {
  return useQuery({
    queryKey: ["teachers", id],
    queryFn: () => teacherApi.getTeacherById(id),
    select: (data) => data.teacher,
    enabled: !!id,
    ...options,
  });
};
