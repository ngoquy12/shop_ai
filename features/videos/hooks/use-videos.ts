import { useQuery } from "@tanstack/react-query";
import { videosApi } from "../api/videos.api";

export const useVideos = (params?: {
  page?: number;
  limit?: number;
  isFeatured?: boolean;
  categoryId?: string;
}) => {
  return useQuery({
    queryKey: ["videos", "public", params],
    queryFn: () => videosApi.getPublicVideos(params),
  });
};

export const useFeaturedVideos = () => {
  return useQuery({
    queryKey: ["videos", "featured"],
    queryFn: () => videosApi.getFeaturedVideos(),
  });
};
