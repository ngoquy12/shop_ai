"use client";

import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/auth.store";
import { toast } from "sonner";

export function useSessionGuardian() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const sessionId = Cookies.get("sessionId");
    
    // Nếu không có session (chưa đăng nhập), không cần kết nối
    if (!sessionId) return;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || "http://localhost:8080";
    const socket: Socket = io(`${baseUrl}/sessions`, {
      path: "/socket.io", 
      query: {
        sessionId: sessionId,
      },
      transports: ["websocket"]
    });

    socket.on("connect", () => {
      console.log("Connected to Real-time Session Guardian.");
    });

    socket.on("session_revoked", (payload: { message: string, terminated: boolean }) => {
      console.warn("🔔 Session Revoked Event:", payload);
      
      // Xóa tất cả token 
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove("sessionId");
      logout();

      // Hiển thị thông báo và chuyển hướng
      toast.error(payload.message || "Phiên đăng nhập của bạn đã bị thu hồi.");
      router.push("/dang-nhap");
    });

    socket.on("connect_error", (err: Error) => {
      console.error("Socket connect_error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [logout, router]);
}
