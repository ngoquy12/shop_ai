import { useQuery } from "@tanstack/react-query";
import { GetPromptsQuery } from "../types";
import { getMarketplacePromptsFn, getPromptDetailFn } from "../api/prompts.api";

export const usePrompts = (query?: GetPromptsQuery) => {
  return useQuery({
    queryKey: ["prompts", query],
    queryFn: () => getMarketplacePromptsFn(query),
    staleTime: 5 * 60 * 1000, // Cache 5 phút cho chợ Prompt
  });
};

export const usePromptDetail = (slug: string) => {
  return useQuery({
    queryKey: ["prompt", slug],
    queryFn: () => getPromptDetailFn(slug),
    enabled: !!slug, // Chỉ gọi khi có slug
    staleTime: 1 * 60 * 1000,
  });
};
