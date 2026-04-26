import { apiClient } from "./api-client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  status: string;
  displayOrder: number;
  type: string;
  videos?: Video[];
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  type: "CLOUDINARY" | "YOUTUBE";
  status: string;
  cloudinaryUrl?: string;
  cloudinaryPublicId?: string;
  youtubeVideoId?: string;
  youtubeUrl?: string;
  youtubeThumbnailUrl?: string;
  thumbnailUrl?: string;
  displayOrder: number;
  isFeatured: boolean;
  viewCount: number;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesWithVideosResponse {
  data: Category[];
}

export const categoryApi = {
  getVideoCategoriesWithVideos: (): Promise<CategoriesWithVideosResponse> => {
    return apiClient.get("/categories/video/with-videos");
  },
};
