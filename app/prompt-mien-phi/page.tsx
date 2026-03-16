import type { Metadata } from "next"
import { PromptLibraryPage } from "@/components/prompt-library-page"

export const metadata: Metadata = {
  title: "Thư viện Prompt miễn phí",
  description:
    "Kho prompt AI miễn phí đa dạng: tạo ảnh, video, nội dung marketing, thiết kế... Sao chép và sử dụng ngay với ChatGPT, Claude, Gemini.",
  keywords: ["prompt AI miễn phí", "prompt ChatGPT", "prompt Midjourney", "AI image prompt"],
}

export default function PromptLibraryRoute() {
  return <PromptLibraryPage />
}
