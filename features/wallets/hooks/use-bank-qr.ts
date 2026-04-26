import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

interface BankQRInfo {
  bankName: string;
  bankAccountNo: string;
  bankAccountName: string;
  qrImageUrl: string | null;
}

interface ApiResponse {
  success: boolean;
  data: BankQRInfo;
}

export const useBankQR = (isOpen: boolean) => {
  return useQuery({
    queryKey: ["bank-qr"],
    queryFn: async (): Promise<BankQRInfo> => {
      const response = (await apiClient.get<ApiResponse>(
        "/config/bank-qr",
      )) as unknown as ApiResponse;
      return response.data;
    },
    enabled: isOpen,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
