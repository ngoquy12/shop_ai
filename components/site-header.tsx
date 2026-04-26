"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  User,
  LogOut,
  Settings,
  Menu,
  ChevronDown,
  Sparkles,
  Package,
  Lock,
  Heart,
  Wallet,
  X,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./sidebar-context";
import { LogoutModal } from "./logout-modal";
import { cn } from "@/lib/utils";

import Cookies from "js-cookie";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getRoleLabel } from "@/lib/enums/role.enum";
import { useQueryClient } from "@tanstack/react-query";
import { useBalance } from "@/features/wallets/hooks/use-wallets";
import { TopupModal } from "@/features/wallets/components/TopupModal";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { NotificationDropdown } from "@/features/notifications/components/NotificationDropdown";
import { useMyCart } from "@/features/carts/hooks/use-carts";

const USER_MENU_SECTIONS = [
  [
    {
      icon: User,
      label: "Trang cá nhân",
      href: "/tai-khoan",
      desc: "Xem & chỉnh sửa thông tin",
    },
    {
      icon: Package,
      label: "Đơn hàng của tôi",
      href: "/don-hang",
      desc: "Theo dõi trạng thái đơn",
    },
    {
      icon: Heart,
      label: "Sản phẩm yêu thích",
      href: "/yeu-thich",
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
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isTopupOpen, setIsTopupOpen] = useState(false);

  const cartQuery = useMyCart();
  const { data: balanceData } = useBalance();
  const CART_COUNT = cartQuery.data?.items?.length || 0;

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifOpen &&
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setNotifOpen(false);
      }
      if (
        userMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notifOpen, userMenuOpen]);

  const initials =
    user?.fullName
      ?.split(" ")
      ?.slice(-2)
      ?.map((n) => n[0])
      ?.join("")
      ?.toUpperCase() || "?";
  const firstName =
    user?.fullName?.split(" ").pop() ?? (user?.fullName || "Guest");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/85 backdrop-blur-xl">
      <div className="max-w-400 mx-auto flex h-16 items-center gap-3 px-4 sm:px-6">
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
        <div className="w-full max-w-xs xl:max-w-sm hidden md:block">
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
                  placeholder="Tìm kiếm công cụ AI, khóa học..."
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

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex flex-1 items-center justify-end px-4">
          {/* User's Courses Dropdown - Hidden */}
          {/* {mounted && isAuthenticated && (
            <div className="ml-2 pl-6 border-l border-border/60">
              <MyCoursesDropdown />
            </div>
          )} */}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1 shrink-0 ml-auto lg:ml-0">
          {/* Mobile search */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setSearchOpen(true)}
            className="sm:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-accent text-muted-foreground transition-colors"
          >
            <Search className="w-4 h-4" />
          </motion.button>

          {/* Notifications - Only show if authenticated */}
          {!mounted ? (
            <div className="w-9 h-9 rounded-lg bg-muted/50 animate-pulse hidden sm:block" />
          ) : (
            isAuthenticated && <NotificationDropdown />
          )}

          {/* Cart */}
          <motion.div whileTap={{ scale: 0.9 }}>
            <Link
              href="/gio-hang"
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

          {/* Chat Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              const event = new CustomEvent("toggle-chat");
              window.dispatchEvent(event);
            }}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Chat"
          >
            <MessageSquare className="w-4 h-4" />
          </motion.button>

          <div className="w-px h-6 bg-border/60 mx-1" />

          {/* ── Avatar Dropdown ─────────────────────────── */}
          {!mounted ? (
            <div className="flex items-center gap-2 h-9 pl-1.5 pr-2.5 rounded-xl border border-transparent">
              <div className="w-7 h-7 rounded-full bg-muted/60 animate-pulse" />
              <div className="hidden sm:flex flex-col gap-1.5">
                <div className="w-20 h-2 bg-muted/60 rounded animate-pulse" />
                <div className="w-12 h-1.5 bg-muted/60 rounded animate-pulse" />
              </div>
              <div className="w-3 h-3 bg-muted/60 rounded-sm animate-pulse ml-1" />
            </div>
          ) : isAuthenticated && user ? (
            <div className="relative" ref={userMenuRef}>
              <motion.button
                whileTap={{ scale: 0.97 }}
                id="btn-user-avatar"
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2 h-9 pl-1.5 pr-2.5 rounded-xl hover:bg-accent transition-colors"
              >
                {/* Avatar circle */}
                <div className="relative">
                  <div className="w-7 h-7 rounded-full bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                    {user.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt={user.fullName}
                        width={28}
                        height={28}
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
                    {getRoleLabel(user.role)}
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
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border/60 bg-card shadow-2xl z-50 overflow-hidden"
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
                              {user.fullName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </p>
                            <div className="mt-1.5">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20">
                                <Sparkles className="w-2.5 h-2.5" />
                                {getRoleLabel(user.role)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bóp Ví */}
                      <div className="px-4 py-3 border-b border-border/50 bg-muted/40">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-muted-foreground font-medium">
                            Số dư khả dụng
                          </span>
                          <Wallet className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <div className="font-bold text-lg text-foreground mb-2">
                          {formatCurrency(balanceData?.balance)}
                        </div>
                        <Button
                          size="sm"
                          className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-700 font-semibold"
                          onClick={() => {
                            setUserMenuOpen(false);
                            router.push("/profile?tab=deposit");
                          }}
                        >
                          Nạp tiền ngay
                        </Button>
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
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/dang-nhap"
                className="text-sm font-medium hover:underline px-2"
              >
                Đăng nhập
              </Link>
              <Link
                href="/dang-ky"
                className="hidden sm:inline-flex items-center justify-center px-4 h-9 bg-primary text-primary-foreground rounded-md text-sm font-medium transition-colors hover:bg-primary/90"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Logout confirmation modal */}
      {isAuthenticated && user && (
        <LogoutModal
          open={logoutOpen}
          onClose={() => setLogoutOpen(false)}
          onConfirm={() => {
            logout();
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            Cookies.remove("sessionId");
            queryClient.clear();
            setLogoutOpen(false);
            router.push("/dang-nhap");
          }}
          userName={user.fullName}
          userInitials={initials}
          userPlan={getRoleLabel(user.role)}
        />
      )}

      {/* Topup Modal */}
      <TopupModal isOpen={isTopupOpen} onClose={() => setIsTopupOpen(false)} />
    </header>
  );
}
