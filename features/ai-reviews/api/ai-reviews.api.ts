import { apiClient } from "@/lib/api-client";
import type {
  AIReview,
  AIReviewsResponse,
  CreateAIReviewDto,
  UpdateAIReviewDto,
} from "../types";

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

export const aiReviewsApi = {
  getAIReviews: (params?: {
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    aiToolId?: string;
    page?: number;
    limit?: number;
    search?: string;
    isFeatured?: boolean;
  }): Promise<AIReviewsResponse> => {
    return apiClient.get("/ai-reviews", { params }).then((res) => {
      const response = res as unknown as {
        data: AIReview[];
        meta?: {
          currentPage?: number;
          pageSize?: number;
          totalRecords?: number;
          totalPages?: number;
        };
      };
      // Backend mapping: PaginatedResponse { data: AIReview[], meta: { ... } }
      const meta = response.meta || {};
      return {
        data: response.data || [],
        meta: {
          currentPage: meta.currentPage ?? 1,
          pageSize: meta.pageSize ?? 10,
          totalRecords: meta.totalRecords ?? 0,
          totalPages: meta.totalPages ?? 1,
        },
      };
    });
  },

  getAIReviewBySlug: (slug: string): Promise<AIReview> => {
    return apiClient.get(`/ai-reviews/slug/${slug}`).then((res) => {
      const response = res as unknown as ApiResponse<AIReview>;
      return response.data;
    });
  },

  createAIReview: (data: CreateAIReviewDto): Promise<AIReview> => {
    return apiClient.post("/admin/ai-reviews", data).then((res) => {
      const response = res as unknown as ApiResponse<AIReview>;
      return response.data;
    });
  },

  updateAIReview: (id: string, data: UpdateAIReviewDto): Promise<AIReview> => {
    return apiClient.put(`/admin/ai-reviews/${id}`, data).then((res) => {
      const response = res as unknown as ApiResponse<AIReview>;
      return response.data;
    });
  },

  deleteAIReview: (id: string): Promise<{ message: string }> => {
    return apiClient.delete(`/admin/ai-reviews/${id}`).then((res) => {
      const response = res as unknown as ApiResponse<{ message: string }>;
      return response.data;
    });
  },
};
