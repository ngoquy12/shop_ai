import type { Metadata } from "next"
import { OrdersPage } from "@/components/orders-page"

export const metadata: Metadata = {
  title: "Đơn hàng của tôi",
  description: "Xem lịch sử mua hàng và trạng thái đơn hàng",
}

export default function Page() {
  return <OrdersPage />
}
