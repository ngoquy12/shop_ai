import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Prompt } from "@/features/prompts/types";

export interface GetPromptsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  isFree?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Giả sử backend bọc JSON bằng { success: true, data: <actual_data> }
export const useGetPrompts = (params: GetPromptsParams) => {
  return useQuery({
    queryKey: ["prompts", params],
    queryFn: async () => {
      const response = await apiClient.get("/prompts-ai", { params });
      return (response as unknown as { data: Prompt[] }).data;
    },
  });
};

export const useGetPromptDetail = (slug: string) => {
  return useQuery({
    queryKey: ["prompt", slug],
    queryFn: async () => {
      const response = await apiClient.get(`/prompts/${slug}`);
      return (response as unknown as { data: Prompt }).data;
    },
    enabled: !!slug,
  });
};
