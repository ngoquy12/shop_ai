import { useEffect, useState, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useQueryClient } from "@tanstack/react-query";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000; // 3 seconds

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const user = useAuthStore((state) => state.user);
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectWithRetryRef = useRef<(() => void) | null>(null);

  const connectWithRetry = useCallback(() => {
    if (!user) {
      console.log(
        "[DEBUG] [useSocket] No user found, skipping socket connection",
      );
      return;
    }

    if (retryCountRef.current >= MAX_RETRIES) {
      console.error(
        "[DEBUG] [useSocket] Max retries reached, stopping reconnection attempts",
      );
      return;
    }

    console.log(
      `[DEBUG] [useSocket] Connection attempt ${retryCountRef.current + 1}/${MAX_RETRIES}`,
    );
    console.log(
      "[DEBUG] [useSocket] Initializing socket connection for user:",
      user.id,
    );
    console.log("[DEBUG] [useSocket] Socket URL:", SOCKET_URL);

    const socketInstance = io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem("accessToken"),
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: RETRY_DELAY_MS,
      reconnectionAttempts: MAX_RETRIES,
    });

    socketRef.current = socketInstance;

    socketInstance.on("connect", () => {
      console.log("[DEBUG] [useSocket] Socket connected:", socketInstance.id);
      setIsConnected(true);
      retryCountRef.current = 0; // Reset retry count on successful connection
      // Join user room
      socketInstance.emit("join:user", { userId: user.id });
      console.log("[DEBUG] [useSocket] Joined user room:", `user:${user.id}`);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("[DEBUG] [useSocket] Socket disconnected, reason:", reason);
      setIsConnected(false);

      // If disconnect was not intentional, increment retry count
      if (reason !== "io client disconnect") {
        retryCountRef.current++;
      }
    });

    socketInstance.on("connect_error", (error) => {
      console.error("[DEBUG] [useSocket] Socket connection error:", error);
      retryCountRef.current++;

      if (retryCountRef.current < MAX_RETRIES) {
        console.log(`[DEBUG] [useSocket] Retrying in ${RETRY_DELAY_MS}ms...`);
        retryTimeoutRef.current = setTimeout(() => {
          connectWithRetryRef.current?.();
        }, RETRY_DELAY_MS);
      }
    });

    // Listen for new notifications
    socketInstance.on("notification:new", (data) => {
      console.log(
        "[DEBUG] [useSocket] ============================================",
      );
      console.log("[DEBUG] [useSocket] Received notification:new event:", data);
      console.log("[DEBUG] [useSocket] Notification data:", {
        id: data.notification?.id,
        userId: data.notification?.userId,
        type: data.notification?.type,
        title: data.notification?.title,
      });

      console.log(
        "[DEBUG] [useSocket] About to invalidate notifications query",
      );
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      console.log("[DEBUG] [useSocket] Invalidated notifications query");

      console.log("[DEBUG] [useSocket] About to invalidate wallets query");
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      console.log("[DEBUG] [useSocket] Invalidated wallets query");
      console.log(
        "[DEBUG] [useSocket] ============================================",
      );
    });

    // Listen for deposit request updates
    socketInstance.on("deposit_request:updated", (data) => {
      console.log(
        "[DEBUG] [useSocket] ============================================",
      );
      console.log(
        "[DEBUG] [useSocket] Received deposit_request:updated event:",
        data,
      );
      console.log("[DEBUG] [useSocket] Deposit request data:", {
        id: data.depositRequest?.id,
        userId: data.depositRequest?.userId,
        amount: data.depositRequest?.amount,
        status: data.depositRequest?.status,
      });

      console.log("[DEBUG] [useSocket] About to invalidate wallets query");
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      console.log("[DEBUG] [useSocket] Invalidated wallets query");

      console.log(
        "[DEBUG] [useSocket] About to invalidate notifications query",
      );
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      console.log("[DEBUG] [useSocket] Invalidated notifications query");
      console.log(
        "[DEBUG] [useSocket] ============================================",
      );
    });
  }, [user, queryClient]);

  useEffect(() => {
    connectWithRetryRef.current = connectWithRetry;
  }, [connectWithRetry]);

  useEffect(() => {
    connectWithRetry();

    return () => {
      console.log("[DEBUG] [useSocket] Cleaning up socket connection");
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setIsConnected(false);
      retryCountRef.current = 0;
    };
  }, [user, connectWithRetry]);

  return { isConnected };
};

export const useAdminSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectWithRetryRef = useRef<(() => void) | null>(null);

  const connectWithRetry = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.log(
        "[DEBUG] [useAdminSocket] No token found, skipping admin socket connection",
      );
      return;
    }

    if (retryCountRef.current >= MAX_RETRIES) {
      console.error(
        "[DEBUG] [useAdminSocket] Max retries reached, stopping reconnection attempts",
      );
      return;
    }

    console.log(
      `[DEBUG] [useAdminSocket] Connection attempt ${retryCountRef.current + 1}/${MAX_RETRIES}`,
    );
    console.log(
      "[DEBUG] [useAdminSocket] Initializing admin socket connection",
    );
    console.log("[DEBUG] [useAdminSocket] Socket URL:", SOCKET_URL);

    const socketInstance = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: RETRY_DELAY_MS,
      reconnectionAttempts: MAX_RETRIES,
    });

    socketRef.current = socketInstance;

    socketInstance.on("connect", () => {
      console.log(
        "[DEBUG] [useAdminSocket] ============================================",
      );
      console.log(
        "[DEBUG] [useAdminSocket] Admin socket connected:",
        socketInstance.id,
      );
      setIsConnected(true);
      retryCountRef.current = 0; // Reset retry count on successful connection
      // Join admin deposits room
      socketInstance.emit("join:admin:deposits");
      console.log("[DEBUG] [useAdminSocket] Joined admin:deposits room");
      console.log(
        "[DEBUG] [useAdminSocket] ============================================",
      );
    });

    socketInstance.on("disconnect", (reason) => {
      console.log(
        "[DEBUG] [useAdminSocket] Admin socket disconnected, reason:",
        reason,
      );
      setIsConnected(false);

      // If disconnect was not intentional, increment retry count
      if (reason !== "io client disconnect") {
        retryCountRef.current++;
      }
    });

    socketInstance.on("connect_error", (error) => {
      console.error(
        "[DEBUG] [useAdminSocket] Admin socket connection error:",
        error,
      );
      retryCountRef.current++;

      if (retryCountRef.current < MAX_RETRIES) {
        console.log(
          `[DEBUG] [useAdminSocket] Retrying in ${RETRY_DELAY_MS}ms...`,
        );
        retryTimeoutRef.current = setTimeout(() => {
          connectWithRetryRef.current?.();
        }, RETRY_DELAY_MS);
      }
    });

    // Listen for deposit request created
    socketInstance.on("deposit_request:created", (data) => {
      console.log(
        "[DEBUG] [useAdminSocket] ============================================",
      );
      console.log(
        "[DEBUG] [useAdminSocket] Received deposit_request:created event:",
        data,
      );
      console.log("[DEBUG] [useAdminSocket] Deposit request data:", {
        id: data.depositRequest?.id,
        userId: data.depositRequest?.userId,
        amount: data.depositRequest?.amount,
        status: data.depositRequest?.status,
      });

      console.log(
        "[DEBUG] [useAdminSocket] About to invalidate admin-deposits query",
      );
      queryClient.invalidateQueries({ queryKey: ["admin-deposits"] });
      console.log("[DEBUG] [useAdminSocket] Invalidated admin-deposits query");
      console.log(
        "[DEBUG] [useAdminSocket] ============================================",
      );
    });

    // Listen for deposit request updated
    socketInstance.on("deposit_request:updated", (data) => {
      console.log(
        "[DEBUG] [useAdminSocket] ============================================",
      );
      console.log(
        "[DEBUG] [useAdminSocket] Received deposit_request:updated event:",
        data,
      );
      console.log("[DEBUG] [useAdminSocket] Deposit request data:", {
        id: data.depositRequest?.id,
        userId: data.depositRequest?.userId,
        amount: data.depositRequest?.amount,
        status: data.depositRequest?.status,
      });

      console.log(
        "[DEBUG] [useAdminSocket] About to invalidate admin-deposits query",
      );
      queryClient.invalidateQueries({ queryKey: ["admin-deposits"] });
      console.log("[DEBUG] [useAdminSocket] Invalidated admin-deposits query");
      console.log(
        "[DEBUG] [useAdminSocket] ============================================",
      );
    });
  }, [queryClient]);

  useEffect(() => {
    connectWithRetryRef.current = connectWithRetry;
  }, [connectWithRetry]);

  useEffect(() => {
    connectWithRetry();

    return () => {
      console.log(
        "[DEBUG] [useAdminSocket] Cleaning up admin socket connection",
      );
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setIsConnected(false);
      retryCountRef.current = 0;
    };
  }, [queryClient, connectWithRetry]);

  return { isConnected };
};
