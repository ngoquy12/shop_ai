"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        {/* 404 Number */}
        <div className="relative mb-8">
          <div className="text-[180px] md:text-[220px] font-bold bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-none opacity-20 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center backdrop-blur-sm border border-violet-500/30">
              <Sparkles className="w-16 h-16 md:w-20 md:h-20 text-violet-400" />
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Trang không tìm thấy
        </h1>
        <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/">
            <Button
              variant="default"
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 border-0 text-white font-semibold h-12 px-8"
            >
              <Home className="w-5 h-5 mr-2" />
              Về trang chủ
            </Button>
          </Link>
        </div>

        {/* Search Suggestion */}
        <div className="mt-12 p-6 rounded-xl bg-slate-900/50 border border-slate-800 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2 text-slate-400 mb-4">
            <Search className="w-5 h-5" />
            <span className="text-sm">Bạn có thể tìm kiếm:</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/cong-cu-ai"
              className="px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white text-sm transition-colors border border-slate-700 hover:border-slate-600"
            >
              Công cụ AI
            </Link>
            <Link
              href="/khoa-hoc"
              className="px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white text-sm transition-colors border border-slate-700 hover:border-slate-600"
            >
              Khóa học AI
            </Link>
            <Link
              href="/gio-hang"
              className="px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white text-sm transition-colors border border-slate-700 hover:border-slate-600"
            >
              Giỏ hàng
            </Link>
            <Link
              href="/tai-khoan"
              className="px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white text-sm transition-colors border border-slate-700 hover:border-slate-600"
            >
              Tài khoản
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-slate-500 text-sm">
          Cần giúp đỡ?{" "}
          <Link
            href="/contact"
            className="text-violet-400 hover:text-violet-300 underline"
          >
            Liên hệ với chúng tôi
          </Link>
        </p>
      </div>
    </div>
  );
}
