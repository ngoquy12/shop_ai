export interface AIReview {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  thumbnailUrl?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  type: "BLOG" | "AI_REVIEW";
  authorId: string;
  seoTitle?: string;
  seoDescription?: string;
  views: number;
  scheduledAt?: string;
  isFeatured: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  // AI Review specific fields
  aiToolId?: string;
  aiTool?: {
    id: string;
    name: string;
    slug: string;
    thumbnailUrl?: string;
    description?: string;
    link?: string;
    price: number;
  };
  rating?: number;
  pros?: string[];
  cons?: string[];
  pricing?: {
    free: boolean;
    price: number;
    currency: string;
  };
  useCases?: string[];
  // Relations
  author: {
    id: string;
    fullName: string;
    email: string;
  };
  postTags: {
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
}

export interface AIReviewsResponse {
  data: AIReview[];
  meta: {
    currentPage: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
  };
}

export interface CreateAIReviewDto {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  thumbnailUrl?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  seoTitle?: string;
  seoDescription?: string;
  scheduledAt?: string;
  isFeatured?: boolean;
  aiToolId?: string;
  rating?: number;
  pros?: string[];
  cons?: string[];
  pricing?: {
    free: boolean;
    price: number;
    currency: string;
  };
  useCases?: string[];
  tags?: string[];
}

export type UpdateAIReviewDto = Partial<CreateAIReviewDto>;
