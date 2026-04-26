import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createManualDepositFn,
  getMyDepositRequestsFn,
  getAllDepositRequestsFn,
  approveDepositFn,
  rejectDepositFn,
  createDepositCommentFn,
  getDepositCommentsFn,
} from "../api/manual-deposits.api";
import type { ManualDepositRequest } from "../types/manual-deposit.types";

export const useCreateManualDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ManualDepositRequest) => {
      console.log("[DEBUG] [useCreateManualDeposit] Called with data:", data);
      return createManualDepositFn(data);
    },
    onSuccess: (result) => {
      console.log("[DEBUG] [useCreateManualDeposit] Success, result:", result);
      queryClient.invalidateQueries({ queryKey: ["my-deposit-requests"] });
    },
    onError: (error) => {
      console.error("[DEBUG] [useCreateManualDeposit] Error:", error);
    },
  });
};

export const useMyDepositRequests = (params?: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  console.log("[DEBUG] [useMyDepositRequests] Called with params:", params);

  return useQuery({
    queryKey: ["my-deposit-requests", params],
    queryFn: async () => {
      console.log("[DEBUG] [useMyDepositRequests] Calling API...");
      try {
        const result = await getMyDepositRequestsFn(params);
        console.log("[DEBUG] [useMyDepositRequests] API response:", result);
        return result;
      } catch (error) {
        console.error("[DEBUG] [useMyDepositRequests] API error:", error);
        throw error;
      }
    },
  });
};

export const useAllDepositRequests = (params?: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["all-deposit-requests", params],
    queryFn: () => getAllDepositRequestsFn(params),
  });
};

export const useApproveDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { actualAmount: number; adminNote?: string };
    }) => approveDepositFn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-deposit-requests"] });
    },
  });
};

export const useRejectDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { reason: string } }) =>
      rejectDepositFn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-deposit-requests"] });
    },
  });
};

export const useCreateDepositComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { content: string } }) =>
      createDepositCommentFn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deposit-comments"] });
    },
  });
};

export const useDepositComments = (id: string) => {
  return useQuery({
    queryKey: ["deposit-comments", id],
    queryFn: () => getDepositCommentsFn(id),
    enabled: !!id,
  });
};
