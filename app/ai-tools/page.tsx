import type { Metadata } from "next"
import { AIToolsPage } from "@/components/ai-tools-page"

export const metadata: Metadata = {
  title: "Công cụ AI",
  description:
    "Khám phá và mua tài khoản các công cụ AI hàng đầu thế giới: VEO3, Midjourney, Sora2, ChatGPT, Gemini Pro với giá ưu đãi đến 90%.",
}

export default function AIToolsRoute() {
  return <AIToolsPage />
}
