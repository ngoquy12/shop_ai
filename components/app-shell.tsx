"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { SiteHeader } from "./site-header";
import { Footer } from "./footer";
import { SidebarProvider } from "./sidebar-context";
import { ChatWidget } from "./chat-widget";
import { useAuthStore } from "@/features/auth/store/auth.store";

// Routes that need a clean, minimal layout without the main Sidebar/Navbar
const CLEAN_PREFIXES = [
  "/dang-nhap",
  "/dang-ky",
  "/quen-mat-khau",
  "/dat-lai-mat-khau",
  "/xac-thuc-email",
  "/khong-duoc-phep",
  "/admin",
  "/terms",
  "/privacy",
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isCleanPage =
    CLEAN_PREFIXES.some((p) => pathname.startsWith(p)) ||
    pathname.match(/^\/khoa-hoc-ai\/[^\/]+\/learn/);

  if (isCleanPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Right: Header + Content + Footer */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>

        {/* Chat Widget - Always show for debugging */}
        <ChatWidget />
      </div>
    </SidebarProvider>
  );
}
