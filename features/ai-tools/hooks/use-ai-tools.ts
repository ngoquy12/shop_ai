import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { GetAiToolsQuery } from "../types";
import { getAiToolsFn, getAiToolDetailFn } from "../api/ai-tools.api";

export const aiToolsKeys = {
  all: ["ai-tools"] as const,
  lists: () => [...aiToolsKeys.all, "list"] as const,
  list: (filters: string) => [...aiToolsKeys.lists(), { filters }] as const,
  details: () => [...aiToolsKeys.all, "detail"] as const,
  detail: (id: string) => [...aiToolsKeys.details(), id] as const,
};

export const useAiTools = (query?: GetAiToolsQuery) => {
  return useQuery({
    queryKey: aiToolsKeys.list(JSON.stringify(query)),
    queryFn: () => getAiToolsFn(query),
    staleTime: 5 * 60 * 1000,
  });
};

export const useInfiniteAiTools = (query?: Omit<GetAiToolsQuery, "page">) => {
  return useInfiniteQuery({
    queryKey: [...aiToolsKeys.lists(), "infinite", JSON.stringify(query)],
    queryFn: ({ pageParam = 1 }) =>
      getAiToolsFn({ ...query, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // API returns PaginatedAiTools: { data: [], meta: { currentPage, totalPages } }
      if (lastPage.meta?.currentPage < lastPage.meta?.totalPages) {
        return lastPage.meta.currentPage + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useAiToolDetail = (id: string) => {
  return useQuery({
    queryKey: aiToolsKeys.detail(id),
    queryFn: () => getAiToolDetailFn(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
