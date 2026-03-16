import type { Metadata } from "next"
import { WebsitePage } from "@/components/website-page"

export const metadata: Metadata = {
  title: "Làm website theo yêu cầu",
  description:
    "Dịch vụ thiết kế và phát triển website chuyên nghiệp. Landing page, e-commerce, web app đến website tích hợp AI chatbot.",
}

export default function WebsiteRoute() {
  return <WebsitePage />
}
