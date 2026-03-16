import type { Metadata } from "next"
import { CoursesPage } from "@/components/courses-page"

export const metadata: Metadata = {
  title: "Khóa học AI",
  description:
    "Học cách sử dụng AI hiệu quả với các khóa học thực chiến. VEO3, Midjourney, ChatGPT, AI Marketing từ các chuyên gia.",
}

export default function CoursesRoute() {
  return <CoursesPage />
}
