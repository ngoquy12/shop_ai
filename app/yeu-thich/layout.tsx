import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sản Phẩm Yêu Thích",
  description: "Danh sách sản phẩm AI và khóa học bạn đã lưu tại VideoPrompt. Xem lại và thêm vào giỏ hàng dễ dàng.",
  robots: { index: false, follow: false },
}

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
