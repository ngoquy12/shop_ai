"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Copy,
  Bookmark,
  BookmarkCheck,
  Heart,
  Eye,
  Sparkles,
  Tag,
  ChevronDown,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { prompts, promptCategories, promptTags } from "@/lib/prompt-data";
import type { Prompt } from "@/lib/prompt-types";

// ─── Prompt Card ──────────────────────────────────────────────────────────────
function PromptCard({ prompt }: { prompt: Prompt }) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.promptText).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative rounded-2xl border border-border/50 bg-card overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/30 hover:shadow-[0_8px_30px_-8px_rgba(139,92,246,0.2)] flex flex-col">
      {/* Image */}
      <div
        className="relative overflow-hidden bg-muted"
        style={{ aspectRatio: "16/9" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={prompt.image}
          alt={prompt.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Copy count badge */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
          <Copy className="w-3 h-3" />
          {prompt.copies}
        </div>

        {/* Bookmark */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setBookmarked((b) => !b);
          }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/70"
          aria-label="Bookmark"
        >
          {bookmarked ? (
            <BookmarkCheck className="w-3.5 h-3.5 text-yellow-400" />
          ) : (
            <Bookmark className="w-3.5 h-3.5 text-white" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category badge */}
        <div className="mb-2">
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-500 border border-violet-500/20 font-medium">
            🏷️ {prompt.categoryLabel}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-sm text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-violet-400 transition-colors">
          {prompt.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3 flex-1">
          {prompt.description}
        </p>

        {/* Prompt text snippet */}
        <div className="relative mb-3 rounded-lg bg-muted/60 border border-border/50 p-2.5 overflow-hidden">
          <p className="text-[11px] text-muted-foreground font-mono leading-relaxed line-clamp-3">
            {prompt.promptText}
          </p>
          <div className="absolute bottom-0 inset-x-0 h-4 bg-linear-to-t from-muted/60 to-transparent" />
        </div>

        {/* Stats + actions row */}
        <div className="flex items-center justify-between">
          {/* Stats */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLiked((l) => !l)}
              className={cn(
                "flex items-center gap-1 text-xs transition-colors",
                liked
                  ? "text-red-500"
                  : "text-muted-foreground hover:text-red-500",
              )}
              aria-label="Like"
            >
              <Heart className={cn("w-3.5 h-3.5", liked && "fill-red-500")} />
              {prompt.likes + (liked ? 1 : 0)}
            </button>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="w-3.5 h-3.5" />
              {prompt.views}
            </div>
          </div>

          {/* Tags */}
          <div className="flex gap-1 flex-wrap justify-end">
            {prompt.tags.slice(0, 2).map((t) => (
              <span key={t} className="text-[10px] text-blue-400/70">
                #{t.replace(/\s+/g, "")}
              </span>
            ))}
          </div>
        </div>

        {/* Copy button */}
        <Button
          id={`btn-copy-${prompt.id}`}
          size="sm"
          onClick={handleCopy}
          className={cn(
            "w-full mt-3 h-8 gap-1.5 text-xs font-semibold transition-all duration-200",
            copied
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-500/20",
          )}
          aria-label={`Copy prompt: ${prompt.title}`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Đã sao chép!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Sao chép prompt
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function PromptLibraryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showAllTags, setShowAllTags] = useState(false);

  const filtered = useMemo(() => {
    return prompts.filter((p) => {
      const matchCat =
        activeCategory === "all" || p.category === activeCategory;
      const matchTag = !activeTag || p.tags.includes(activeTag);
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t: string) => t.toLowerCase().includes(q)) ||
        p.promptText.toLowerCase().includes(q);
      return matchCat && matchTag && matchSearch;
    });
  }, [search, activeCategory, activeTag]);

  const visibleTags = showAllTags ? promptTags : promptTags.slice(0, 14);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-500/8 dark:bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-8 left-1/3 w-[200px] h-[200px] bg-pink-500/8 dark:bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
          <div className="flex items-center gap-2.5 mb-2">
            <Sparkles className="w-7 h-7 text-violet-500" />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Thư viện Prompt miễn phí
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base mb-6">
            Sao chép và sử dụng ngay với ChatGPT, Claude, Gemini...
          </p>

          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="prompt-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm prompt..."
              className="pl-10 h-11 rounded-xl border-border/60 bg-card shadow-sm focus-visible:ring-violet-500/30"
            />
          </div>
        </div>
      </div>

      {/* ── Sticky filters ── */}
      <div className="sticky top-16 z-30 bg-background/90 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 space-y-2">
          {/* Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
            {promptCategories.map((cat) => (
              <button
                key={cat.id}
                id={`prompt-cat-${cat.id}`}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setActiveTag(null);
                }}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border whitespace-nowrap",
                  activeCategory === cat.id
                    ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-500/25"
                    : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border bg-card",
                )}
              >
                {cat.emoji && <span>{cat.emoji}</span>}
                {cat.label}
              </button>
            ))}
          </div>

          {/* Tags row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Tag className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            {visibleTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={cn(
                  "text-xs px-2.5 py-1 rounded-full transition-all border",
                  activeTag === tag
                    ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                    : "border-border/40 text-muted-foreground hover:text-foreground hover:border-border bg-muted/50",
                )}
              >
                {tag}
              </button>
            ))}
            <button
              onClick={() => setShowAllTags((s) => !s)}
              className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform",
                  showAllTags && "rotate-180",
                )}
              />
              {showAllTags ? "Thu gọn" : "Xem thêm"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Grid content ── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {filtered.length}
            </span>{" "}
            prompt{filtered.length !== 1 ? "s" : ""}
            {search && <span>pro &quot;{search}&quot;</span>}
          </p>
          {(search || activeCategory !== "all" || activeTag) && (
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("all");
                setActiveTag(null);
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">
              Không tìm thấy prompt
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setActiveCategory("all");
                setActiveTag(null);
              }}
            >
              Xem tất cả prompts
            </Button>
          </div>
        ) : (
          /* Masonry-style 3 column grid (CSS columns) */
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-3 gap-4 space-y-0">
            {filtered.map((prompt) => (
              <div key={prompt.id} className="break-inside-avoid mb-4">
                <PromptCard prompt={prompt} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
