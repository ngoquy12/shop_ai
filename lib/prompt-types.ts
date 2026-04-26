export type PromptStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ARCHIVED";

export interface PromptAuthor {
  id: string;
  fullName: string;
  avatarUrl?: string | null;
}

export interface PromptCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
}

export interface PromptTag {
  id: string;
  name: string;
  slug: string;
}

export interface Prompt {
  id: string;
  title: string;
  slug: string;
  description: string;
  excerpt: string | null;
  content?: string;
  instructions?: string | null;
  thumbnailUrl: string | null;
  themeColor: string | null;
  demoVideoUrl: string | null;
  tutorialVideoUrl: string | null;
  status: PromptStatus;
  statusFormatted: string;
  isFree: boolean;
  isPremium: boolean;
  isFeatured: boolean;
  viewCount: number;
  purchaseCount: number;
  copyCount: number;
  likeCount: number;
  averageRating: number;
  author?: PromptAuthor;
  category?: PromptCategory;
  tags?: PromptTag[];
  gallery: string[] | null;
  requiredTools: { name: string; planRequired?: string; url?: string }[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedPrompts {
  data: Prompt[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
