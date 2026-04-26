import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Bookmark,
  Crown,
  MessageSquare,
  Play,
  Sparkles,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { Prompt } from "@/features/prompts/types";

export const cardVar = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

export function ChatbotCard({
  cb,
  onPlayVideo,
}: {
  cb: Prompt;
  onPlayVideo?: (video: { url: string; title: string; author: string }) => void;
}) {
  // Mapping new fields to old UI logic where necessary
  const displayImage = cb.thumbnailUrl || "/placeholder-chatbot.png";
  const displayDesc = cb.description;

  return (
    <motion.div
      variants={cardVar}
      layout
      whileHover={{ y: -8 }}
      className="group flex flex-col bg-[#0c0c0d] rounded-2xl border border-white/5 overflow-hidden transition-all hover:border-cyan-500/30 hover:shadow-[0_30px_60px_-15px_rgba(6,182,212,0.15)]"
    >
      <div className="flex-1 flex flex-col relative">
        {/* Image wrapper */}
        <div className="relative aspect-[3/4.2] overflow-hidden bg-black/40 group/thumbnail cursor-pointer">
          {cb.demoVideoUrl ? (
            <video
              src={cb.demoVideoUrl}
              poster={displayImage}
              muted
              loop
              playsInline
              className="w-full h-full object-cover transition-transform duration-700 group-hover/thumbnail:scale-105"
              onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
              onMouseLeave={(e) => e.currentTarget.pause()}
              onClick={(e) => {
                e.preventDefault();
                if (onPlayVideo) {
                  onPlayVideo({
                    url: cb.demoVideoUrl as string,
                    title: cb.title,
                    author: cb.author?.fullName || "Gu AI",
                  });
                }
              }}
            />
          ) : (
            <Link href={`/chatbot/${cb.slug}`} className="block w-full h-full">
              <Image
                src={displayImage}
                alt={cb.title}
                fill
                unoptimized
                className="object-cover transition-transform duration-700 group-hover/thumbnail:scale-105"
              />
            </Link>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-[#0c0c0d] via-transparent to-transparent opacity-80 pointer-events-none" />

          <div className="absolute top-5 inset-x-5 flex justify-between items-start z-10 pointer-events-none">
            <div className="flex flex-col gap-2">
              {cb.isPremium ? (
                <Badge className="bg-[#f97316] text-white font-black text-[10px] py-1 px-3 rounded-full border-none shadow-xl flex items-center gap-1.5 w-fit">
                  <Crown className="w-3.5 h-3.5" /> PREMIUM
                </Badge>
              ) : cb.isFree ? (
                <Badge className="bg-[#10b981] text-white font-black text-[10px] py-1 px-3 rounded-full border-none shadow-xl flex items-center gap-1.5 w-fit">
                  <Sparkles className="w-3.5 h-3.5" /> MIỄN PHÍ
                </Badge>
              ) : (
                <Badge className="bg-cyan-500 text-black font-black text-[10px] py-1 px-3 rounded-full border-none shadow-xl flex items-center gap-1.5 w-fit">
                  <Sparkles className="w-3.5 h-3.5" /> TRẢ PHÍ
                </Badge>
              )}
              {cb.isFeatured && (
                <Badge className="bg-[#14b8a6] text-white font-black text-[10px] py-1 px-3 rounded-full border-none shadow-xl flex items-center gap-1.5 w-fit">
                  <Sparkles className="w-3.5 h-3.5" /> NỔI BẬT
                </Badge>
              )}
            </div>
            <Badge className="bg-white/95 text-black font-black text-[10px] py-1 px-3 rounded-full border-none shadow-xl flex items-center gap-1.5 whitespace-nowrap">
              <MessageSquare className="w-3.5 h-3.5" /> AI
            </Badge>
          </div>

          {cb.demoVideoUrl && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 transition-opacity duration-300 opacity-0 group-hover/thumbnail:opacity-100">
              <div
                className="w-[60px] h-[60px] rounded-full bg-[#1da1f2]/90 flex items-center justify-center shadow-xl pointer-events-auto transition-transform hover:scale-110 active:scale-95"
                onClick={(e) => {
                  e.preventDefault();
                  if (onPlayVideo) {
                    onPlayVideo({
                      url: cb.demoVideoUrl as string,
                      title: cb.title,
                      author: cb.author?.fullName || "Gu AI",
                    });
                  }
                }}
              >
                <Play className="w-7 h-7 text-black fill-black ml-1.5" />
              </div>
            </div>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              toast.error("Yêu cầu đăng nhập", {
                description:
                  "Bạn cần phải đăng nhập để lưu chatbot này vào thư viện.",
              });
            }}
            className="absolute bottom-5 right-5 w-10 h-10 rounded-full bg-[#fbbf24] flex items-center justify-center translate-y-4 opacity-0 group-hover/thumbnail:translate-y-0 group-hover/thumbnail:opacity-100 transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 z-20"
          >
            <Bookmark className="w-5 h-5 text-black" />
          </button>
        </div>

        <Link href={`/chatbot/${cb.slug}`} className="p-6 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-lg border border-cyan-400/20 font-mono tracking-widest uppercase">
              {cb.category?.name || "AI Prompt"}
            </span>
            <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity bg-white/5 px-2 py-1 rounded-lg">
              <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
              <span className="text-[11px] font-black text-white">
                {(cb.averageRating || 0).toFixed(1)}
              </span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-cyan-400 transition-colors">
            {cb.title}
          </h3>
          <p className="text-sm text-white/50 line-clamp-2 mb-6 leading-relaxed font-normal">
            {displayDesc}
          </p>

          <div className="pt-4 border-t border-white/5 mt-auto flex items-center justify-between">
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-white/20" /> Đã copy:{" "}
              {cb.copyCount || 0}
            </span>
            <div className="flex items-center gap-2">
              {cb.isFree ? (
                <div className="text-[9px] font-black uppercase tracking-widest text-[#10b981] bg-[#10b981]/10 px-2.5 py-1.5 rounded-lg border border-[#10b981]/20">
                  Miễn phí
                </div>
              ) : (
                <div className="text-[9px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-400/10 px-2.5 py-1.5 rounded-lg border border-cyan-400/20">
                  Sở hữu ngay
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
