"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sparkles, Home, Bot, Wand2, BookOpen, Globe2,
  Wrench, Package, Heart, ChevronRight, ChevronLeft,
  Star, X, ShoppingCart, TrendingUp,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"

// ─── Navigation Config ────────────────────────────────────────
const NAV_SECTIONS = [
  {
    section: "Khám phá",
    items: [
      { icon: Home, label: "Trang chủ", href: "/" },
      { icon: Bot, label: "AI Tools Store", href: "/ai-tools", badge: "50+", badgeClass: "bg-blue-500" },
      { icon: Wand2, label: "Prompt miễn phí", href: "/prompt-mien-phi", badge: "Free", badgeClass: "bg-green-500" },
      { icon: BookOpen, label: "Khóa học AI", href: "/khoa-hoc-ai", badge: "Hot", badgeClass: "bg-orange-500" },
    ],
  },
  {
    section: "Dịch vụ",
    items: [
      { icon: Globe2, label: "Làm website", href: "/lam-website" },
      { icon: Wrench, label: "Dịch vụ khác", href: "/services" },
    ],
  },
  {
    section: "Cá nhân",
    items: [
      { icon: ShoppingCart, label: "Giỏ hàng", href: "/cart" },
      { icon: Package, label: "Đơn hàng", href: "/orders" },
      { icon: Heart, label: "Yêu thích", href: "/wishlist" },
    ],
  },
]

// ─── Tooltip wrapper (when collapsed) ────────────────────────
function NavItem({ icon: Icon, label, href, badge, badgeClass, collapsed, onClick }: {
  icon: React.ElementType; label: string; href: string;
  badge?: string; badgeClass?: string;
  collapsed: boolean; onClick?: () => void
}) {
  const pathname = usePathname()
  const active = pathname === href || (href !== "/" && pathname.startsWith(href))

  return (
    <Link href={href} onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        "relative flex items-center gap-2.5 rounded-xl text-sm font-medium transition-all duration-150 group overflow-hidden",
        collapsed ? "w-10 h-10 justify-center mx-auto p-0" : "px-3 py-2.5",
        active
          ? "text-blue-500 dark:text-blue-400"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/80"
      )}>
      {/* Active bg */}
      {active && (
        <motion.div layoutId="sidebar-active-bg"
          className="absolute inset-0 rounded-xl bg-blue-500/10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
      )}
      <Icon className={cn("w-4.5 h-4.5 shrink-0 relative z-10", active ? "text-blue-500 dark:text-blue-400" : "")} />
      <AnimatePresence>
        {!collapsed && (
          <motion.span key="label" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 truncate relative z-10 whitespace-nowrap overflow-hidden">{label}</motion.span>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!collapsed && badge && (
          <motion.span key="badge" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            className={cn("text-[9px] font-extrabold text-white px-1.5 py-0.5 rounded-full shrink-0 relative z-10", badgeClass)}>
            {badge}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────
export function Sidebar() {
  const { collapsed, toggleCollapse, mobileOpen, setMobileOpen } = useSidebar()
  const SIDEBAR_W = collapsed ? "w-[72px]" : "w-64"

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)} />
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
        )}>

        {/* ── Logo ───────────────────────────────────────── */}
        <div className={cn(
          "flex items-center h-16 border-b border-border/50 shrink-0",
          collapsed ? "justify-center px-0" : "justify-between px-4"
        )}>
          <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/25">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div key="brand" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}>
                  <div className="font-extrabold text-base leading-none">VideoPrompt</div>
                  <div className="text-[10px] text-muted-foreground leading-none mt-0.5">AI Platform</div>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
          {/* Desktop collapse toggle */}
          <AnimatePresence>
            {!collapsed && (
              <motion.button key="collapse-btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={toggleCollapse}
                className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center hover:bg-accent text-muted-foreground transition-colors"
                aria-label="Thu gọn sidebar">
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Mobile close */}
          <button onClick={() => setMobileOpen(false)}
            className="lg:hidden w-7 h-7 rounded-lg flex items-center justify-center hover:bg-accent text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Navigation ─────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4 scrollbar-none">
          {NAV_SECTIONS.map(({ section, items }) => (
            <div key={section}>
              <AnimatePresence>
                {!collapsed && (
                  <motion.p key={`section-${section}`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.08em] px-3 pb-1.5">
                    {section}
                  </motion.p>
                )}
              </AnimatePresence>
              <div className={cn("space-y-0.5", collapsed && "flex flex-col items-center gap-1")}>
                {items.map((item) => (
                  <NavItem key={item.href}
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
            <button onClick={toggleCollapse}
              className="hidden lg:flex w-10 h-10 rounded-xl items-center justify-center hover:bg-accent text-muted-foreground transition-colors"
              aria-label="Mở rộng sidebar">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Bottom promo card ───────────────────────────── */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div key="promo" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              className="p-3 border-t border-border/50">
              <div className="rounded-xl bg-linear-to-br from-blue-600/20 via-violet-600/15 to-pink-600/10 border border-violet-500/20 p-3.5">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
                  <span className="text-xs font-bold">Flash Sale đang diễn ra</span>
                </div>
                <p className="text-[11px] text-muted-foreground mb-2.5 leading-relaxed">
                  Giảm đến <span className="font-bold text-red-400">40%</span> tất cả AI Tools hôm nay
                </p>
                <Link href="/ai-tools"
                  className="flex items-center justify-center gap-1.5 text-[11px] font-bold py-2 rounded-lg bg-linear-to-r from-blue-600 to-violet-600 text-white hover:opacity-90 transition-opacity">
                  <Star className="w-3 h-3 fill-white" />Xem ưu đãi
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* Desktop spacer to push content right */}
      <div className="hidden lg:block shrink-0 transition-all duration-300" style={{ width: collapsed ? 72 : 256 }} />
    </>
  )
}
