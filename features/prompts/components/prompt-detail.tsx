"use client";

import { useState } from "react";
import { ExampleMediaItem } from "../types";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Star,
  Play,
  Bot,
  Zap,
  MessageCircle,
  Sparkles,
  Copy,
  Bookmark,
  ChevronRight,
  Flame,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PromptPlayground } from "./prompt-playground";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useAddToCart } from "@/features/carts/hooks/use-carts";
import { usePromptDetail } from "../hooks/use-prompts";

const MotionImage = motion(Image);

export function PromptDetail({ slug }: { slug: string }) {
  const { data: prompt, isLoading, isError } = usePromptDetail(slug);
  const [activeImg, setActiveImg] = useState(0);
  const router = useRouter();
  const { mutate: addToCart, isPending } = useAddToCart();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-cyan-500 mx-auto" />
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground animate-pulse">
            Đang tải dữ liệu...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !prompt) {
    return (
      <div className="text-center py-20 bg-card/20 rounded-2xl border border-dashed border-white/10">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-5">
          <Bot className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-white">Không tìm thấy Prompt</h2>
        <p className="text-xs text-muted-foreground mt-3 max-w-sm mx-auto opacity-70">
          Sản phẩm này có thể đã bị gỡ bỏ hoặc bạn không có quyền truy cập vào
          liên kết này.
        </p>
        <Button
          asChild
          variant="outline"
          className="mt-8 h-11 px-6 rounded-lg border-white/10 text-white font-bold text-[9px] tracking-widest"
        >
          <Link href="/prompts-mien-phi">Quay về Chợ Prompt</Link>
        </Button>
      </div>
    );
  }

  // Xử lý gallery thực tế từ prompt
  const gallery = [prompt.thumbnailUrl, ...(prompt.gallery || [])].filter(
    Boolean,
  ) as string[];

  const extractYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = extractYoutubeId(prompt.demoVideoUrl || "");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
      {/* SECTION 1: VISUALS (Left) */}
      <div className="space-y-4">
        <div className="relative aspect-square sm:aspect-4/5 rounded-2xl overflow-hidden border border-white/5 bg-[#0a0a0b] group shadow-xl">
          <MotionImage
            key={activeImg}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            src={
              gallery[activeImg] ||
              "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1000"
            }
            alt={prompt.title}
            fill
            quality={100}
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60" />

          {gallery.length > 1 && (
            <div className="absolute bottom-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 text-[9px] font-bold text-white/90 tracking-widest">
              {activeImg + 1} / {gallery.length}
            </div>
          )}

          <div className="absolute top-6 left-6 flex flex-col gap-2">
            {prompt.isPremium && (
              <Badge className="bg-orange-600 text-white font-bold text-[9px] py-1 px-3 rounded-lg shadow-lg tracking-widest">
                PREMIUM
              </Badge>
            )}
            <Badge className="bg-white/10 backdrop-blur-md text-white font-bold text-[9px] py-1 px-3 rounded-lg shadow-lg tracking-widest border border-white/10">
              PROMPT
            </Badge>
          </div>
        </div>

        {/* Thumbnail Navigation */}
        {gallery.length > 1 && (
          <div className="grid grid-cols-4 gap-3 px-1">
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={cn(
                  "aspect-square rounded-xl overflow-hidden border-2 transition-all p-0.5 shadow-sm",
                  activeImg === i
                    ? "border-cyan-500 bg-cyan-500/10 scale-105"
                    : "border-transparent opacity-40 hover:opacity-100",
                )}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={img}
                    fill
                    sizes="100px"
                    className="w-full h-full object-cover rounded-lg"
                    alt={`Gallery ${i}`}
                  />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Description below gallery (Main Content) */}
        <div className="pt-10 space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight text-shadow-sm">
                Mô tả Prompt
              </h2>
            </div>
            <div className="bg-card/40 backdrop-blur-md rounded-2xl border border-white/5 p-8 space-y-7 shadow-xl">
              <p className="text-base leading-relaxed text-muted-foreground font-medium opacity-90 first-letter:text-2xl first-letter:font-bold first-letter:text-cyan-500">
                {prompt.description}
              </p>
            </div>
          </div>

          {/* Prompt Playground Section */}
          <div className="space-y-6 scroll-mt-24" id="playground">
            <PromptPlayground
              prompt={prompt}
              hasAccess={
                prompt.isFree ||
                (!!prompt.content && prompt.content.indexOf("[") === -1)
              }
            />
          </div>

          {/* Video Demo Section */}
          {prompt.demoVideoUrl && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <Play className="w-5 h-5 text-red-500 fill-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Video Sản phẩm AI
                </h2>
              </div>
              <div className="aspect-video relative rounded-2xl overflow-hidden border border-white/5 shadow-2xl group ring-1 ring-white/10 bg-black">
                {videoId ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-slate-900/40">
                    <Play className="w-10 h-10 text-white/20" />
                    <p className="text-[10px] font-bold text-white/40 tracking-widest">
                      Không thể nạp video
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Example Media Section (Kết quả mẫu) */}
          {prompt.exampleMedia && prompt.exampleMedia.length > 0 && (
            <div className="space-y-8 pt-8 border-t border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Kết quả mẫu thực tế
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {prompt.exampleMedia.map(
                  (item: ExampleMediaItem, i: number) => {
                    const itemVideoId =
                      item.type === "VIDEO" ? extractYoutubeId(item.url) : null;

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="group relative rounded-2xl overflow-hidden border border-white/5 bg-white/2 shadow-lg"
                      >
                        {item.type === "IMAGE" ? (
                          <div className="aspect-square relative overflow-hidden">
                            <Image
                              src={item.url}
                              alt={`Kết quả mẫu ${i + 1}`}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ) : (
                          <div className="aspect-square relative bg-black">
                            {itemVideoId ? (
                              <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${itemVideoId}?rel=0`}
                                title={`Video kết quả ${i + 1}`}
                                allowFullScreen
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                <Play className="w-8 h-8 text-white/20" />
                                <p className="text-[9px] font-bold text-white/30">
                                  Video không khả dụng
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="absolute top-4 right-4 z-10">
                          <Badge className="bg-black/60 backdrop-blur-md text-white/80 border-white/10 text-[8px] font-black tracking-widest">
                            {item.type}
                          </Badge>
                        </div>
                      </motion.div>
                    );
                  },
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: SIDEBAR (Right) */}
      <div className="space-y-8 lg:sticky lg:top-28">
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1.5 rounded-lg font-bold text-[9px] tracking-widest flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5" /> MODEL:{" "}
              {prompt.category?.name || "AI Tool"}
            </Badge>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="h-9 px-4 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 text-[9px] font-bold tracking-widest text-white/70 hover:text-white"
              >
                <Bookmark className="w-3.5 h-3.5 mr-1.5" /> Lưu
              </Button>
            </div>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-lg">
            {prompt.title}
          </h1>
        </header>

        <div className="bg-[#0f0f12] rounded-3xl border border-white/5 p-8 space-y-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 blur-[100px] pointer-events-none group-hover:bg-cyan-500/20 transition-colors duration-500" />

          <div className="flex items-end justify-between relative z-10">
            <div className="space-y-1">
              <p className="text-base font-bold text-muted-foreground tracking-widest opacity-60">
                Trạng thái truy cập
              </p>
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    "text-xl sm:text-2xl font-black drop-shadow-[0_0_25px_rgba(249,115,22,0.15)] tracking-tighter",
                    prompt.isPremium ? "text-orange-500" : "text-cyan-500",
                  )}
                >
                  {prompt.isPremium ? "Premium 👑" : "Miễn Phí"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 relative z-10">
            <Button
              className={cn(
                "h-14 w-full font-black text-[11px] tracking-[0.2em] rounded-2xl shadow-xl transition-all active:scale-95",
                prompt.isPremium
                  ? "bg-linear-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-orange-500/20"
                  : "bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-500/20",
              )}
              onClick={() => {
                if (
                  prompt.isPremium &&
                  (!prompt.content || prompt.content.indexOf("[") !== -1)
                ) {
                  router.push("/bang-gia");
                  return;
                }
                document
                  .getElementById("playground")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {prompt.isFree ||
              (!!prompt.content && prompt.content.indexOf("[") === -1)
                ? "Sử dụng ngay"
                : prompt.isPremium
                  ? "Mở khóa Premium"
                  : "Đăng nhập ngay"}
            </Button>
            <Button
              variant="ghost"
              className="h-11 w-full bg-white/2 hover:bg-white/5 rounded-2xl border border-white/5 text-[9px] font-semibold text-sm tracking-widest text-white/40 hover:text-white transition-all"
            >
              <Copy className="w-4 h-4 mr-2" /> Share Link
            </Button>
            {!prompt.isFree && (
              <Button
                variant="outline"
                disabled={isPending}
                className="h-11 w-full bg-cyan-500/10 hover:bg-cyan-500/20 rounded-2xl text-[9px] font-semibold text-sm tracking-widest text-cyan-400 border border-cyan-500/20 transition-all"
                onClick={() => {
                  addToCart(
                    {
                      itemType: "PROMPT",
                      itemId: prompt.id,
                      quantity: 1,
                    },
                    {
                      onSuccess: () => {
                        toast.success(`Đã thêm ${prompt.title} vào giỏ hàng`);
                      },
                    },
                  );
                }}
              >
                {isPending ? (
                  "Đang thêm..."
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" /> Thêm vào giỏ
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-wrap gap-6 items-center justify-between text-[10px] font-black tracking-[0.15em] opacity-50">
            <span className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />{" "}
              {prompt.copyCount > 1000
                ? `${(prompt.copyCount / 1000).toFixed(1)}k`
                : prompt.copyCount}{" "}
              Đã copy
            </span>
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />{" "}
              {prompt.averageRating.toFixed(1)} Rating
            </span>
          </div>
        </div>

        {/* Required Tools Section */}
        {prompt.requiredTools && prompt.requiredTools.length > 0 && (
          <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-7 space-y-6 shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                  <Zap className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white tracking-widest">
                    Công cụ hỗ trợ
                  </h3>
                  <p className="text-[9px] text-muted-foreground font-bold tracking-widest mt-0.5 opacity-60">
                    Yêu cầu để đạt hiệu quả tối đa
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {prompt.requiredTools.map(
                  (
                    tool: { name: string; planRequired?: string; url?: string },
                    i: number,
                  ) => (
                    <Link
                      key={i}
                      href={tool.url || "#"}
                      target="_blank"
                      className="p-4 rounded-2xl bg-white/2 border border-white/5 hover:border-cyan-500/30 hover:bg-white/5 transition-all group/tool flex items-center gap-5"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover/tool:scale-110 transition-transform duration-300">
                        {tool.name.toLowerCase().includes("chatgpt")
                          ? "🤖"
                          : tool.name.toLowerCase().includes("midjourney")
                            ? "🎨"
                            : "🛠️"}
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-white text-sm leading-tight tracking-tight group-hover/tool:text-cyan-400 transition-colors">
                          {tool.name}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground mt-1 tracking-widest">
                          Gói yêu cầu:{" "}
                          <span className="text-cyan-500">
                            {tool.planRequired || "Bất kỳ"}
                          </span>
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/10 group-hover/tool:text-cyan-400 group-hover/tool:translate-x-1 transition-all" />
                    </Link>
                  ),
                )}
              </div>
            </div>
          </div>
        )}

        {/* Advisor CTA */}
        <div className="bg-blue-600/5 border border-blue-500/10 rounded-3xl p-7 flex items-center gap-6 shadow-inner hover:bg-blue-600/10 transition-colors group">
          <div className="relative">
            <div className="w-14 h-14 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg p-0.5">
              <MessageCircle className="w-7 h-7 text-white fill-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-4 border-background" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-white tracking-widest">
              Tư vấn Prompt
            </h4>
            <p className="text-[9px] font-bold text-muted-foreground mt-1 opacity-60">
              Support 24/7 chuyên gia
            </p>
          </div>
          <Button
            variant="outline"
            className="h-8 px-4 rounded-lg border-blue-500/40 text-blue-400 font-bold text-[8px] tracking-widest hover:bg-blue-500 hover:text-white"
          >
            Chat Zalo
          </Button>
        </div>
      </div>
    </div>
  );
}
