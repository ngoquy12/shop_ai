import type { Metadata } from "next";

import { CoursesPage } from "@/components/courses-page";

export const metadata: Metadata = {
  title: "Khóa Học AI Thực Chiến — Học từ Chuyên Gia",
  description:
    "Khóa học AI thực chiến từ cơ bản đến nâng cao: VEO3, Midjourney, ChatGPT, AI Marketing, Lập trình với AI. Học online linh hoạt, chứng chỉ hoàn thành, áp dụng ngay vào công việc.",
  keywords: [
    "khóa học AI",
    "học AI online",
    "khóa học ChatGPT",
    "khóa học Midjourney",
    "khóa học VEO3",
    "AI Marketing",
    "lập trình AI",
    "học AI tiếng Việt",
    "prompt engineering",
    "khóa học AI Việt Nam",
  ],
  openGraph: {
    title: "Khóa Học AI Thực Chiến | VideoPrompt",
    description:
      "Làm chủ các công cụ AI hàng đầu với khóa học thực chiến từ chuyên gia. Học linh hoạt, áp dụng ngay.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function CoursesRoute() {
  return <CoursesPage />;
}
