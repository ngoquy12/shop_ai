"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ShoppingCart,
  ExternalLink,
  Flame,
  TrendingDown,
  Heart,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  type Variants,
} from "framer-motion";
import { aiTools, aiToolCategories, type AITool } from "@/lib/data";
import { cn } from "@/lib/utils";

function formatPrice(price: number) {
  return price.toLocaleString("vi-VN") + "đ";
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.065 } },
};

function ToolCard({ tool }: { tool: AITool }) {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div
      variants={cardVariants}
      layout
      className="group relative rounded-2xl border border-border/60 bg-card overflow-hidden"
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{ boxShadow: "0 0 0 0 rgba(59,130,246,0)" }}
      whileInView={{ boxShadow: "0 0 0 0 rgba(59,130,246,0)" }}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-500/0 to-violet-500/0 group-hover:from-blue-500/5 group-hover:to-violet-500/5 transition-all duration-300 pointer-events-none" />

      {/* Wishlist button */}
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={() => setWished((w) => !w)}
        className={cn(
          "absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200",
          wished
            ? "bg-red-500 text-white"
            : "bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-red-400",
        )}
        aria-label="Yêu thích"
      >
        <Heart className={cn("w-3.5 h-3.5", wished && "fill-white")} />
      </motion.button>

      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3 pr-8">
          <motion.div
            whileHover={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.4 }}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shrink-0 shadow-lg"
            style={{ backgroundColor: tool.bgColor }}
          >
            {tool.icon}
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm sm:text-base leading-snug text-foreground line-clamp-2">
                {tool.name}
              </h3>
              {tool.hot && (
                <Badge className="bg-orange-500/15 text-orange-500 border-orange-500/20 gap-1 shrink-0 hover:bg-orange-500/20">
                  <Flame className="w-3 h-3" />
                  Hot
                </Badge>
              )}
            </div>
            <Badge variant="secondary" className="mt-1.5 text-xs font-medium">
              {tool.category.replace("-", " ")}
            </Badge>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
          {tool.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border/50"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price + Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/50">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(tool.originalPrice)}
            </span>
            <span className="text-base sm:text-lg font-bold text-blue-500">
              {formatPrice(tool.salePrice)}
            </span>
            <Badge className="bg-red-500/15 text-red-500 border-red-500/20 gap-1 font-bold hover:bg-red-500/20">
              <TrendingDown className="w-3 h-3" />-{tool.discount}%
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {tool.externalUrl && (
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground"
                  onClick={() => window.open(tool.externalUrl, "_blank")}
                  aria-label="Xem trang gốc"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </motion.div>
            )}
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                size="sm"
                onClick={handleAdd}
                className={cn(
                  "h-8 gap-1.5 rounded-lg shadow-md transition-all duration-200",
                  added
                    ? "bg-green-600 hover:bg-green-600 shadow-green-500/20"
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20",
                )}
                aria-label={`Thêm ${tool.name} vào giỏ`}
              >
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span
                      key="added"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-1"
                    >
                      ✓ Đã thêm
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-1"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      {tool.soldCount ? (
                        <span className="text-white/80 text-xs">
                          {tool.soldCount}
                        </span>
                      ) : (
                        "Mua"
                      )}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function AIToolsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    return aiTools.filter((tool) => {
      const matchCat =
        activeCategory === "all" || tool.category === activeCategory;
      const s = search.toLowerCase();
      const matchSearch =
        !s ||
        tool.name.toLowerCase().includes(s) ||
        tool.description.toLowerCase().includes(s) ||
        tool.tags.some((t) => t.toLowerCase().includes(s));
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/8 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1.05, 1, 1.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-1/4 w-[200px] h-[200px] bg-violet-500/8 rounded-full blur-2xl pointer-events-none"
        />

        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
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
              className="pl-10 h-12 rounded-xl border-border/60 bg-card shadow-sm text-base focus-visible:ring-blue-500/30"
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
                      ? "border-blue-600 text-white"
                      : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border bg-card",
                  )}
                  whileTap={{ scale: 0.95 }}
                >
                  {activeCategory === cat.id && (
                    <motion.div
                      layoutId="category-bg"
                      className="absolute inset-0 rounded-full bg-blue-600"
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
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                variants={stagger}
                initial="hidden"
                animate="show"
              >
                {filtered.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
