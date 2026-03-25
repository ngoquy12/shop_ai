"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  BookOpen,
  ShoppingBag,
  Users,
  Wand2,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  Shield,
  TrendingUp,
  ExternalLink,
  Sun,
  Moon,
  FolderTree,
  Tag,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

// ─── Nav config ────────────────────────────────────────────────────────────
const NAV = [
  {
    section: "Tổng quan",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    section: "Cửa hàng",
    items: [
      { label: "Danh mục", href: "/admin/categories", icon: FolderTree },
      { label: "AI Tools", href: "/admin/products", icon: Bot, badge: "12" },
      { label: "Khóa học", href: "/admin/courses", icon: BookOpen },
      { label: "Prompt", href: "/admin/prompts", icon: Wand2 },
    ],
  },
  {
    section: "Thương mại",
    items: [
      {
        label: "Đơn hàng",
        href: "/admin/orders",
        icon: ShoppingBag,
        badge: "5",
        badgeCls: "bg-orange-500",
      },
      { label: "Mã giảm giá", href: "/admin/coupons", icon: Tag },
      { label: "Khách hàng", href: "/admin/customers", icon: Users },
    ],
  },
  {
    section: "Nội dung",
    items: [
      { label: "Bài viết", href: "/admin/posts", icon: FileText },
    ],
  },
  {
    section: "Phân tích",
    items: [{ label: "Analytics", href: "/admin/analytics", icon: BarChart3 }],
  },
  {
    section: "Hệ thống",
    items: [{ label: "Cài đặt", href: "/admin/settings", icon: Settings }],
  },
];

const ADMIN = { name: "Admin", email: "admin@videoprompt.vn", initials: "AD" };

// ─── Sidebar Item ──────────────────────────────────────────────────────────
function SidebarItem({
  icon: Icon,
  label,
  href,
  badge,
  badgeCls,
  collapsed,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
  badgeCls?: string;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== "/admin" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        "relative flex items-center gap-2.5 rounded-xl text-sm font-medium transition-all duration-150 group overflow-hidden",
        collapsed ? "w-10 h-10 justify-center mx-auto p-0" : "px-3 py-2.5",
        active
          ? "text-blue-400"
          : "text-[#8b8b9e] hover:text-white hover:bg-white/5",
      )}
    >
      {active && (
        <motion.div
          layoutId="admin-active-bg"
          className="absolute inset-0 rounded-xl bg-blue-500/15 border border-blue-500/20"
          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
        />
      )}
      <Icon
        className={cn(
          "w-4 h-4 shrink-0 relative z-10",
          active && "text-blue-400",
        )}
      />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            key="lbl"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 truncate relative z-10 whitespace-nowrap"
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
              "text-[9px] font-extrabold text-white px-1.5 py-0.5 rounded-full relative z-10",
              badgeCls ?? "bg-blue-500",
            )}
          >
            {badge}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

// ─── Admin Sidebar ─────────────────────────────────────────────────────────
function AdminSidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
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
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        className={cn(
          "fixed left-0 top-0 h-full z-50 flex flex-col border-r",
          "bg-[#0d0d14] border-[rgba(255,255,255,0.07)] shadow-2xl",
          "transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex items-center h-16 border-b border-[rgba(255,255,255,0.07)] shrink-0",
            collapsed ? "justify-center px-0" : "justify-between px-4",
          )}
        >
          <Link
            href="/admin/dashboard"
            onClick={onMobileClose}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  key="brand"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="font-extrabold text-sm leading-none text-white">
                    VideoPrompt
                  </div>
                  <div className="text-[10px] text-blue-400 leading-none mt-0.5 font-semibold">
                    ADMIN PANEL
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
          <AnimatePresence>
            {!collapsed && (
              <motion.button
                key="collapse"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onToggle}
                className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center hover:bg-white/8 text-[#8b8b9e] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
          <button
            onClick={onMobileClose}
            className="lg:hidden w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/8 text-[#8b8b9e]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4 scrollbar-none">
          {NAV.map(({ section, items }) => (
            <div key={section}>
              <AnimatePresence>
                {!collapsed && (
                  <motion.p
                    key={`s-${section}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] font-bold text-[#4a4a5e] uppercase tracking-[0.08em] px-3 pb-1.5"
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
                  <SidebarItem
                    key={item.href}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    badge={"badge" in item ? item.badge : undefined}
                    badgeCls={"badgeCls" in item ? item.badgeCls : undefined}
                    collapsed={collapsed}
                    onClick={onMobileClose}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Collapsed expand */}
        {collapsed && (
          <div className="py-2 border-t border-[rgba(255,255,255,0.07)] flex justify-center">
            <button
              onClick={onToggle}
              className="hidden lg:flex w-10 h-10 rounded-xl items-center justify-center hover:bg-white/8 text-[#8b8b9e] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Admin user footer */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              key="admin-footer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="p-3 border-t border-[rgba(255,255,255,0.07)]"
            >
              <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer">
                <div className="w-7 h-7 rounded-full bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-[10px]">
                    {ADMIN.initials}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {ADMIN.name}
                  </p>
                  <p className="text-[10px] text-[#8b8b9e] truncate">
                    {ADMIN.email}
                  </p>
                </div>
                <Link
                  href="/"
                  className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white/10 text-[#8b8b9e] hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                >
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* Desktop spacer */}
      <div
        className="hidden lg:block shrink-0 transition-all duration-300"
        style={{ width: collapsed ? 72 : 240 }}
      />
    </>
  );
}

// ─── Admin Header ──────────────────────────────────────────────────────────
function AdminHeader({ onMobileOpen }: { onMobileOpen: () => void }) {
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const crumbs = pathname
    .replace("/admin", "")
    .split("/")
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " "));

  const NOTIFS = [
    {
      icon: "🛒",
      title: "Đơn hàng mới #VP-2026-001",
      time: "2 phút",
      unread: true,
    },
    {
      icon: "👤",
      title: "Khách hàng mới đăng ký",
      time: "15 phút",
      unread: true,
    },
    {
      icon: "⚠️",
      title: "Sản phẩm hết hàng: Runway ML",
      time: "1 giờ",
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[rgba(255,255,255,0.07)] bg-[#09090d]/90 backdrop-blur-xl flex items-center px-4 sm:px-6 gap-3">
      {/* Mobile menu */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onMobileOpen}
        className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/8 text-[#8b8b9e] transition-colors"
      >
        <Menu className="w-5 h-5" />
      </motion.button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm">
        <Link
          href="/admin/dashboard"
          className="text-[#8b8b9e] hover:text-white transition-colors"
        >
          Admin
        </Link>
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="text-[#3a3a4e]">/</span>
            <span
              className={
                i === crumbs.length - 1
                  ? "text-white font-semibold"
                  : "text-[#8b8b9e]"
              }
            >
              {c}
            </span>
          </span>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-1">
        {/* Search */}
        <button className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-white/5 text-sm text-[#8b8b9e] hover:text-white hover:border-white/15 transition-all">
          <Search className="w-3.5 h-3.5" />
          <span>Tìm kiếm...</span>
          <kbd className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-white/10 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* User site link */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-xl text-sm text-[#8b8b9e] hover:text-white hover:bg-white/8 transition-all"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Xem website</span>
        </Link>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setNotifOpen((o) => !o)}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/8 text-[#8b8b9e] hover:text-white transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-[#09090d]" />
          </motion.button>
          <AnimatePresence>
            {notifOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setNotifOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#111118] shadow-2xl z-20"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.07)]">
                    <p className="font-semibold text-sm text-white">
                      Thông báo hệ thống
                    </p>
                    <button className="text-xs text-blue-400 hover:underline">
                      Đánh dấu đã đọc
                    </button>
                  </div>
                  {NOTIFS.map((n, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex gap-3 px-4 py-3 border-b border-[rgba(255,255,255,0.05)] last:border-0 cursor-pointer hover:bg-white/5 transition-colors",
                        n.unread && "bg-blue-500/5",
                      )}
                    >
                      <span className="text-xl shrink-0">{n.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white line-clamp-1">
                          {n.title}
                        </p>
                        <p className="text-xs text-[#8b8b9e] mt-0.5">
                          {n.time} trước
                        </p>
                      </div>
                      {n.unread && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Theme toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title={
            !mounted || theme === "dark"
              ? "Chuyển sang sáng"
              : "Chuyển sang tối"
          }
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/8 text-[#8b8b9e] hover:text-white transition-colors"
        >
          {!mounted || theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </motion.button>

        <div className="w-px h-6 bg-[rgba(255,255,255,0.08)] mx-1" />

        {/* Admin avatar */}
        <div className="flex items-center gap-2 h-9 pl-1.5 pr-3 rounded-xl hover:bg-white/8 transition-colors cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-[10px]">
              {ADMIN.initials}
            </span>
          </div>
          <span className="hidden sm:block text-xs font-semibold text-white">
            {ADMIN.name}
          </span>
        </div>

        {/* Logout */}
        <Link
          href="/login"
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-red-500/15 text-[#8b8b9e] hover:text-red-400 transition-colors"
          title="Đăng xuất"
        >
          <LogOut className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
}

// ─── Admin Shell (exported) ────────────────────────────────────────────────
export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="admin-shell flex min-h-screen bg-[#09090d]">
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <AdminHeader onMobileOpen={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
