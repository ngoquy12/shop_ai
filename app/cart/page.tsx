import type { Metadata } from "next"
import { CartPage } from "@/components/cart-page"

export const metadata: Metadata = {
  title: "Giỏ Hàng",
  description: "Xem và quản lý giỏ hàng của bạn tại VideoPrompt.",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <CartPage />
}
