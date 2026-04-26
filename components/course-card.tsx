import { useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  BookOpen,
  Star,
  Users,
  Clock,
  Play,
  ChevronRight,
  Trophy,
  Heart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Course } from "@/features/courses/types";

import {
  useFavorites,
  useToggleFavorite,
} from "@/features/favorites/hooks/use-favorites";

export const levelColor: Record<string, string> = {
  "Cơ bản":
    "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20",
  "Trung cấp":
    "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  "Nâng cao": "bg-red-500/15 text-red-500 border-red-500/20",
};

export function fmt(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

export const courseCardVar: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export function CourseCard({ course }: { course: Course }) {
  const { data: favorites } = useFavorites("COURSE");
  const { mutate: toggleFavorite } = useToggleFavorite();

  const isWished = favorites?.some((f) => f.itemId === course.id) || false;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({ itemType: "COURSE", itemId: course.id });
  };

  const discount = Math.round(
    ((course.originalPrice - course.price) / course.originalPrice) * 100,
  );

  return (
    <motion.div
      variants={courseCardVar}
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
        onClick={handleToggleFavorite}
        className={cn(
          "absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200",
          isWished
            ? "bg-red-500 text-white"
            : "bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-red-400",
        )}
        aria-label="Yêu thích"
      >
        <Heart className={cn("w-3.5 h-3.5", isWished && "fill-white")} />
      </motion.button>

      {/* Thumbnail */}
      <Link
        href={`/khoa-hoc-ai/${course.id}`}
        className="relative h-44 bg-linear-to-br from-violet-500/20 via-blue-500/10 to-pink-500/20 flex items-center justify-center overflow-hidden"
      >
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
              levelColor[course.level] || "bg-muted text-muted-foreground",
            )}
          >
            {course.level}
          </Badge>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/khoa-hoc-ai/${course.id}`}>
          <h3 className="font-bold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-violet-400 transition-colors">
            {course.name}
          </h3>
        </Link>
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
            {course.students.toLocaleString("vi-VN")}
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
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 gap-1.5"
              aria-label={`Đăng ký ${course.name}`}
              asChild
            >
              <Link href={`/khoa-hoc-ai/${course.id}`}>
                Đăng ký
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
