import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { categoriesApi } from "../api/categories.api";
import type {
  CreateCategoryDto,
  QueryCategoryDto,
  UpdateCategoryDto,
} from "../types";

export const CATEGORIES_QUERY_KEY = "categories";

// ─── List Hook ────────────────────────────────────────────────────────────────
export const useCategories = (query: QueryCategoryDto) => {
  return useQuery({
    queryKey: [CATEGORIES_QUERY_KEY, query],
    queryFn: () => categoriesApi.findAll(query),
    placeholderData: (prev) => prev, // giữ data cũ khi query thay đổi (tránh flick)
    staleTime: 30_000,
  });
};

// ─── Create Hook ──────────────────────────────────────────────────────────────
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCategoryDto) => categoriesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
      toast.success("Thêm danh mục thành công!");
    },
    onError: (error: unknown) => {
      const msg = (
        error as { response?: { data?: { message?: string | string[] } } }
      )?.response?.data?.message;
      toast.error(
        Array.isArray(msg) ? msg.join(", ") : msg || "Thêm danh mục thất bại",
      );
    },
  });
};

// ─── Update Hook ──────────────────────────────────────────────────────────────
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryDto }) =>
      categoriesApi.update({ id, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
      toast.success("Cập nhật danh mục thành công!");
    },
    onError: (error: unknown) => {
      const msg = (
        error as { response?: { data?: { message?: string | string[] } } }
      )?.response?.data?.message;
      toast.error(
        Array.isArray(msg)
          ? msg.join(", ")
          : msg || "Cập nhật danh mục thất bại",
      );
    },
  });
};

// ─── Delete Hook ──────────────────────────────────────────────────────────────
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
      toast.success("Đã xóa danh mục!");
    },
    onError: (error: unknown) => {
      const msg = (
        error as { response?: { data?: { message?: string | string[] } } }
      )?.response?.data?.message;
      toast.error(
        Array.isArray(msg) ? msg.join(", ") : msg || "Xóa danh mục thất bại",
      );
    },
  });
};

// ─── Bulk Delete Hook ─────────────────────────────────────────────────────────
export const useBulkDeleteCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => categoriesApi.bulkRemove(ids),
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
      toast.success(`Đã xóa ${ids.length} danh mục!`);
    },
    onError: (error: unknown) => {
      const msg = (
        error as { response?: { data?: { message?: string | string[] } } }
      )?.response?.data?.message;
      toast.error(
        Array.isArray(msg) ? msg.join(", ") : msg || "Xóa hàng loạt thất bại",
      );
    },
  });
};
