export type CategoryTypeEnum = "COURSE" | "TOOL" | "PROMPT";
export type CategoryStatusEnum = "ACTIVE" | "INACTIVE";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  type: CategoryTypeEnum;
  status: CategoryStatusEnum;
  count: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface CategoryListResponse {
  data: Category[];
  meta: PaginationMeta;
}

export interface QueryCategoryDto {
  search?: string;
  type?: CategoryTypeEnum | 'all';
  status?: CategoryStatusEnum;
  limit?: number;
  page?: number;
  cursor?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateCategoryDto {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  type?: CategoryTypeEnum;
  status?: CategoryStatusEnum;
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>;
