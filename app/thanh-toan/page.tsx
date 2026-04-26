import type { Metadata } from "next"
import { CheckoutPage } from "@/components/checkout-page"

export const metadata: Metadata = {
  title: "Thanh Toán",
  description: "Hoàn tất đơn hàng của bạn tại VideoPrompt. Thanh toán an toàn qua VietQR, MoMo, ZaloPay.",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <CheckoutPage />
}
