"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";

const LEGAL_NAV = [
  { href: "/terms", label: "Điều khoản sử dụng" },
  { href: "/privacy", label: "Chính sách bảo mật" },
];

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* ── Unified Legal Header ── */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 grid grid-cols-3 items-center">
          {/* Left: Synchronized Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group justify-self-start"
          >
            <div className="relative">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.4 }}
                className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20"
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:block">
              VideoPrompt
            </span>
          </Link>

          {/* Center: Tabs */}
          <nav className="flex items-center justify-center gap-6 sm:gap-10 h-full justify-self-center overflow-x-auto scrollbar-hide no-scrollbar whitespace-nowrap">
            {LEGAL_NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center h-full text-sm font-semibold transition-all duration-300",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="legal-nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full shadow-primary/40"
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

          {/* Right: Actions & Theme Toggle */}
          <div className="flex items-center gap-3 justify-self-end">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Main Legal Content ── */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
        {children}
      </main>

      {/* ── Minimalist Legal Footer ── */}
      <footer className="py-12 border-t border-border/40 bg-accent/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground font-medium">
            © 2026 VideoPrompt. Mọi quyền được bảo lưu.
          </p>
        </div>
      </footer>
    </div>
  );
}
