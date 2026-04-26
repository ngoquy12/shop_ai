"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ShoppingCart,
  ExternalLink,
  Flame,
  TrendingDown,
  Heart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { RichTextRenderer } from "@/components/ui/rich-text-renderer";
import { useAddToCart } from "@/features/carts/hooks/use-carts";
import {
  useFavorites,
  useToggleFavorite,
} from "@/features/favorites/hooks/use-favorites";
import { AITool } from "@/features/ai-tools/types";

function formatPrice(price?: number | string) {
  if (price === undefined || price === null) return "0đ";
  return Number(price).toLocaleString("vi-VN") + "đ";
}

export const toolCardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export function AIToolCard({ tool }: { tool: AITool }) {
  const [added, setAdded] = useState(false);
  const { mutate: addToCart, isPending } = useAddToCart();

  const { data: favorites } = useFavorites("AITOOL");
  const { mutate: toggleFavorite } = useToggleFavorite();

  const isWished = favorites?.some((f) => f.itemId === tool.id) || false;

  const handleAdd = () => {
    addToCart(
      {
        itemType: "AITOOL",
        itemId: tool.id,
        quantity: 1,
      },
      {
        onSuccess: () => {
          setAdded(true);
          setTimeout(() => setAdded(false), 1800);
        },
      },
    );
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({ itemType: "AITOOL", itemId: tool.id });
  };

  const discountPercentage = tool.oldPrice
    ? Math.round(((tool.oldPrice - tool.price) / tool.oldPrice) * 100)
    : 0;
  const originalPrice = tool.oldPrice || tool.price;
  const tagsList = tool.tags?.map((t) => t.name) || [];

  return (
    <motion.div
      variants={toolCardVariants}
      className="group relative rounded-2xl border border-border/60 bg-card overflow-hidden h-full flex flex-col"
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{ boxShadow: "0 0 0 0 rgba(59,130,246,0)" }}
      whileInView={{ boxShadow: "0 0 0 0 rgba(59,130,246,0)" }}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-500/0 to-violet-500/0 group-hover:from-blue-500/5 group-hover:to-violet-500/5 transition-all duration-300 pointer-events-none" />

      {/* Wishlist button */}
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={handleToggleFavorite}
        className={cn(
          "absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200",
          isWished
            ? "bg-red-500 text-white"
            : "bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-red-400",
        )}
        aria-label="Yêu thích"
      >
        <Heart className={cn("w-3.5 h-3.5", isWished && "fill-white")} />
      </motion.button>

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {/* Clickable Area */}
        <Link href={`/ai-tools/${tool.id}`} className="flex-1 block group/link">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4 pr-8">
            <motion.div
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.4 }}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shrink-0 shadow-lg overflow-hidden bg-white"
            >
              {tool.thumbnailUrl ? (
                <Image
                  src={tool.thumbnailUrl}
                  alt={tool.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover p-1 rounded-full"
                />
              ) : (
                tool.name.charAt(0).toUpperCase()
              )}
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3
                  className="font-semibold text-sm sm:text-base leading-snug text-foreground truncate flex-1 group-hover/link:text-blue-500 transition-colors"
                  title={tool.name}
                >
                  {tool.name}
                </h3>
                {tool.isHot && (
                  <Badge className="bg-orange-500/15 text-orange-500 border-orange-500/20 gap-1 shrink-0 px-1 py-0 text-[10px]">
                    <Flame className="w-3 h-3" />
                    Hot
                  </Badge>
                )}
              </div>
              <Badge variant="secondary" className="text-[10px] font-medium">
                {tool.category?.name || "All"}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <div className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4 overflow-hidden">
            <RichTextRenderer
              content={tool.description}
              className="prose-sm line-clamp-2 m-0 p-0 prose-p:!mb-0 prose-headings:!mb-1 prose-headings:!mt-0"
            />
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 mb-5 h-7 overflow-hidden pointer-events-none">
            {tagsList.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border/50 truncate max-w-[120px] shrink-0"
                title={tag}
              >
                {tag}
              </span>
            ))}
            {tagsList.length > 2 && (
              <span className="text-[11px] px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0 font-medium">
                +{tagsList.length - 2}
              </span>
            )}
          </div>
        </Link>

        {/* Price + Actions */}
        <div className="flex items-center justify-between gap-3 pt-5 border-t border-border/50 mt-auto">
          <div className="flex items-center gap-2 flex-wrap">
            {discountPercentage > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="text-base sm:text-lg font-bold text-blue-500">
              {formatPrice(tool.price)}
            </span>
            {discountPercentage > 0 && (
              <Badge className="bg-red-500/15 text-red-500 border-red-500/20 gap-1 font-bold hover:bg-red-500/20 text-[10px] px-1 py-0">
                <TrendingDown className="w-3 h-3" />-{discountPercentage}%
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {tool.link && (
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground"
                  onClick={() => window.open(tool.link as string, "_blank")}
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
                      className="flex items-center gap-1 text-[11px]"
                    >
                      ✓ Đã thêm
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-1 text-[11px]"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Mua
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
