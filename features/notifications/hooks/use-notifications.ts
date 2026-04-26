import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotificationsFn,
  markAsReadFn,
  markAllAsReadFn,
} from "../api/notifications.api";

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken") || "";
  }
  return "";
};

export const useNotifications = (params?: {
  limit?: number;
  offset?: number;
}) => {
  const token = getToken();

  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => getNotificationsFn(params || {}, token),
    enabled: !!token,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markAsReadFn(id, getToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllAsReadFn(getToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
