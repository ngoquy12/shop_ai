import type { Metadata } from "next"
import { OrdersPage } from "@/components/orders-page"

export const metadata: Metadata = {
  title: "Đơn Hàng Của Tôi",
  description: "Xem lịch sử mua hàng và theo dõi trạng thái đơn hàng của bạn tại VideoPrompt.",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <OrdersPage />
}
