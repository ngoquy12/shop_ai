"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Sparkles,
  Mail,
  Phone,
  Facebook,
  Youtube,
  Send,
  ArrowRight,
  Shield,
  Package,
  Heart,
  ChevronRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const FOOTER_LINKS: {
  title: string;
  links: { label: string; href: string; badge?: string; external?: boolean }[];
}[] = [
  {
    title: "Sản phẩm",
    links: [
      { label: "AI Tools Store", href: "/ai-tools", badge: "50+" },
      { label: "Prompt miễn phí", href: "/prompt-mien-phi", badge: "Free" },
      { label: "Khóa học AI", href: "/khoa-hoc-ai" },
      { label: "Làm website", href: "/lam-website" },
      { label: "Dịch vụ khác", href: "/services" },
    ],
  },
  {
    title: "Chính sách",
    links: [
      { label: "Điều khoản sử dụng", href: "/terms" },
      { label: "Chính sách bảo mật", href: "/privacy" },
      { label: "Chính sách hoàn tiền", href: "/refund" },
      { label: "Bảo hành tài khoản", href: "/warranty" },
      { label: "Hướng dẫn mua hàng", href: "/guide" },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      { label: "Câu hỏi thường gặp", href: "/faq" },
      { label: "Liên hệ hỗ trợ", href: "/contact" },
      { label: "Blog & Tin tức", href: "/blog" },
      { label: "Trạng thái hệ thống", href: "/status" },
      {
        label: "Cộng đồng Discord",
        href: "https://discord.gg",
        external: true,
      },
    ],
  },
];

const SOCIAL = [
  {
    icon: Facebook,
    label: "Facebook",
    href: "https://facebook.com",
    color: "hover:text-blue-500 hover:bg-blue-500/10",
  },
  {
    icon: Youtube,
    label: "YouTube",
    href: "https://youtube.com",
    color: "hover:text-red-500 hover:bg-red-500/10",
  },
  {
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.504-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    label: "Telegram",
    href: "https://t.me",
    color: "hover:text-blue-400 hover:bg-blue-400/10",
  },
  {
    icon: Send,
    label: "Zalo",
    href: "https://zalo.me",
    color: "hover:text-blue-500 hover:bg-blue-500/10",
  },
];

const TRUST_BADGES = [
  { icon: Shield, text: "Bảo mật SSL" },
  { icon: Package, text: "Bảo hành 30 ngày" },
  { icon: Heart, text: "Hỗ trợ 24/7" },
  { icon: Star, text: "Đánh giá 4.9★" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="border-t border-border/50 bg-card/40 mt-auto">
      {/* ── Trust badges ──────────────────────────────── */}
      <div className="border-b border-border/40 bg-muted/20">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
            {TRUST_BADGES.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5 text-blue-400" />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main footer grid ──────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-10">
          {/* Brand column (2 cols wide on xl) */}
          <div className="xl:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2.5 mb-4 group w-fit"
            >
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Sparkles className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <div className="font-extrabold text-lg leading-none">
                  VideoPrompt
                </div>
                <div className="text-xs text-muted-foreground leading-none mt-0.5">
                  AI Platform
                </div>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-xs">
              Nền tảng công cụ AI hàng đầu Việt Nam. Tài khoản AI chính chủ,
              prompt miễn phí, website chuyên nghiệp và khóa học thực chiến.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2 mb-6">
              {SOCIAL.map(({ icon: Icon, label, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-9 h-9 rounded-xl border border-border/50 flex items-center justify-center text-muted-foreground transition-all duration-200",
                    color,
                  )}
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Contact */}
            <div className="space-y-2">
              <a
                href="tel:0999888777"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                0999 888 777
              </a>
              <a
                href="mailto:support@videoprompt.vn"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-violet-400" />
                support@videoprompt.vn
              </a>
            </div>
          </div>

          {/* Nav columns */}
          {FOOTER_LINKS.map(({ title, links }) => (
            <div key={title}>
              <h4 className="font-bold text-sm mb-4 text-foreground">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href, badge, external }) => (
                  <li key={label}>
                    {external ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                      >
                        {label}
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <Link
                        href={href}
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                      >
                        {label}
                        {badge && (
                          <span className="text-[9px] font-bold text-white bg-blue-500 px-1.5 py-0.5 rounded-full">
                            {badge}
                          </span>
                        )}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-10 pt-10 border-t border-border/40">
          <div className="rounded-2xl bg-linear-to-br from-blue-600/10 via-violet-600/8 to-pink-600/5 border border-violet-500/20 p-6 sm:p-8">
            <div className="grid sm:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-xl font-extrabold mb-2">
                  Nhận ưu đãi độc quyền 📬
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Đăng ký nhận thông báo Flash Sale, prompt miễn phí và tips AI
                  hữu ích mỗi tuần.
                  <span className="font-semibold text-foreground">
                    {" "}
                    Không spam, hủy bất cứ lúc nào.
                  </span>
                </p>
              </div>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                {subscribed ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/15 border border-green-500/20 text-green-500 text-sm font-semibold"
                  >
                    ✅ Đã đăng ký thành công! Cảm ơn bạn.
                  </motion.div>
                ) : (
                  <>
                    <div className="relative flex-1">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@của bạn.com"
                        required
                        className="pl-10 h-11 rounded-xl border-border/60 bg-background"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="h-11 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 shadow-md shadow-blue-500/20 shrink-0"
                    >
                      <span className="hidden sm:inline">Đăng ký</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────── */}
      <div className="border-t border-border/40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              © 2026 VideoPrompt. Bảo lưu mọi quyền. Thiết kế tại 🇻🇳 Việt Nam
            </p>
            <div className="flex items-center gap-4">
              {["Điều khoản", "Bảo mật", "Cookies"].map((l) => (
                <Link
                  key={l}
                  href="#"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l}
                </Link>
              ))}
              {/* Payment icons */}
              <div className="flex items-center gap-1.5">
                {["VietQR", "MoMo", "Zalo"].map((p) => (
                  <span
                    key={p}
                    className="text-[9px] font-bold px-2 py-1 rounded-md bg-muted text-muted-foreground border border-border/50"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
