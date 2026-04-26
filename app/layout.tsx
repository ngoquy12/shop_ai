import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/components/app-shell";
import { FomoToasts } from "@/components/fomo-toasts";
import { QueryProvider } from "@/components/query-provider";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SessionGuardianProvider } from "@/features/auth/components/session-guardian-provider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "VideoPrompt - Công cụ AI & Khóa học AI hàng đầu Việt Nam",
    template: "%s | VideoPrompt",
  },
  description:
    "Mua tài khoản AI chính chủ giá tốt nhất: ChatGPT, Midjourney, Claude, Gemini... Học AI thực chiến, prompt miễn phí, làm website theo yêu cầu chuyên nghiệp.",
  keywords: [
    "Công cụ AI",
    "ChatGPT",
    "Midjourney",
    "Gemini",
    "khóa học AI",
    "làm website",
    "prompt miễn phí",
    "mua tài khoản AI",
  ],
  metadataBase: new URL("https://videoprompt.vn"),
  openGraph: {
    title: "VideoPrompt - Nền tảng AI hàng đầu Việt Nam",
    description:
      "Xông cụ AI, khóa học, prompt miễn phí và website chuyên nghiệp",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <QueryProvider>
            <SessionGuardianProvider>
              <AppShell>{children}</AppShell>
            </SessionGuardianProvider>
          </QueryProvider>
          <FomoToasts />
          <Toaster theme="dark" />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
