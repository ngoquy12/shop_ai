import { useQuery } from "@tanstack/react-query";
import { GetCoursesQuery } from "../types";
import { getCoursesFn, getCourseDetailFn } from "../api/courses.api";

export const coursesKeys = {
  all: ["courses"] as const,
  lists: () => [...coursesKeys.all, "list"] as const,
  list: (filters: string) => [...coursesKeys.lists(), { filters }] as const,
  details: () => [...coursesKeys.all, "detail"] as const,
  detail: (id: string) => [...coursesKeys.details(), id] as const,
};

export const useCourses = (query?: GetCoursesQuery) => {
  return useQuery({
    queryKey: coursesKeys.list(JSON.stringify(query)),
    queryFn: () => getCoursesFn(query),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCourseDetail = (id: string) => {
  return useQuery({
    queryKey: coursesKeys.detail(id),
    queryFn: () => getCourseDetailFn(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
