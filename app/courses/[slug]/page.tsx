import type { Metadata } from "next"
import { CourseDetailPage } from "@/components/course-detail-page"

export const metadata: Metadata = {
  title: "AI Thực Chiến: ChatGPT, Midjourney & Automation",
  description: "Khóa học AI thực chiến — làm chủ ChatGPT, Midjourney, Automation với giảng viên hàng đầu",
}

export default function Page() {
  return <CourseDetailPage />
}
