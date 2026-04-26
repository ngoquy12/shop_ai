"use client";

import { useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Laptop,
  Smartphone,
  MapPin,
  Globe,
  Clock,
  ShieldAlert,
  LogOut,
  Loader2,
} from "lucide-react";
import Cookies from "js-cookie";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useGetSessions, useRevokeSession } from "../hooks/use-sessions";
import { SessionData } from "../api/session.api";

export function LoginHistory() {
  const { data: sessions, isLoading } = useGetSessions();
  const { mutate: revokeSession, isPending: isRevoking } = useRevokeSession();

  const [selectedSessionRevoke, setSelectedSessionRevoke] =
    useState<SessionData | null>(null);

  const currentSessionId = Cookies.get("sessionId");

  const confirmRevoke = () => {
    if (!selectedSessionRevoke) return;
    revokeSession(selectedSessionRevoke.id, {
      onSettled: () => setSelectedSessionRevoke(null),
    });
  };

  const getDeviceIcon = (type: string | null) => {
    if (!type) return <Laptop className="w-5 h-5 text-slate-500" />;
    const normalized = type.toLowerCase();
    if (normalized.includes("mobile") || normalized.includes("tablet")) {
      return <Smartphone className="w-5 h-5 text-slate-500" />;
    }
    return <Laptop className="w-5 h-5 text-slate-500" />;
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-40" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold text-slate-800">
              Lịch Sử Đăng Nhập
            </CardTitle>
            <CardDescription className="mt-1">
              Quản lý các thiết bị và trình duyệt đang được sử dụng để truy cập
              tài khoản của bạn.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            className="text-red-500 border-red-200 hover:bg-red-50"
            disabled={sessions?.length === 1}
          >
            <LogOut className="w-4 h-4 mr-2" /> Đăng xuất tất cả thiết bị khác
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions?.length === 0 && (
          <div className="text-center p-8 text-slate-500">
            Không có dữ liệu lịch sử đăng nhập.
          </div>
        )}

        {sessions?.map((session) => {
          const isCurrentDevice = session.id === currentSessionId;
          const isSuspect = false; // Could check if location is very different from usual

          return (
            <div
              key={session.id}
              className={`p-4 border rounded-xl flex items-center justify-between gap-4 transition-all ${
                isCurrentDevice
                  ? "border-blue-200 bg-blue-50/50"
                  : isSuspect
                    ? "border-amber-200 bg-amber-50/50"
                    : session.isRevoked
                      ? "border-slate-100 bg-slate-50 opacity-60 grayscale"
                      : "border-slate-100 hover:bg-slate-50"
              }`}
            >
              {/* Cột trái: Icon thiết bị */}
              <div
                className={`p-3 shrink-0 rounded-full ${isCurrentDevice ? "bg-blue-100" : "bg-slate-100"}`}
              >
                {getDeviceIcon(session.deviceType)}
              </div>

              {/* Cột giữa: Thông tin chính */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-800">
                    {session.browser || "Trình duyệt Web"} trên{" "}
                    {session.os || "Hệ điều hành lạ"}
                  </span>
                  {isCurrentDevice && (
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-transparent text-xs">
                      Thiết bị hiện tại
                    </Badge>
                  )}
                  {isSuspect && (
                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-transparent text-xs gap-1">
                      <ShieldAlert className="w-3 h-3" /> Đáng ngờ
                    </Badge>
                  )}
                  {session.isRevoked && (
                    <Badge variant="outline" className="text-slate-500 text-xs">
                      Đã thu hồi
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-slate-500 mt-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span
                      className="truncate"
                      title={session.location || "Không rõ vị trí"}
                    >
                      {session.location || "Không rõ vị trí"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 shrink-0" />
                    <span>{session.ipAddress || "IP Ẩn"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {isCurrentDevice
                        ? `Đang hoạt động (Khởi tạo: ${format(new Date(session.createdAt), "dd/MM/yyyy", { locale: vi })})`
                        : format(
                            new Date(session.lastActive),
                            "dd/MM/yyyy HH:mm",
                            { locale: vi },
                          )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cột phải: Hành động */}
              {!isCurrentDevice && !session.isRevoked && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
                  onClick={() => setSelectedSessionRevoke(session)}
                  disabled={isRevoking}
                >
                  Thu hồi
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>

      {/* Modal Xác Nhận Thu Hồi */}
      <Dialog
        open={!!selectedSessionRevoke}
        onOpenChange={(open) => !open && setSelectedSessionRevoke(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thu hồi phiên đăng nhập?</DialogTitle>
            <DialogDescription>
              Bạn đang chuẩn bị đăng xuất tài khoản khỏi thiết bị
              <span className="font-semibold text-slate-800 mx-1">
                {selectedSessionRevoke?.browser} trên{" "}
                {selectedSessionRevoke?.os}
              </span>
              ({selectedSessionRevoke?.location}).
            </DialogDescription>
          </DialogHeader>
          <div className="bg-slate-50 p-3 rounded-md text-sm text-slate-600 border border-slate-100">
            Hành động này sẽ buộc thiết bị kia phải đăng nhập lại lập tức (ngay
            cả khi họ đang thao tác trên trang).
          </div>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setSelectedSessionRevoke(null)}
              disabled={isRevoking}
            >
              Hủy bỏ
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRevoke}
              disabled={isRevoking}
            >
              {isRevoking ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Đồng ý thu hồi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
