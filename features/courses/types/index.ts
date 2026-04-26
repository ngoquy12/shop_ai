export type Course = {
  id: string;
  name: string;
  description: string;
  lessons: number;
  duration: string;
  level: "Cơ bản" | "Trung cấp" | "Nâng cao";
  price: number;
  originalPrice: number;
  icon: string;
  tags: string[];
  rating: number;
  students: number;
  new?: boolean;
  bestseller?: boolean;
};

export type GetCoursesQuery = {
  page?: number;
  limit?: number;
  level?: string;
  search?: string;
};

export type PaginatedCourses = {
  data: Course[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
};
