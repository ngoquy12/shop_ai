import type { Metadata } from "next"
import { CartPage } from "@/components/cart-page"

export const metadata: Metadata = {
  title: "Giỏ hàng",
  description: "Xem và quản lý giỏ hàng của bạn",
}

export default function Page() {
  return <CartPage />
}
