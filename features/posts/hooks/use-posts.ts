import { useQuery } from "@tanstack/react-query";
import { postsApi } from "../api/posts.api";

export const usePosts = (params?: {
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  category?: string;
  page?: number;
  limit?: number;
  search?: string;
  isFeatured?: boolean;
}) => {
  return useQuery({
    queryKey: ["posts", params],
    queryFn: () => postsApi.getPosts(params),
  });
};

export const usePostsByCategory = (
  category: string,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    isFeatured?: boolean;
  },
) => {
  return useQuery({
    queryKey: ["posts", category, params],
    queryFn: () => postsApi.getPostsByCategory(category, params),
  });
};

export const usePostBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["post", slug],
    queryFn: () => postsApi.getPostBySlug(slug),
    enabled: !!slug,
  });
};
