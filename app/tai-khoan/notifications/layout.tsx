import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cài Đặt Thông Báo",
  description: "Quản lý cài đặt thông báo email, push notification, SMS và trình duyệt trên VideoPrompt.",
  robots: { index: false, follow: false },
}

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
