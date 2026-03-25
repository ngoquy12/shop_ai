"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { SiteHeader } from "./site-header";
import { Footer } from "./footer";
import { SidebarProvider } from "./sidebar-context";

// Auth routes get a clean, minimal layout
const AUTH_PREFIXES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/unauthorized",
  "/admin",
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PREFIXES.some((p) => pathname.startsWith(p));

  if (isAuthPage) {
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
      </div>
    </SidebarProvider>
  );
}
