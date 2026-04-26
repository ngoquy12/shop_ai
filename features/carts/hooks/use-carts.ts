import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AddToCartRequest, CartResponse } from "../types";
import { toast } from "sonner";
import {
  addToCartFn,
  checkoutCartFn,
  clearCartFn,
  getCartFn,
  removeFromCartFn,
} from "../api/carts.api";

export const cartKeys = {
  all: ["carts"] as const,
  myCart: () => [...cartKeys.all, "my-cart"] as const,
};

export const useMyCart = () => {
  return useQuery<CartResponse>({
    queryKey: cartKeys.myCart(),
    queryFn: getCartFn,
    staleTime: 1000 * 60, // 1 minute
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartRequest) => addToCartFn(data),
    onSuccess: () => {
      // Invalidate cart query to refetch the new total items number
      queryClient.invalidateQueries({ queryKey: cartKeys.myCart() });
    },
    onError: (error: unknown) => {
      toast.error(
        (error as Error)?.message || "Có lỗi xảy ra khi thêm vào giỏ hàng",
      );
    },
  });
};

export const useCheckoutCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data?: { couponCode?: string }) => checkoutCartFn(data),
    onSuccess: () => {
      // Clear cart
      queryClient.setQueryData<CartResponse | undefined>(
        cartKeys.myCart(),
        (old) => {
          if (!old) return old;
          return { ...old, items: [], totalAmount: 0 };
        },
      );
      queryClient.invalidateQueries({ queryKey: cartKeys.myCart() });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => removeFromCartFn(itemId),
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.myCart() });
      const previousCart = queryClient.getQueryData<CartResponse>(
        cartKeys.myCart(),
      );

      if (previousCart) {
        queryClient.setQueryData<CartResponse>(cartKeys.myCart(), (old) => {
          if (!old) return old;
          const newItems = old.items.filter((i) => i.itemId !== itemId);
          const newTotal = newItems.reduce(
            (acc, curr) => acc + curr.price * curr.quantity,
            0,
          );
          return { ...old, items: newItems, totalAmount: newTotal };
        });
      }
      return { previousCart };
    },
    onError: (_err, _newVal, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.myCart(), context.previousCart);
      }
      toast.error("Có lỗi xảy ra khi xóa sản phẩm");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.myCart() });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => clearCartFn(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: cartKeys.myCart() });
      const previousCart = queryClient.getQueryData<CartResponse>(
        cartKeys.myCart(),
      );
      if (previousCart) {
        queryClient.setQueryData<CartResponse>(cartKeys.myCart(), (old) => {
          if (!old) return old;
          return { ...old, items: [], totalAmount: 0 };
        });
      }
      return { previousCart };
    },
    onError: (_err, _newVal, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.myCart(), context.previousCart);
      }
      toast.error("Có lỗi xảy ra khi dọn dẹp giỏ hàng");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.myCart() });
    },
  });
};
