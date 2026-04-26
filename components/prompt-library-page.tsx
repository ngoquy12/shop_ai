"use client";

import { useState, useMemo } from "react";

import { Search, Tag, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PromptCard } from "@/components/prompt-card";
import { usePrompts } from "@/features/prompts/hooks/use-prompts";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { Category } from "@/features/categories/types";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Prompt } from "@/features/prompts/types";

// ─── Main Page ────────────────────────────────────────────────────────────────
export function PromptLibraryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showAllTags, setShowAllTags] = useState(false);

  const { data: paginatedData, isLoading } = usePrompts({
    search: search || undefined,
  });

  const prompts = useMemo(() => paginatedData?.data || [], [paginatedData]);

  const filtered = useMemo(() => {
    // Nếu có dữ liệu từ API, ta có thể lọc thêm ở client cho Tag (nếu backend chưa lọc Tag)
    return prompts.filter((p: Prompt) => {
      const matchCat =
        activeCategory === "all" ||
        p.categoryId === activeCategory ||
        p.category?.slug === activeCategory;
      const matchTag =
        !activeTag ||
        p.tags?.some((t) => t.name === activeTag || t.slug === activeTag);
      return matchCat && matchTag;
    });
  }, [prompts, activeCategory, activeTag]);

  const categoriesQuery = useCategories({
    type: "PROMPT",
    page: 1,
    limit: 100,
  });

  const dynamicCategories = useMemo(() => {
    const categoriesDb = categoriesQuery.data?.data || [];
    const catMap = new Map();
    categoriesDb.forEach((c: Category) => {
      // Assuming PROMPT categories exist or we just use those matching the prompts
      catMap.set(c.id, { id: c.id, label: c.name, emoji: c.icon || "📚" });
    });

    prompts.forEach((p: Prompt) => {
      if (p.category && p.categoryId) {
        catMap.set(p.categoryId, {
          id: p.categoryId,
          label: p.category.name,
          emoji: p.category.icon || "📚",
        });
      }
    });

    return [
      { id: "all", label: "Tất cả Prompt", emoji: "⚡" },
      ...Array.from(catMap.values()),
    ];
  }, [categoriesQuery.data, prompts]);

  const dynamicTags = useMemo(() => {
    const tagsMap = new Set<string>();
    prompts.forEach((p: Prompt) => {
      if (p.tags && Array.isArray(p.tags)) {
        p.tags.forEach((tag) => {
          if (tag.name) tagsMap.add(tag.name);
          else if (typeof tag === "string") tagsMap.add(tag);
        });
      }
    });
    return Array.from(tagsMap);
  }, [prompts]);

  const visibleTags = showAllTags ? dynamicTags : dynamicTags.slice(0, 14);

  return (
    <div className="min-h-screen bg-background">
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <span className="text-3xl sm:text-4xl">✨</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Thư viện Prompt miễn phí
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto mb-8"
        >
          Sao chép và sử dụng ngay với ChatGPT, Claude, Gemini...
        </motion.p>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative max-w-lg mx-auto"
        >
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="ai-tools-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm công cụ AI..."
            className="pl-10 h-12 rounded-xl border-border/60 bg-card shadow-sm text-base focus-visible:ring-cyan-500/30"
          />
          <AnimatePresence>
            {search && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors text-xs"
              >
                ✕
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── Sticky filters ── */}
      <div className="sticky top-16 z-30 bg-background/90 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 space-y-2">
          {/* Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
            {dynamicCategories.map((cat) => (
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
                    ? "bg-cyan-500 text-black border-cyan-500 shadow-md shadow-cyan-500/25"
                    : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border bg-card",
                )}
              >
                {cat.emoji && <span>{cat.emoji}</span>}
                {cat.label}
              </button>
            ))}
          </div>

          {/* Tags row */}
          {dynamicTags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mt-2">
              <Tag className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              {visibleTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-full transition-all border",
                    activeTag === tag
                      ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                      : "border-border/40 text-muted-foreground hover:text-foreground hover:border-border bg-muted/50",
                  )}
                >
                  {tag}
                </button>
              ))}
              {dynamicTags.length > 14 && (
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
              )}
            </div>
          )}
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

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
            <p className="text-sm font-medium text-muted-foreground animate-pulse">
              Đang tải danh sách prompt từ hệ thống...
            </p>
          </div>
        ) : filtered.length === 0 ? (
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
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
            {filtered.map((prompt: Prompt) => (
              <div key={prompt.id} className="break-inside-avoid block mb-6">
                <PromptCard prompt={prompt} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
