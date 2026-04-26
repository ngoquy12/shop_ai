import { apiClient } from "@/lib/api-client";
import { BaseApiResponse } from "@/features/auth/types";

export interface SessionData {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  deviceType: string | null;
  os: string | null;
  browser: string | null;
  location: string | null;
  isRevoked: boolean;
  lastActive: string;
  createdAt: string;
}

export const getSessionsFn = async (): Promise<SessionData[]> => {
  const response = await apiClient.get<BaseApiResponse<SessionData[]>>('/sessions');
  return response.data.data;
};

export const revokeSessionFn = async (sessionId: string) => {
  const response = await apiClient.delete<BaseApiResponse<{ success: boolean; message: string }>>(`/sessions/${sessionId}`);
  return response.data.data;
};
