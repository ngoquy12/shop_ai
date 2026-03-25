import type { Metadata } from "next"
import { ProfileLayoutClient } from "@/components/profile-layout-client"

export const metadata: Metadata = {
  title: "Tài Khoản Của Tôi",
  description: "Quản lý thông tin cá nhân, bảo mật, thông báo và cài đặt tài khoản VideoPrompt của bạn.",
  robots: { index: false, follow: false },
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <ProfileLayoutClient>{children}</ProfileLayoutClient>
}
