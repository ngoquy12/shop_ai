"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  type Variants,
} from "framer-motion";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { cn } from "@/lib/utils";
import { AIToolCard } from "@/components/ai-tool-card";
import { useInfiniteAiTools } from "@/features/ai-tools/hooks/use-ai-tools";

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.065 } },
};

export function AIToolsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const toolsQuery = useInfiniteAiTools({
    pageSize: 4,
    status: "ACTIVE",
  });

  const categoriesQuery = useCategories({
    type: "TOOL",
    page: 1,
    limit: 100,
  });

  const tools = useMemo(() => {
    return toolsQuery.data?.pages.flatMap((page) => page.data) || [];
  }, [toolsQuery.data]);

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [observerNode, setObserverNode] = useState<HTMLDivElement | null>(null);

  const observerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) setObserverNode(node);
  }, []);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target) {
      setIsIntersecting(target.isIntersecting);
    }
  }, []);

  useEffect(() => {
    if (!observerNode) return;
    const option = { threshold: 0.1 };
    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(observerNode);
    return () => observer.unobserve(observerNode);
  }, [observerNode, handleObserver]);

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = toolsQuery;

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);
  const aiToolCategories = useMemo(() => {
    const categoriesDb = categoriesQuery.data?.data || [];
    const catMap = new Map();
    categoriesDb.forEach((c: { id: string; name: string; slug: string }) => {
      catMap.set(c.id, { id: c.id, label: c.name, slug: c.slug });
    });
    tools.forEach((t) => {
      if (t.category) {
        catMap.set(t.category.id, {
          id: t.category.id,
          label: t.category.name,
          slug: t.category.slug,
        });
      } else if (t.categoryId && !catMap.has(t.categoryId)) {
        catMap.set(t.categoryId, {
          id: t.categoryId,
          label: "Khác",
          slug: t.categoryId,
        });
      }
    });
    return [
      { id: "all", label: "Tất cả", slug: "all" },
      ...Array.from(catMap.values()),
    ];
  }, [categoriesQuery.data?.data, tools]);

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    tools.forEach((t) => {
      if (t.tags) {
        t.tags.forEach((tag: { id: string; name: string }) => {
          if (tag.name) tagsSet.add(tag.name);
        });
      }
    });
    return Array.from(tagsSet);
  }, [tools]);

  const filtered = useMemo(() => {
    return tools.filter((tool) => {
      const matchCat =
        activeCategory === "all" ||
        tool.categoryId === activeCategory ||
        tool.category?.slug === activeCategory ||
        tool.category?.id === activeCategory;
      const matchTag =
        !activeTag ||
        (tool.tags &&
          tool.tags.some(
            (t: { id: string; name: string }) => t.name === activeTag,
          ));
      const s = search.toLowerCase();
      const matchSearch =
        !s ||
        tool.name.toLowerCase().includes(s) ||
        (tool.description && tool.description.toLowerCase().includes(s)) ||
        (tool.tags &&
          tool.tags.some((t: { id: string; name: string }) =>
            t.name?.toLowerCase().includes(s),
          ));
      return matchCat && matchTag && matchSearch;
    });
  }, [search, activeCategory, activeTag, tools]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-blue-500/8 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1.05, 1, 1.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-1/4 w-50 h-50 bg-violet-500/8 rounded-full blur-2xl pointer-events-none"
        />

        <div className="relative max-w-400 mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <span className="text-3xl sm:text-4xl">✨</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Khám phá Công cụ AI
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto mb-8"
          >
            Tìm hiểu và mua tài khoản các công cụ AI hàng đầu thế giới với giá
            tốt nhất
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
      </div>

      {/* Category Filters */}
      <div className="sticky top-16 z-30 bg-background/85 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <LayoutGroup>
            <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-none">
              {aiToolCategories.map((cat) => (
                <motion.button
                  key={cat.id}
                  id={`filter-${cat.id}`}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "relative shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                    activeCategory === cat.id
                      ? "border-cyan-500 text-black"
                      : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border bg-card",
                  )}
                  whileTap={{ scale: 0.95 }}
                >
                  {activeCategory === cat.id && (
                    <motion.div
                      layoutId="category-bg"
                      className="absolute inset-0 rounded-full bg-cyan-500"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.4,
                      }}
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </motion.button>
              ))}
            </div>
          </LayoutGroup>

          {allTags.length > 0 && (
            <LayoutGroup id="tags">
              <div className="flex items-center gap-2 pb-3 overflow-x-auto scrollbar-none mt-2">
                <motion.button
                  onClick={() => setActiveTag(null)}
                  className={cn(
                    "relative shrink-0 px-3 py-1 rounded-md text-xs transition-colors border",
                    !activeTag
                      ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-500 font-medium"
                      : "border-border/40 text-muted-foreground hover:text-foreground hover:border-border/80 bg-card",
                  )}
                  whileTap={{ scale: 0.95 }}
                >
                  Tất cả Tags
                </motion.button>
                {allTags.map((tag) => (
                  <motion.button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={cn(
                      "relative shrink-0 px-3 py-1 rounded-md text-xs transition-colors border",
                      activeTag === tag
                        ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-500 font-medium"
                        : "border-border/40 text-muted-foreground hover:text-foreground hover:border-border/80 bg-card",
                    )}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>
            </LayoutGroup>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">
                Không tìm thấy kết quả
              </h3>
              <p className="text-muted-foreground mb-4">
                Hãy thử từ khóa khác hoặc chọn danh mục khác
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("all");
                }}
              >
                Xóa bộ lọc
              </Button>
            </motion.div>
          ) : (
            <motion.div key="grid">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between mb-6"
              >
                <p className="text-sm text-muted-foreground">
                  Hiển thị{" "}
                  <span className="font-semibold text-foreground">
                    {filtered.length}
                  </span>{" "}
                  công cụ
                </p>
              </motion.div>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                variants={stagger}
                initial="hidden"
                animate="show"
              >
                {filtered.map((tool) => (
                  <AIToolCard key={tool.id} tool={tool} />
                ))}
              </motion.div>

              <div
                ref={observerRef}
                className="w-full flex justify-center py-8 mt-4"
              >
                {toolsQuery.isFetchingNextPage && (
                  <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
