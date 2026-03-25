"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Sun,
  Moon,
  ShoppingCart,
  Bell,
  BookOpen,
  TrendingUp,
  User,
  LogOut,
  Settings,
  Menu,
  ChevronDown,
  Sparkles,
  X,
  Package,
  Lock,
  Heart,
  Bot,
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useSidebar } from "./sidebar-context";
import { LogoutModal } from "./logout-modal";
import { cn } from "@/lib/utils";

// Toggle MOCK_USER to null to show guest state
const MOCK_USER = {
  name: "Nguyễn Văn An",
  email: "nguyenvanan@gmail.com",
  plan: "Pro",
  avatar: null as string | null,
};



const CART_COUNT = 3;

const USER_MENU_SECTIONS = [
  [
    {
      icon: User,
      label: "Trang cá nhân",
      href: "/profile",
      desc: "Xem & chỉnh sửa thông tin",
    },
    {
      icon: Package,
      label: "Đơn hàng của tôi",
      href: "/orders",
      desc: "Theo dõi trạng thái đơn",
    },
    {
      icon: Heart,
      label: "Sản phẩm yêu thích",
      href: "/wishlist",
      desc: "Danh sách đã lưu",
    },
  ],
  [
    {
      icon: Lock,
      label: "Bảo mật & Mật khẩu",
      href: "/profile/security",
      desc: "Đổi mật khẩu, 2FA",
    },
    {
      icon: Settings,
      label: "Cài đặt tài khoản",
      href: "/profile/settings",
      desc: "Ngôn ngữ, thông báo",
    },
  ],
];

export function SiteHeader() {
  const { setMobileOpen } = useSidebar();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const user = MOCK_USER;
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const initials = user.name
    .split(" ")
    .slice(-2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  const firstName = user.name.split(" ").pop() ?? user.name;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/50 bg-background/85 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto flex h-16 items-center gap-3 px-4 sm:px-6">
        {/* Mobile hamburger */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileOpen(true)}
          className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-accent text-muted-foreground transition-colors"
          aria-label="Mở menu"
        >
          <Menu className="w-5 h-5" />
        </motion.button>

        {/* Search */}
        <div className="flex-1 max-w-sm">
          <AnimatePresence mode="wait">
            {searchOpen ? (
              <motion.div
                key="search-active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative flex items-center"
              >
                <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  autoFocus
                  placeholder="Tìm kiếm AI tools, khóa học..."
                  className="pl-9 pr-10 h-9 rounded-xl border-border/60 bg-card text-sm"
                  onBlur={() => setSearchOpen(false)}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="search-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex items-center gap-2.5 h-9 px-3.5 rounded-xl border border-border/50 bg-card text-sm text-muted-foreground hover:border-border hover:text-foreground transition-colors w-full max-w-xs group"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="flex-1 text-left">Tìm kiếm...</span>
                <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono hidden group-hover:inline-block">
                  ⌘K
                </kbd>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 ml-auto">
          {/* Mobile search */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setSearchOpen(true)}
            className="sm:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-accent text-muted-foreground transition-colors"
          >
            <Search className="w-4 h-4" />
          </motion.button>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setNotifOpen((o) => !o)}
              className="relative w-9 h-9 rounded-lg flex items-center justify-center hover:bg-accent text-muted-foreground transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
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
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border/60 bg-card shadow-2xl z-20 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                      <p className="font-semibold text-sm">Thông báo</p>
                      <button className="text-xs text-blue-400 hover:underline">
                        Đánh dấu đã đọc
                      </button>
                    </div>
                    {[
                      {
                        icon: "🎉",
                        title: "Flash Sale đang diễn ra!",
                        desc: "Giảm 40% tất cả AI Tools. Còn 5 giờ!",
                        time: "2 phút",
                      },
                      {
                        icon: "✅",
                        title: "Đơn hàng #VP2024 hoàn thành",
                        desc: "ChatGPT Plus đã được kích hoạt.",
                        time: "1 giờ",
                      },
                      {
                        icon: "📚",
                        title: "Khóa học mới ra mắt",
                        desc: "AI Creative Pro — Đăng ký sớm giảm 30%",
                        time: "3 giờ",
                      },
                    ].map((n, i) => (
                      <div
                        key={i}
                        className="flex gap-3 px-4 py-3 hover:bg-accent/50 transition-colors cursor-pointer border-b border-border/30 last:border-0"
                      >
                        <span className="text-xl shrink-0">{n.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">
                            {n.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {n.desc}
                          </p>
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">
                          {n.time}
                        </span>
                      </div>
                    ))}
                    <div className="px-4 py-2.5 text-center">
                      <button className="text-sm text-blue-400 hover:underline">
                        Xem tất cả thông báo
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Cart */}
          <motion.div whileTap={{ scale: 0.9 }}>
            <Link
              href="/cart"
              className="relative w-9 h-9 rounded-lg flex items-center justify-center hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Giỏ hàng"
            >
              <ShoppingCart className="w-4 h-4" />
              <AnimatePresence>
                {CART_COUNT > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-background"
                  >
                    {CART_COUNT}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </motion.div>

          {/* Theme */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Đổi giao diện"
          >
            <AnimatePresence mode="wait">
              {!mounted || theme === "dark" ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <div className="w-px h-6 bg-border/60 mx-1" />

          {/* ── Avatar Dropdown ─────────────────────────── */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.97 }}
              id="btn-user-avatar"
              onClick={() => setUserMenuOpen((o) => !o)}
              className="flex items-center gap-2 h-9 pl-1.5 pr-2.5 rounded-xl hover:bg-accent transition-colors"
            >
              {/* Avatar circle */}
              <div className="relative">
                <div className="w-7 h-7 rounded-full bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                  {user.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-xs">
                      {initials}
                    </span>
                  )}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />
              </div>
              {/* Name + plan */}
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold leading-none">
                  {firstName}
                </p>
                <p className="text-[10px] text-violet-400 leading-none mt-0.5 font-medium">
                  {user.plan}
                </p>
              </div>
              <motion.div
                animate={{ rotate: userMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </motion.div>
            </motion.button>

            {/* Dropdown panel */}
            <AnimatePresence>
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border/60 bg-card shadow-2xl z-20 overflow-hidden"
                  >
                    {/* User info header */}
                    <div className="relative p-4 border-b border-border/50 bg-linear-to-br from-blue-500/10 via-violet-500/5 to-transparent">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <div className="w-11 h-11 rounded-full bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                            <span className="text-white font-extrabold text-sm">
                              {initials}
                            </span>
                          </div>
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                          <div className="mt-1.5">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20">
                              <Sparkles className="w-2.5 h-2.5" />
                              {user.plan} Plan
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu sections */}
                    {USER_MENU_SECTIONS.map((section, si) => (
                      <div
                        key={si}
                        className={cn(
                          "py-1.5",
                          si > 0 && "border-t border-border/40",
                        )}
                      >
                        {section.map(({ icon: Icon, label, desc, href }) => (
                          <Link
                            key={href}
                            href={href}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent/60 transition-colors group"
                          >
                            <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-accent-foreground/10 transition-colors">
                              <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium leading-none">
                                {label}
                              </p>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                {desc}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ))}

                    {/* Logout */}
                    <div className="border-t border-border/40 p-2">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          setLogoutOpen(true);
                        }}
                        className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors font-medium"
                      >
                        <div className="w-7 h-7 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                          <LogOut className="w-3.5 h-3.5" />
                        </div>
                        Đăng xuất
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Logout confirmation modal */}
      <LogoutModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => {
          /* TODO: clear auth state, redirect to /login */
        }}
        userName={user.name}
        userInitials={initials}
        userPlan={user.plan}
      />
    </header>
  );
}
