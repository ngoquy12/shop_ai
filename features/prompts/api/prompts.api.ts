import { apiClient } from "@/lib/api-client";
import { Prompt, GetPromptsQuery, PaginatedPrompts } from "../types";
import { BaseApiResponse } from "@/features/auth/types";

export const getMarketplacePromptsFn = async (query?: GetPromptsQuery) => {
  // apiClient interceptor trả về response.data
  // NestJS Backend trả về { success: true, data: PaginatedPrompts }
  const response = await apiClient.get<never, PaginatedPrompts>("/prompts-ai", {
    params: query,
  });
  // Ép kiểu về PaginatedPrompts vì format body của Backend PaginatedResponse
  // đã khớp với interface PaginatedPrompts (có data và meta)
  return response;
};

export const getPromptDetailFn = async (slug: string) => {
  const response = await apiClient.get<never, BaseApiResponse<Prompt>>(
    `/prompts/${slug}`,
  );
  return response.data;
};

export const createReviewFn = async (
  promptId: string,
  data: { rating: number; comment?: string },
) => {
  const response = await apiClient.post<never, { data: unknown }>(
    `/prompts/${promptId}/review`,
    data,
  );
  return response.data;
};
