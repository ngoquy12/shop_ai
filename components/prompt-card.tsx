import { useState } from "react";
import Link from "next/link";
import { Copy, Bookmark, BookmarkCheck, Heart, Eye, Check } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import type { Prompt } from "@/features/prompts/types";

import {
  useFavorites,
  useToggleFavorite,
} from "@/features/favorites/hooks/use-favorites";

export function PromptCard({ prompt }: { prompt: Prompt }) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const { data: favorites } = useFavorites("PROMPT");
  const { mutate: toggleFavorite } = useToggleFavorite();

  const isLiked = favorites?.some((f) => f.itemId === prompt.id) || false;

  const stripHtml = (html?: string | null) =>
    html ? html.replace(/<[^>]*>?/gm, "") : "";

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard
      .writeText(
        stripHtml(prompt.instructions) || stripHtml(prompt.content) || "",
      )
      .catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({ itemType: "PROMPT", itemId: prompt.id });
  };

  return (
    <div className="group relative rounded-2xl border border-border/50 bg-card overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/30 hover:shadow-[0_8px_30px_-8px_rgba(139,92,246,0.2)] flex flex-col">
      {/* Image */}
      <Link
        href={`/prompt-mien-phi/${prompt.slug}`}
        className="relative block overflow-hidden bg-muted group-hover:cursor-pointer"
      >
        <Image
          src={
            prompt.thumbnailUrl ||
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500"
          }
          alt={prompt.title}
          width={800}
          height={800}
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Bookmark */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setBookmarked((b) => !b);
          }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/70 z-10"
          aria-label="Bookmark"
        >
          {bookmarked ? (
            <BookmarkCheck className="w-3.5 h-3.5 text-yellow-400" />
          ) : (
            <Bookmark className="w-3.5 h-3.5 text-white" />
          )}
        </button>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Header: Category & Pricing Status */}
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-500 border border-violet-500/20 font-medium truncate">
              {prompt.category?.name || "AI Prompt"}
            </span>
            {prompt.variables && prompt.variables.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 font-bold uppercase tracking-widest">
                ⚡ Tùy biến
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {prompt.isPremium ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold uppercase tracking-tight">
                👑 Premium
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] font-bold uppercase tracking-tight">
                Miễn phí
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <Link href={`/prompt-mien-phi/${prompt.slug}`}>
          <h3 className="font-semibold text-sm text-foreground leading-snug mb-2 line-clamp-2 hover:text-violet-400 transition-colors cursor-pointer">
            {prompt.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3 flex-1">
          {prompt.excerpt || prompt.description}
        </p>

        {/* Prompt text snippet / Preview */}
        <div className="group/snippet relative mb-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors border border-border/50 p-3 pr-9 overflow-hidden">
          <p className="text-[11px] text-muted-foreground font-mono leading-relaxed line-clamp-3">
            {prompt.isPremium
              ? "Đăng ký gói Premium để xem toàn bộ nội dung prompt này..."
              : stripHtml(prompt.instructions) ||
                stripHtml(prompt.content) ||
                "Nội dung đang được cập nhật..."}
          </p>
          <div className="absolute bottom-0 inset-x-0 h-4 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />

          {!prompt.isPremium && (
            <button
              onClick={handleCopy}
              title="Sao chép prompt"
              className={cn(
                "absolute top-2 right-2 w-6 h-6 rounded-md flex items-center justify-center transition-all bg-background border border-border/50 text-muted-foreground hover:scale-105",
                copied
                  ? "opacity-100"
                  : "opacity-0 group-hover/snippet:opacity-100 hover:text-foreground shadow-sm",
              )}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Stats + actions row */}
        <div className="flex items-center justify-between">
          {/* Stats */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleLike}
              className={cn(
                "flex items-center gap-1 text-xs transition-colors",
                isLiked
                  ? "text-red-500"
                  : "text-muted-foreground hover:text-red-500",
              )}
              aria-label="Like"
            >
              <Heart className={cn("w-3.5 h-3.5", isLiked && "fill-red-500")} />
              {prompt.likeCount + (isLiked ? 1 : 0)}
            </button>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="w-3.5 h-3.5" />
              {prompt.viewCount}
            </div>
            <Link
              href={`/prompt-mien-phi/${prompt.slug}`}
              className={cn(
                "ml-2 text-[11px] font-bold flex items-center gap-1 transition-all",
                prompt.isPremium
                  ? "text-amber-500 hover:text-amber-600"
                  : "text-violet-500 hover:gap-1.5",
              )}
            >
              {prompt.isPremium ? "Mở khóa 🔓" : "Sử dụng ⚡"}
            </Link>
          </div>

          {/* Tags */}
          <div className="flex gap-1 flex-wrap justify-end">
            {prompt.tags?.slice(0, 2).map((t, i) => (
              <span
                key={t?.id || t?.name || i}
                className="text-[10px] text-blue-400/70"
              >
                #{t?.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
