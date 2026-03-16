"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Star,
  Users,
  Clock,
  Play,
  BookOpen,
  Award,
  ChevronDown,
  ChevronRight,
  Check,
  ShoppingCart,
  Globe,
  BarChart3,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { MOCK_COURSES } from "@/lib/shop-data";

function fmt(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

function StarRating({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "lg";
}) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "fill-yellow-400 text-yellow-400",
            size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5",
          )}
          style={{
            opacity: i < Math.floor(rating) ? 1 : i < rating ? 0.5 : 0.2,
          }}
        />
      ))}
    </div>
  );
}

function CurriculumChapter({
  chapter,
  isFirst,
}: {
  chapter: (typeof MOCK_COURSES)[0]["curriculum"][0];
  isFirst: boolean;
}) {
  const [open, setOpen] = useState(isFirst);

  return (
    <div className="border border-border/60 rounded-xl overflow-hidden mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-card hover:bg-accent/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0",
              open && "rotate-180",
            )}
          />
          <div>
            <p className="font-semibold text-sm">{chapter.title}</p>
            <p className="text-xs text-muted-foreground">
              {chapter.lessons.length} bài • {chapter.duration}
            </p>
          </div>
        </div>
      </button>

      {open && (
        <div className="divide-y divide-border/40 animate-slide-down">
          {chapter.lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-accent/30 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0">
                {lesson.type === "video" && (
                  <Play className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                )}
                {lesson.type === "quiz" && (
                  <BarChart3 className="w-3.5 h-3.5 text-violet-400" />
                )}
                {lesson.type === "assignment" && (
                  <BookOpen className="w-3.5 h-3.5 text-orange-400" />
                )}
                {lesson.type === "article" && (
                  <BookOpen className="w-3.5 h-3.5 text-green-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm line-clamp-1">{lesson.title}</p>
                  {lesson.free && (
                    <Badge className="text-[10px] h-4 bg-green-500/15 text-green-400 border-green-500/20">
                      Free
                    </Badge>
                  )}
                </div>
              </div>
              {lesson.completed !== undefined &&
                (lesson.completed ? (
                  <Check className="w-4 h-4 text-green-400 shrink-0" />
                ) : (
                  <span className="text-xs text-muted-foreground shrink-0">
                    {lesson.duration}
                  </span>
                ))}
              {lesson.completed === undefined && (
                <span className="text-xs text-muted-foreground shrink-0">
                  {lesson.duration}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function CourseDetailPage() {
  const course = MOCK_COURSES[0];
  const [showAllOutcomes, setShowAllOutcomes] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative bg-linear-to-br from-slate-900 via-blue-950 to-violet-950 border-b border-border/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15)_0%,transparent_60%)]" />
        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left: Info */}
            <div className="lg:col-span-2 animate-slide-up">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-4">
                <Link
                  href="/khoa-hoc-ai"
                  className="hover:text-white transition-colors"
                >
                  Khóa học
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-white/70">AI & Automation</span>
              </nav>

              <div className="flex flex-wrap gap-2 mb-3">
                {course.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-blue-600/20 text-blue-300 border-blue-500/30 text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
                <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                  🔥 Bán chạy nhất
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-3">
                {course.title}
              </h1>
              <p className="text-white/70 text-base mb-5">{course.subtitle}</p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/70 mb-5">
                <div className="flex items-center gap-1.5">
                  <StarRating rating={course.rating} />
                  <span className="text-yellow-400 font-bold">
                    {course.rating}
                  </span>
                  <span className="text-white/50">
                    ({course.reviewCount.toLocaleString()} đánh giá)
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {course.studentCount.toLocaleString()} học viên
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  {course.language}
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                  {course.instructor.avatar}
                </div>
                <div>
                  <p className="text-xs text-white/50">Giảng viên</p>
                  <p className="text-white font-semibold text-sm">
                    {course.instructor.name}
                  </p>
                </div>
                <Badge className="ml-auto bg-white/10 text-white/70 border-white/20 text-xs">
                  Cập nhật: {course.lastUpdated}
                </Badge>
              </div>
            </div>

            {/* Right: Sticky buy card (hidden on mobile, shown below) */}
            <div className="hidden lg:block animate-slide-in-right">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 sticky top-24">
                {/* Preview thumbnail */}
                <div className="relative rounded-xl overflow-hidden mb-4 aspect-video">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors cursor-pointer">
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                  </div>
                  <Badge className="absolute top-2 left-2 bg-blue-600 text-white border-0 text-xs">
                    Xem thử miễn phí
                  </Badge>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-extrabold text-white">
                      {fmt(course.price)}
                    </span>
                    <span className="text-white/50 line-through text-sm">
                      {fmt(course.originalPrice)}
                    </span>
                    <Badge className="bg-red-500/80 text-white border-0 text-xs">
                      -
                      {Math.round(
                        (1 - course.price / course.originalPrice) * 100,
                      )}
                      %
                    </Badge>
                  </div>
                  <p className="text-white/50 text-xs">
                    ⏰ Ưu đãi kết thúc sau 23:47:12
                  </p>
                </div>

                <Button
                  asChild
                  className="w-full h-11 bg-linear-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-base border-0 gap-2 mb-2"
                >
                  <Link href="/checkout">
                    <ShoppingCart className="w-5 h-5" />
                    Đăng ký ngay
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-10 border-white/20 text-white/80 hover:bg-white/10 hover:text-white mb-4"
                >
                  Thêm vào giỏ hàng
                </Button>

                <p className="text-center text-xs text-white/40 mb-4">
                  Hoàn tiền 30 ngày nếu không hài lòng
                </p>

                <div className="space-y-2 text-sm text-white/70">
                  {[
                    {
                      icon: Play,
                      text: `${course.lessons} bài giảng video HD`,
                    },
                    { icon: Clock, text: course.duration + " nội dung" },
                    { icon: Award, text: "Chứng chỉ hoàn thành" },
                    { icon: Zap, text: "Truy cập trọn đời" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-white/50 shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile buy bar */}
      <div className="lg:hidden sticky top-16 z-30 bg-card/95 backdrop-blur-sm border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-xl font-extrabold text-blue-400">
              {fmt(course.price)}
            </span>
            <span className="text-sm text-muted-foreground line-through ml-2">
              {fmt(course.originalPrice)}
            </span>
          </div>
          <Button
            asChild
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 gap-2 shrink-0"
          >
            <Link href="/checkout">
              <ShoppingCart className="w-4 h-4" />
              Đăng ký
            </Link>
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Outcomes */}
            <section className="rounded-2xl border border-border/60 bg-card p-6 animate-slide-up">
              <h2 className="text-xl font-extrabold mb-5 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Bạn sẽ học được gì?
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {(showAllOutcomes
                  ? course.outcomes
                  : course.outcomes.slice(0, 4)
                ).map((o) => (
                  <div key={o} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <span>{o}</span>
                  </div>
                ))}
              </div>
              {course.outcomes.length > 4 && (
                <button
                  onClick={() => setShowAllOutcomes(!showAllOutcomes)}
                  className="mt-4 text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
                >
                  {showAllOutcomes
                    ? "Thu gọn"
                    : `Xem thêm ${course.outcomes.length - 4} mục`}
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform",
                      showAllOutcomes && "rotate-180",
                    )}
                  />
                </button>
              )}
            </section>

            {/* Course stats */}
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up-delay">
              {[
                {
                  icon: Play,
                  value: course.lessons,
                  label: "Bài giảng",
                  color: "text-blue-400",
                },
                {
                  icon: Clock,
                  value: course.duration,
                  label: "Tổng thời gian",
                  color: "text-violet-400",
                },
                {
                  icon: BarChart3,
                  value: course.level,
                  label: "Cấp độ",
                  color: "text-orange-400",
                },
                {
                  icon: Users,
                  value: course.studentCount.toLocaleString(),
                  label: "Học viên",
                  color: "text-green-400",
                },
              ].map(({ icon: Icon, value, label, color }) => (
                <div
                  key={label}
                  className="rounded-xl border border-border/60 bg-card p-4 text-center"
                >
                  <Icon className={cn("w-5 h-5 mx-auto mb-2", color)} />
                  <p className="font-bold text-sm">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </section>

            {/* Curriculum */}
            <section className="animate-slide-up-delay-2">
              <h2 className="text-xl font-extrabold mb-5 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                Nội dung khóa học
              </h2>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                <span>{course.curriculum.length} chương</span>
                <span>•</span>
                <span>{course.lessons} bài giảng</span>
                <span>•</span>
                <span>Tổng {course.duration}</span>
              </div>
              {course.curriculum.map((ch, i) => (
                <CurriculumChapter key={ch.id} chapter={ch} isFirst={i === 0} />
              ))}
            </section>

            {/* Requirements */}
            <section className="animate-slide-up-delay-3">
              <h2 className="text-xl font-extrabold mb-4">Yêu cầu</h2>
              <ul className="space-y-2">
                {course.requirements.map((r) => (
                  <li
                    key={r}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </section>

            {/* Instructor */}
            <section className="rounded-2xl border border-border/60 bg-card p-6 animate-slide-up-delay-3">
              <h2 className="text-xl font-extrabold mb-5">Giảng viên</h2>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                  {course.instructor.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base mb-1">
                    {course.instructor.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {course.instructor.bio}
                  </p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      {course.instructor.rating} rating
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {course.instructor.students.toLocaleString()} học viên
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Desktop sidebar — already in hero, show description here */}
          <div className="hidden lg:block">
            <div className="rounded-2xl border border-border/60 bg-card p-5 sticky top-24">
              <h3 className="font-bold mb-3 text-sm">Mô tả khóa học</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {course.description}
              </p>
              <Separator className="my-4" />
              <h3 className="font-bold mb-3 text-sm">Chia sẻ</h3>
              <div className="flex gap-2">
                {["Facebook", "Zalo", "Link"].map((s) => (
                  <button
                    key={s}
                    className="flex-1 text-xs py-2 rounded-lg border border-border/60 hover:bg-accent transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
