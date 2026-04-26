import type { Metadata } from "next"
import { CourseLearnPage } from "@/components/course-learn-page"
import { MOCK_COURSES } from "@/lib/shop-data"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const course = MOCK_COURSES.find((c) => c.slug === slug)

  return {
    title: course ? `Đang học: ${course.title}` : "Học tập — VideoPrompt",
    description: course
      ? `Xem bài học khóa học ${course.title} trên nền tảng VideoPrompt.`
      : "Nền tảng học tập e-learning VideoPrompt.",
    robots: { index: false, follow: false },
  }
}

export default function Page() {
  return <CourseLearnPage />
}
