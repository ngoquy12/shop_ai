import { apiClient } from "@/lib/api-client";
import { AuthResponse, UpdateProfileData } from "../types";

export const loginFn = async (data: { email: string; password: string }) => {
  const response = await apiClient.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const firebaseLoginFn = async (data: { idToken: string }) => {
  const response = await apiClient.post<AuthResponse>(
    "/auth/firebase-login",
    data,
  );
  return response.data;
};

export const registerFn = async (data: {
  email: string;
  password: string;
  fullName: string;
}) => {
  const response = await apiClient.post<AuthResponse>("/auth/register", data);
  return response.data;
};

export const logoutFn = async () => {
  const response = await apiClient.post("/auth/logout");
  return response.data;
};

export const verifyEmailFn = async (data: {
  email: string;
  otpCode: string;
}) => {
  const response = await apiClient.post("/auth/verify-email", data);
  return response.data;
};

export const sendVerificationEmailFn = async (data: { email: string }) => {
  const response = await apiClient.post("/auth/send-verification", data);
  return response.data;
};

export const getProfileFn = async () => {
  const response = await apiClient.get("/auth/profile");
  return response.data;
};

export const updateProfileFn = async (data: UpdateProfileData) => {
  const response = await apiClient.patch("/auth/profile", data);
  return response.data;
};

export const uploadAvatarFn = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.patch("/auth/profile/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const forgotPasswordFn = async (data: { email: string }) => {
  const response = await apiClient.post("/auth/forgot-password", data);
  return response.data;
};

export const verifyResetOtpFn = async (data: {
  email: string;
  otpCode: string;
}) => {
  const response = await apiClient.post("/auth/verify-reset-otp", data);
  return response.data;
};

export const resetPasswordFn = async (data: {
  email: string;
  otpCode: string;
  newPassword: string;
}) => {
  const response = await apiClient.post("/auth/reset-password", data);
  return response.data;
};
