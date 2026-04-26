"use client";

import { useState } from "react";
import {
  Search,
  ChevronRight,
  Shapes,
  Megaphone,
  ShoppingCart,
  PenTool,
  Video,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useGetPrompts } from "@/hooks/use-prompts";
import { ChatbotCard } from "@/components/chatbot-card";

const stagger = {
  show: { transition: { staggerChildren: 0.05 } },
};
const CATEGORIES = [
  { id: "all", name: "Tất cả", icon: Shapes },
  { id: "marketing", name: "Marketing", icon: Megaphone },
  { id: "sales", name: "Bán hàng", icon: ShoppingCart },
  { id: "content", name: "Nội dung", icon: PenTool },
  { id: "video", name: "Video", icon: Video },
];

export default function ChatbotListingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [activeType, setActiveType] = useState("all");
  const [sort, setSort] = useState("all");
  const [playingVideo, setPlayingVideo] = useState<{
    url: string;
    title: string;
    author: string;
  } | null>(null);

  // Mapping FE categories/types/sort to BE API params
  const { data, isLoading, isError } = useGetPrompts({
    search: searchTerm,
    categoryId: activeCat !== "all" ? activeCat : undefined,
    isFree:
      activeType === "free" ? true : activeType === "paid" ? false : undefined,
    sortBy:
      sort === "all"
        ? "createdAt"
        : sort === "priceAsc" || sort === "priceDesc"
          ? "price"
          : sort === "soldAsc" || sort === "soldDesc"
            ? "purchaseCount"
            : "createdAt",
    sortOrder: sort.endsWith("Asc") ? "asc" : "desc",
    limit: 100,
  });

  // data is now explicitly Prompt[] from the hook
  const filteredData = Array.isArray(data) ? data : [];

  return (
    <div className="min-h-screen bg-[#070708] pb-20">
      <Dialog
        open={!!playingVideo}
        onOpenChange={(open) => !open && setPlayingVideo(null)}
      >
        <DialogContent
          className="w-auto sm:max-w-none max-w-[95vw] h-[90vh] sm:h-[85vh] aspect-9/16 p-0 border-none bg-[#0c0c0d] overflow-hidden rounded-xl shadow-2xl [&>button]:text-white z-100 mx-auto flex flex-col"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Video Preview</DialogTitle>
          <DialogDescription className="sr-only">
            Xem video demo chatbot
          </DialogDescription>
          {playingVideo && (
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              <video
                src={playingVideo.url}
                className="w-full h-full object-cover"
                controls
                autoPlay
                playsInline
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Header Section */}
      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="px-4 sm:px-6 lg:px-8 relative max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <span className="text-3xl sm:text-4xl">🤖</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Chatbot Prompt
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto mb-8 text-center leading-relaxed"
          >
            Khám phá bộ sưu tập những công cụ Chatbot và Prompt thông minh giúp
            bạn tối ưu hóa công việc marketing, bán hàng, và sáng tạo nội dung
            hiệu quả nhất.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative max-w-lg mx-auto"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              id="chatbot-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm chatbot, công dụng, lĩnh vực..."
              className="pl-10 h-12 rounded-xl border-white/10 bg-[#0c0c0d] shadow-sm text-base focus-visible:ring-cyan-500/30 text-white"
            />
            <AnimatePresence>
              {searchTerm && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors text-xs"
                >
                  ✕
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── Sticky filters ── */}
      <div className="sticky top-16 z-30 bg-[#070708]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
          {/* Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCat === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className={cn(
                    "shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border whitespace-nowrap",
                    isActive
                      ? "bg-cyan-500 text-black border-cyan-500 shadow-md shadow-cyan-500/25"
                      : "border-white/10 text-white/60 hover:text-white hover:border-white/20 bg-[#0c0c0d]",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Type and Sort filters */}
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
            <div className="flex items-center bg-[#0c0c0d] p-1 rounded-xl border border-white/5">
              {[
                { id: "all", label: "Tất cả" },
                { id: "paid", label: "Có phí" },
                { id: "free", label: "Miễn phí" },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveType(type.id)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                    activeType === type.id
                      ? "bg-white/10 text-white shadow-sm"
                      : "text-white/40 hover:text-white",
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>

            <div className="w-[180px] shrink-0">
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="h-10 rounded-xl bg-[#0c0c0d] border-white/5 text-white focus:ring-1 focus:ring-cyan-500/40">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent className="bg-[#111112] border-white/10 text-white rounded-xl">
                  <SelectItem value="all">Mặc định</SelectItem>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="oldest">Cũ nhất</SelectItem>
                  <SelectItem value="priceAsc">Giá tăng dần</SelectItem>
                  <SelectItem value="priceDesc">Giá giảm dần</SelectItem>
                  <SelectItem value="soldDesc">Bán chạy nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Listing Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
        <div className="mb-6 flex items-center justify-between text-sm text-white/50">
          <p>
            Tìm thấy{" "}
            <span className="text-white font-semibold">
              {filteredData.length}
            </span>{" "}
            chatbot
          </p>
        </div>

        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
            <p className="text-white/50 animate-pulse">Đang tải dữ liệu...</p>
          </div>
        ) : isError ? (
          <div className="py-24 text-center space-y-4">
            <h3 className="text-lg font-semibold text-red-400">
              Có lỗi xảy ra khi tải dữ liệu
            </h3>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence>
              {filteredData.map((cb) => (
                <ChatbotCard
                  key={cb.id}
                  cb={cb}
                  onPlayVideo={setPlayingVideo}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && filteredData.length === 0 && (
          <div className="py-24 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-white/5 text-white/40">
              <Search className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Không tìm thấy Chatbot phù hợp
              </h3>
              <p className="text-sm text-white/50 mt-1 max-w-md mx-auto leading-relaxed">
                Rất tiếc, các bộ lọc hoặc từ khóa của bạn không khớp với chatbot
                nào. Hãy thử thay đổi tiêu chí tìm kiếm.
              </p>
            </div>
            <Button
              variant="outline"
              className="mt-4 rounded-xl border-white/10 text-white hover:bg-white hover:text-black transition-colors px-6"
              onClick={() => {
                setSearchTerm("");
                setActiveCat("all");
                setActiveType("all");
                setSort("all");
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </section>

      {/* CTA Footer */}
      <section className="py-12">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="bg-linear-to-r from-cyan-600 to-blue-700 rounded-3xl p-8 sm:p-14 relative overflow-hidden group shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute top-0 right-0 w-[500px] h-full bg-white/5 -skew-x-12 translate-x-1/2" />
            <div className="relative z-10 text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                Bạn muốn tự thiết kế Chatbot theo yêu cầu?
              </h2>
              <p className="text-white/80 text-base max-w-2xl">
                Hãy kết nối với đội ngũ chuyên gia của Gu AI để xây dựng bộ
                chatbot tối ưu nhất, được thiết kế riêng cho quy trình quản lý
                và vận hành của doanh nghiệp bạn.
              </p>
            </div>
            <Button className="relative z-10 h-12 px-8 bg-black text-white hover:bg-[#111112] rounded-xl font-semibold shadow-xl transition-all hover:scale-105 active:scale-95 gap-2">
              Liên hệ ngay <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
