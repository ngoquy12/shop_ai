"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Bot,
  Wand2,
  Package,
  Heart,
  ChevronRight,
  ChevronLeft,
  X,
  ShoppingCart,
  MessageSquare,
  Star,
  CreditCard,
  Users,
  BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";
import Image from "next/image";

// ─── Navigation Config ────────────────────────────────────────
const NAV_SECTIONS = [
  {
    section: "Khám phá",
    items: [
      { icon: Home, label: "Trang chủ", href: "/" },
      {
        icon: Bot,
        label: "Công cụ AI",
        href: "/cong-cu-ai",
        badge: "50+",
        badgeClass: "bg-blue-500",
      },
      {
        icon: Wand2,
        label: "Prompt miễn phí",
        href: "/prompts-mien-phi",
        badge: "Free",
        badgeClass: "bg-green-500",
      },
      {
        icon: MessageSquare,
        label: "Chatbot AI",
        href: "/chatbot-ai",
        badge: "Trend",
        badgeClass: "bg-red-500",
      },
      {
        icon: BookOpen,
        label: "Khóa học AI",
        href: "/khoa-hoc-ai",
        badge: "Hot",
        badgeClass: "bg-orange-500",
      },
    ],
  },
  {
    section: "Hệ sinh thái",
    items: [
      { icon: Star, label: "Review AI", href: "/review-ai" },
      { icon: CreditCard, label: "Bảng giá", href: "/bang-gia" },
      { icon: Users, label: "Cộng tác viên", href: "/cong-tac-vien" },
    ],
  },
  {
    section: "Cá nhân",
    items: [
      { icon: ShoppingCart, label: "Giỏ hàng", href: "/gio-hang" },
      { icon: Package, label: "Đơn hàng", href: "/don-hang" },
      { icon: Heart, label: "Yêu thích", href: "/yeu-thich" },
    ],
  },
];

// ─── Tooltip wrapper (when collapsed) ────────────────────────
function NavItem({
  icon: Icon,
  label,
  href,
  badge,
  badgeClass,
  collapsed,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
  badgeClass?: string;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        "relative flex items-center gap-2.5 rounded-xl text-sm font-medium transition-all duration-150 group overflow-hidden",
        collapsed ? "w-10 h-10 justify-center mx-auto p-0" : "px-3 py-2.5",
        active
          ? "text-blue-500 dark:text-blue-400"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/80",
      )}
    >
      {/* Active bg */}
      {active && (
        <motion.div
          layoutId="sidebar-active-bg"
          className="absolute inset-0 rounded-xl bg-blue-500/10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
        />
      )}
      <Icon
        className={cn(
          "w-4.5 h-4.5 shrink-0 relative z-10",
          active ? "text-blue-500 dark:text-blue-400" : "",
        )}
      />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            key="label"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 truncate relative z-10 whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!collapsed && badge && (
          <motion.span
            key="badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={cn(
              "text-[9px] font-extrabold text-white px-1.5 py-0.5 rounded-full shrink-0 relative z-10",
              badgeClass,
            )}
          >
            {badge}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────
export function Sidebar() {
  const { collapsed, toggleCollapse, mobileOpen, setMobileOpen } = useSidebar();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        className={cn(
          "fixed left-0 top-0 h-full z-50 flex flex-col bg-card/95 backdrop-blur-xl border-r border-border/60 shadow-xl lg:shadow-none",
          // Mobile: slide in/out; Desktop: always visible
          "transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* ── Logo ───────────────────────────────────────── */}
        <div
          className={cn(
            "flex items-center h-16 border-b border-border/50 shrink-0",
            collapsed ? "justify-center px-0" : "justify-between px-4",
          )}
        >
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5 group"
          >
            <Image src={"/images/logo.png"} alt="Logo" width={32} height={32} />
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  key="brand"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="font-extrabold text-base leading-none text-[#00d3f3]">
                    Gu AI
                  </div>
                  <div className="text-[12px] text-muted-foreground leading-none mt-1">
                    Giải phóng ước mơ
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
          {/* Desktop collapse toggle */}
          <AnimatePresence>
            {!collapsed && (
              <motion.button
                key="collapse-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleCollapse}
                className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center hover:bg-accent text-muted-foreground transition-colors"
                aria-label="Thu gọn sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden w-7 h-7 rounded-lg flex items-center justify-center hover:bg-accent text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Navigation ─────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4 scrollbar-none">
          {NAV_SECTIONS.map(({ section, items }) => (
            <div key={section}>
              <AnimatePresence>
                {!collapsed && (
                  <motion.p
                    key={`section-${section}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.08em] px-3 pb-1.5"
                  >
                    {section}
                  </motion.p>
                )}
              </AnimatePresence>
              <div
                className={cn(
                  "space-y-0.5",
                  collapsed && "flex flex-col items-center gap-1",
                )}
              >
                {items.map((item) => (
                  <NavItem
                    key={item.href}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    badge={item.badge}
                    badgeClass={item.badgeClass}
                    collapsed={collapsed}
                    onClick={() => setMobileOpen(false)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Collapsed expand button ─────────────────────── */}
        {collapsed && (
          <div className="py-2 border-t border-border/50 flex justify-center">
            <button
              onClick={toggleCollapse}
              className="hidden lg:flex w-10 h-10 rounded-xl items-center justify-center hover:bg-accent text-muted-foreground transition-colors"
              aria-label="Mở rộng sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.aside>

      {/* Desktop spacer to push content right */}
      <div
        className="hidden lg:block shrink-0 transition-all duration-300"
        style={{ width: collapsed ? 72 : 256 }}
      />
    </>
  );
}
