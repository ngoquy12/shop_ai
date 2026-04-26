import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Bảo Mật & Mật Khẩu",
  description: "Thay đổi mật khẩu, bật xác thực 2 bước (2FA) và quản lý phiên đăng nhập trên tài khoản VideoPrompt.",
  robots: { index: false, follow: false },
}

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
