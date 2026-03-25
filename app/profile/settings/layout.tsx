import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cài Đặt Tài Khoản",
  description: "Tuỳ chỉnh ngôn ngữ, giao diện, múi giờ và quyền riêng tư tài khoản VideoPrompt của bạn.",
  robots: { index: false, follow: false },
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
