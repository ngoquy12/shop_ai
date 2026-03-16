import type { Metadata } from "next"
import { CourseLearnPage } from "@/components/course-learn-page"

export const metadata: Metadata = {
  title: "Học tập — AI Thực Chiến",
  description: "Nền tảng học tập e-learning VideoPrompt",
}

export default function Page() {
  return <CourseLearnPage />
}
