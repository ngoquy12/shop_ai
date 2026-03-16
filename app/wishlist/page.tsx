"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Heart, ShoppingCart, Trash2, Star, Clock, Zap,
  ArrowRight, Search, Bot, BookOpen, Wand2, Share2, CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { cn } from "@/lib/utils"

// ─── Mock data ─────────────────────────────────────────────────
const INITIAL_ITEMS = [
  {
    id: 1, type: "ai-tool",
    name: "ChatGPT Plus Account",
    desc: "Tài khoản ChatGPT Plus chính chủ, full tính năng GPT-4o, DALL-E 3",
    price: 280000, originalPrice: 400000,
    rating: 4.9, reviews: 1240, sold: 8500,
    badge: "Bán chạy #1", badgeColor: "bg-orange-500",
    icon: "🤖", iconBg: "from-green-500 to-teal-500",
    tags: ["GPT-4o", "DALL-E 3", "Code Interpreter"],
    addedAt: "2 ngày trước",
    inStock: true,
  },
  {
    id: 2, type: "course",
    name: "Khóa học AI Creative Pro",
    desc: "Học thiết kế với AI từ cơ bản đến nâng cao. 80+ bài học thực chiến, chứng chỉ quốc tế",
    price: 599000, originalPrice: 1200000,
    rating: 4.8, reviews: 456, sold: 2300,
    badge: "Hot -50%", badgeColor: "bg-red-500",
    icon: "🎨", iconBg: "from-pink-500 to-rose-500",
    tags: ["Midjourney", "Stable Diffusion", "Canva AI"],
    addedAt: "5 ngày trước",
    inStock: true,
  },
  {
    id: 3, type: "ai-tool",
    name: "Midjourney Subscription",
    desc: "Tài khoản Midjourney Basic/Standard, tạo ảnh AI chất lượng cao không giới hạn",
    price: 350000, originalPrice: 500000,
    rating: 4.7, reviews: 892, sold: 4200,
    badge: "Phổ biến", badgeColor: "bg-violet-500",
    icon: "🖼️", iconBg: "from-violet-500 to-purple-600",
    tags: ["Image Generation", "v6.1", "Fast Queue"],
    addedAt: "1 tuần trước",
    inStock: true,
  },
  {
    id: 4, type: "prompt",
    name: "Bộ 500+ Prompt Marketing",
    desc: "Prompt viết content, quảng cáo, email marketing tối ưu cho thị trường Việt Nam",
    price: 149000, originalPrice: 299000,
    rating: 4.6, reviews: 234, sold: 1800,
    badge: "Giảm 50%", badgeColor: "bg-green-500",
    icon: "✨", iconBg: "from-yellow-500 to-orange-500",
    tags: ["Marketing", "Copywriting", "Email"],
    addedAt: "2 tuần trước",
    inStock: true,
  },
  {
    id: 5, type: "ai-tool",
    name: "Claude Pro Account",
    desc: "Tài khoản Claude Pro của Anthropic với context window 200K tokens cực lớn",
    price: 320000, originalPrice: 420000,
    rating: 4.8, reviews: 567, sold: 3100,
    badge: "Mới nhất", badgeColor: "bg-blue-500",
    icon: "🧠", iconBg: "from-blue-500 to-cyan-500",
    tags: ["200K Context", "Code", "Analysis"],
    addedAt: "3 tuần trước",
    inStock: false,
  },
]

const FILTERS = [
  { key: "all", label: "Tất cả", icon: Heart },
  { key: "ai-tool", label: "AI Tools", icon: Bot },
  { key: "course", label: "Khóa học", icon: BookOpen },
  { key: "prompt", label: "Prompt", icon: Wand2 },
]

function fmt(n: number) { return n.toLocaleString("vi-VN") + "đ" }
function discount(original: number, price: number) { return Math.round((1 - price / original) * 100) }

// ─── Wishlist Card ─────────────────────────────────────────────
function WishlistCard({
  item,
  onRemove,
  onAddToCart,
}: {
  item: typeof INITIAL_ITEMS[0]
  onRemove: () => void
  onAddToCart: () => void
}) {
  const [addedToCart, setAddedToCart] = useState(false)
  const [removing, setRemoving] = useState(false)

  const handleAddToCart = () => {
    setAddedToCart(true)
    onAddToCart()
    setTimeout(() => setAddedToCart(false), 2500)
  }

  const handleRemove = () => {
    setRemoving(true)
    setTimeout(onRemove, 350)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: removing ? 0 : 1, scale: removing ? 0.9 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ duration: 0.35 }}
      className="group relative rounded-2xl border border-border/60 bg-card overflow-hidden hover:border-blue-500/30 hover:shadow-[0_0_30px_-8px_rgba(59,130,246,0.15)] transition-all duration-300"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        <span className={cn("text-[10px] font-bold text-white px-2 py-0.5 rounded-full", item.badgeColor)}>
          {item.badge}
        </span>
        {!item.inStock && (
          <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full bg-gray-500">Hết hàng</span>
        )}
      </div>

      {/* Remove btn */}
      <motion.button whileTap={{ scale: 0.85 }} onClick={handleRemove}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-red-400 hover:bg-red-500/15 hover:border-red-400/50 transition-all opacity-0 group-hover:opacity-100">
        <Trash2 className="w-3.5 h-3.5" />
      </motion.button>

      <div className="p-5">
        {/* Icon + type */}
        <div className="flex items-start gap-3 mb-3">
          <div className={cn("w-14 h-14 rounded-2xl bg-linear-to-br flex items-center justify-center text-2xl shadow-md shrink-0", item.iconBg)}>
            {item.icon}
          </div>
          <div className="flex-1 min-w-0">
            <Link href={`/ai-tools`} className="font-bold text-base leading-snug hover:text-blue-400 transition-colors line-clamp-1 block">
              {item.name}
            </Link>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{item.desc}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {item.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-muted border border-border/50 text-muted-foreground">{tag}</span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{item.rating} ({item.reviews.toLocaleString()})
          </span>
          <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-green-400" />{item.sold.toLocaleString()} đã bán</span>
          <span className="flex items-center gap-1 ml-auto"><Clock className="w-3 h-3" />Lưu {item.addedAt}</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-foreground">{fmt(item.price)}</span>
              <span className="text-xs line-through text-muted-foreground/60">{fmt(item.originalPrice)}</span>
            </div>
            <span className="text-xs font-bold text-green-500">Tiết kiệm {fmt(item.originalPrice - item.price)} (-{discount(item.originalPrice, item.price)}%)</span>
          </div>

          <motion.button whileTap={{ scale: 0.95 }} onClick={handleAddToCart}
            disabled={!item.inStock || addedToCart}
            className={cn(
              "flex items-center gap-1.5 px-4 h-9 rounded-xl text-sm font-bold transition-all duration-200 shrink-0",
              addedToCart
                ? "bg-green-600 text-white shadow-md shadow-green-500/20"
                : item.inStock
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/15"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
            )}>
            <AnimatePresence mode="wait">
              {addedToCart ? (
                <motion.span key="added" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />Đã thêm
                </motion.span>
              ) : (
                <motion.span key="add" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5">
                  <ShoppingCart className="w-3.5 h-3.5" />{item.inStock ? "Thêm giỏ" : "Hết hàng"}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Empty State ───────────────────────────────────────────────
function EmptyWishlist({ filter }: { filter: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="col-span-full py-24 flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-3xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-5">
        <Heart className="w-9 h-9 text-pink-400" />
      </div>
      <h3 className="text-xl font-bold mb-2">
        {filter === "all" ? "Danh sách yêu thích trống" : `Chưa có ${FILTERS.find(f => f.key === filter)?.label} nào`}
      </h3>
      <p className="text-muted-foreground text-sm mb-6 max-w-sm">
        Nhấn vào icon ❤️ trên bất kỳ sản phẩm nào để thêm vào danh sách yêu thích của bạn.
      </p>
      <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-xl">
        <Link href="/ai-tools">Khám phá AI Tools <ArrowRight className="w-4 h-4" /></Link>
      </Button>
    </motion.div>
  )
}

// ─── Page ──────────────────────────────────────────────────────
export default function WishlistPage() {
  const [items, setItems] = useState(INITIAL_ITEMS)
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [cartCount, setCartCount] = useState(0)
  const [cartToast, setCartToast] = useState("")

  const filtered = items.filter(item => {
    const matchFilter = filter === "all" || item.type === filter
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.desc.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const totalSavings = filtered.reduce((acc, item) => acc + (item.originalPrice - item.price), 0)

  const handleRemove = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const handleAddToCart = (name: string) => {
    setCartCount(c => c + 1)
    setCartToast(name)
    setTimeout(() => setCartToast(""), 3000)
  }

  const handleAddAll = () => {
    const inStock = filtered.filter(i => i.inStock)
    setCartCount(c => c + inStock.length)
    setCartToast(`${inStock.length} sản phẩm`)
    setTimeout(() => setCartToast(""), 3000)
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Cart toast */}
      <AnimatePresence>
        {cartToast && (
          <motion.div initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-20 left-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-green-600 text-white text-sm font-semibold shadow-2xl shadow-green-500/30">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Đã thêm <strong>{cartToast}</strong> vào giỏ hàng!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl font-extrabold">Sản phẩm yêu thích</h1>
            <AnimatePresence>
              {items.length > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  {items.length}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          {totalSavings > 0 && (
            <p className="text-sm text-green-500 font-medium">
              💰 Tổng tiết kiệm: <span className="font-extrabold">{fmt(totalSavings)}</span> so với giá gốc
            </p>
          )}
        </div>
        {filtered.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 rounded-xl h-9 text-sm border-border/60">
              <Share2 className="w-3.5 h-3.5" />Chia sẻ danh sách
            </Button>
            <Button onClick={handleAddAll} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-xl h-9 text-sm">
              <ShoppingCart className="w-3.5 h-3.5" />Thêm tất cả vào giỏ
            </Button>
          </div>
        )}
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Filter tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/50 border border-border/40 flex-wrap">
          {FILTERS.map(({ key, label, icon: Icon }) => {
            const count = key === "all" ? items.length : items.filter(i => i.type === key).length
            return (
              <button key={key} onClick={() => setFilter(key)}
                className={cn("relative flex items-center gap-1.5 h-8 px-3 rounded-lg text-sm font-medium transition-all",
                  filter === key ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
                {filter === key && (
                  <motion.div layoutId="wishlist-filter-active" className="absolute inset-0 rounded-lg bg-background shadow-sm border border-border/50"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} />
                )}
                <span className="relative flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" />{label}
                  {count > 0 && <span className="text-[10px] font-bold tabular-nums">{count}</span>}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm trong danh sách..." className="pl-9 h-9 rounded-xl border-border/60 bg-card text-sm" />
        </div>
      </div>

      {/* Grid */}
      <LayoutGroup>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <EmptyWishlist key="empty" filter={filter} />
            ) : (
              filtered.map(item => (
                <WishlistCard
                  key={item.id}
                  item={item}
                  onRemove={() => handleRemove(item.id)}
                  onAddToCart={() => handleAddToCart(item.name)}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </LayoutGroup>

      {/* Cart summary sticky bar */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 80 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 px-5 py-3.5 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/60 shadow-2xl">
            <div className="flex items-center gap-2">
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-muted-foreground" />
                <span className="absolute -top-2 -right-2 w-4.5 h-4.5 bg-blue-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <span className="text-sm font-semibold">{cartCount} sản phẩm trong giỏ</span>
            </div>
            <div className="w-px h-5 bg-border" />
            <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 rounded-xl h-8">
              <Link href="/cart">Xem giỏ hàng <ArrowRight className="w-3.5 h-3.5" /></Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
