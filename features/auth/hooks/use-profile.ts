import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfileFn, updateProfileFn, uploadAvatarFn } from "../api/auth.api";
import { User } from "../types";

export const useProfile = () => {
  return useQuery<User>({
    queryKey: ["user-profile"],
    queryFn: getProfileFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileFn,
    onSuccess: (data) => {
      queryClient.setQueryData(["user-profile"], data);
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadAvatarFn,
    onSuccess: (data) => {
      // Update the user profile cache with the new avatar
      queryClient.setQueryData(["user-profile"], data);
    },
  });
};
