"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  HelpCircle,
  Bell,
  Play,
  ThumbsUp,
  Share2,
  ChevronDown,
  ChevronUp,
  FileText,
  MessageCircle,
  PencilLine,
  Info,
  Download,
  Search,
  PlusCircle,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Course } from "@/lib/data";
import { cn } from "@/lib/utils";

const MOCK_CHAPTERS = [
  {
    id: 1,
    title: "Chương 1: Giới thiệu & Cài đặt",
    completed: 3,
    total: 3,
    duration: "45:20",
    lessons: [
      {
        id: "l1",
        title: "1. Giới thiệu về khóa học",
        type: "video",
        time: "14:45",
        isDone: true,
      },
      {
        id: "l2",
        title: "2. Lộ trình Fullstack Web",
        type: "video",
        time: "20:10",
        isDone: true,
      },
      {
        id: "l3",
        title: "3. Tài liệu tham khảo & Tools",
        type: "doc",
        time: "5 phút",
        isDone: true,
      },
    ],
  },
  {
    id: 2,
    title: "Chương 2: HTML & HTML5 Cơ bản",
    completed: 0,
    total: 12,
    duration: "2h 15p",
    lessons: [
      {
        id: "l4",
        title: "1. Cấu trúc HTML đầu tiên",
        type: "video",
        time: "10:20",
        isDone: false,
      },
      {
        id: "l5",
        title: "2. Các thẻ định dạng văn bản",
        type: "video",
        time: "15:45",
        isDone: false,
      },
      {
        id: "l6",
        title: "3. Bài tập thực hành",
        type: "quiz",
        time: "10 câu hỏi",
        isDone: false,
      },
    ],
  },
  {
    id: 3,
    title: "Chương 3: Xây dựng giao diện với AI",
    completed: 0,
    total: 8,
    duration: "1h 30p",
    lessons: [
      {
        id: "l7",
        title: "1. Prompt chuẩn để AI viết code",
        type: "video",
        time: "25:00",
        isDone: false,
      },
      {
        id: "l8",
        title: "2. Chữa lỗi giao diện tự động",
        type: "video",
        time: "18:30",
        isDone: false,
      },
    ],
  },
];

const TABS = [
  { id: "overview", label: "Tổng quan", icon: Info },
  { id: "resources", label: "Tài liệu", icon: FileText },
  { id: "qna", label: "Hỏi đáp (Q&A)", icon: MessageCircle },
  { id: "notes", label: "Ghi chú", icon: PencilLine },
];

export function CourseLearningPage({ course }: { course: Course }) {
  const [activeTab, setActiveTab] = useState("qna");
  const [expandedChaps, setExpandedChaps] = useState<number[]>([1]);
  const [activeLessonId, setActiveLessonId] = useState("l2");

  const toggleChap = (id: number) => {
    if (expandedChaps.includes(id)) {
      setExpandedChaps(expandedChaps.filter((c) => c !== id));
    } else {
      setExpandedChaps([...expandedChaps, id]);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ─── TOP NAVBAR ─── */}
      <header className="sticky top-0 z-50 h-14 bg-[#0f0f10] border-b border-border/40 flex items-center justify-between px-4 shrink-0 text-white">
        <div className="flex items-center gap-4">
          <Link
            href={`/khoa-hoc-ai/${course.id}`}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-6 h-6 bg-violet-600 rounded flex items-center justify-center font-bold text-xs">
              {"</>"}
            </div>
            <h1 className="font-bold text-sm tracking-wide line-clamp-1">
              {course.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden md:flex items-center gap-3 w-48">
            <div className="flex-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-violet-500 transition-all duration-300"
                  style={{ width: "35%" }}
                />
              </div>
            </div>
            <span className="text-[10px] font-semibold whitespace-nowrap text-white/80">
              Tiến độ <span className="text-white">35%</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/support"
              className="text-white/70 hover:text-white transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
            </Link>
            <Link
              href="/tai-khoan/notifications"
              className="text-white/70 hover:text-white transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            </Link>
            <Link
              href="/tai-khoan"
              className="w-8 h-8 rounded-full bg-linear-to-tr from-violet-600 to-pink-500 flex items-center justify-center font-bold text-xs ring-2 ring-white/20 cursor-pointer"
            >
              HP
            </Link>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT COLUMN (Player & Tabs) */}
        <div className="flex-1 overflow-y-auto w-full custom-scrollbar pb-20">
          {/* YOUTUBE PLAYER EMBED */}
          <div className="w-full bg-black aspect-video max-h-[80vh] relative border-b border-border/50">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/oekpJ0irhi4?autoplay=0&rel=0&modestbranding=1"
              title="Khóa học Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>

          <div className="max-w-[1000px] mx-auto px-4 sm:px-8 py-8 w-full">
            {/* Lesson Title header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-2">
                  Bài 2: Hướng dẫn Prompt chuẩn để tạo giao diện tự động
                </h2>
                <p className="text-sm text-muted-foreground">
                  Cập nhật lần cuối: Tháng 03, 2026
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 h-9 border-border/80 rounded-lg"
                >
                  <ThumbsUp className="w-4 h-4" /> Thích
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 h-9 border-border/80 rounded-lg"
                >
                  <Share2 className="w-4 h-4" /> Chia sẻ
                </Button>
              </div>
            </div>

            {/* In-page Tabs */}
            <div className="border-b border-border/60 flex items-center gap-6 sm:gap-8 mb-8 overflow-x-auto no-scrollbar">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "pb-3 text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-colors relative",
                    activeTab === tab.id
                      ? "text-violet-500"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="learning-tab-indicator"
                      className="absolute bottom-0 inset-x-0 h-0.5 bg-violet-500"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            {activeTab === "overview" && (
              <div className="animate-fade-in space-y-6">
                <h3 className="font-bold text-lg">Về bài học này</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Trong bài học này, chúng ta sẽ đi sâu vào kỹ thuật
                  &quot;Role-playing&quot; (đóng vai) kết hợp với cấu trúc
                  prompt 4 yếu tố để yêu cầu AI (như ChatGPT hoặc Claude) viết
                  ra bộ khung giao diện UI hoàn chỉnh sử dụng Tailwind CSS.
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Mục tiêu cuối bài: Bạn có thể tự mình ra lệnh cho AI thiết kế
                  một Landing Page hoàn chỉnh dựa trên ý tưởng từ văn bản trơn
                  mà không cần tự code từng dòng CSS.
                </p>
              </div>
            )}

            {activeTab === "resources" && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-lg mb-1">Tài liệu học tập</h3>
                    <p className="text-sm text-muted-foreground">
                      Các tài nguyên bổ trợ cho bài học này
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-violet-500 font-semibold gap-2 hover:bg-violet-500/10"
                  >
                    <Download className="w-4 h-4" /> Tải tất cả
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center p-4 border border-border/60 rounded-2xl bg-card hover:border-violet-500/30 transition-colors group">
                    <div className="w-12 h-12 bg-red-500/10 text-red-500 flex items-center justify-center rounded-xl mr-4 shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">
                        Slide bài giảng - Chương 1
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span className="uppercase font-bold text-[10px] bg-muted px-1.5 py-0.5 rounded">
                          PDF
                        </span>
                        <span>2.4 MB</span>
                        <span>•</span>
                        <span>Cập nhật ngày hôm qua</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hidden sm:flex gap-2"
                    >
                      <Download className="w-3.5 h-3.5" /> Tải xuống
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="sm:hidden text-violet-500"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center p-4 border border-border/60 rounded-2xl bg-card hover:border-violet-500/30 transition-colors group">
                    <div className="w-12 h-12 bg-blue-500/10 text-blue-500 flex items-center justify-center rounded-xl mr-4 shrink-0">
                      <div className="font-black text-xs">&lt;/&gt;</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">
                        Source Code Mẫu (Starter)
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span className="uppercase font-bold text-[10px] bg-muted px-1.5 py-0.5 rounded">
                          ZIP
                        </span>
                        <span>1.1 MB</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hidden sm:flex gap-2"
                    >
                      <Download className="w-3.5 h-3.5" /> Tải xuống
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="sm:hidden text-violet-500"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "qna" && (
              <div className="animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm câu hỏi trong bài học này..."
                      className="pl-9 h-11 rounded-xl bg-muted/50 border-transparent focus-visible:bg-background"
                    />
                  </div>
                  <Button className="h-11 rounded-xl bg-violet-600 hover:bg-violet-700 shadow-md gap-2 font-bold px-6">
                    <PlusCircle className="w-4 h-4" /> Đặt câu hỏi
                  </Button>
                </div>

                <div className="flex items-center justify-between text-sm font-medium mb-6 text-muted-foreground">
                  <span>24 thảo luận • 8 chưa trả lời</span>
                  <select className="bg-transparent border-0 font-bold text-foreground focus:ring-0 cursor-pointer">
                    <option>Mới nhất</option>
                    <option>Phổ biến</option>
                    <option>Chưa trả lời</option>
                  </select>
                </div>

                <div className="space-y-6">
                  {/* QA Item */}
                  <div className="border-b border-border/40 pb-6">
                    <div className="flex gap-4">
                      <Image
                        src="https://i.pravatar.cc/150?img=1"
                        alt="Avatar"
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-sm">
                            Cường Bùi{" "}
                            <span className="bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded text-[10px] ml-2">
                              HỌC VIÊN
                            </span>
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            2 giờ trước
                          </span>
                        </div>
                        <h5 className="font-bold text-base mb-2">
                          Cho mình hỏi về cách setup plugin cho Tailwind?
                        </h5>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                          Anh cho em hỏi đoạn 12:45 anh có thêm plugin
                          `tailwind-scrollbar` vào file config nhưng em chạy npm
                          install báo lỗi dependency conflict thì xử lý sao ạ?
                        </p>
                        <div className="flex items-center gap-4 text-xs font-semibold">
                          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-violet-500 transition-colors">
                            <span className="w-5 h-5 rounded bg-muted flex items-center justify-center">
                              12
                            </span>{" "}
                            Upvote
                          </button>
                          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-violet-500 transition-colors">
                            <MessageCircle className="w-4 h-4" /> 1 Trả lời
                          </button>
                        </div>

                        {/* Reply */}
                        <div className="mt-4 bg-muted/30 rounded-2xl p-4 flex gap-3 border border-border/50">
                          <Image
                            src="https://i.pravatar.cc/150?img=11"
                            alt="Author"
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full shrink-0 border border-violet-500/50"
                          />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-sm text-violet-500">
                                Hoàng Phương{" "}
                                <span className="bg-violet-500/10 text-violet-500 px-1.5 py-0.5 rounded text-[10px]">
                                  GIẢNG VIÊN
                                </span>
                              </h4>
                              <span className="text-[10px] text-muted-foreground">
                                1 giờ trước
                              </span>
                            </div>
                            <p className="text-sm text-foreground/90 leading-relaxed">
                              Chào Cường, e thư thêm flag `--legacy-peer-deps`
                              vào lệnh cài đặt nhé. VD: `npm i
                              tailwind-scrollbar --legacy-peer-deps`. Do version
                              React e dùng có thể cao hơn yêu cầu của plugin!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notes" && (
              <div className="animate-fade-in w-full max-w-2xl">
                <div className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm mb-8 focus-within:border-violet-500/50 focus-within:ring-1 focus-within:ring-violet-500/50 transition-all">
                  <div className="bg-muted px-4 py-2 border-b border-border/50 flex justify-between items-center text-xs font-semibold text-muted-foreground">
                    <span className="flex items-center gap-2 px-2 py-1 rounded bg-background">
                      <Play className="w-3 h-3 text-violet-500" /> Tạo ghi chú ở
                      06:45
                    </span>
                  </div>
                  <textarea
                    placeholder="Ghi chú lại kiến thức quan trọng..."
                    className="w-full h-32 bg-transparent resize-none p-4 focus:outline-none text-sm"
                  />
                  <div className="flex justify-end p-3 border-t border-border/50 bg-muted/30">
                    <Button size="sm" className="bg-violet-600 font-bold px-6">
                      Lưu
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-sm mb-4">
                    Các ghi chú của bạn (1)
                  </h4>
                  <div className="flex gap-4 p-4 border border-border/40 rounded-xl bg-card hover:bg-muted/20 transition-colors">
                    <button className="shrink-0 mt-0.5 px-2 py-1 rounded bg-violet-500/10 text-violet-500 text-xs font-mono font-bold hover:bg-violet-500 hover:text-white transition-colors h-fit">
                      12:30
                    </button>
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-relaxed">
                        Luôn nhớ thêm directive &quot;use client&quot; ở
                        component có sử dụng state, effect nha.
                      </p>
                      <div className="flex gap-3 mt-3 text-xs text-muted-foreground font-semibold">
                        <button className="hover:text-foreground">Sửa</button>
                        <button className="hover:text-red-500">Xóa</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR (Curriculum) */}
        <div className="lg:w-[380px] xl:w-[420px] bg-card border-l border-border/60 flex flex-col shrink-0 min-h-[500px]">
          <div className="p-5 border-b border-border/60">
            <h2 className="font-bold text-lg mb-4">Nội dung khóa học</h2>
            <div className="flex items-center gap-4 text-xs font-bold bg-muted p-2 rounded-xl text-center">
              <div className="flex-1 border-r border-border/80 text-foreground">
                <span className="text-sm mr-1">12</span> chương
              </div>
              <div className="flex-1 border-r border-border/80 text-foreground">
                <span className="text-sm mr-1">145</span> bài
              </div>
              <div className="flex-1 text-muted-foreground whitespace-nowrap">
                48h 30p
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
            {MOCK_CHAPTERS.map((chap, idx) => (
              <div
                key={chap.id}
                className="border-b last:border-0 border-border/60"
              >
                <button
                  onClick={() => toggleChap(chap.id)}
                  className="w-full p-4 text-left transition-colors hover:bg-muted/40"
                >
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-wider">
                    Chương {idx + 1}
                  </p>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-bold text-sm leading-snug">
                      {chap.title.split(": ")[1]}
                    </h3>
                    {expandedChaps.includes(chap.id) ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-[10px] font-semibold text-muted-foreground">
                    <span
                      className={cn(
                        chap.completed === chap.total
                          ? "bg-green-500/10 text-green-500 px-1 rounded-sm"
                          : "",
                      )}
                    >
                      {chap.completed}/{chap.total} Hoàn thành
                    </span>
                    <span>•</span>
                    <span>{chap.duration}</span>
                  </div>
                </button>

                <AnimatePresence>
                  {expandedChaps.includes(chap.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-background"
                    >
                      <div className="py-2">
                        {chap.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            onClick={() => setActiveLessonId(lesson.id)}
                            className={cn(
                              "flex gap-3 px-4 py-3 cursor-pointer transition-colors relative group",
                              activeLessonId === lesson.id
                                ? "bg-violet-500/5 text-violet-500"
                                : "hover:bg-muted/50 text-foreground",
                            )}
                          >
                            {activeLessonId === lesson.id && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500" />
                            )}

                            <div className="shrink-0 mt-0.5">
                              {lesson.isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500 fill-green-500/20" />
                              ) : activeLessonId === lesson.id ? (
                                <Circle className="w-4 h-4 text-violet-500 fill-violet-500/20 border-[3px] border-violet-500 rounded-full" />
                              ) : (
                                <Circle className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p
                                className={cn(
                                  "text-sm font-semibold mb-1 line-clamp-2",
                                  activeLessonId !== lesson.id &&
                                    "text-foreground/90 group-hover:text-foreground",
                                )}
                              >
                                {lesson.title}
                              </p>
                              <div
                                className={cn(
                                  "flex items-center gap-1.5 text-[11px] font-medium",
                                  activeLessonId === lesson.id
                                    ? "text-violet-500/80"
                                    : "text-muted-foreground",
                                )}
                              >
                                {lesson.type === "video" && (
                                  <Play className="w-3 h-3" />
                                )}
                                {lesson.type === "doc" && (
                                  <FileText className="w-3 h-3" />
                                )}
                                {lesson.title.includes("Trắc nghiệm") && (
                                  <HelpCircle className="w-3 h-3" />
                                )}
                                <span>
                                  {lesson.type === "video"
                                    ? "Video"
                                    : lesson.type === "doc"
                                      ? "Bài đọc"
                                      : "Quiz"}
                                </span>
                                <span>•</span>
                                <span>{lesson.time}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
