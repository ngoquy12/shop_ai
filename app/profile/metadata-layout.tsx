import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tài Khoản Của Tôi",
  description: "Quản lý thông tin cá nhân, bảo mật và cài đặt tài khoản VideoPrompt của bạn.",
  robots: { index: false, follow: false },
}

export default function ProfileRootLayout({ children }: { children: React.ReactNode }) {
  // The actual layout UI is handled by the client layout component below
  // This server wrapper exists solely to export metadata
  return <>{children}</>
}
