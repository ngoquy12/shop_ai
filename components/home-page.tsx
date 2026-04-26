"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Flame,
  MousePointerClick,
  Search,
  LayoutGrid,
  Sparkles,
  Copy,
} from "lucide-react";
import {
  motion,
  useInView,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { PromptCard } from "@/components/prompt-card";
import { AIToolCard } from "@/components/ai-tool-card";
import { VideoBanner } from "@/components/video-banner";
import { cn } from "@/lib/utils";

import { useVideoCategoriesWithVideos } from "@/hooks/use-video-categories";
import { CategoryVideoSection } from "@/components/video-banner";
import { usePrompts } from "@/features/prompts/hooks/use-prompts";
import { useAiTools } from "@/features/ai-tools/hooks/use-ai-tools";
import { useGetPrompts } from "@/hooks/use-prompts";
import { ChatbotCard } from "./chatbot-card";
import { Prompt } from "@/features/prompts/types";
import { AITool } from "@/features/ai-tools/types";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
};

// ─── LUMEFLOW STYLE UI COMPONENTS ──────────────────────────────────────

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const cardVar: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1 },
};

// ─── Scroll Reveal ─────────────────────────────────────────────
function ScrollReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={fadeUp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Khám phá Library",
    desc: "Duyệt qua hàng nghìn Prompt và Chatbot chuyên nghiệp được tối ưu sẵn.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    glow: "group-hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]",
  },
  {
    icon: MousePointerClick,
    step: "02",
    title: "Lựa chọn & Copy",
    desc: "Chọn giải pháp phù hợp và sao chép câu lệnh chỉ với một lần nhấn.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    glow: "group-hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)]",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "Trải nghiệm Đột phá",
    desc: "Dán vào công cụ AI của bạn và nhận ngay kết quả chất lượng vượt trội.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "group-hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]",
  },
];

const SLOGAN_WORDS = [
  "giải phóng giấc mơ...",
  "tối ưu công việc...",
  "sáng tạo vô tận...",
  "bứt phá giới hạn...",
] as const;

const AnimatedDigit = ({ value }: { value: number }) => {
  const padded = value.toString().padStart(2, "0");
  return (
    <div className="relative w-full h-14 text-center bg-black/50 rounded-xl border border-white/5 shadow-inner overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={padded}
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{
            duration: 0.4,
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
          className="absolute inset-0 flex flex-col items-center justify-center font-mono leading-none"
        >
          {padded}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

// ─── Initial App Loader ───────────────────────────────────────────────
const InitialLoader = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onComplete();
    }, 0); // Giảm thiểu tối đa độ trễ, ẩn ngay khi component mount thành công
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed inset-0 z-9999 bg-[#050505] flex flex-col items-center justify-center pointer-events-auto"
    >
      <div className="relative flex flex-col items-center">
        {/* Glowing Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl animate-pulse delay-700" />

        {/* Core spinner / Logo */}
        <div className="relative flex items-center justify-center w-24 h-24 mb-8">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-[3px] border-dashed border-white/20 rounded-full"
          />
          <div className="absolute inset-3 border-2 border-transparent border-t-blue-500 border-l-blue-500 rounded-full animate-spin" />
          <Sparkles className="absolute w-8 h-8 text-white animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
};

export function HomePage() {
  const { data: promptsResponse } = usePrompts({ limit: 8, sortOrder: "desc" });
  const { data: toolsResponse } = useAiTools({ pageSize: 4, isHot: true });
  const { data: chatbotsResponse } = useGetPrompts({
    limit: 8,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const { data: categoriesResponse } = useVideoCategoriesWithVideos();

  const promptsList = promptsResponse?.data || [];
  const aiToolsList = toolsResponse?.data || [];
  const hotChatbots = Array.isArray(chatbotsResponse)
    ? chatbotsResponse.slice(0, 8)
    : [];

  const initialDuration = 8 * 3600 + 45 * 60 + 12; // 8h 45m 12s
  const [timeLeft, setTimeLeft] = useState(() => {
    if (typeof window === "undefined") return initialDuration;
    const storedEndTime = localStorage.getItem("flashDropEndTime");
    if (storedEndTime) {
      const endTime = parseInt(storedEndTime, 10);
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      return remaining > 0 ? remaining : initialDuration;
    }
    return initialDuration;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedEndTime = localStorage.getItem("flashDropEndTime");
    let endTime: number;

    if (storedEndTime) {
      endTime = parseInt(storedEndTime, 10);
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));

      if (remaining === 0) {
        // Time has passed, set new end time
        endTime = now + initialDuration * 1000;
        localStorage.setItem("flashDropEndTime", endTime.toString());
      }
    } else {
      // First time, set end time
      endTime = Date.now() + initialDuration * 1000;
      localStorage.setItem("flashDropEndTime", endTime.toString());
    }

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeLeft(remaining);

      // Clear storage when time is up
      if (remaining === 0) {
        localStorage.removeItem("flashDropEndTime");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [initialDuration]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const [sloganIndex, setSloganIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % SLOGAN_WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {isInitialLoading && (
          <InitialLoader onComplete={() => setIsInitialLoading(false)} />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-[#050505] overflow-hidden font-outfit text-white">
        <div className="fixed inset-0 pointer-events-none z-0">
          <motion.div
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -100, 50, 0],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] right-[10%] w-[50vw] h-[50vw] bg-purple-600/10 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              x: [0, -150, 100, 0],
              y: [0, 150, -50, 0],
              scale: [1, 1.5, 0.9, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[40%] left-[-10%] w-[40vw] h-[40vw] bg-blue-600/10 rounded-full blur-[150px]"
          />
        </div>

        {/* ═══ TOP CONTROL & BANNERS ═══ */}
        <section className="relative px-4 sm:px-6 lg:px-8 py-10 pb-0 max-w-400 mx-auto w-full">
          {/* 1. Quick Actions Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-8 relative z-10">
            {/* Main big card (combining columns 1 and 2) */}
            <div className="lg:col-span-2 bg-[#17171c]/80 border border-white/5 rounded-3xl p-5 sm:p-6 hover:border-white/10 transition-colors flex flex-col justify-center">
              <h1 className="text-2xl sm:text-3xl font-black text-cyan-400 mb-6 tracking-tight flex items-start sm:items-center flex-col sm:flex-row gap-2">
                <span className="whitespace-nowrap">Gu AI giúp bạn</span>
                <div className="relative inline-block h-8 sm:h-10 w-full min-w-50 sm:min-w-75">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={sloganIndex}
                      initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="absolute left-0 text-white truncate w-full pt-1"
                    >
                      {SLOGAN_WORDS[sloganIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </h1>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <Link
                  href="/prompts-mien-phi"
                  className="relative bg-white/5 hover:bg-white/10 transition-colors rounded-xl px-4 py-3.5 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white flex items-center justify-center text-center overflow-visible border border-transparent"
                >
                  <span className="truncate w-full capitalize">
                    Prompt miễn phí
                  </span>
                  <span className="absolute -top-2.5 -right-2 px-1.5 py-0.5 text-[9px] font-bold text-white rounded-md shadow-md z-10 bg-linear-to-r from-orange-400 to-pink-500">
                    NÓNG
                  </span>
                </Link>
                <Link
                  href="/chatbot-ai"
                  className="relative bg-white/5 hover:bg-white/10 transition-colors rounded-xl px-4 py-3.5 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white flex items-center justify-center text-center overflow-visible border border-transparent"
                >
                  <span className="truncate w-full capitalize">Chatbot AI</span>
                </Link>
                <Link
                  href="#"
                  className="relative bg-white/5 hover:bg-white/10 transition-colors rounded-xl px-4 py-3.5 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white flex items-center justify-center text-center overflow-visible border border-transparent"
                >
                  <span className="truncate w-full capitalize">Review AI</span>
                </Link>
                <Link
                  href="/cong-cu-ai"
                  className="relative bg-white/5 hover:bg-white/10 transition-colors rounded-xl px-4 py-3.5 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white flex items-center justify-center text-center overflow-visible border border-transparent"
                >
                  <span className="truncate w-full capitalize">Công cụ AI</span>
                  <span className="absolute -top-2.5 -right-2 px-1.5 py-0.5 text-[9px] font-bold text-white rounded-md shadow-md z-10 bg-green-500">
                    MỚI
                  </span>
                </Link>
              </div>
            </div>

            {/* Right card (column 3) */}
            <div className="lg:col-span-1 bg-[#17171c]/80 border border-white/5 rounded-3xl p-5 sm:p-6 hover:border-white/10 transition-colors flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded border border-orange-500/30 bg-orange-500/10 flex items-center justify-center">
                  <LayoutGrid className="w-4 h-4 text-orange-400" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-gray-200">
                  Dịch vụ nổi bật
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <Link
                  href="/khoa-hoc-ai"
                  className="relative bg-white/5 hover:bg-white/10 transition-colors rounded-xl px-2 py-3 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white flex items-center justify-center text-center overflow-visible border border-transparent"
                >
                  <span className="truncate w-full capitalize">
                    Khóa học AI
                  </span>
                </Link>
                <Link
                  href="#"
                  className="relative bg-white/5 hover:bg-white/10 transition-colors rounded-xl px-2 py-3 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white flex items-center justify-center text-center overflow-visible border border-transparent"
                >
                  <span className="truncate w-full capitalize">
                    Đang cập nhật
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* 2. Banner Gallery Row */}
          <VideoBanner />
        </section>

        {/* ═══ VIDEO CATEGORIES ═══ */}
        {categoriesResponse?.data && categoriesResponse.data.length > 0 && (
          <section className="relative z-10 py-8 max-w-400 mx-auto px-4 sm:px-6 lg:px-8">
            {categoriesResponse.data.map((category) => (
              <CategoryVideoSection
                key={category.id}
                categorySlug={category.id}
                title={category.name}
                onVideoClick={(video) => {
                  // Handle video click - open modal or navigate
                  console.log("Video clicked:", video);
                }}
              />
            ))}
          </section>
        )}

        {/* ═══ DAILY FLASH DROP ═══ */}
        <section className="relative z-20 max-w-400 mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="relative rounded-3xl overflow-hidden p-0.5 xl:p-0.75 group cursor-pointer shadow-[0_0_40px_rgba(59,130,246,0.1)] hover:shadow-[0_0_60px_rgba(59,130,246,0.2)] transition-shadow duration-500">
            {/* Animated Glowing Border */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250%] h-[250%] bg-[conic-gradient(from_0deg,transparent_0_280deg,#3b82f6_360deg)] animate-spin-slow pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity" />

            {/* Inner Content Card */}
            <div className="relative bg-[#0a0a0f] rounded-[22px] p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 h-full z-20 overflow-hidden">
              {/* Inner background glow & abstract shapes */}
              <div className="absolute top-0 right-0 w-125 h-125 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-colors duration-700" />
              <div className="absolute bottom-0 left-0 w-75 h-75 bg-pink-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-pink-500/20 transition-colors duration-700" />

              {/* Left Content */}
              <div className="flex-1 relative z-10 w-full lg:w-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20 mb-4 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                  <Flame className="w-4 h-4 text-pink-500 animate-pulse" />
                  <span className="text-[10px] sm:text-xs font-black tracking-widest text-pink-400">
                    Flash Drop Giới Hạn Quà Mỗi Ngày
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
                  Mở khóa{" "}
                  <span className="gradient-text animate-gradient bg-size-[300%_300%]">
                    Bộ Prompt &quot;Triệu View TikTok&quot;
                  </span>
                </h2>
                <p className="text-gray-400 text-sm sm:text-lg max-w-2xl font-medium leading-relaxed">
                  Tuyệt chiêu tạo kịch bản video viral được tinh luyện từ 100+
                  kênh top trending hiện nay. Trị giá{" "}
                  <span className="line-through text-gray-500">$49.00</span> nay
                  hoàn toàn{" "}
                  <span className="text-emerald-400 font-bold">Miễn Phí</span>{" "}
                  thu thập trong vòng 24h tới!
                </p>
              </div>

              {/* Right Content - Countdown Timer */}
              <div className="flex flex-col items-center shrink-0 relative z-10 bg-[#12121a]/80 p-6 sm:p-8 rounded-2xl border border-white/5 backdrop-blur-xl w-full sm:w-auto shadow-2xl hover:bg-[#1a1a24] transition-colors">
                <div className="text-xs sm:text-sm font-black text-gray-400 tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                  Kết thúc sau
                </div>
                <div className="flex items-center gap-3 sm:gap-4 font-mono text-3xl sm:text-4xl font-black text-white mb-6">
                  <div className="flex flex-col items-center w-16 sm:w-20">
                    <AnimatedDigit value={hours} />
                    <span className="text-[9px] sm:text-[11px] text-gray-500 mt-2 font-sans tracking-wider font-bold">
                      Giờ
                    </span>
                  </div>
                  <span className="text-gray-600 mb-6 text-2xl sm:text-3xl animate-pulse">
                    :
                  </span>
                  <div className="flex flex-col items-center w-16 sm:w-20">
                    <AnimatedDigit value={minutes} />
                    <span className="text-[9px] sm:text-[11px] text-gray-500 mt-2 font-sans tracking-wider font-bold">
                      Phút
                    </span>
                  </div>
                  <span className="text-gray-600 mb-6 text-2xl sm:text-3xl animate-pulse">
                    :
                  </span>
                  <div className="flex flex-col items-center w-16 sm:w-20">
                    <AnimatedDigit value={seconds} />
                    <span className="text-[9px] sm:text-[11px] text-gray-500 mt-2 font-sans tracking-wider font-bold">
                      Giây
                    </span>
                  </div>
                </div>
                <Button
                  asChild
                  className="w-full bg-white text-black hover:bg-gray-200 font-black text-sm h-12 rounded-xl tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all"
                >
                  <Link href="/prompts-mien-phi">
                    Nhận ngay <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ PROMPT LIBRARY ═══ */}
        {promptsList.length > 0 && (
          <section className="py-8 relative overflow-hidden bg-background">
            <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal className="text-center mb-20">
                <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 px-5 py-4 rounded-full font-black text-xs tracking-widest mb-6">
                  Hot Trending
                </Badge>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 text-white tracking-tight">
                  Thư viện Prompt{" "}
                  <span className="gradient-text">Miễn Phí</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed opacity-70">
                  Sáng tạo không giới hạn với hàng nghìn bộ câu lệnh được tối ưu
                  sẵn cho mọi ngành nghề.
                </p>
              </ScrollReveal>

              <motion.div
                className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6"
                variants={stagger}
                initial="hidden"
                whileInView="show"
              >
                {promptsList.slice(0, 8).map((prompt: Prompt, idx: number) => (
                  <motion.div
                    key={idx}
                    variants={cardVar}
                    className="break-inside-avoid block mb-6"
                  >
                    <PromptCard prompt={prompt} />
                  </motion.div>
                ))}
              </motion.div>
              <div className="mt-16 text-center">
                <Button
                  variant="outline"
                  asChild
                  className="h-14 px-10 rounded-2xl border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 text-white transition-all font-black tracking-widest text-xs"
                >
                  <Link href="/prompts-mien-phi">
                    Khám phá thêm <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* ═══ PREMIUM CHATBOTS ═══ */}
        {hotChatbots.length > 0 && (
          <section className="py-8 bg-[#080808] relative">
            <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal className="text-center mb-20">
                <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 px-5 py-4 rounded-full font-black text-xs tracking-widest mb-6">
                  Hệ sinh thái thông minh nhất
                </Badge>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 text-white tracking-tight">
                  Chatbot <span className="text-orange-500">Hot</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed opacity-70">
                  Khám phá các chatbot chuyên biệt được tạo sẵn giúp bạn giải
                  quyết nhanh gọn những công việc lặp đi lặp lại.
                </p>
              </ScrollReveal>

              <motion.div
                className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
                variants={stagger}
                initial="hidden"
                whileInView="show"
              >
                {hotChatbots.map((cb) => (
                  <ChatbotCard key={cb.id} cb={cb} />
                ))}
              </motion.div>

              <div className="mt-16 text-center">
                <Button
                  variant="outline"
                  asChild
                  className="h-14 px-10 rounded-2xl border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 text-white transition-all font-black tracking-widest text-xs"
                >
                  <Link href="/chatbot-ai">
                    Tất cả Chatbot <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* ═══ AI TOOL STORE ═══ */}
        {aiToolsList.length > 0 && (
          <section className="py-8 bg-[#050505] relative">
            <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal className="text-center mb-20">
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-5 py-4 rounded-full font-black text-xs tracking-widest mb-6">
                  Tài khoản Premium
                </Badge>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 text-white tracking-tighter leading-none">
                  Công cụ AI <span className="gradient-text">Đỉnh Cao</span>
                </h2>
                <p className="text-muted-foreground text-xl max-w-2xl mx-auto opacity-70">
                  ChatGPT Plus, Midjourney Pro và 50+ siêu ứng dụng khác với mức
                  giá rẻ hơn 60%.
                </p>
              </ScrollReveal>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
                variants={stagger}
                initial="hidden"
                whileInView="show"
              >
                {aiToolsList.slice(0, 4).map((tool: AITool, idx: number) => (
                  <motion.div key={idx} variants={cardVar}>
                    <AIToolCard tool={tool} />
                  </motion.div>
                ))}
              </motion.div>

              <div className="mt-16 text-center">
                <Button
                  variant="outline"
                  asChild
                  className="h-14 px-10 rounded-2xl border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 text-white transition-all font-black tracking-widest text-xs"
                >
                  <Link href="/cong-cu-ai">
                    Vào Cửa Hàng <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* ═══ HOW IT WORKS ═══ */}
        <section className="py-16 relative bg-[#050505] overflow-hidden">
          {/* Glow & Grid Engine Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <ScrollReveal className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter mb-4">
                Trải nghiệm chỉ{" "}
                <span className="gradient-text">3 Bước Đơn Giản</span>
              </h2>
            </ScrollReveal>

            <motion.div
              className="grid sm:grid-cols-3 gap-8 lg:gap-12 relative mt-16"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {/* Connecting Line (Only visible on lg screens) */}
              <div className="absolute top-16 left-[16.666%] right-[16.666%] h-1 bg-white/5 hidden sm:block rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-linear-to-r from-blue-500 via-violet-500 to-emerald-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                />
              </div>

              {STEPS.map((s, i) => (
                <motion.div
                  key={i}
                  variants={cardVar}
                  className="relative text-center group flex flex-col items-center"
                >
                  {/* Step Number + Icon Wrapper */}
                  <div
                    className={cn(
                      "relative w-32 h-32 rounded-[2.5rem] flex flex-col items-center justify-center mb-8 bg-[#0c0c0d] border transition-all duration-500 group-hover:-translate-y-2 z-10",
                      s.border,
                      s.glow,
                    )}
                  >
                    {/* Subtle Background Glow behind icon */}
                    <div
                      className={cn(
                        "absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                        s.bg,
                      )}
                    />

                    {/* Step Number */}
                    <span
                      className={cn(
                        "text-[10px] font-black tracking-[0.2em] mb-2",
                        s.color,
                      )}
                    >
                      BƯỚC {s.step}
                    </span>

                    {/* Icon */}
                    <s.icon
                      className={cn(
                        "w-10 h-10 transition-transform duration-500 group-hover:scale-110",
                        s.color,
                      )}
                    />
                  </div>

                  {/* Content */}
                  <h3 className="font-black text-2xl mb-4 text-white tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed px-2 lg:px-6 opacity-70">
                    {s.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══ COURSES ═══ */}
        {/* Temporarily disabled - course module not public */}
        {/* {topCourses.length > 0 && (
          <section className="py-8 bg-[#0a0a0b]">
            <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal className="text-center mb-20">
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-5 py-4 rounded-full font-black text-xs tracking-widest mb-6">
                  Chuyên Môn
                </Badge>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 text-white tracking-tight">
                  Khóa Học <span className="gradient-text">AI</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed opacity-70">
                  Nâng cao kỹ năng với các khóa học chuyên sâu từ cơ bản đến nâng cao.
                </p>
              </ScrollReveal>

              <motion.div
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={stagger}
                initial="hidden"
                whileInView="show"
              >
                {topCourses.map((c) => (
                  <CourseCard key={c.id} course={c} />
                ))}
              </motion.div>

              <div className="mt-16 text-center">
                <Button
                  variant="outline"
                  asChild
                  className="h-14 px-10 rounded-2xl border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 text-white transition-all font-black tracking-widest text-xs"
                >
                  <Link href="/khoa-hoc-ai">
                    Học Ngay <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )} */}
      </div>
    </>
  );
}
