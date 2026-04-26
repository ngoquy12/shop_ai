import { apiClient } from "@/lib/api-client";
import { Course, GetCoursesQuery, PaginatedCourses } from "../types";

export const getCoursesFn = async (query?: GetCoursesQuery) => {
  const response = await apiClient.get<never, PaginatedCourses>("/courses", {
    params: query,
  });
  return response;
};

export const getCourseDetailFn = async (id: string) => {
  const response = await apiClient.get<never, { data: Course }>(
    `/courses/${id}`,
  );
  return response?.data || response;
};
