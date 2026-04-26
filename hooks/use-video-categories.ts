import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "@/lib/category-api";

export const useVideoCategoriesWithVideos = () => {
  return useQuery({
    queryKey: ["video-categories-with-videos"],
    queryFn: () => categoryApi.getVideoCategoriesWithVideos(),
  });
};
