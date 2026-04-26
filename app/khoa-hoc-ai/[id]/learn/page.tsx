import { notFound } from "next/navigation";
import { courses } from "@/lib/data";
import { CourseLearningPage } from "@/components/course-learning-page";

export default async function CourseLearningRoute(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const course = courses.find((c) => c.id === params.id);

  if (!course) {
    notFound();
  }

  return <CourseLearningPage course={course} />;
}
