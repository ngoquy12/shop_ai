import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSessionsFn, revokeSessionFn } from "../api/session.api";
import { toast } from "sonner";

export const useGetSessions = () => {
  return useQuery({
    queryKey: ["user-sessions"],
    queryFn: getSessionsFn,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useRevokeSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: revokeSessionFn,
    onSuccess: () => {
      // Refresh the session list after successfully kicking someone out
      queryClient.invalidateQueries({ queryKey: ["user-sessions"] });
      toast.success("Đã thu hồi phiên đăng nhập thành công.");
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Không thể thu hồi phiên. Vui lòng thử lại sau.";
      toast.error(message);
    },
  });
};
