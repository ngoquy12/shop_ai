"use client";

import Link from "next/link";
import {
  Sparkles,
  Mail,
  Phone,
  Facebook,
  Youtube,
  Send,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FOOTER_LINKS: {
  title: string;
  links: { label: string; href: string; badge?: string; external?: boolean }[];
}[] = [
  {
    title: "Sản phẩm",
    links: [
      { label: "Công cụ AI", href: "/cong-cu-ai", badge: "50+" },
      { label: "Prompt miễn phí", href: "/prompts-mien-phi", badge: "Free" },
      { label: "Khóa học AI", href: "/khoa-hoc-ai" },
      { label: "Làm website", href: "/lam-website" },
      { label: "Cộng tác viên", href: "/cong-tac-vien" },
    ],
  },
  {
    title: "Tài khoản",
    links: [
      { label: "Trang cá nhân", href: "/tai-khoan" },
      { label: "Đơn hàng", href: "/don-hang" },
      { label: "Giỏ hàng", href: "/gio-hang" },
      { label: "Yêu thích", href: "/yeu-thich" },
      { label: "Nâng cấp", href: "/bang-gia" },
    ],
  },
  {
    title: "Chính sách",
    links: [
      { label: "Điều khoản sử dụng", href: "/dieu-khoan" },
      { label: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
      { label: "Liên hệ", href: "/lien-he" },
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

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/40 mt-auto">
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
                  Shop AI
                </div>
                <div className="text-xs text-muted-foreground leading-none mt-0.5">
                  AI Platform
                </div>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-xs">
              Nền tảng công cụ AI hàng đầu Việt Nam. Tài khoản AI chính chủ,
              prompt miễn phí, khóa học thực chiến và dịch vụ chuyên nghiệp.
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
      </div>

      {/* ── Bottom bar ────────────────────────────────── */}
      <div className="border-t border-border/40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              © 2026 Shop AI. Bảo lưu mọi quyền. Thiết kế tại 🇻🇳 Việt Nam
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/dieu-khoan"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Điều khoản
              </Link>
              <Link
                href="/chinh-sach-bao-mat"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Bảo mật
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
