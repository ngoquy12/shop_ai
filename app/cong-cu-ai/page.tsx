import type { Metadata } from "next";
import { AIToolsPage } from "@/components/ai-tools-page";

export const metadata: Metadata = {
  title: "Công cụ AI — Mua Tài Khoản AI Giá Tốt Nhất",
  description:
    "Mua tài khoản AI chính chủ giá tốt nhất thị trường: VEO3, Sora2, Midjourney Pro, ChatGPT Plus, Claude Pro, Gemini Advanced. Giảm giá đến 90%, bảo hành 30 ngày, kích hoạt ngay.",
  keywords: [
    "mua tài khoản AI",
    "ChatGPT Plus giá rẻ",
    "Midjourney Pro",
    "VEO3",
    "Sora2",
    "Claude Pro",
    "Gemini Advanced",
    "tài khoản AI chính chủ",
    "Công cụ AI giá rẻ",
    "mua AI Việt Nam",
  ],
  openGraph: {
    title: "Công cụ AI — Mua Tài Khoản AI Giá Tốt Nhất | VideoPrompt",
    description:
      "50+ tài khoản AI hàng đầu thế giới với giá ưu đãi đến 90%. Bảo hành 30 ngày, kích hoạt ngay sau thanh toán.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function AIToolsRoute() {
  return <AIToolsPage />;
}
