import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  hasMore: boolean;
}

export const getNotificationsFn = async (
  params: { limit?: number; offset?: number },
  token: string,
): Promise<NotificationsResponse> => {
  const response = await axios.get(`${API_BASE}/notifications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
  return response.data;
};

export const markAsReadFn = async (
  id: string,
  token: string,
): Promise<void> => {
  await axios.patch(
    `${API_BASE}/notifications/${id}/read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const markAllAsReadFn = async (token: string): Promise<void> => {
  await axios.patch(
    `${API_BASE}/notifications/read-all`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
