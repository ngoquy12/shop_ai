import type { Metadata } from "next"
import { WebsitePage } from "@/components/website-page"

export const metadata: Metadata = {
  title: "Dịch Vụ Làm Website Chuyên Nghiệp — Theo Yêu Cầu",
  description:
    "Thiết kế & phát triển website chuyên nghiệp theo yêu cầu: Landing page, E-commerce, Website doanh nghiệp, Web App, Portfolio, Website tích hợp AI Chatbot. Bàn giao mã nguồn, SEO chuẩn, hỗ trợ sau bàn giao.",
  keywords: [
    "làm website theo yêu cầu", "thiết kế website chuyên nghiệp", "làm landing page",
    "website bán hàng", "website doanh nghiệp", "web app", "website AI chatbot",
    "thiết kế web Việt Nam", "dịch vụ website", "làm website giá rẻ",
  ],
  openGraph: {
    title: "Dịch Vụ Làm Website Chuyên Nghiệp | VideoPrompt",
    description: "Từ landing page đến web app AI tích hợp chatbot. Responsive, SEO chuẩn, bàn giao mã nguồn. Báo giá nhanh trong 24h.",
    type: "website",
    locale: "vi_VN",
  },
}

export default function WebsiteRoute() {
  return <WebsitePage />
}
