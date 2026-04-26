"use client";

import { motion, Variants } from "framer-motion";
import {
  Sparkles,
  Zap,
  ThumbsUp,
  ThumbsDown,
  Target,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useAIReviewBySlug } from "@/features/ai-reviews/hooks/use-ai-reviews";
import { use } from "react";

const staggerVar: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

export default function ReviewDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const { data: reviewData, isLoading, error } = useAIReviewBySlug(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mb-4"
        >
          <Zap className="w-10 h-10 text-blue-500" />
        </motion.div>
        <p className="text-muted-foreground animate-pulse">
          Đang phân tích trải nghiệm...
        </p>
      </div>
    );
  }

  if (error || !reviewData) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center bg-[#0b0b12] p-10 rounded-3xl border border-white/10 max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </motion.div>
          <h1 className="text-2xl font-bold mb-4">Review không tồn tại</h1>
          <p className="text-muted-foreground mb-8">
            Bài viết bạn đang tìm kiếm có thể đã bị xóa hoặc đường dẫn không
            chính xác.
          </p>
          <Link href="/review-ai">
            <Button className="bg-white text-black hover:bg-gray-200 rounded-xl px-8">
              Quay lại danh sách
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Map JSON types to arrays for rendering
  const pros = Array.isArray(reviewData.pros)
    ? (reviewData.pros as string[])
    : [];
  const cons = Array.isArray(reviewData.cons)
    ? (reviewData.cons as string[])
    : [];
  const useCases = Array.isArray(reviewData.useCases)
    ? (reviewData.useCases as string[])
    : [];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* ── 1. HEADER & SUMMARY CARD (THÔNG TIN CÔNG CỤ) ── */}
      <section className="relative pt-10 pb-8 overflow-hidden">
        {/* Glow bg */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0b0b12] border border-border/50 rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col md:flex-row gap-8 items-center md:items-start"
          >
            <div className="w-28 h-28 shrink-0 relative rounded-2xl overflow-hidden border-2 border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <Image
                src={
                  reviewData.thumbnailUrl ||
                  "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=200"
                }
                alt={reviewData.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4 items-center gap-1.5 px-3 py-1 text-xs">
                {reviewData.aiTool?.name || "AI Tool"}{" "}
                <span className="w-1 h-1 rounded-full bg-blue-500 ml-1"></span>{" "}
                Đánh Giá Thực Tế
              </Badge>
              <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
                {reviewData.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {reviewData.excerpt ||
                  "Khám phá tiềm năng thực sự của công cụ này qua bài phân tích chi tiết."}
              </p>
              <Button
                size="lg"
                className="w-full md:w-auto h-12 px-8 bg-white text-black font-bold hover:bg-gray-200 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                asChild
              >
                <a
                  href={reviewData.aiTool?.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Khám Phá Công Cụ <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTENT GRID ── */}
      <section className="pb-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <motion.div
            variants={staggerVar}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {/* 2. TÍNH NĂNG NỔI BẬT (QUICK FEATURES) */}
            <motion.div
              variants={fadeUp}
              className="bg-[#101018] border border-blue-500/15 rounded-3xl p-8"
            >
              <h2 className="text-xl flex items-center gap-2 font-bold mb-6 text-white pb-4 border-b border-white/5">
                <Sparkles className="w-5 h-5 text-blue-400" /> Sơ Lược Tính Năng
              </h2>
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                {useCases.length > 0 ? (
                  useCases.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-3 group">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-300 font-medium">{f}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-muted-foreground italic">
                    Đang cập nhật danh sách tính năng...
                  </p>
                )}
              </ul>
            </motion.div>

            {/* 3. GIỚI THIỆU (DEEP DIVE / LÀ GÌ?) */}
            <motion.div
              variants={fadeUp}
              className="bg-card/30 border border-border/40 rounded-3xl p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-16 bg-white/5 blur-3xl rounded-full" />
              <h2 className="text-2xl font-black mb-4 flex items-center gap-2 relative z-10">
                <Target className="w-6 h-6 text-red-400" /> Nội Dung Chi Tiết
              </h2>
              <div
                className="text-lg text-muted-foreground leading-relaxed relative z-10 prose prose-invert max-w-none prose-p:text-gray-300"
                dangerouslySetInnerHTML={{ __html: reviewData.content }}
              />
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* 5. ƯU ĐIỂM (PROS) */}
              <motion.div
                variants={fadeUp}
                className="bg-[#0b0b12] border border-green-500/10 rounded-3xl p-8 hover:border-green-500/20 transition-colors"
              >
                <h3 className="text-lg font-bold flex items-center gap-2 text-green-400 mb-6 bg-green-500/10 w-max px-4 py-2 rounded-xl border border-green-500/20">
                  <ThumbsUp className="w-5 h-5" /> Ưu Điểm
                </h3>
                <ul className="space-y-4">
                  {pros.length > 0 ? (
                    pros.map((p, i) => (
                      <li
                        key={i}
                        className="flex gap-4 text-gray-300 items-start group"
                      >
                        <span className="shrink-0 w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 text-xs font-bold group-hover:bg-green-500 group-hover:text-black transition-colors">
                          ✓
                        </span>
                        <span className="leading-relaxed">{p}</span>
                      </li>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Đang cập nhật...
                    </p>
                  )}
                </ul>
              </motion.div>

              {/* 5. NHƯỢC ĐIỂM (CONS) */}
              <motion.div
                variants={fadeUp}
                className="bg-[#0b0b12] border border-red-500/10 rounded-3xl p-8 hover:border-red-500/20 transition-colors"
              >
                <h3 className="text-lg font-bold flex items-center gap-2 text-red-400 mb-6 bg-red-500/10 w-max px-4 py-2 rounded-xl border border-red-500/20">
                  <ThumbsDown className="w-5 h-5" /> Nhược Điểm
                </h3>
                <ul className="space-y-4">
                  {cons.length > 0 ? (
                    cons.map((c, i) => (
                      <li
                        key={i}
                        className="flex gap-4 text-gray-400 items-start group"
                      >
                        <span className="shrink-0 w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 text-xs font-bold group-hover:bg-red-500 group-hover:text-black transition-colors">
                          ✕
                        </span>
                        <span className="leading-relaxed">{c}</span>
                      </li>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Đang cập nhật...
                    </p>
                  )}
                </ul>
              </motion.div>
            </div>

            {/* 8. HƯỚNG DẪN SỬ DỤNG */}

            {/* 9. FAQ (ACCORDION) */}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
