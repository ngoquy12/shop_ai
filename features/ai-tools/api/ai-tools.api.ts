import { apiClient } from "@/lib/api-client";
import { AITool, GetAiToolsQuery, PaginatedAiTools } from "../types";

export const getAiToolsFn = async (query?: GetAiToolsQuery) => {
  const response = await apiClient.get<never, PaginatedAiTools>("/cong-cu-ai", {
    params: query,
  });
  return response;
};

export const getAiToolDetailFn = async (id: string) => {
  const response = await apiClient.get<never, { data: AITool }>(
    `/ai-tools/${id}`,
  );
  return response?.data || response;
};
