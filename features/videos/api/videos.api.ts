import { apiClient } from "@/lib/api-client";

export interface Video {
  id: string;
  title: string;
  description?: string;
  type: "CLOUDINARY" | "YOUTUBE";
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
  cloudinaryUrl?: string;
  cloudinaryPublicId?: string;
  cloudinaryResourceType?: string;
  cloudinaryDuration?: number;
  cloudinaryBytes?: number;
  youtubeVideoId?: string;
  youtubeUrl?: string;
  youtubeThumbnailUrl?: string;
  thumbnailUrl?: string;
  displayOrder: number;
  isFeatured: boolean;
  isMuted: boolean;
  autoplay: boolean;
  loop: boolean;
  viewCount: number;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface VideosResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Video[];
  total: number;
  timestamp: string;
}

export const videosApi = {
  getPublicVideos: (params?: {
    page?: number;
    limit?: number;
    isFeatured?: boolean;
    categoryId?: string;
  }): Promise<VideosResponse> => {
    return apiClient.get("/videos/public", { params });
  },

  getFeaturedVideos: (): Promise<VideosResponse> => {
    return apiClient.get("/videos/public/featured");
  },

  incrementView: (
    videoId: string,
  ): Promise<{ success: boolean; count: number }> => {
    return apiClient.post(`/videos/${videoId}/view`);
  },

  getViewCount: (
    videoId: string,
  ): Promise<{ success: boolean; count: number }> => {
    return apiClient.get(`/videos/${videoId}/view-count`);
  },
};
