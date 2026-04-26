export type AIToolStatus = "ACTIVE" | "INACTIVE";

export interface AITool {
  id: string;
  name: string;
  slug: string;
  description: string;
  content: string | null;
  thumbnailUrl: string | null;
  link: string | null;
  features: string[] | null;
  tutorialVideoUrl?: string | null;
  tutorialVideoType?: string | null;
  price: number;
  oldPrice: number | null;
  isHot: boolean;
  isFeatured: boolean;
  status: AIToolStatus;
  categoryId: string;
  category?: { id: string; name: string; slug: string };
  tags?: { id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface GetAiToolsQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string;
  status?: AIToolStatus;
  isHot?: boolean;
  isFeatured?: boolean;
}

export interface PaginatedAiTools {
  data: AITool[];
  meta: {
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
}
