import { notFound } from "next/navigation";
import { MOCK_COURSES as courses } from "@/lib/shop-data";
import { CourseDetailPage } from "@/components/course-detail-page";

export default async function CourseRoute(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const course = courses.find((c) => c.id === params.id);

  if (!course) {
    notFound();
  }

  return <CourseDetailPage course={course} />;
}
