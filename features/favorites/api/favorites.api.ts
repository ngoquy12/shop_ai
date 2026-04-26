import { apiClient } from "@/lib/api-client";
import {
  FavoriteItemType,
  FavoriteResponse,
  ToggleFavoriteRequest,
  ToggleFavoriteResponse,
} from "../types";

export const getFavoritesFn = async (
  itemType?: FavoriteItemType,
): Promise<FavoriteResponse[]> => {
  const url = itemType ? `/favorites?itemType=${itemType}` : "/favorites";
  const res = await apiClient.get<FavoriteResponse[]>(url);
  return res.data;
};

export const toggleFavoriteFn = async (
  data: ToggleFavoriteRequest,
): Promise<ToggleFavoriteResponse> => {
  const res = await apiClient.post<ToggleFavoriteResponse>(
    "/favorites/toggle",
    data,
  );
  return res.data;
};
