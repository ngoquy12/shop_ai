"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Search, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, useInView } from "framer-motion";
import { useCourses } from "@/features/courses/hooks/use-courses";
import { cn } from "@/lib/utils";
import { CourseCard } from "@/components/course-card";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("Tất cả");

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

  const { data: coursesData, isLoading, error } = useCourses();
  const courses = useMemo(() => coursesData?.data || [], [coursesData?.data]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchSearch =
        (course.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (course.description?.toLowerCase() || "").includes(
          searchTerm.toLowerCase(),
        ) ||
        (course.tags || []).some((t) =>
          t.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      const matchLevel =
        selectedLevel === "Tất cả" || course.level === selectedLevel;
      return matchSearch && matchLevel;
    });
  }, [searchTerm, selectedLevel, courses]);

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
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8"
        >
          <div>
            <h2 className="text-2xl font-extrabold mb-1">Tất cả khóa học</h2>
            <p className="text-muted-foreground text-sm">
              Tìm thấy {filteredCourses.length} khóa học
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Filter by Level */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              {["Tất cả", "Cơ bản", "Trung cấp", "Nâng cao"].map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={cn(
                    "whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border",
                    selectedLevel === level
                      ? "bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-500/20"
                      : "bg-card border-border/60 text-muted-foreground hover:text-foreground md:hover:border-violet-500/30",
                  )}
                >
                  {level}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm tên tác giả, lĩnh vực..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 w-full rounded-xl bg-card border-border/60 focus-visible:ring-violet-500/40"
              />
            </div>
          </div>
        </motion.div>

        <div ref={gridRef}>
          {isLoading ? (
            <div className="text-center py-20 bg-card rounded-3xl border border-border/50">
              <div className="text-5xl mb-4">⏳</div>
              <h3 className="text-xl font-bold mb-2">Đang tải khóa học...</h3>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-card rounded-3xl border border-border/50">
              <div className="text-5xl mb-4">❌</div>
              <h3 className="text-xl font-bold mb-2">Lỗi tải dữ liệu</h3>
              <p className="text-muted-foreground">
                Không thể tải danh sách khóa học. Vui lòng thử lại sau.
              </p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl border border-border/50">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">
                Không tìm thấy khóa học nào
              </h3>
              <p className="text-muted-foreground">
                Thử đổi từ khóa hoặc bộ lọc khác xem sao nhé.
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              variants={stagger}
              initial="hidden"
              animate={gridInView ? "show" : "hidden"}
            >
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </motion.div>
          )}
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
              <Link href="/cong-cu-ai">Xem Công cụ AI</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
