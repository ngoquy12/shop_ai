"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import {
  ArrowLeft,
  Bookmark,
  Play,
  Zap,
  Lock,
  ChevronRight,
  ShieldCheck,
  Copy,
  Sparkles,
  Loader2,
  Eye,
  Star,
  Clock,
  ShoppingCart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Prompt } from "@/features/prompts/types";
import { useGetPromptDetail } from "@/hooks/use-prompts";
import { useAddToCart } from "@/features/carts/hooks/use-carts";
import { ReviewForm } from "@/components/review-form";
import { createReviewFn } from "@/features/prompts/api/prompts.api";

// ─── Helper Functions ───────────────────────────────────────
function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

// ─── Component: Countdown Timer ─────────────────────────────
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(() => {
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 23);
    endTime.setMinutes(endTime.getMinutes() + 59);
    endTime.setSeconds(endTime.getSeconds() + 59);
    return Math.floor((endTime.getTime() - Date.now()) / 1000);
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-red-400 uppercase flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          Ưu đãi kết thúc sau
        </span>
        <div className="flex gap-1.5 font-mono text-sm font-bold text-white">
          <span>{String(hours).padStart(2, "0")}h</span>:
          <span>{String(minutes).padStart(2, "0")}m</span>:
          <span>{String(seconds).padStart(2, "0")}s</span>
        </div>
      </div>
    </div>
  );
}

// ─── Component: Product Images ────────────────────────────────
function ProductImages({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setActive((prev) => (prev + newDirection + images.length) % images.length);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/5 bg-[#0c0c0d] group">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={active}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="w-full h-full relative"
          >
            <Image
              src={images[active]}
              alt="Product Thumbnail"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={() => paginate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 opacity-40 group-hover:opacity-100 transition-all hover:scale-110 active:scale-90"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <button
          onClick={() => paginate(1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 opacity-40 group-hover:opacity-100 transition-all hover:scale-110 active:scale-90"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Counter */}
        <div className="absolute bottom-4 right-4 z-10 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold border border-white/10">
          {active + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > active ? 1 : -1);
              setActive(idx);
            }}
            className={cn(
              "aspect-square rounded-xl overflow-hidden border-2 transition-all p-0.5 relative",
              active === idx
                ? "border-cyan-500 scale-105"
                : "border-transparent opacity-60 hover:opacity-100",
            )}
          >
            <Image
              src={img}
              alt={`Thumb ${idx}`}
              fill
              className="object-cover rounded-lg"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Component: JSON-LD Structured Data ─────────────────────
function ProductStructuredData({ chatbot }: { chatbot: Prompt }) {
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: chatbot.title,
    description: chatbot.description || chatbot.content,
    image: chatbot.thumbnailUrl,
    offers: {
      "@type": "Offer",
      price: chatbot.isFree ? "0" : "Liên hệ",
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
    },
    author: {
      "@type": "Person",
      name: chatbot.author?.fullName || "Gu AI Team",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: chatbot.averageRating?.toString() || "4.8",
      reviewCount: chatbot.purchaseCount?.toString() || "120",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// ─── Component: Features & Benefits ───────────────────────────
function FeaturesBenefits() {
  const features = [
    {
      icon: Zap,
      title: "Tự động hóa",
      desc: "Tự động xử lý các tác vụ lặp đi lặp lại",
    },
    {
      icon: Sparkles,
      title: "AI thông minh",
      desc: "Sử dụng công nghệ AI tiên tiến nhất",
    },
    {
      icon: ShieldCheck,
      title: "Bảo mật",
      desc: "Dữ liệu được bảo vệ tuyệt đối",
    },
    {
      icon: Play,
      title: "Dễ sử dụng",
      desc: "Giao diện thân thiện, dễ dàng thao tác",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20">
          <Sparkles className="w-4 h-4 text-green-400" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight uppercase">
          Tính năng nổi bật
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              className="bg-card/40 border border-white/5 rounded-2xl p-5 hover:border-green-500/20 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20 group-hover:bg-green-500/20 transition-colors">
                  <Icon className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Component: Social Proof Section ───────────────────────────
function SocialProofSection() {
  const reviews = [
    {
      name: "Nguyễn Văn A",
      role: "Content Creator",
      rating: 5,
      content:
        "Chatbot này giúp tôi tiết kiệm rất nhiều thời gian trong việc tạo nội dung. Rất dễ sử dụng!",
      avatar: "https://i.pravatar.cc/100?img=1",
    },
    {
      name: "Trần Thị B",
      role: "Digital Marketer",
      rating: 5,
      content:
        "Tự động hóa quy trình marketing của tôi một cách tuyệt vời. Đáng đồng tiền!",
      avatar: "https://i.pravatar.cc/100?img=5",
    },
    {
      name: "Lê Văn C",
      role: "Freelancer",
      rating: 4,
      content:
        "Giá cả hợp lý, tính năng đầy đủ. Hỗ trợ khách hàng cũng rất tốt.",
      avatar: "https://i.pravatar.cc/100?img=3",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
          <Sparkles className="w-4 h-4 text-purple-400" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight uppercase">
          Đánh giá từ khách hàng
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reviews.map((review, idx) => (
          <div
            key={idx}
            className="bg-card/40 border border-white/5 rounded-2xl p-5 hover:border-purple-500/20 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={review.avatar}
                  alt={review.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{review.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {review.role}
                </p>
              </div>
            </div>
            <div className="flex gap-0.5 mb-2">
              {[...Array(review.rating)].map((_, i) => (
                <span key={i} className="text-yellow-400">
                  ★
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {review.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Component: FAQ Section ───────────────────────────────────
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Chatbot này phù hợp với ai?",
      a: "Chatbot này phù hợp với mọi người muốn tự động hóa công việc, từ người mới bắt đầu đến chuyên gia.",
    },
    {
      q: "Cần kiến thức kỹ thuật không?",
      a: "Không cần, chatbot được thiết kế để dễ sử dụng ngay cả khi bạn không có kiến thức kỹ thuật.",
    },
    {
      q: "Có hỗ trợ sau mua không?",
      a: "Có, chúng tôi cung cấp hỗ trợ 24/7 qua Zalo và email sau khi bạn mua sản phẩm.",
    },
    {
      q: "Có thể hoàn tiền không?",
      a: "Có chính sách hoàn tiền trong 7 ngày nếu sản phẩm không hoạt động như mô tả.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
          <Sparkles className="w-4 h-4 text-blue-400" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight uppercase">
          Câu hỏi thường gặp
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-card/40 border border-white/5 rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
            >
              <span className="text-sm font-bold text-white">{faq.q}</span>
              <ChevronRight
                className={`w-4 h-4 text-muted-foreground transition-transform ${
                  openIndex === idx ? "rotate-90" : ""
                }`}
              />
            </button>
            {openIndex === idx && (
              <div className="px-6 pb-4 pt-0">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Component: Description & Video ───────────────────────────
function ProductDetails({ chatbot }: { chatbot: Prompt }) {
  // Extract steps from content or instructions if it is a list
  // For now, we'll try to split lines if instructions exist
  const steps = chatbot.instructions?.split("\n").filter(Boolean) || [];

  return (
    <div className="space-y-12">
      {/* Description Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight uppercase">
            Mô tả sản phẩm
          </h2>
        </div>

        <div className="bg-card/40 border border-white/5 rounded-2xl p-6 space-y-4">
          <div
            className="text-sm text-muted-foreground leading-relaxed prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: chatbot.content || chatbot.description || "",
            }}
          />
          {steps.length > 0 && (
            <ul className="space-y-3 mt-4">
              {steps.map((step: string, i: number) => (
                <li key={i} className="flex gap-3 group">
                  <div className="w-5 h-5 rounded-md bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[9px] font-bold text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                    {i + 1}
                  </div>
                  <span className="text-sm text-foreground/80 leading-relaxed">
                    {step}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Video Demo Section */}
      {chatbot.demoVideoUrl && (
        <div className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
              <Play className="w-4 h-4 text-orange-500 fill-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight uppercase">
                Video Demo
              </h2>
              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5 opacity-60">
                Xem video thực tế để hiểu rõ hơn
              </p>
            </div>
          </div>

          <div className="w-full">
            <div className="relative rounded-2xl overflow-hidden border border-white/5 shadow-xl group ring-1 ring-white/10 bg-black aspect-video lg:aspect-auto lg:h-175">
              <video
                src={chatbot.demoVideoUrl}
                className="absolute inset-0 w-full h-full"
                controls
              />
            </div>
          </div>
        </div>
      )}

      {/* Instruction Video Section (Locked if not free and not bought) */}
      <div className="space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
            <Lock className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight uppercase">
              Video hướng dẫn
            </h2>
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5 opacity-60">
              Xem cách sử dụng và cấu hình chatbot
            </p>
          </div>
        </div>

        <div className="w-full">
          {!chatbot.isFree ? (
            <div className="relative rounded-2xl bg-[#0c0c0d] border border-dashed border-white/5 flex items-center justify-center aspect-video lg:aspect-auto lg:h-175">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto">
                  <Lock className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">
                    Video bị khóa
                  </h3>
                  <p className="text-[11px] text-muted-foreground max-w-xs mx-auto opacity-70 leading-relaxed">
                    Mua Chatbot để mở khóa video hướng dẫn cài đặt và vận hành
                    chi tiết nhất.
                  </p>
                </div>
                <Button
                  size={"lg"}
                  className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold text-sm transition-all hover:scale-105 active:scale-95"
                >
                  Đăng nhập để mua
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-white/5 shadow-xl group ring-1 ring-white/10 bg-black aspect-video lg:aspect-auto lg:h-175">
              {chatbot.tutorialVideoUrl ? (
                <video
                  src={chatbot.tutorialVideoUrl}
                  className="absolute inset-0 w-full h-full"
                  controls
                />
              ) : (
                <div className="flex items-center justify-center h-full text-white/40">
                  Không có video hướng dẫn
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function ChatbotDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.id;

  const { data: chatbot, isLoading, isError } = useGetPromptDetail(slug);
  const { mutate: addToCart, isPending } = useAddToCart();
  const [liveViewers] = useState(() => Math.floor(Math.random() * 10) + 5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070708] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
        <p className="text-white/50 animate-pulse">Đang tải thông tin...</p>
      </div>
    );
  }

  if (isError || !chatbot) {
    return (
      <div className="min-h-screen bg-[#070708] flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-white">Không tìm thấy Chatbot</h2>
        <Link href="/chatbot-ai">
          <Button variant="outline">Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  // Gallery calculation
  const gallery = [chatbot.thumbnailUrl, ...(chatbot.gallery || [])].filter(
    Boolean,
  ) as string[];

  return (
    <div className="min-h-screen bg-[#070708] text-white pt-6 pb-16">
      {/* SEO Structured Data */}
      <ProductStructuredData chatbot={chatbot} />

      <div className="px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/chatbot-ai"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại Chatbot Prompt
          </Link>
        </div>

        {/* Main Grid: Info Area */}
        <div className="grid lg:grid-cols-[500px_1fr] gap-10 items-start mb-16">
          {/* Section 1: Images */}
          <ProductImages images={gallery} />

          {/* Section 2: Info and CTA */}
          <div className="space-y-6 lg:sticky lg:top-28">
            <header className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full font-bold text-[10px] flex items-center gap-1.5 uppercase tracking-wide">
                  <Sparkles className="w-3 h-3" /> Chatbot AI
                </Badge>
                <button
                  onClick={() =>
                    toast.error("Yêu cầu đăng nhập", {
                      description:
                        "Bạn cần phải đăng nhập để lưu chatbot này vào thư viện.",
                    })
                  }
                  className="h-8 px-3 rounded-lg border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 hover:bg-white/10 transition-colors"
                >
                  <Bookmark className="w-3.5 h-3.5" /> Lưu
                </button>
              </div>
              <h1 className="text-2xl sm:text-2xl font-bold leading-tight uppercase">
                {chatbot.title}
              </h1>

              {/* Stats Bar */}
              <div className="flex items-center gap-6 text-xs text-white/60">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{formatNumber(chatbot.viewCount || 0)} lượt xem</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{formatNumber(chatbot.purchaseCount || 0)} đã mua</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-yellow-400" />
                  <span>{chatbot.averageRating?.toFixed(1) || "4.8"}/5.0</span>
                </div>
              </div>

              {/* Live Viewers */}
              <div className="flex items-center gap-2 text-[10px] text-green-400">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span>{liveViewers} người đang xem sản phẩm này</span>
              </div>
            </header>

            {/* Price section */}
            <div className="bg-[#0f0f12] rounded-2xl border border-white/5 p-6 space-y-6">
              {!chatbot.isFree && <CountdownTimer />}

              <div className="space-y-1">
                <p className="text-xs font-semibold text-white/40">
                  Giá sở hữu
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-[#eb4444]">
                    {chatbot.isFree ? "Miễn phí" : "Sở hữu Prompt"}
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-green-500/80 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Đã xác thực chất lượng bởi
                  Gu AI
                </p>
              </div>

              {/* Guarantee Badge */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-sm font-bold text-green-400">
                    Bảo hành 30 ngày
                  </p>
                  <p className="text-[10px] text-white/60">
                    Hoàn tiền nếu không hài lòng
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                <Button
                  className="h-14 w-full bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm tracking-widest rounded-xl transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] hover:scale-105"
                  disabled={isPending || chatbot.isFree}
                  onClick={() => {
                    addToCart(
                      {
                        itemType: "PROMPT",
                        itemId: chatbot.id,
                        quantity: 1,
                      },
                      {
                        onSuccess: () => {
                          toast.success(
                            `Đã thêm ${chatbot.title} vào giỏ hàng`,
                          );
                        },
                      },
                    );
                  }}
                >
                  {isPending ? (
                    "Đang thêm..."
                  ) : chatbot.isFree ? (
                    "Đã sở hữu"
                  ) : (
                    <span className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" /> Mua ngay
                    </span>
                  )}
                </Button>
                <button className="flex items-center justify-center gap-2 h-14 w-full border border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-400 font-bold uppercase text-[10px] tracking-widest rounded-xl transition-all">
                  <Copy className="w-4 h-4" /> Sao chép link
                </button>
              </div>
            </div>

            {/* Required Tools Section (Combo) */}
            {chatbot.requiredTools && chatbot.requiredTools.length > 0 && (
              <div className="border border-cyan-500/20 rounded-2xl p-6 bg-cyan-500/5 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full border border-cyan-500/30 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                    Công cụ cần để sử dụng
                  </h3>
                </div>

                {chatbot.requiredTools.map((tool, idx) => (
                  <Link
                    key={idx}
                    href={tool.url || "#"}
                    target="_blank"
                    className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center gap-4 group cursor-pointer hover:border-cyan-400/30 transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center p-1.5 relative border border-white/10 group-hover:border-cyan-500/30">
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-white group-hover:text-cyan-400">
                        {tool.name}
                      </p>
                      <p className="text-[10px] font-medium text-white/40 mt-0.5">
                        {tool.planRequired || "Mọi phiên bản"}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            )}

            {/* Category Section */}
            {chatbot.category && (
              <div className="bg-[#111112] border border-white/5 rounded-xl p-4 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center p-1.5 relative overflow-hidden">
                    {chatbot.category.icon ? (
                      chatbot.category.icon.startsWith("https") ? (
                        <Image
                          src={chatbot.category.icon}
                          alt={chatbot.category.name}
                          fill
                          className="object-contain p-1.5"
                        />
                      ) : (
                        <span className="text-xl">{chatbot.category.icon}</span>
                      )
                    ) : (
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      Lĩnh vực chatbot
                    </p>
                    <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors uppercase">
                      {chatbot.category.name}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:translate-x-1 group-hover:text-cyan-500 transition-all" />
              </div>
            )}
            {/* Advisor Contact */}
            <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-5 flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden group/zalo cursor-pointer hover:scale-105 transition-transform bg-white">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/500px-Icon_of_Zalo.svg.png"
                    alt="Zalo"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-[#070708]" />
              </div>
              <div className="flex-1">
                <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">
                  Liên hệ nhận tư vấn
                </h4>
                <p className="text-[9px] text-white/40 mt-0.5 font-medium">
                  Tác giả:{" "}
                  <span className="text-cyan-400/80">
                    {chatbot.author?.fullName || "Gu AI Team"}
                  </span>
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="rounded-lg h-8 border-white/10 text-white font-bold uppercase text-[9px] tracking-widest px-4 hover:bg-white hover:text-black transition-all"
              >
                Chat ngay
              </Button>
            </div>
          </div>
        </div>

        {/* Description and Content Sections */}
        <ProductDetails chatbot={chatbot} />

        {/* Features & Benefits Section */}
        <div className="mt-16">
          <FeaturesBenefits />
        </div>

        {/* Social Proof Section */}
        <div className="mt-16">
          <SocialProofSection />
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <FAQSection />
        </div>

        {/* Review Form Section */}
        <div className="mt-16">
          <ReviewForm
            promptId={chatbot.id}
            isSubmitting={isSubmittingReview}
            onSubmit={async (data) => {
              try {
                setIsSubmittingReview(true);
                await createReviewFn(chatbot.id, data);
                toast.success("Đánh giá của bạn đã được gửi!");
              } catch (error) {
                console.error("Failed to submit review:", error);
                toast.error("Không thể gửi đánh giá. Vui lòng thử lại.");
              } finally {
                setIsSubmittingReview(false);
              }
            }}
          />
        </div>
      </div>

      {/* Sticky CTA on Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#070708]/95 backdrop-blur-xl border-t border-white/10 p-4 lg:hidden z-50">
        <Button
          className="w-full h-12 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] hover:scale-105 transition-all"
          disabled={isPending || chatbot.isFree}
          onClick={() => {
            addToCart(
              {
                itemType: "PROMPT",
                itemId: chatbot.id,
                quantity: 1,
              },
              {
                onSuccess: () => {
                  toast.success(`Đã thêm ${chatbot.title} vào giỏ hàng`);
                },
              },
            );
          }}
        >
          {isPending ? (
            "Đang thêm..."
          ) : chatbot.isFree ? (
            "Đã sở hữu"
          ) : (
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" /> Mua ngay
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
