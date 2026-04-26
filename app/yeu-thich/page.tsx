"use client";

import { useState } from "react";
import { type ComponentType } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  ShoppingCart,
  Trash2,
  Clock,
  ArrowRight,
  Search,
  Bot,
  BookOpen,
  Wand2,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { cn, formatCurrency } from "@/lib/utils";
import {
  useFavorites,
  useToggleFavorite,
} from "@/features/favorites/hooks/use-favorites";
import type {
  FavoriteItemType,
  FavoriteResponse,
} from "@/features/favorites/types";
import { useAddToCart } from "@/features/carts/hooks/use-carts";

const FILTERS: {
  key: FavoriteItemType | "ALL";
  label: string;
  icon: ComponentType<{ className?: string }>;
}[] = [
  { key: "ALL", label: "Tất cả", icon: Heart },
  { key: "AITOOL", label: "Công cụ AI", icon: Bot },
  { key: "COURSE", label: "Khóa học", icon: BookOpen },
  { key: "PROMPT", label: "Prompt", icon: Wand2 },
];

function discount(original: number, price: number) {
  return original && price ? Math.round((1 - price / original) * 100) : 0;
}

// ─── Wishlist Card ─────────────────────────────────────────────
function WishlistCard({ item }: { item: FavoriteResponse }) {
  const [addedToCart, setAddedToCart] = useState(false);
  const { mutate: toggleFav } = useToggleFavorite();
  const { mutate: addToCart } = useAddToCart();

  const handleAddToCart = () => {
    if (!item.details) return;
    const validCartTypes: FavoriteItemType[] = [
      "COURSE",
      "AITOOL",
      "PROMPT",
    ];
    if (!validCartTypes.includes(item.itemType)) return;
    const cartItemType = item.itemType as "COURSE" | "AITOOL" | "PROMPT";
    addToCart(
      {
        itemType: cartItemType,
        itemId: item.itemId,
        quantity: 1,
      },
      {
        onSuccess: () => {
          setAddedToCart(true);
          setTimeout(() => setAddedToCart(false), 2500);
        },
      },
    );
  };

  const handleRemove = () => {
    toggleFav({ itemType: item.itemType, itemId: item.itemId });
  };

  if (!item.details) return null;

  const price = item.details.price || 0;
  const originalPrice = item.details.oldPrice || price;
  const inStock = true;

  const getBadges = () => {
    if (item.itemType === "COURSE")
      return {
        text: "Khóa học",
        baseColor: "bg-pink-500",
        icon: <BookOpen className="w-5 h-5 text-white" />,
        iconBg: "from-pink-500 to-rose-500",
      };
    if (item.itemType === "AITOOL")
      return {
        text: "AI Tool",
        baseColor: "bg-blue-500",
        icon: <Bot className="w-5 h-5 text-white" />,
        iconBg: "from-blue-500 to-cyan-500",
      };
    return {
      text: "Prompt",
      baseColor: "bg-yellow-500",
      icon: <Wand2 className="w-5 h-5 text-white" />,
      iconBg: "from-yellow-500 to-orange-500",
    };
  };

  const badgeInfo = getBadges();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ duration: 0.35 }}
      className="group relative rounded-2xl border border-border/60 bg-card overflow-hidden hover:border-cyan-500/30 hover:shadow-[0_0_30px_-8px_rgba(6,182,212,0.15)] transition-all duration-300"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        <span
          className={cn(
            "text-[10px] font-bold text-white px-2 py-0.5 rounded-full",
            badgeInfo.baseColor,
          )}
        >
          {badgeInfo.text}
        </span>
      </div>

      {/* Remove btn */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={handleRemove}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-red-400 hover:bg-red-500/15 hover:border-red-400/50 transition-all opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </motion.button>

      <div className="p-5">
        {/* Icon + type */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className={cn(
              "w-14 h-14 rounded-2xl bg-linear-to-br flex items-center justify-center shadow-md shrink-0 border border-border/20",
              badgeInfo.iconBg,
            )}
          >
            {item.details.thumbnailUrl ? (
              <Image
                src={item.details.thumbnailUrl}
                alt={item.details.name}
                width={56}
                height={56}
                className="w-full h-full object-cover rounded-2xl p-1"
              />
            ) : (
              badgeInfo.icon
            )}
          </div>
          <div className="flex-1 min-w-0">
            <Link
              href={
                item.itemType === "COURSE"
                  ? `/khoa-hoc-ai/${item.details.slug || item.itemId}`
                  : item.itemType === "AITOOL"
                    ? `/ai-tools/${item.details.slug || item.itemId}`
                    : `/prompts/${item.details.slug || item.itemId}`
              }
              className="font-bold text-base leading-snug hover:text-cyan-400 transition-colors line-clamp-2 block"
            >
              {item.details.name}
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground mt-6">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Đã lưu {new Date(item.createdAt).toLocaleDateString("vi-VN")}
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-foreground">
                {formatCurrency(price)}
              </span>
              {originalPrice > price && (
                <span className="text-xs line-through text-muted-foreground/60">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>
            {originalPrice > price && (
              <span className="text-xs font-bold text-green-500">
                Tiết kiệm {formatCurrency(originalPrice - price)} (-
                {discount(originalPrice, price)}%)
              </span>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={!inStock || addedToCart}
            className={cn(
              "flex items-center gap-1.5 px-4 h-9 rounded-xl text-sm font-bold transition-all duration-200 shrink-0",
              addedToCart
                ? "bg-green-600 text-white shadow-md shadow-green-500/20"
                : inStock
                  ? "bg-cyan-500 hover:bg-cyan-600 text-white shadow-md shadow-cyan-500/15"
                  : "bg-muted text-muted-foreground cursor-not-allowed",
            )}
          >
            <AnimatePresence mode="wait">
              {addedToCart ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Đã thêm
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Thêm giỏ
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Empty State ───────────────────────────────────────────────
function EmptyWishlist({ filter }: { filter: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full py-24 flex flex-col items-center text-center"
    >
      <div className="w-20 h-20 rounded-3xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-5">
        <Heart className="w-9 h-9 text-pink-400" />
      </div>
      <h3 className="text-xl font-bold mb-2">
        {filter === "ALL"
          ? "Danh sách yêu thích trống"
          : `Chưa có ${FILTERS.find((f) => f.key === filter)?.label} nào`}
      </h3>
      <p className="text-muted-foreground text-sm mb-6 max-w-sm">
        Nhấn vào icon ❤️ trên bất kỳ sản phẩm nào để thêm vào danh sách yêu
        thích của bạn.
      </p>
      <Button
        asChild
        className="bg-cyan-500 hover:bg-cyan-600 text-white gap-2 rounded-xl"
      >
        <Link href="/cong-cu-ai">
          Khám phá công cụ AI <ArrowRight className="w-4 h-4" />
        </Link>
      </Button>
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────
export default function WishlistPage() {
  const [filter, setFilter] = useState<FavoriteItemType | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const { data: favorites = [], isLoading } = useFavorites(
    filter === "ALL" ? undefined : (filter as FavoriteItemType),
  );

  const filtered = favorites.filter((item) => {
    if (!item.details) return false;
    const matchSearch = item.details.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchSearch;
  });

  const totalSavings = filtered.reduce((acc, item) => {
    if (!item.details) return acc;
    const oldPrice = item.details.oldPrice || item.details.price;
    return acc + (oldPrice - item.details.price);
  }, 0);

  return (
    <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl font-extrabold">Sản phẩm yêu thích</h1>
            <AnimatePresence>
              {favorites.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center"
                >
                  {favorites.length}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          {totalSavings > 0 && (
            <p className="text-sm text-green-500 font-medium">
              💰 Tổng tiết kiệm:{" "}
              <span className="font-extrabold">
                {formatCurrency(totalSavings)}
              </span>{" "}
              so với giá gốc
            </p>
          )}
        </div>
        {filtered.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2 rounded-xl h-9 text-sm border-border/60"
            >
              <Share2 className="w-3.5 h-3.5" />
              Chia sẻ danh sách
            </Button>
            <Button
              asChild
              className="bg-cyan-500 hover:bg-cyan-600 text-white gap-2 rounded-xl h-9 text-sm"
            >
              <Link href="/gio-hang">
                <ShoppingCart className="w-3.5 h-3.5" />
                Xem giỏ hàng
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Filter tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/50 border border-border/40 flex-wrap">
          {FILTERS.map(({ key, label, icon: Icon }) => {
            const count =
              key === "ALL"
                ? favorites.length
                : favorites.filter((i) => i.itemType === key).length;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={cn(
                  "relative flex items-center gap-1.5 h-8 px-3 rounded-lg text-sm font-medium transition-all",
                  filter === key
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {filter === key && (
                  <motion.div
                    layoutId="wishlist-filter-active"
                    className="absolute inset-0 rounded-lg bg-background shadow-sm border border-border/50"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                  {count > 0 && (
                    <span className="text-[10px] font-bold tabular-nums">
                      {count}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm trong danh sách..."
            className="pl-9 h-9 rounded-xl border-border/60 bg-card text-sm"
          />
        </div>
      </div>

      {/* Grid */}
      <LayoutGroup>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className="col-span-full py-24 flex items-center justify-center text-muted-foreground animate-pulse">
                Đang tải danh sách yêu thích...
              </div>
            ) : filtered.length === 0 ? (
              <EmptyWishlist key="empty" filter={filter} />
            ) : (
              filtered.map((item) => <WishlistCard key={item.id} item={item} />)
            )}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </div>
  );
}
