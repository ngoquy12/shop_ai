import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFavoritesFn, toggleFavoriteFn } from "../api/favorites.api";
import { FavoriteItemType, ToggleFavoriteRequest } from "../types";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/auth.store";

export const favoriteKeys = {
  all: ["favorites"] as const,
  lists: () => [...favoriteKeys.all, "list"] as const,
  list: (itemType?: FavoriteItemType) =>
    [...favoriteKeys.lists(), { itemType }] as const,
};

export const useFavorites = (itemType?: FavoriteItemType) => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: favoriteKeys.list(itemType),
    queryFn: () => getFavoritesFn(itemType),
    staleTime: 1000 * 60, // 1 min
    enabled: isAuthenticated,
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ToggleFavoriteRequest) => toggleFavoriteFn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.all });
    },
    onError: (error: unknown) => {
      toast.error((error as Error)?.message || "Lỗi khi cập nhật yêu thích");
    },
  });
};
