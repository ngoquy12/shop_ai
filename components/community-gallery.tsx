"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Eye,
  Copy,
  ArrowRight,
  Flame,
  Award,
  X,
  CheckCheck,
  Wand2,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────
const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Tạo ảnh sản phẩm Coca Cola siêu thực",
    image:
      "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&q=80",
    tool: "Midjourney",
    toolColor: "bg-violet-500",
    author: "Minh T.",
    authorAvatar: "M",
    likes: 234,
    views: 1820,
    category: "Sản phẩm",
    hot: true,
    tall: true,
    prompt: `A hyper-realistic studio photograph of a Coca-Cola glass bottle, perfectly condensed water droplets on the surface, ice cubes floating in a crystal glass beside it, professional product photography lighting, soft rim light from behind, dark gradient background, 8K resolution, shot with Sony A7R IV, 85mm lens, f/2.8 aperture

--ar 4:5 --v 6.1 --style raw --q 2`,
    tags: ["Product Photography", "Beverage", "Studio Lighting"],
  },
  {
    id: 2,
    title: "Ảnh món ăn diorama nghệ thuật",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
    tool: "DALL-E 3",
    toolColor: "bg-green-500",
    author: "Lan N.",
    authorAvatar: "L",
    likes: 189,
    views: 940,
    category: "Ẩm thực",
    hot: true,
    tall: false,
    prompt: `A stunning diorama-style food photography of traditional Vietnamese pho, miniature world aesthetic, vibrant colors, tiny people sitting at the table eating, restaurant scene in miniature scale, tilt-shift photography effect, warm lighting, ultra detailed, photorealistic render, 4K

Style: diorama, miniature, tilt-shift photography`,
    tags: ["Food Photography", "Diorama", "Miniature"],
  },
  {
    id: 3,
    title: "Chân dung cinematic ngoài trời",
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
    tool: "Stable Diffusion",
    toolColor: "bg-orange-500",
    author: "Hùng P.",
    authorAvatar: "H",
    likes: 156,
    views: 720,
    category: "Chân dung",
    hot: false,
    tall: true,
    prompt: `Cinematic outdoor portrait of a young Vietnamese woman, golden hour sunlight, bokeh background with city lights, film grain, analog photography style, Kodak Portra 400 emulation, shallow depth of field, emotional expression, lifestyle photography

Negative prompt: ugly, deformed, blurry, watermark, text
Steps: 30, CFG Scale: 7, Sampler: DPM++ 2M Karras`,
    tags: ["Portrait", "Cinematic", "Golden Hour"],
  },
  {
    id: 4,
    title: "Logo thương hiệu tối giản",
    image:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80",
    tool: "ChatGPT",
    toolColor: "bg-teal-500",
    author: "Thu H.",
    authorAvatar: "T",
    likes: 98,
    views: 540,
    category: "Thiết kế",
    hot: false,
    tall: false,
    prompt: `Create a minimalist logo concept for a tech startup called "NexAI". The logo should:
- Use only 2 colors: deep navy blue (#0A1628) and electric blue (#00D4FF)
- Incorporate a subtle AI/neural network motif
- Be completely vector and scalable
- Work on both light and dark backgrounds
- Modern, clean, professional aesthetic

Output as SVG code with proper viewBox and clean paths.`,
    tags: ["Logo Design", "Branding", "Minimalist"],
  },
  {
    id: 5,
    title: "Phong cảnh Van Gogh style siêu đẹp",
    image:
      "https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=600&q=80",
    tool: "Midjourney",
    toolColor: "bg-violet-500",
    author: "Dũng K.",
    authorAvatar: "D",
    likes: 312,
    views: 2100,
    category: "Nghệ thuật",
    hot: true,
    tall: false,
    prompt: `Vietnamese countryside landscape in the style of Vincent Van Gogh's Starry Night, swirling brushstrokes, vivid impasto technique, rice paddies and mountains, dramatic sky with swirling clouds and stars, warm and cool color contrast, post-impressionist painting, museum quality artwork

--ar 16:9 --v 6.1 --style expressive --chaos 20 --q 2`,
    tags: ["Art Style", "Van Gogh", "Landscape"],
  },
  {
    id: 6,
    title: "Interior Japandi phong cách tối giản",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
    tool: "DALL-E 3",
    toolColor: "bg-green-500",
    author: "Phong V.",
    authorAvatar: "P",
    likes: 145,
    views: 830,
    category: "Nội thất",
    hot: false,
    tall: true,
    prompt: `Japandi interior design living room, harmonious blend of Japanese and Scandinavian aesthetics, natural materials (oak wood, linen, stone), neutral color palette with warm undertones, morning light flooding through large windows, bamboo plant in corner, minimalist furniture, cozy yet uncluttered, architectural photography, ultra-realistic render, 4K resolution`,
    tags: ["Interior Design", "Japandi", "Architecture"],
  },
];

// ─── Prompt Modal ──────────────────────────────────────────────
function PromptModal({
  item,
  onClose,
}: {
  item: (typeof GALLERY_ITEMS)[0];
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(item.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="relative z-10 w-full sm:max-w-2xl max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-2xl bg-card border border-border/60 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start gap-3 p-5 border-b border-border/50">
          {/* Tool icon */}
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md",
              item.toolColor,
            )}
          >
            {item.tool.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base leading-snug line-clamp-1">
              {item.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span
                className={cn(
                  "text-[11px] font-bold text-white px-2 py-0.5 rounded-full",
                  item.toolColor,
                )}
              >
                {item.tool}
              </span>
              <span className="text-xs text-muted-foreground">
                bởi {item.author}
              </span>
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-accent text-muted-foreground transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Prompt content */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex items-center gap-2 mb-3">
            <Wand2 className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Prompt
            </span>
          </div>
          <div className="relative rounded-xl bg-muted/50 border border-border/60 overflow-hidden">
            {/* Code block header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-muted/80 border-b border-border/50">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">
                {item.tool} Prompt
              </span>
            </div>
            <pre className="p-4 text-sm leading-relaxed whitespace-pre-wrap overflow-wrap-break-word text-foreground font-mono overflow-auto max-h-64 text-[13px]">
              {item.prompt}
            </pre>
          </div>
        </div>

        {/* Actions footer */}
        <div className="p-5 pt-0 flex gap-3">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleCopy}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 h-11 rounded-xl font-semibold text-sm transition-all duration-200",
              copied
                ? "bg-green-600 text-white shadow-md shadow-green-500/20"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20",
            )}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="copied"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <CheckCheck className="w-4 h-4" />
                  Đã copy prompt!
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Sao chép prompt
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          <Button variant="outline" className="gap-2 h-11 rounded-xl" asChild>
            <Link href="/prompt-mien-phi">
              <Sparkles className="w-4 h-4" />
              Xem thêm
              <ExternalLink className="w-3 h-3" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Gallery Card ──────────────────────────────────────────────
function GalleryCard({
  item,
  onViewPrompt,
}: {
  item: (typeof GALLERY_ITEMS)[0];
  onViewPrompt: (item: (typeof GALLERY_ITEMS)[0]) => void;
}) {
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "group relative rounded-2xl overflow-hidden cursor-pointer",
        item.tall ? "row-span-2" : "row-span-1",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-muted",
          item.tall ? "h-[380px]" : "h-[175px]",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

        {item.hot && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/90 backdrop-blur-sm text-white text-[10px] font-bold">
            <Flame className="w-3 h-3" />
            HOT
          </div>
        )}
        <div
          className={cn(
            "absolute top-3 right-3 px-2 py-1 rounded-full text-white text-[10px] font-bold backdrop-blur-sm",
            item.toolColor + "/90",
          )}
        >
          {item.tool}
        </div>

        {/* Hover overlay with buttons */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setLiked((l) => !l);
            }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold backdrop-blur-sm border transition-all",
              liked
                ? "bg-red-500 border-red-400 text-white"
                : "bg-white/15 border-white/20 text-white hover:bg-white/25",
            )}
          >
            <Heart className={cn("w-3.5 h-3.5", liked && "fill-white")} />
            {item.likes + (liked ? 1 : 0)}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onViewPrompt(item);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600/90 border border-violet-400/30 text-white text-xs font-bold backdrop-blur-sm hover:bg-violet-500 transition-all"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Xem Prompt
          </motion.button>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 inset-x-0 p-3">
          <p className="text-white font-semibold text-sm leading-snug mb-1.5 line-clamp-2">
            {item.title}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] text-white font-bold">
                {item.authorAvatar}
              </div>
              <span className="text-white/70 text-[11px]">{item.author}</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-[11px]">
              <span className="flex items-center gap-0.5">
                <Eye className="w-3 h-3" />
                {item.views.toLocaleString()}
              </span>
              <span className="flex items-center gap-0.5">
                <Heart className="w-3 h-3" />
                {item.likes}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Community Gallery ─────────────────────────────────────────
export function CommunityGallery() {
  const [activePrompt, setActivePrompt] = useState<
    (typeof GALLERY_ITEMS)[0] | null
  >(null);

  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-pink-500/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-semibold mb-4">
              <Award className="w-4 h-4" />
              Community Showcase
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Kết quả{" "}
              <span className="gradient-text-animated">
                thực tế từ cộng đồng
              </span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md">
              Nhấn{" "}
              <span className="text-violet-400 font-semibold">Xem Prompt</span>{" "}
              để xem và sao chép prompt tạo ra tác phẩm.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="shrink-0 gap-2 border-border/60 hover:border-pink-500/40"
          >
            <Link href="/gallery">
              Xem toàn bộ gallery
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Masonry grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {GALLERY_ITEMS.map((item) => (
            <GalleryCard
              key={item.id}
              item={item}
              onViewPrompt={setActivePrompt}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-3 gap-4">
          {[
            { value: "12,400+", label: "Tác phẩm đã đăng" },
            { value: "3,200+", label: "Prompts được chia sẻ" },
            { value: "48K+", label: "Lượt xem tuần này" },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="text-center py-4 rounded-xl bg-card/60 border border-border/40"
            >
              <p className="text-xl sm:text-2xl font-extrabold gradient-text">
                {value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Prompt Modal */}
      <AnimatePresence>
        {activePrompt && (
          <PromptModal
            item={activePrompt}
            onClose={() => setActivePrompt(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
