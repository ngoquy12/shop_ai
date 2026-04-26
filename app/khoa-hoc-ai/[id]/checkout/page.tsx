import { CourseCheckoutPage } from "@/components/course-checkout-page";
import { courses } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function CourseCheckoutRoute(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const course = courses.find((c) => c.id === params.id);

  if (!course) {
    notFound();
  }

  return <CourseCheckoutPage course={course} />;
}
