"use client";

import Link from "next/link";
import { ShieldOff, ArrowLeft, Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <ShieldOff className="w-10 h-10 text-red-500" />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          403 — Không có quyền truy cập
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Bạn không có quyền truy cập
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Trang này yêu cầu đăng nhập hoặc bạn không có đủ quyền để xem nội dung
          này. Vui lòng đăng nhập hoặc liên hệ quản trị viên.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
          >
            <Link href="/dang-nhap">
              <LogIn className="w-4 h-4 mr-2" />
              Đăng nhập
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Trang chủ
            </Link>
          </Button>
        </div>

        {/* Back link */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại trang trước
        </button>
      </div>
    </div>
  );
}
