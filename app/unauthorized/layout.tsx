import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Không có quyền truy cập | VideoPrompt",
  description: "Bạn không có đủ quyền để xem trang này.",
}

export default function UnauthorizedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
