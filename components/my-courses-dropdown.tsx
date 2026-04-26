"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PlayCircle, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_MY_COURSES = [
  {
    id: "c-1",
    name: "Làm chủ AI Video với VEO3 & Sora",
    progress: 35,
    thumb: "https://images.unsplash.com/photo-1620061546736-2ee2f9abebf9?w=300",
  },
  {
    id: "c-2",
    name: "Midjourney & Stable Diffusion Pro",
    progress: 80,
    thumb: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=300",
  },
];

export function MyCoursesDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      <button
        onMouseEnter={() => setOpen(true)}
        onClick={() => setOpen(!open)}
        className="text-sm font-semibold hover:text-foreground text-muted-foreground transition-colors flex items-center justify-center rounded-lg hover:bg-accent cursor-pointer w-9 h-9 relative"
        aria-label="Khóa học của tôi"
      >
        <BookOpen className="w-4 h-4 text-violet-500" />

        {/* Invisible bridge for hover */}
        <div className="absolute top-full left-0 right-0 h-4 bg-transparent" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-3 w-80 rounded-2xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-3 border-b border-border/40 font-bold text-sm">
              Đang học ({MOCK_MY_COURSES.length})
            </div>

            <div className="max-h-[300px] overflow-y-auto no-scrollbar">
              {MOCK_MY_COURSES.map((course) => (
                <Link
                  key={course.id}
                  href={`/khoa-hoc-ai/${course.id}/learn`}
                  target="_blank"
                  className="flex gap-3 p-3 hover:bg-muted/50 transition-colors border-b border-border/30 last:border-0 group"
                >
                  <div className="w-16 h-12 rounded-lg bg-muted overflow-hidden shrink-0 relative">
                    <Image
                      src={course.thumb}
                      alt="thumnail"
                      width={64}
                      height={48}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                      <PlayCircle className="w-5 h-5 text-white/90 drop-shadow-md" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="text-xs font-bold leading-tight line-clamp-2 mb-1 group-hover:text-violet-400 transition-colors">
                      {course.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-500 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-bold text-muted-foreground w-6 text-right shrink-0">
                        {course.progress}%
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              href="/tai-khoan/courses"
              className="block text-center p-2.5 text-xs font-semibold text-violet-500 hover:bg-violet-500/10 transition-colors bg-muted/20"
            >
              Xem tất cả quá trình học
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
