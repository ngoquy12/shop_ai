"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, X } from "lucide-react";
import { useNotifications, useMarkAllAsRead } from "../hooks/use-notifications";
import { useSocket } from "../hooks/use-socket";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export function NotificationDropdown() {
  const { data, isLoading } = useNotifications({ limit: 10 });
  const markAllAsRead = useMarkAllAsRead();
  const queryClient = useQueryClient();
  useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = data?.notifications.filter((n) => !n.isRead).length || 0;

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Listen for new notifications from socket
  useSocket();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative w-9 h-9 rounded-lg flex items-center justify-center hover:bg-accent text-muted-foreground transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border/60 bg-card shadow-2xl z-20 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
            <p className="font-semibold text-sm">Thông báo</p>
            {unreadCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAllAsRead();
                }}
                className="text-xs text-blue-400 hover:underline"
                disabled={markAllAsRead.isPending}
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Đang tải...
            </div>
          ) : !data || data.notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Chưa có thông báo nào
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {data.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b border-border/30 hover:bg-accent/50 transition-colors cursor-pointer ${
                    !notification.isRead ? "bg-blue-50/30" : ""
                  }`}
                  onClick={() => {
                    // Handle notification click
                    queryClient.invalidateQueries({
                      queryKey: ["notifications"],
                    });
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      {notification.type === "DEPOSIT_REQUEST_APPROVED" && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                      {notification.type === "DEPOSIT_REQUEST_REJECTED" && (
                        <X className="w-4 h-4 text-red-600" />
                      )}
                      {notification.type === "DEPOSIT_REQUEST_CREATED" && (
                        <Bell className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-2">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {data?.hasMore && (
            <div className="px-4 py-3 border-t border-border/50 text-center">
              <button className="text-xs text-blue-400 hover:underline">
                Xem tất cả thông báo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
