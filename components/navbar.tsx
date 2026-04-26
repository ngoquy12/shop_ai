"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Menu,
  X,
  Bot,
  ShoppingCart,
  LogIn,
  UserPlus,
  User,
  LogOut,
  ChevronDown,
  Wand2,
  Wallet,
  Settings,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Công cụ AI", href: "/cong-cu-ai", icon: Bot },
  { label: "Prompt miễn phí", href: "/prompts-mien-phi", icon: Wand2 },
];

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const mobileMenuVariants = {
  hidden: { opacity: 0, x: "-100%" },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, damping: 25, stiffness: 200 },
  },
  exit: { opacity: 0, x: "-100%" as string },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
};

import { useMyCart } from "@/features/carts/hooks/use-carts";
import { useProfile } from "@/features/auth/hooks/use-profile";
import { useBalance } from "@/features/wallets/hooks/use-wallets";
import { TopupModal } from "@/features/wallets/components/TopupModal";
import { formatCurrency } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { data: user } = useProfile();
  const { data: balanceData } = useBalance();

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 20));

  // Close mobile menu on route change
  useEffect(() => {
    if (mobileOpen) setMobileOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const cartQuery = useMyCart();
  const cartCount = cartQuery.data?.items?.length || 0;

  return (
    <>
      {/* ── Main Header ────────────────────────────────── */}
      <motion.header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "border-b border-border/60 bg-background/85 backdrop-blur-xl shadow-sm shadow-black/5"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="relative">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.4 }}
                  className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md shadow-blue-500/20"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </motion.div>
              </div>
              <span className="font-bold text-lg tracking-tight">
                VideoPrompt
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {navItems.map(({ label, href, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                      active
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                    {active && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-lg bg-primary/10"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.4,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Cart */}
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg w-9 h-9 relative"
                  aria-label="Giỏ hàng"
                  asChild
                >
                  <Link href="/gio-hang">
                    <ShoppingCart className="h-4 w-4" />
                    <AnimatePresence>
                      {cartCount > 0 && (
                        <motion.span
                          key="badge"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                        >
                          {cartCount}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </Button>
              </motion.div>

              {/* Auth */}
              {user ? (
                <div className="relative hidden sm:block">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    id="btn-user-menu"
                    onClick={() => setUserMenuOpen((o) => !o)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/60 bg-card hover:bg-accent transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {user.fullName?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <span className="text-sm font-medium hidden md:block max-w-[100px] truncate">
                      {user.fullName || "User"}
                    </span>
                    <motion.div
                      animate={{ rotate: userMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    </motion.div>
                  </motion.button>

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
                          transition={{ duration: 0.2, ease: EASE }}
                          className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border/60 bg-card shadow-lg z-20 py-1.5 overflow-hidden"
                        >
                          <div className="px-4 py-2.5 border-b border-border/50">
                            <p className="font-semibold text-sm truncate">
                              {user.fullName || "Người dùng"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>

                          {/* Bóp Ví */}
                          <div className="px-4 py-3 border-b border-border/50 bg-slate-50/50">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs text-slate-500 font-medium">
                                Số dư khả dụng
                              </span>
                              <Wallet className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <div className="font-bold text-lg text-slate-900 mb-2">
                              {formatCurrency(balanceData?.balance)}
                            </div>
                            <Button
                              size="sm"
                              className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-700"
                              onClick={() => {
                                setUserMenuOpen(false);
                                setIsTopupOpen(true);
                              }}
                            >
                              Nạp tiền ngay
                            </Button>
                          </div>
                          {[
                            {
                              icon: User,
                              label: "Trang cá nhân",
                              href: "/tai-khoan",
                            },
                            {
                              icon: Settings,
                              label: "Cài đặt tài khoản",
                              href: "/tai-khoan/settings",
                            },
                          ].map(({ icon: Icon, label, href }) => (
                            <Link
                              key={href}
                              href={href}
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                            >
                              <Icon className="w-4 h-4 text-muted-foreground" />
                              {label}
                            </Link>
                          ))}
                          <div className="border-t border-border/50 mt-1 pt-1">
                            <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                              <LogOut className="w-4 h-4" />
                              Đăng xuất
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Button
                    id="btn-nav-login"
                    variant="ghost"
                    size="sm"
                    asChild
                    className="gap-1.5 font-medium"
                  >
                    <Link href="/dang-nhap">
                      <LogIn className="w-4 h-4" />
                      Đăng nhập
                    </Link>
                  </Button>
                  <Button
                    id="btn-nav-register"
                    size="sm"
                    asChild
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 gap-1.5"
                  >
                    <Link href="/dang-ky">
                      <UserPlus className="w-4 h-4" />
                      Đăng ký
                    </Link>
                  </Button>
                </div>
              )}

              {/* Mobile Hamburger */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen(true)}
                className="lg:hidden rounded-lg w-9 h-9 flex items-center justify-center hover:bg-accent transition-colors"
                aria-label="Mở menu"
              >
                <Menu className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Drawer ───────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              variants={overlayVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="fixed top-0 left-0 bottom-0 z-61 w-72 bg-background border-r border-border/60 lg:hidden flex flex-col overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <div className="w-7 h-7 rounded-lg bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-bold text-base">VideoPrompt</span>
                </Link>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Auth buttons */}
              {!user && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-2 p-4 border-b border-border/50"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5"
                    asChild
                  >
                    <Link
                      href="/dang-nhap"
                      onClick={() => setMobileOpen(false)}
                    >
                      <LogIn className="w-4 h-4" />
                      Đăng nhập
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
                    asChild
                  >
                    <Link href="/dang-ky" onClick={() => setMobileOpen(false)}>
                      <UserPlus className="w-4 h-4" />
                      Đăng ký
                    </Link>
                  </Button>
                </motion.div>
              )}

              {/* Nav Items */}
              <div className="flex-1 p-4 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                  Danh mục chính
                </p>
                {navItems.map(({ label, href, icon: Icon }, i) => (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (i + 1) * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        pathname === href
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-accent",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Bottom cart */}
              <div className="p-4 border-t border-border/50">
                <Link
                  href="/gio-hang"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm font-medium text-blue-400 hover:bg-blue-500/15 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Giỏ hàng
                  </span>
                  {cartCount > 0 && (
                    <span className="w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <TopupModal isOpen={isTopupOpen} onClose={() => setIsTopupOpen(false)} />
    </>
  );
}
