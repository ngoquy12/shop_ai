export interface CartItemResponse {
  id: string;
  cartId: string;
  itemType: "COURSE" | "AITOOL" | "PROMPT";
  itemId: string;
  quantity: number;
  name: string;
  thumbnailUrl: string;
  price: number;
  oldPrice?: number;
}

export interface CartResponse {
  id: string;
  userId: string;
  items: CartItemResponse[];
  totalAmount: number;
}

export interface AddToCartRequest {
  itemType: "COURSE" | "AITOOL" | "PROMPT";
  itemId: string;
  quantity?: number;
}

export interface CheckoutResponse {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  transferContent: string;
}
