import type { Metadata } from "next"
import { CourseDetailPage } from "@/components/course-detail-page"
import { MOCK_COURSES } from "@/lib/shop-data"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const course = MOCK_COURSES.find((c) => c.slug === slug)

  if (!course) {
    return {
      title: "Khóa học không tồn tại",
      description: "Không tìm thấy khóa học này trên VideoPrompt.",
    }
  }

  return {
    title: `${course.title} — Khóa Học AI Thực Chiến`,
    description: `${course.subtitle}. ${course.lessons} bài học · ${course.duration} · ${course.level}. Giảng viên: ${course.instructor.name}. Đăng ký ngay tại VideoPrompt.`,
    keywords: [
      ...course.tags,
      "khóa học AI", "học AI online", "VideoPrompt", course.instructor.name,
    ],
    openGraph: {
      title: `${course.title} | VideoPrompt`,
      description: course.subtitle,
      type: "article",
      locale: "vi_VN",
      images: course.thumbnail ? [{ url: course.thumbnail, width: 800, height: 450, alt: course.title }] : [],
    },
  }
}

export default function Page() {
  return <CourseDetailPage />
}
