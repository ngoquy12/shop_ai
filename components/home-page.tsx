"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ShoppingCart,
  BookOpen,
  Globe2,
  Wand2,
  Star,
  CheckCircle2,
  Users,
  Bot,
  Play,
  Zap,
  Flame,
  Clock,
  ChevronRight,
  TrendingDown,
  Award,
} from "lucide-react";
import {
  motion,
  useInView,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FlashDealBanner } from "@/components/flash-deal-banner";
import { PromptBuilder } from "@/components/prompt-builder";
import { CommunityGallery } from "@/components/community-gallery";
import { aiTools } from "@/lib/data";
import { courses } from "@/lib/data";
import { cn } from "@/lib/utils";

// ─── Utils ────────────────────────────────────────────────────
function fmt(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

// ─── Motion Variants ──────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const cardVar: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1 },
};

// ─── Scroll Reveal ─────────────────────────────────────────────
function ScrollReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={fadeUp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Animated Counter ─────────────────────────────────────────
function AnimatedCounter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const dur = 2200,
      start = Date.now();
    const tick = () => {
      const t = Math.min((Date.now() - start) / dur, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - t, 4))));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);
  return (
    <span ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Typewriter ────────────────────────────────────────────────
const WORDS = ["Sáng Tạo", "Thực Chiến", "Đỉnh Cao", "Đột Phá"];
function TypewriterText() {
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const w = WORDS[wordIdx];
    const delay = del ? 60 : charIdx === w.length ? 2000 : 90;
    const t = setTimeout(() => {
      if (!del && charIdx === w.length) setDel(true);
      else if (del && charIdx === 0) {
        setDel(false);
        setWordIdx((i) => (i + 1) % WORDS.length);
      } else setCharIdx((c) => c + (del ? -1 : 1));
    }, delay);
    return () => clearTimeout(t);
  }, [charIdx, del, wordIdx]);
  return (
    <span className="gradient-text-animated">
      {WORDS[wordIdx].slice(0, charIdx)}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="text-violet-400"
      >
        |
      </motion.span>
    </span>
  );
}

// ─── Hero Tool Cards ──────────────────────────────────────────
const HERO_CARDS = [
  {
    icon: "🤖",
    name: "ChatGPT Plus",
    tag: "-30%",
    color: "from-emerald-500 to-teal-600",
    price: "350.000đ",
  },
  {
    icon: "🎨",
    name: "Midjourney Pro",
    tag: "-25%",
    color: "from-violet-500 to-purple-600",
    price: "600.000đ",
  },
  {
    icon: "🎬",
    name: "Sora AI",
    tag: "-15%",
    color: "from-blue-500 to-indigo-600",
    price: "1.020.000đ",
  },
  {
    icon: "✨",
    name: "Gemini Advanced",
    tag: "-35%",
    color: "from-pink-500 to-rose-600",
    price: "260.000đ",
  },
];

// ─── Marquee Tools ────────────────────────────────────────────
const MARQUEE = [
  { icon: "🤖", name: "ChatGPT Plus" },
  { icon: "🎨", name: "Midjourney" },
  { icon: "🎬", name: "Sora AI" },
  { icon: "🔮", name: "Claude Pro" },
  { icon: "✨", name: "Gemini" },
  { icon: "🎙️", name: "ElevenLabs" },
  { icon: "🚀", name: "Runway ML" },
  { icon: "🧠", name: "Perplexity" },
  { icon: "🖼️", name: "Adobe Firefly" },
  { icon: "💡", name: "Luma AI" },
];

// ─── Testimonials ─────────────────────────────────────────────
const TESTIMONIALS = [
  {
    text: "Mua Midjourney ở đây rẻ hơn 40% so với mua trực tiếp. Support nhiệt tình, bảo hành rõ ràng!",
    name: "Nguyễn Minh Tuấn",
    role: "Designer tự do",
    avatar: "M",
    color: "from-blue-500 to-violet-600",
  },
  {
    text: "Thư viện prompt miễn phí cực kỳ chất lượng. Tiết kiệm rất nhiều thời gian thử nghiệm và tôi.",
    name: "Trần Thị Lan",
    role: "Content Creator",
    avatar: "L",
    color: "from-violet-500 to-pink-600",
  },
  {
    text: "Khóa học AI Thực Chiến thực sự xứng đáng từng đồng. Áp dụng được ngay vào công việc.",
    name: "Phạm Văn Hùng",
    role: "Marketing Manager",
    avatar: "H",
    color: "from-pink-500 to-orange-500",
  },
];

// ─── How It Works ─────────────────────────────────────────────
const STEPS = [
  {
    icon: ShoppingCart,
    step: "01",
    title: "Chọn công cụ AI",
    desc: "Tìm kiếm và chọn tài khoản AI phù hợp với nhu cầu của bạn từ 50+ công cụ hàng đầu.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Zap,
    step: "02",
    title: "Thanh toán nhanh chóng",
    desc: "Thanh toán an toàn qua VietQR, MoMo, ZaloPay chỉ trong vài giây.",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: CheckCircle2,
    step: "03",
    title: "Nhận tài khoản ngay",
    desc: "Thông tin kích hoạt gửi qua email trong 1-5 phút. Bảo hành 30 ngày.",
    color: "from-green-500 to-emerald-500",
  },
];

// ─── Main ─────────────────────────────────────────────────────
export function HomePage() {
  const [activeTab, setActiveTab] = useState(0);

  // Testimonial auto-rotate
  useEffect(() => {
    const t = setInterval(
      () => setActiveTab((a) => (a + 1) % TESTIMONIALS.length),
      4500,
    );
    return () => clearInterval(t);
  }, []);

  const hotTools = aiTools.filter((t) => t.hot).slice(0, 4);
  const topCourses = courses.slice(0, 3);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Flash Deal Banner */}
      <FlashDealBanner />

      {/* ═══ HERO — height = 100vh - header(64) - flash-bar(44) - ticker(32) ═══ */}
      <section className="relative flex items-center overflow-hidden"
        style={{ minHeight: "calc(100vh - 140px)" }}>
        {/* Animated orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.12, 0.2, 0.12] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-blue-600 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.08, 0.15, 0.08] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-violet-600 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
            className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-pink-600 opacity-[0.06] rounded-full blur-[80px]"
          />
        </div>
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/8 text-violet-400 text-sm font-semibold mb-6"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
                </span>
                Nền tảng AI hàng đầu Việt Nam
                <Star className="w-3.5 h-3.5 fill-violet-400" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
              >
                <span className="text-foreground">Công Cụ AI &amp; </span>
                <br className="hidden sm:block" />
                <TypewriterText />
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
              >
                Tài khoản AI chính chủ giá tốt nhất, prompt miễn phí, website
                theo yêu cầu và khóa học AI thực chiến từ các chuyên gia hàng
                đầu.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
              >
                <Button
                  size="lg"
                  asChild
                  className="relative h-13 px-8 text-base font-bold bg-linear-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 shadow-2xl shadow-violet-500/30 gap-2.5 overflow-hidden group"
                >
                  <Link href="/ai-tools">
                    <div className="absolute inset-0 animate-shimmer opacity-30" />
                    <ShoppingCart className="w-5 h-5 relative" />
                    <span className="relative">Khám phá AI Tools</span>
                    <ArrowRight className="w-5 h-5 relative transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="h-13 px-8 text-base font-bold border-border/60 hover:border-violet-500/50 gap-2.5 group"
                >
                  <Link href="/prompt-mien-phi">
                    <Wand2 className="w-5 h-5 text-violet-400 group-hover:rotate-12 transition-transform" />
                    Prompt miễn phí
                  </Link>
                </Button>
              </motion.div>

              {/* Social proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center lg:justify-start gap-4"
              >
                <div className="flex -space-x-2">
                  {["M", "L", "H", "T", "D"].map((a, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-background bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold"
                    >
                      {a}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-bold text-foreground">7,000+</span>{" "}
                  người dùng tin tưởng
                  <div className="flex gap-0.5 mt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-xs ml-1 text-yellow-400 font-semibold">
                      4.9/5
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Floating tool cards */}
            <div className="relative hidden lg:flex flex-col gap-3 max-w-sm ml-auto">
              <div className="absolute -inset-8 bg-gradient-to-br from-blue-600/10 to-violet-600/10 rounded-3xl blur-2xl" />
              {HERO_CARDS.map((card, i) => (
                <motion.div
                  key={card.name}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.2 + i * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    scale: 1.03,
                    x: -4,
                    transition: { duration: 0.2 },
                  }}
                  className="glass-card rounded-2xl p-4 flex items-center gap-3.5 cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent to-white/5" />
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl shadow-lg shrink-0",
                      card.color,
                    )}
                  >
                    {card.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground">
                      {card.name}
                    </p>
                    <p className="text-base font-bold text-blue-400">
                      {card.price}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5 shrink-0">
                    {card.tag}
                  </span>
                </motion.div>
              ))}
              {/* CTA mini card */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.7 }}
                className="glass-card rounded-2xl p-4 flex items-center justify-between cursor-pointer group"
              >
                <div className="text-sm text-muted-foreground">
                  Và <span className="font-bold text-foreground">46+</span> công
                  cụ khác...
                </div>
                <ArrowRight className="w-4 h-4 text-violet-400 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-border/50 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2.5 rounded-full bg-muted-foreground/50" />
          </motion.div>
        </div>
      </section>

      {/* ═══ MARQUEE ═══════════════════════════════════════════ */}
      <div className="border-y border-border/40 bg-muted/10 py-5 overflow-hidden">
        <p className="text-center text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-4">
          Hơn 50+ công cụ AI hàng đầu thế giới
        </p>
        <div className="relative">
          <div className="absolute left-0 inset-y-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 inset-y-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
          <motion.div
            className="flex gap-4 w-max"
            animate={{ x: ["0px", "-50%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          >
            {[...MARQUEE, ...MARQUEE].map((t, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-card border border-border/50 shrink-0 hover:border-violet-500/30 transition-colors cursor-default"
              >
                <span className="text-xl">{t.icon}</span>
                <span className="text-sm font-medium text-foreground/70 whitespace-nowrap">
                  {t.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ═══ STATS ══════════════════════════════════════════════ */}
      <section className="border-b border-border/50 bg-card/40 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-8"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            {[
              {
                icon: Bot,
                value: 50,
                suffix: "+",
                label: "Công cụ AI",
                color: "text-blue-400",
                bg: "bg-blue-500/10",
              },
              {
                icon: Users,
                value: 7000,
                suffix: "+",
                label: "Người dùng",
                color: "text-violet-400",
                bg: "bg-violet-500/10",
              },
              {
                icon: Globe2,
                value: 200,
                suffix: "+",
                label: "Dự án web",
                color: "text-green-400",
                bg: "bg-green-500/10",
              },
              {
                icon: Star,
                value: 4.9,
                suffix: "★",
                label: "Đánh giá TB",
                color: "text-yellow-400",
                bg: "bg-yellow-500/10",
              },
            ].map(({ icon: Icon, value, suffix, label, color, bg }) => (
              <motion.div
                key={label}
                variants={cardVar}
                className="text-center group"
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform",
                    bg,
                  )}
                >
                  <Icon className={cn("w-6 h-6", color)} />
                </div>
                <p className="text-3xl sm:text-4xl font-extrabold text-foreground">
                  <AnimatedCounter target={value} suffix={suffix} />
                </p>
                <p className="text-sm text-muted-foreground mt-1">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ HOT DEALS ══════════════════════════════════════════ */}
      <section className="py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm font-semibold mb-4">
              <Flame className="w-4 h-4" />
              Flash Sale hôm nay
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
              Ưu đãi <span className="gradient-text">nổi bật</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Tài khoản AI chính chủ giá tốt nhất thị trường. Kích hoạt ngay sau
              thanh toán.
            </p>
          </ScrollReveal>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            {hotTools.map((tool) => (
              <motion.div
                key={tool.id}
                variants={cardVar}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative rounded-2xl border border-border/60 bg-card overflow-hidden cursor-pointer hover:border-blue-500/40 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)] transition-all duration-300"
              >
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-violet-500/0 group-hover:from-blue-500/5 group-hover:to-violet-500/8 transition-all duration-300 pointer-events-none" />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                      style={{ backgroundColor: tool.bgColor }}
                    >
                      {tool.icon}
                    </div>
                    <Badge className="bg-red-500/15 text-red-500 border-red-500/20 font-bold gap-1">
                      <TrendingDown className="w-3 h-3" />-{tool.discount}%
                    </Badge>
                  </div>
                  <h3 className="font-bold text-sm mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {tool.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div>
                      <p className="text-xs text-muted-foreground line-through">
                        {fmt(tool.originalPrice)}
                      </p>
                      <p className="text-base font-extrabold text-blue-400">
                        {fmt(tool.salePrice)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md shadow-blue-500/20 gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Mua
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <ScrollReveal className="text-center mt-8">
            <Button
              variant="outline"
              asChild
              className="gap-2 border-border/60 hover:border-blue-500/40"
            >
              <Link href="/ai-tools">
                Xem tất cả công cụ AI <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ PROMPT BUILDER ═════════════════════════════════════ */}
      <ScrollReveal>
        <PromptBuilder />
      </ScrollReveal>

      {/* ═══ HOW IT WORKS ═══════════════════════════════════════ */}
      <section className="py-20 bg-card/20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-4">
              <Zap className="w-4 h-4" />
              Đơn giản &amp; Nhanh chóng
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
              Mua AI chỉ <span className="gradient-text">3 bước đơn giản</span>
            </h2>
          </ScrollReveal>

          <motion.div
            className="grid sm:grid-cols-3 gap-6 relative"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            {/* Connecting line */}
            <div className="absolute top-8 left-[20%] right-[20%] h-px bg-gradient-to-r from-blue-500/30 via-violet-500/30 to-green-500/30 hidden sm:block" />
            {STEPS.map(({ icon: Icon, step, title, desc, color }) => (
              <motion.div
                key={step}
                variants={cardVar}
                className="relative text-center group"
              >
                <div className="relative inline-flex mb-6">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform duration-300",
                      color,
                    )}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border border-border/60 flex items-center justify-center text-xs font-black text-muted-foreground">
                    {step}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ COURSES PREVIEW ════════════════════════════════════ */}
      <section className="py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="flex items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-semibold mb-4">
                <BookOpen className="w-4 h-4" />
                Khóa học AI
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-2">
                Học AI <span className="gradient-text">thực chiến</span>
              </h2>
              <p className="text-muted-foreground">
                Từ cơ bản đến nâng cao — áp dụng ngay vào công việc.
              </p>
            </div>
            <Button
              variant="outline"
              asChild
              className="hidden sm:flex gap-2 shrink-0"
            >
              <Link href="/khoa-hoc-ai">
                Tất cả khóa học <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </ScrollReveal>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            {topCourses.map((course) => {
              const discount = Math.round(
                ((course.originalPrice - course.price) / course.originalPrice) *
                  100,
              );
              return (
                <motion.div
                  key={course.id}
                  variants={cardVar}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="group rounded-2xl border border-border/60 bg-card overflow-hidden hover:border-violet-500/30 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.2)] transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-36 bg-gradient-to-br from-violet-500/20 via-blue-500/10 to-pink-500/20 flex items-center justify-center overflow-hidden">
                    <span className="text-5xl relative z-10">
                      {course.icon}
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                        <Play className="w-5 h-5 text-white fill-white" />
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {course.bestseller && (
                        <Badge className="bg-orange-500 text-white border-0 text-xs">
                          🏆 Bán chạy
                        </Badge>
                      )}
                      {course.new && (
                        <Badge className="bg-green-500 text-white border-0 text-xs">
                          ✨ Mới
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-violet-400 transition-colors">
                      {course.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {course.lessons} bài
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {course.rating}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <div>
                        <p className="text-xs text-muted-foreground line-through">
                          {fmt(course.originalPrice)}
                        </p>
                        <p className="text-base font-extrabold text-violet-500">
                          {fmt(course.price)}
                        </p>
                      </div>
                      <Badge className="bg-red-500/15 text-red-500 border-red-500/20 font-bold">
                        -{discount}%
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <ScrollReveal className="sm:hidden text-center mt-6">
            <Button variant="outline" asChild className="gap-2">
              <Link href="/khoa-hoc-ai">
                Xem tất cả khóa học <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ COMMUNITY GALLERY ══════════════════════════════════ */}
      <ScrollReveal>
        <CommunityGallery />
      </ScrollReveal>

      {/* ═══ FEATURES GRID ══════════════════════════════════════ */}
      <section className="py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
              Tất cả trong <span className="gradient-text">một nơi</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Từ công cụ AI đến khóa học, từ prompt đến website — chúng tôi có
              tất cả.
            </p>
          </ScrollReveal>
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            {[
              {
                icon: Bot,
                emoji: "🤖",
                title: "AI Tools Store",
                desc: "50+ công cụ AI hàng đầu với giá tốt nhất thị trường. Bảo hành và hỗ trợ 24/7.",
                href: "/ai-tools",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Wand2,
                emoji: "✨",
                title: "Prompt Library",
                desc: "3,200+ prompts miễn phí cho mọi nhu cầu. Từ marketing đến thiết kế sáng tạo.",
                href: "/prompt-mien-phi",
                color: "from-violet-500 to-purple-500",
              },
              {
                icon: Globe2,
                emoji: "🌐",
                title: "Làm Website",
                desc: "Website chuyên nghiệp theo yêu cầu. Thiết kế đẹp, code sạch, bàn giao 7 ngày.",
                href: "/lam-website",
                color: "from-green-500 to-teal-500",
              },
              {
                icon: BookOpen,
                emoji: "📚",
                title: "Khóa học AI",
                desc: "Học AI từ cơ bản đến nâng cao. Video HD, có chứng chỉ, học mọi lúc mọi nơi.",
                href: "/khoa-hoc-ai",
                color: "from-orange-500 to-red-500",
              },
            ].map(({ emoji, title, desc, href, color }) => (
              <motion.div key={title} variants={cardVar}>
                <Link
                  href={href}
                  className="group relative rounded-2xl border border-border/60 bg-card p-6 overflow-hidden hover-lift transition-all duration-300 hover:border-transparent block"
                >
                  <div
                    className={cn(
                      "relative w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl mb-4 shadow-lg",
                      color,
                    )}
                  >
                    {emoji}
                  </div>
                  <h3 className="font-bold text-base mb-2 group-hover:text-violet-400 transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {desc}
                  </p>
                  <div className="flex items-center gap-1 text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                    Khám phá ngay{" "}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══════════════════════════════════════ */}
      <section className="py-16 bg-card/20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm font-semibold mb-4">
              <Award className="w-4 h-4" />
              Đánh giá từ khách hàng
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold">
              Khách hàng nói gì về{" "}
              <span className="gradient-text">chúng tôi?</span>
            </h2>
          </ScrollReveal>

          <motion.div
            className="grid sm:grid-cols-3 gap-4"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                variants={cardVar}
                animate={
                  activeTab === i
                    ? { scale: 1.02, transition: { duration: 0.3 } }
                    : { scale: 1 }
                }
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={cn(
                  "relative rounded-2xl border bg-card p-5 cursor-default transition-all duration-300",
                  activeTab === i
                    ? "border-violet-500/50 shadow-lg shadow-violet-500/10"
                    : "border-border/60",
                )}
              >
                <div className="text-4xl text-muted-foreground/20 font-serif mb-2">
                  &ldquo;
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                  {t.text}
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm shrink-0",
                      t.color,
                    )}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto" />
                </div>
                <AnimatePresence>
                  {activeTab === i && (
                    <motion.div
                      layoutId="testimonial-ring"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 rounded-2xl border-2 border-violet-500/40 pointer-events-none"
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
          <div className="flex justify-center gap-2 mt-6">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300 cursor-pointer",
                  activeTab === i ? "bg-violet-500 w-8" : "bg-border w-2",
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ══════════════════════════════════════════ */}
      <section className="relative py-28 overflow-hidden">
        <motion.div
          animate={{
            background: [
              "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.1) 50%, rgba(236,72,153,0.08) 100%)",
              "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.1) 50%, rgba(59,130,246,0.08) 100%)",
            ],
          }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0"
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-5xl mb-6"
          >
            🚀
          </motion.div>
          <ScrollReveal>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-5">
              Sẵn sàng <span className="gradient-text-animated">bứt phá</span>{" "}
              cùng AI?
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Tham gia 7,000+ người dùng đang tận dụng AI để tăng năng suất. Bắt
              đầu miễn phí ngay hôm nay.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="relative h-13 px-10 text-lg font-bold bg-linear-to-r from-blue-600 to-violet-600 text-white border-0 shadow-2xl shadow-violet-500/30 gap-2.5 overflow-hidden group"
              >
                <Link href="/register">
                  <div className="absolute inset-0 animate-shimmer opacity-20" />
                  <Sparkles className="w-5 h-5 relative animate-spin-slow" />
                  <span className="relative">Đăng ký miễn phí</span>
                  <ArrowRight className="w-5 h-5 relative transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-13 px-8 text-lg font-bold border-border/60 hover:border-violet-500/40 gap-2"
              >
                <Link href="/ai-tools">
                  <Play className="w-5 h-5 text-violet-400" />
                  Khám phá ngay
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
