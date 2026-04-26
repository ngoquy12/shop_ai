import type { Metadata } from "next"
import { PromptLibraryPage } from "@/components/prompt-library-page"

export const metadata: Metadata = {
  title: "Thư Viện Prompt AI Miễn Phí — 500+ Prompt Chất Lượng",
  description:
    "Kho prompt AI miễn phí đa dạng: tạo ảnh, làm video, viết nội dung marketing, thiết kế... Sao chép và sử dụng ngay với ChatGPT, Claude, Gemini, Midjourney. Cập nhật liên tục.",
  keywords: [
    "prompt AI miễn phí", "prompt ChatGPT", "prompt Midjourney", "prompt Claude",
    "AI image prompt", "prompt tiếng Việt", "prompt marketing", "prompt viết content",
    "thư viện prompt", "prompt engineering miễn phí",
  ],
  openGraph: {
    title: "Thư Viện Prompt AI Miễn Phí | VideoPrompt",
    description: "500+ prompt AI chất lượng cao miễn phí. Tạo ảnh, video, content marketing — sao chép và dùng ngay.",
    type: "website",
    locale: "vi_VN",
  },
}

export default function PromptLibraryRoute() {
  return <PromptLibraryPage />
}
