"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Check,
  PlayCircle,
  MonitorPlay,
  FileText,
  Download,
  Infinity,
  Trophy,
  ChevronDown,
  ChevronUp,
  Share,
  Gift,
  Play,
  Clock,
  ShieldCheck,
  ChevronRight,
  Globe2,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/lib/shop-data";
import { useAddToCart } from "@/features/carts/hooks/use-carts";
import { toast } from "sonner";

const MOCK_LEARNINGS = [
  "Làm chủ các công cụ AI tiên tiến nhất hiện nay (ChatGPT, Midjourney, VEO3...)",
  "Tự động hóa công việc hàng ngày giúp tiết kiệm 80% thời gian",
  "Tạo thu nhập thụ động từ các sản phẩm được tạo ra bằng AI",
  "Nắm vững nghệ thuật Prompt Engineering để ra lệnh cho AI chính xác",
  "Xây dựng kịch bản, làm video và chỉnh sửa chuyên nghiệp với AI",
  "Phát triển tư duy ứng dụng AI vào mọi lĩnh vực kinh doanh",
];

const MOCK_SECTIONS = [
  {
    title: "Phần 1: Nhập môn Trí Tuệ Nhân Tạo & Prompt Engineering",
    lectures: 4,
    duration: "45m",
    items: [
      {
        title: "Giới thiệu tổng quan khóa học",
        time: "05:20",
        isPreview: true,
      },
      { title: "Cách AI đang thay đổi thế giới", time: "12:15" },
      { title: "Tư duy đúng khi sử dụng AI", time: "08:30" },
      { title: "Cấu trúc cơ bản của một Prompt tốt", time: "19:10" },
    ],
  },
  {
    title: "Phần 2: Sáng tạo nội dung cực tốc với ChatGPT & Claude",
    lectures: 5,
    duration: "1h 15m",
    items: [
      {
        title: "Thiết lập tài khoản và tối ưu không gian làm việc",
        time: "10:05",
        isPreview: true,
      },
      { title: "Công thức viết bài chuẩn SEO tự động", time: "15:45" },
      { title: "Kỹ thuật Role-playing (Đóng vai) chuyên sâu", time: "18:20" },
      { title: "Phân tích dữ liệu và trích xuất thông tin", time: "14:10" },
      { title: "Khắc phục các lỗi ảo tưởng của AI", time: "16:15" },
    ],
  },
  {
    title: "Phần 3: Đỉnh cao thiết kế hình ảnh với Midjourney",
    lectures: 6,
    duration: "2h 30m",
    items: [
      {
        title: "Cài đặt & Giao diện Discord Midjourney",
        time: "12:30",
        isPreview: true,
      },
      { title: "Ngôn ngữ ánh sáng và góc máy nghệ thuật", time: "25:40" },
      { title: "Thiết kế Logo và nhận diện thương hiệu", time: "30:15" },
      {
        title: "Tạo nhân vật nhất quán phong cách (Character Reference)",
        time: "28:50",
      },
      { title: "Upscale và tối ưu ảnh chất lượng cực cao", time: "22:15" },
      { title: "Bài tập thực hành: Poster phim Cinematic", time: "31:00" },
    ],
  },
];

function formatPrice(price: number) {
  return price.toLocaleString("vi-VN") + "đ";
}

export function CourseDetailPage({ course }: { course: Course }) {
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const { mutate: addToCart, isPending } = useAddToCart();

  const discount = Math.round(
    ((course.originalPrice - course.price) / course.originalPrice) * 100,
  );

  const toggleSection = (idx: number) => {
    if (expandedSections.includes(idx)) {
      setExpandedSections(expandedSections.filter((i) => i !== idx));
    } else {
      setExpandedSections([...expandedSections, idx]);
    }
  };

  const expandAll = () => {
    setExpandedSections(MOCK_SECTIONS.map((_, i) => i));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ─── BLACK HEADER HERO ─── */}
      <div className="bg-[#0f0f10] border-b border-white/5 pt-8 pb-12 lg:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto relative flex flex-col lg:flex-row gap-8 lg:gap-12 pl-0 lg:pr-[380px]">
          {/* Breadcrumb */}
          <div className="absolute top-0 left-0 flex items-center gap-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-8 w-full z-10">
            <Link href="/" className="hover:text-violet-400 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              href="/khoa-hoc-ai"
              className="hover:text-violet-400 transition-colors"
            >
              Khóa học
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/80 line-clamp-1">{course.title}</span>
          </div>

          <div className="w-full pt-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
              {course.title}
            </h1>
            <p className="text-lg text-white/70 mb-6 leading-relaxed max-w-3xl">
              {course.description} Khóa học mang tính thực chiến cao, tập trung
              giải quyết các bài toán công việc hàng ngày bằng sức mạnh của AI.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold mb-6">
              {course.studentCount > 1000 && (
                <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0 text-xs gap-1 px-3 py-1 uppercase tracking-widest shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                  <Trophy className="w-3.5 h-3.5" /> Bestseller
                </Badge>
              )}
              <div className="flex items-center gap-1.5 text-yellow-500">
                <span className="text-base font-black">{course.rating}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500" />
                  ))}
                </div>
                <span className="text-white/60 ml-1 font-medium underline underline-offset-4 cursor-pointer hover:text-white">
                  (2,451 đánh giá)
                </span>
              </div>
              <span className="text-white/70 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-violet-400" />{" "}
                {course.studentCount.toLocaleString()} Học viên
              </span>
            </div>

            <div className="text-white/80 text-sm flex gap-1 items-center">
              Tạo bởi{" "}
              <span className="font-bold text-violet-400 underline underline-offset-4 cursor-pointer">
                Gu AI Team (VideoPrompt)
              </span>
            </div>

            <div className="flex gap-4 mt-6 text-sm text-white/60">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Cập nhật lần cuối:{" "}
                {course.lastUpdated}
              </span>
              <span className="flex items-center gap-1.5">
                <Globe2 className="w-4 h-4" /> {course.language}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 relative">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* ─── LEFT CONTENT ─── */}
          <div className="flex-1 lg:max-w-3xl lg:pr-8">
            {/* What you'll learn */}
            <div className="border border-border/60 bg-card rounded-2xl p-6 sm:p-8 mb-10 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold mb-6">
                Bạn sẽ học được gì
              </h2>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                {MOCK_LEARNINGS.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Content */}
            <div className="mb-12">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">
                Nội dung khóa học
              </h2>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>
                  {MOCK_SECTIONS.length} phần • {course.lessons} bài giảng •
                  Tổng thời lượng {course.duration}
                </span>
                <button
                  onClick={expandAll}
                  className="text-violet-500 font-semibold hover:text-violet-600 transition-colors"
                >
                  Mở rộng tất cả
                </button>
              </div>

              <div className="border border-border/60 rounded-2xl overflow-hidden bg-card shadow-sm">
                {MOCK_SECTIONS.map((section, sIdx) => {
                  const isExpanded = expandedSections.includes(sIdx);
                  return (
                    <div
                      key={sIdx}
                      className="border-b last:border-0 border-border/60"
                    >
                      <button
                        onClick={() => toggleSection(sIdx)}
                        className="w-full flex items-center justify-between p-4 sm:p-5 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                          <span className="font-bold text-foreground">
                            {section.title}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground hidden sm:block">
                          {section.lectures} bài giảng • {section.duration}
                        </span>
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="py-2 px-4 sm:px-12 bg-background">
                              {section.items.map((item, iIdx) => (
                                <div
                                  key={iIdx}
                                  className="flex items-center justify-between py-3 text-sm group"
                                >
                                  <div className="flex items-start gap-4">
                                    <PlayCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5 group-hover:text-violet-500 transition-colors" />
                                    <span
                                      className={
                                        item.isPreview
                                          ? "text-violet-500 font-medium"
                                          : "text-muted-foreground"
                                      }
                                    >
                                      {item.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs">
                                    {item.isPreview && (
                                      <span className="text-violet-500 font-semibold underline underline-offset-2 cursor-pointer hidden sm:block">
                                        Học thử
                                      </span>
                                    )}
                                    <span className="text-muted-foreground font-mono">
                                      {item.time}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instructor */}
            <div className="mb-12">
              <h2 className="text-xl sm:text-2xl font-bold mb-6">Giảng viên</h2>
              <div className="border border-border/60 bg-card rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 shadow-sm">
                <div className="shrink-0 flex flex-col items-center gap-3">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-violet-500/20 bg-violet-100 flex justify-center items-center font-bold text-3xl text-violet-600">
                    {course.instructor.avatar}
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg">
                      {course.instructor.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Chuyên gia hướng dẫn
                    </p>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex gap-4 sm:gap-6 text-sm font-semibold mb-4">
                    <div className="flex flex-col gap-1 text-center items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />{" "}
                      {course.instructor.rating} Đánh giá
                    </div>
                    <div className="flex flex-col gap-1 text-center items-center">
                      <Users className="w-4 h-4 text-blue-500" />{" "}
                      {course.instructor.students.toLocaleString()} Học viên
                    </div>
                    <div className="flex flex-col gap-1 text-center items-center">
                      <PlayCircle className="w-4 h-4 text-green-500" /> 1 Khóa
                      học
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {course.instructor.bio}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── RIGHT STICKY SIDEBAR ─── */}
          <div className="lg:w-[350px]">
            <div className="sticky top-24 lg:-mt-[280px]">
              <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-2xl mb-8">
                {/* Video Header */}
                <div
                  className="aspect-video relative bg-muted flex items-center justify-center cursor-pointer overflow-hidden group"
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                >
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt="Cover"
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-800" />
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-2xl group-hover:bg-violet-600/90 group-hover:border-violet-500 transition-all duration-300">
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                    <p className="text-white font-bold mt-4 tracking-wide shadow-black text-sm">
                      Xem video giới thiệu
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  {/* Pricing */}
                  <div className="flex items-end gap-3 mb-2">
                    <span className="text-4xl font-black text-violet-500">
                      {formatPrice(course.price)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-lg text-muted-foreground line-through decoration-muted-foreground/50">
                      {formatPrice(course.originalPrice)}
                    </span>
                    <span className="text-sm font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md">
                      Giảm {discount}%
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-red-500 flex items-center gap-1.5 mb-6">
                    <Clock className="w-3.5 h-3.5" /> 5 giờ cuối cùng với mức
                    giá này!
                  </p>

                  {/* Buttons */}
                  <div className="space-y-3 mb-4">
                    <Button
                      asChild
                      className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-bold text-base shadow-lg shadow-violet-500/25"
                    >
                      <Link href="/thanh-toan">Đăng Ký Ngay</Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full h-12 font-bold text-base hover:bg-accent border-border/80"
                      disabled={isPending}
                      onClick={() => {
                        addToCart(
                          {
                            itemType: "COURSE",
                            itemId: course.id,
                            quantity: 1,
                          },
                          {
                            onSuccess: () => {
                              toast.success(
                                `Đã thêm ${course.title} vào giỏ hàng`,
                              );
                            },
                          },
                        );
                      }}
                    >
                      {isPending ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                    </Button>
                  </div>
                  <p className="text-[10px] text-center text-muted-foreground mb-8">
                    Cam kết hoàn tiền trong 30 ngày
                  </p>

                  {/* Features */}
                  <div>
                    <h4 className="font-bold text-sm mb-4">
                      Khóa học này bao gồm:
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-sm text-foreground/80">
                        <MonitorPlay className="w-4 h-4 text-muted-foreground" />{" "}
                        {course.duration} video on-demand
                      </li>
                      <li className="flex items-center gap-3 text-sm text-foreground/80">
                        <FileText className="w-4 h-4 text-muted-foreground" />{" "}
                        15 bài báo & tài liệu kĩ thuật
                      </li>
                      <li className="flex items-center gap-3 text-sm text-foreground/80">
                        <Download className="w-4 h-4 text-muted-foreground" />{" "}
                        Tải xuống trọn bộ Prompt chuyên sâu
                      </li>
                      <li className="flex items-center gap-3 text-sm text-foreground/80">
                        <Infinity className="w-4 h-4 text-muted-foreground" />{" "}
                        Quyền truy cập trọn đời
                      </li>
                      <li className="flex items-center gap-3 text-sm text-foreground/80">
                        <Trophy className="w-4 h-4 text-muted-foreground" /> Cấp
                        chứng chỉ hoàn thành
                      </li>
                    </ul>
                  </div>

                  {/* Share */}
                  <div className="flex border-t border-border/60 mt-6 pt-4 gap-4">
                    <button className="flex-1 flex justify-center items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                      <Share className="w-4 h-4" /> Chia sẻ
                    </button>
                    <button className="flex-1 flex justify-center items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                      <Gift className="w-4 h-4" /> Tặng khóa học
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
