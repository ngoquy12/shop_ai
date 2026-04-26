import { useMutation } from "@tanstack/react-query";
import { forgotPasswordFn, verifyResetOtpFn, resetPasswordFn } from "../api/auth.api";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPasswordFn,
  });
};

export const useVerifyResetOtp = () => {
  return useMutation({
    mutationFn: verifyResetOtpFn,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPasswordFn,
  });
};
