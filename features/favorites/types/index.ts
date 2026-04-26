export type FavoriteItemType = "COURSE" | "AITOOL" | "PROMPT" | "POST";

export interface FavoriteResponse {
  id: string;
  itemType: FavoriteItemType;
  itemId: string;
  createdAt: string;
  details: {
    name: string;
    thumbnailUrl: string;
    price: number;
    oldPrice: number | null;
    slug: string;
  };
}

export interface ToggleFavoriteRequest {
  itemType: FavoriteItemType;
  itemId: string;
}

export interface ToggleFavoriteResponse {
  isFavorited: boolean;
  message: string;
}
