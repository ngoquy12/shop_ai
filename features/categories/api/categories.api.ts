import { apiClient } from "@/lib/api-client";
import type {
  Category,
  CategoryListResponse,
  CreateCategoryDto,
  QueryCategoryDto,
  UpdateCategoryDto,
} from "../types";

/**
 * Backend dùng TransformResponseInterceptor bọc mọi response thành:
 *   { success: true, data: <actual_payload>, timestamp }
 *
 * apiClient interceptor đã unwrap sang `response.data` (HTTP body),
 * nên giá trị nhận về là { success, data, timestamp }.
 * Cần truy cập thêm `.data` để lấy payload thật sự.
 */
type WrappedResponse<T> = { success: boolean; data: T; timestamp: string };

function unwrap<T>(res: unknown): T {
  return (res as WrappedResponse<T>).data;
}

export const categoriesApi = {
  /** Lấy danh sách có phân trang, lọc, tìm kiếm */
  findAll: async (query: QueryCategoryDto): Promise<CategoryListResponse> => {
    const params: Record<string, unknown> = { ...query };
    if (params.type === "all") delete params.type;
    if (!params.search) delete params.search;

    const res = await apiClient.get("/categories", { params });
    return unwrap<CategoryListResponse>(res);
  },

  /** Lấy chi tiết 1 danh mục */
  findOne: async (id: string): Promise<Category> => {
    const res = await apiClient.get(`/categories/${id}`);
    return unwrap<Category>(res);
  },

  /** Tạo danh mục mới */
  create: async (payload: CreateCategoryDto): Promise<Category> => {
    const res = await apiClient.post("/categories", payload);
    return unwrap<Category>(res);
  },

  /** Cập nhật danh mục */
  update: async ({
    id,
    payload,
  }: {
    id: string;
    payload: UpdateCategoryDto;
  }): Promise<Category> => {
    const res = await apiClient.patch(`/categories/${id}`, payload);
    return unwrap<Category>(res);
  },

  /** Xóa 1 danh mục */
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },

  /** Xóa nhiều danh mục */
  bulkRemove: async (ids: string[]): Promise<void> => {
    await apiClient.delete(`/categories/bulk`, {
      params: { ids: ids.join(",") },
    });
  },
};
