import { apiClient } from '@/lib/api-client';
import { AddToCartRequest, CartResponse } from '../types';

export const getCartFn = async (): Promise<CartResponse> => {
  const response = await apiClient.get('/carts');
  return response.data as CartResponse; // response.data because apiClient interceptor might unwrap { success, data }
};

export const addToCartFn = async (data: AddToCartRequest) => {
  const response = await apiClient.post('/carts/add', data);
  return response;
};

export const checkoutCartFn = async (data?: { couponCode?: string }) => {
  const response = await apiClient.post('/orders/checkout', data || {});
  return response.data; // { orderId, orderNumber, totalAmount, transferContent }
};

export const removeFromCartFn = async (itemId: string) => {
  const response = await apiClient.delete(`/carts/items/${itemId}`);
  return response.data;
};

export const clearCartFn = async () => {
  const response = await apiClient.delete('/carts');
  return response.data;
};
