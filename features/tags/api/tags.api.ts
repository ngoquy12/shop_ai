import { apiClient } from "@/lib/api-client";

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface TagsResponse {
  data: Tag[];
  meta?: {
    currentPage?: number;
    pageSize?: number;
    totalRecords?: number;
    totalPages?: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    currentPage?: number;
    pageSize?: number;
    totalRecords?: number;
    totalPages?: number;
  };
}

export const tagsApi = {
  getTags: async (params?: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<TagsResponse> => {
    const response = await apiClient.get("/tags", { params });
    return response as TagsResponse;
  },

  getTagsByPostType: async (postType: "POST" | "PROMPT" | "AI_TOOL", params?: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<TagsResponse> => {
    const response = await apiClient.get(`/tags/post-type/${postType}`, { params });
    return response as TagsResponse;
  },
};
