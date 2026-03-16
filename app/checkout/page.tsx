import type { Metadata } from "next"
import { CheckoutPage } from "@/components/checkout-page"

export const metadata: Metadata = {
  title: "Thanh toán",
  description: "Hoàn tất đơn hàng của bạn",
}

export default function Page() {
  return <CheckoutPage />
}
