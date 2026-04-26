import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getBalanceFn,
  createDepositFn,
  getTransactionsFn,
} from "../api/wallets.api";
import { DepositRequest } from "../types";
import { toast } from "sonner";

export const walletKeys = {
  all: ["wallets"] as const,
  balance: () => [...walletKeys.all, "balance"] as const,
  transactions: () => [...walletKeys.all, "transactions"] as const,
};

export const useBalance = () => {
  return useQuery({
    queryKey: walletKeys.balance(),
    queryFn: getBalanceFn,
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useCreateDeposit = () => {
  return useMutation({
    mutationFn: (data: DepositRequest) => createDepositFn(data),
    onError: (error: unknown) => {
      toast.error(
        (error as Error)?.message || "Có lỗi xảy ra khi tạo mã nạp tiền",
      );
    },
  });
};

export const useWalletTransactions = () => {
  return useQuery({
    queryKey: walletKeys.transactions(),
    queryFn: getTransactionsFn,
    staleTime: 1000 * 60, // 1 minute
  });
};
