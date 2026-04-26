import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export const useMyOrders = () => {
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const response = await apiClient.get("/orders/me");
      // Backend returns PaginatedResponse { data, meta } or { success, data }
      // Assuming TransformResponseInterceptor returns result directly as seen in api-client interceptor line 44
      return response as unknown as { data: unknown[]; meta?: unknown };
    },
  });
};
