import { apiClient } from "@/lib/api-client";
import type {
  ManualDepositRequest,
  DepositRequest,
  DepositComment,
} from "../types/manual-deposit.types";

export const uploadDepositProofImagesFn = async (
  files: File[],
): Promise<{ urls: string[] }> => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // Validate file sizes before uploading
  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`Ảnh chứng từ có kích thước vượt quá 5MB`);
    }
  }

  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const response = await apiClient.post<{ urls: string[] }>(
    "/wallets/deposits/upload-proof-images",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const createManualDepositFn = async (
  data: ManualDepositRequest,
): Promise<DepositRequest> => {
  const response = await apiClient.post<DepositRequest>(
    "/wallets/deposits/manual",
    data,
  );
  return response.data;
};

export const getMyDepositRequestsFn = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: DepositRequest[]; pagination: unknown }> => {
  const response = await apiClient.get<{
    data: DepositRequest[];
    pagination: unknown;
  }>("/wallets/deposits/my", { params });
  return response.data;
};

export const getAllDepositRequestsFn = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: DepositRequest[]; pagination: unknown }> => {
  const response = await apiClient.get<{
    data: DepositRequest[];
    pagination: unknown;
  }>("/wallets/deposits/admin/all", { params });
  return response.data;
};

export const approveDepositFn = async (
  id: string,
  data: { actualAmount: number; adminNote?: string },
): Promise<unknown> => {
  const response = await apiClient.post(
    `/wallets/deposits/admin/${id}/approve`,
    data,
  );
  return response.data;
};

export const rejectDepositFn = async (
  id: string,
  data: { reason: string },
): Promise<DepositRequest> => {
  const response = await apiClient.post<DepositRequest>(
    `/wallets/deposits/admin/${id}/reject`,
    data,
  );
  return response.data;
};

export const createDepositCommentFn = async (
  id: string,
  data: { content: string },
): Promise<DepositComment> => {
  const response = await apiClient.post<DepositComment>(
    `/wallets/deposits/${id}/comments`,
    data,
  );
  return response.data;
};

export const getDepositCommentsFn = async (
  id: string,
): Promise<DepositComment[]> => {
  const response = await apiClient.get<DepositComment[]>(
    `/wallets/deposits/${id}/comments`,
  );
  return response.data;
};
