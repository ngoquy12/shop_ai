import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiReviewsApi } from '../api/ai-reviews.api';
import type {
  AIReview,
  AIReviewsResponse,
  CreateAIReviewDto,
  UpdateAIReviewDto,
} from '../types';

export const useAIReviews = (params?: {
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  aiToolId?: string;
  page?: number;
  limit?: number;
  search?: string;
  isFeatured?: boolean;
}) => {
  return useQuery<AIReviewsResponse>({
    queryKey: ['ai-reviews', params],
    queryFn: () => aiReviewsApi.getAIReviews(params),
  });
};

export const useAIReviewBySlug = (slug: string) => {
  return useQuery<AIReview>({
    queryKey: ['ai-review', slug],
    queryFn: () => aiReviewsApi.getAIReviewBySlug(slug),
    enabled: !!slug,
  });
};

export const useCreateAIReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAIReviewDto) => aiReviewsApi.createAIReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-reviews'] });
    },
  });
};

export const useUpdateAIReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAIReviewDto }) =>
      aiReviewsApi.updateAIReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-reviews'] });
    },
  });
};

export const useDeleteAIReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => aiReviewsApi.deleteAIReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-reviews'] });
    },
  });
};
