import { apiClient } from "@/lib/api-client";

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  thumbnailUrl?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryId?: string;
  authorId: string;
  seoTitle?: string;
  seoDescription?: string;
  views: number;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  author: {
    id: string;
    fullName: string;
    email: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  postTags: {
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
}

export interface PostsResponse {
  data: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

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

export const postsApi = {
  getPosts: (params?: {
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    category?: string;
    page?: number;
    limit?: number;
    search?: string;
    isFeatured?: boolean;
  }): Promise<PostsResponse> => {
    return apiClient.get("/posts", { params }).then((res) => {
      const response = res as unknown as ApiResponse<Post[]>;
      // TransformResponseInterceptor wraps response in { success, data, meta }
      return {
        data: response.data || [],
        pagination: {
          page: response.meta?.currentPage ?? 1,
          limit: response.meta?.pageSize ?? 10,
          total: response.meta?.totalRecords ?? 0,
          totalPages: response.meta?.totalPages ?? 1,
        },
      };
    });
  },

  getPostsByCategory: (
    category: string,
    params?: {
      page?: number;
      limit?: number;
      search?: string;
      isFeatured?: boolean;
    },
  ): Promise<PostsResponse> => {
    return apiClient.get(`/posts/${category}`, { params }).then((res) => {
      const response = res as unknown as ApiResponse<Post[]>;
      // TransformResponseInterceptor wraps response in { success, data, meta }
      return {
        data: response.data || [],
        pagination: {
          page: response.meta?.currentPage ?? 1,
          limit: response.meta?.pageSize ?? 10,
          total: response.meta?.totalRecords ?? 0,
          totalPages: response.meta?.totalPages ?? 1,
        },
      };
    });
  },

  getPostBySlug: (slug: string): Promise<Post> => {
    return apiClient.get(`/posts/slug/${slug}`).then((res) => {
      const response = res as unknown as ApiResponse<Post>;
      return response.data;
    });
  },
};
