"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Lock,
  Package,
  Heart,
  Settings,
  Bell,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const PROFILE_NAV = [
  {
    section: "Tài khoản",
    items: [
      {
        icon: User,
        label: "Thông tin cá nhân",
        href: "/tai-khoan",
        desc: "Tên, ảnh đại diện, bio",
      },
      {
        icon: Bell,
        label: "Thông báo",
        href: "/profile/notifications",
        desc: "Email, push, SMS",
      },
      {
        icon: CreditCard,
        label: "Thanh toán",
        href: "/profile/billing",
        desc: "Phương thức thanh toán",
      },
    ],
  },
  {
    section: "Bảo mật",
    items: [
      {
        icon: Lock,
        label: "Mật khẩu & Bảo mật",
        href: "/profile/security",
        desc: "Mật khẩu, 2FA, phiên đăng nhập",
      },
      {
        icon: Settings,
        label: "Cài đặt",
        href: "/profile/settings",
        desc: "Ngôn ngữ, giao diện, quyền riêng tư",
      },
    ],
  },
  {
    section: "Hoạt động",
    items: [
      {
        icon: Package,
        label: "Đơn hàng",
        href: "/don-hang",
        desc: "Lịch sử mua hàng",
      },
      {
        icon: Heart,
        label: "Yêu thích",
        href: "/yeu-thich",
        desc: "Sản phẩm đã lưu",
      },
    ],
  },
];

export function ProfileLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold">Tài khoản của tôi</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Quản lý thông tin tài khoản và cài đặt
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar nav */}
        <aside className="lg:w-60 xl:w-64 shrink-0">
          {/* Navigation sections */}
          <nav className="space-y-4">
            {PROFILE_NAV.map(({ section, items }) => (
              <div key={section}>
                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-2 mb-1.5">
                  {section}
                </p>
                <div className="space-y-0.5">
                  {items.map(({ icon: Icon, label, href }) => {
                    const active = pathname === href;
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={cn(
                          "relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                          active
                            ? "text-blue-500 bg-blue-500/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent",
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-4 h-4 shrink-0",
                            active && "text-blue-500",
                          )}
                        />
                        <span className="flex-1">{label}</span>
                        <ChevronRight
                          className={cn(
                            "w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity",
                            active && "opacity-60",
                          )}
                        />
                        {active && (
                          <motion.div
                            layoutId="profile-nav-active"
                            className="absolute inset-0 rounded-xl bg-blue-500/10"
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
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
