"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Star,
  Users,
  Clock,
  Play,
  ChevronRight,
  Zap,
  Trophy,
  Heart,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, useInView, type Variants } from "framer-motion";
import { courses, type Course } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useRef } from "react";

const levelColor = {
  "Cơ bản":
    "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20",
  "Trung cấp":
    "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  "Nâng cao": "bg-red-500/15 text-red-500 border-red-500/20",
};

function fmt(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const cardVar: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1 },
};

function CourseCard({ course }: { course: Course }) {
  const [wished, setWished] = useState(false);
  const discount = Math.round(
    ((course.originalPrice - course.price) / course.originalPrice) * 100,
  );

  return (
    <motion.div
      variants={cardVar}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative rounded-2xl border border-border/60 bg-card overflow-hidden hover:border-violet-500/30 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.2)] transition-all duration-300 flex flex-col"
    >
      {/* Bestseller top bar */}
      {course.bestseller && (
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-violet-500 via-pink-500 to-violet-500 origin-left"
        />
      )}

      {/* Wishlist */}
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={() => setWished((w) => !w)}
        className={cn(
          "absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200",
          wished
            ? "bg-red-500 text-white"
            : "bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-red-400",
        )}
        aria-label="Yêu thích"
      >
        <Heart className={cn("w-3.5 h-3.5", wished && "fill-white")} />
      </motion.button>

      {/* Thumbnail */}
      <div className="relative h-44 bg-linear-to-br from-violet-500/20 via-blue-500/10 to-pink-500/20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-violet-900/20 to-blue-900/20" />

        {/* Animated background particles */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-40 h-40 rounded-full border border-white/5"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute w-56 h-56 rounded-full border border-white/5"
        />

        <motion.div
          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.4 }}
          className="relative z-10 text-5xl"
        >
          {course.icon}
        </motion.div>

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.div
            initial={false}
            whileHover={{ scale: 1.1 }}
            className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center"
          >
            <Play className="w-6 h-6 text-white fill-white ml-0.5" />
          </motion.div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 pr-10">
          {course.new && (
            <Badge className="bg-green-500 text-white border-0 text-xs animate-bounce-subtle">
              ✨ Mới
            </Badge>
          )}
          {course.bestseller && (
            <Badge className="bg-orange-500 text-white border-0 text-xs gap-1">
              <Trophy className="w-3 h-3" />
              Bán chạy
            </Badge>
          )}
        </div>

        {/* Level badge */}
        <div className="absolute bottom-3 left-3">
          <Badge
            className={cn(
              "border text-xs font-medium",
              levelColor[course.level],
            )}
          >
            {course.level}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-violet-400 transition-colors">
          {course.name}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3 flex-1">
          {course.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {course.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/50"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4 flex-wrap">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {course.lessons} bài
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {course.students.toLocaleString()}
          </span>
          <span className="flex items-center gap-1 text-yellow-500 font-semibold">
            <Star className="w-3.5 h-3.5 fill-yellow-400" />
            {course.rating}
          </span>
        </div>

        {/* Price + CTA */}
        <div className="pt-4 border-t border-border/50 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground line-through">
              {fmt(course.originalPrice)}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-extrabold text-violet-500">
                {fmt(course.price)}
              </p>
              <Badge className="bg-red-500/15 text-red-500 border-red-500/20 font-bold text-xs">
                -{discount}%
              </Badge>
            </div>
          </div>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              className="bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-500/20 gap-1.5"
              aria-label={`Đăng ký ${course.name}`}
            >
              Đăng ký
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export function CoursesPage() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <motion.div
          animate={{ opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-violet-500 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute top-10 left-1/4 w-[200px] h-[200px] bg-pink-500 rounded-full blur-2xl pointer-events-none"
        />

        <div
          ref={headerRef}
          className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 bg-card text-sm text-muted-foreground mb-6"
          >
            <Zap className="w-4 h-4 text-violet-500" />
            Học AI từ cơ bản đến nâng cao
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4"
          >
            Khóa Học{" "}
            <span className="bg-linear-to-r from-violet-500 to-pink-600 bg-clip-text text-transparent">
              AI Thực Chiến
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-8"
          >
            Nắm vững các công cụ AI hàng đầu. Học từ chuyên gia thực tế. Áp dụng
            ngay vào công việc.
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {[
              "📹 Bài giảng video HD",
              "🕐 Học mọi lúc mọi nơi",
              "💬 Hỗ trợ cộng đồng",
              "🏆 Chứng chỉ hoàn thành",
            ].map((f) => (
              <div
                key={f}
                className="flex items-center gap-1.5 text-sm text-muted-foreground bg-card border border-border/50 rounded-full px-3 py-1.5"
              >
                {f}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <div ref={statsRef} className="bg-card border-y border-border/60 mb-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <motion.div
            className="flex items-center justify-center gap-8 sm:gap-16 flex-wrap"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1 } },
            }}
            initial="hidden"
            animate={statsInView ? "show" : "hidden"}
          >
            {[
              { value: `${courses.length}+`, label: "Khóa học" },
              { value: "7K+", label: "Học viên" },
              { value: "4.8★", label: "Đánh giá" },
              { value: "100+", label: "Giờ nội dung" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: { opacity: 1, y: 0 },
                }}
                className="text-center group cursor-default"
              >
                <p className="text-2xl font-extrabold text-foreground group-hover:text-violet-400 transition-colors">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-2xl font-extrabold">Tất cả khóa học</h2>
            <p className="text-muted-foreground text-sm mt-1">
              {courses.length} khóa học đang có sẵn
            </p>
          </div>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {courses.length} khóa học
          </Badge>
        </motion.div>

        <div ref={gridRef}>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
            variants={stagger}
            initial="hidden"
            animate={gridInView ? "show" : "hidden"}
          >
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16 py-12 rounded-3xl bg-linear-to-br from-violet-500/10 via-blue-500/5 to-pink-500/8 border border-violet-500/20"
        >
          <div className="text-4xl mb-4">🎓</div>
          <h3 className="text-2xl font-extrabold mb-2">
            Chưa tìm được khóa phù hợp?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Liên hệ với chúng tôi để được tư vấn lộ trình học AI phù hợp nhất
            với mục tiêu của bạn.
          </p>
          <div className="flex gap-3 justify-center">
            <Button className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
              <ArrowRight className="w-4 h-4" />
              Tư vấn miễn phí
            </Button>
            <Button variant="outline" asChild>
              <Link href="/ai-tools">Xem AI Tools</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
