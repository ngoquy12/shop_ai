import { User } from "@/features/auth/types";

export type PromptStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ARCHIVED";
export type AIModelType =
  | "CHATGPT"
  | "CLAUDE"
  | "GEMINI"
  | "MIDJOURNEY"
  | "STABLE_DIFFUSION"
  | "OTHER";

export interface PromptVariable {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  defaultValue?: string;
}

export interface ExampleMediaItem {
  type: "IMAGE" | "VIDEO";
  url: string;
  sortOrder: number;
}

export interface Prompt {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  description: string;
  content: string | null;
  instructions: string | null;
  variables: PromptVariable[] | null;
  exampleOutput: string | null;
  thumbnailUrl: string | null;
  themeColor: string | null;
  version: string | null;
  status: PromptStatus;
  statusFormatted: string;
  modelType: AIModelType;
  isFree: boolean;
  isPremium: boolean;
  price?: number | null;
  oldPrice?: number | null;
  isFeatured: boolean;
  isVerified: boolean;
  viewCount: number;
  purchaseCount: number;
  copyCount: number;
  likeCount: number;
  averageRating: number;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    icon?: string | null;
  };
  author?: User;
  createdAt: string;
  updatedAt: string;
  tags?: {
    id: string;
    name: string;
    slug: string;
  }[];
  // Bổ sung các trường thiếu
  gallery?: string[] | null;
  exampleMedia?: ExampleMediaItem[] | null;
  demoVideoUrl?: string | null;
  tutorialVideoUrl?: string | null;
  requiredTools?:
    | {
        name: string;
        planRequired?: string;
        url?: string;
      }[]
    | null;
}

export interface GetPromptsQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: PromptStatus;
  categoryId?: string;
  authorId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedPrompts {
  data: Prompt[];
  meta: {
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
}
