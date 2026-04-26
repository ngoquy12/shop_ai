"use client";

import { useState, useEffect, useCallback } from "react";
import { ShoppingCart, Star, Eye, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "purchase" | "view" | "review";

interface FomoToast {
  id: number;
  type: ToastType;
  name: string;
  location: string;
  tool: string;
  time: string;
  avatar: string;
  rating?: number;
}

const FOMO_EVENTS: Omit<FomoToast, "id">[] = [
  {
    type: "purchase",
    name: "Minh T.",
    location: "Hà Nội",
    tool: "Picsart Workspace AI",
    time: "2 phút trước",
    avatar: "M",
  },
  {
    type: "view",
    name: "34 người",
    location: "đang xem",
    tool: "ChatGPT Plus",
    time: "ngay lúc này",
    avatar: "👀",
  },
  {
    type: "purchase",
    name: "Lan N.",
    location: "TP.HCM",
    tool: "Midjourney Pro",
    time: "5 phút trước",
    avatar: "L",
  },
  {
    type: "review",
    name: "Hùng P.",
    location: "Đà Nẵng",
    tool: "Sora AI",
    time: "12 phút trước",
    avatar: "H",
    rating: 5,
  },
  {
    type: "purchase",
    name: "Thu H.",
    location: "Cần Thơ",
    tool: "Claude Pro",
    time: "7 phút trước",
    avatar: "T",
  },
  {
    type: "purchase",
    name: "Dũng K.",
    location: "Hải Phòng",
    tool: "Gemini Advanced",
    time: "15 phút trước",
    avatar: "D",
  },
  {
    type: "view",
    name: "21 người",
    location: "đang xem",
    tool: "Grok AI",
    time: "ngay lúc này",
    avatar: "👀",
  },
  {
    type: "review",
    name: "Phong V.",
    location: "Bình Dương",
    tool: "ElevenLabs",
    time: "20 phút trước",
    avatar: "P",
    rating: 5,
  },
];

const avatarColors = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-pink-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-red-500",
  "bg-yellow-500",
];

function getIcon(type: ToastType) {
  if (type === "purchase")
    return <ShoppingCart className="w-3.5 h-3.5 text-green-400" />;
  if (type === "view") return <Eye className="w-3.5 h-3.5 text-blue-400" />;
  return <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />;
}

function getBg(type: ToastType) {
  if (type === "purchase") return "border-green-500/20 bg-green-500/5";
  if (type === "view") return "border-blue-500/20 bg-blue-500/5";
  return "border-yellow-500/20 bg-yellow-500/5";
}

function getLabel(type: ToastType) {
  if (type === "purchase") return "vừa mua";
  if (type === "view") return "đang xem";
  return "đánh giá 5⭐";
}

export function FomoToasts() {
  const [toasts, setToasts] = useState<(FomoToast & { leaving?: boolean })[]>(
    [],
  );
  const [index, setIndex] = useState(0);

  const addToast = useCallback(() => {
    const event = FOMO_EVENTS[index % FOMO_EVENTS.length];
    const newToast: FomoToast = { ...event, id: Date.now() };
    setToasts((prev) => [...prev.slice(-2), newToast]);
    setIndex((i) => i + 1);
  }, [index]);

  useEffect(() => {
    const initial = setTimeout(addToast, 3000);
    return () => clearTimeout(initial);
  }, [addToast]);

  useEffect(() => {
    if (toasts.length === 0) return;
    const interval = setInterval(addToast, 7000);
    return () => clearInterval(interval);
  }, [toasts.length, addToast]);

  const dismiss = (id: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)),
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 350);
  };

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      if (toasts.length > 0) {
        dismiss(toasts[0].id);
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, [toasts]);

  return (
    <div
      className="fixed bottom-6 left-4 sm:left-6 z-50 flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast, i) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl max-w-[280px] sm:max-w-[320px]",
            "bg-background/90",
            getBg(toast.type),
            toast.leaving ? "animate-toast-out" : "animate-toast-in",
            i === 0 && toasts.length > 1
              ? "opacity-60 scale-95 translate-y-1"
              : "",
          )}
          style={{ transformOrigin: "bottom left" }}
        >
          {/* Avatar */}
          <div
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0",
              toast.type === "view"
                ? "bg-blue-500/20 text-xl"
                : avatarColors[(toast.id ?? 0) % avatarColors.length],
            )}
          >
            {toast.type === "view" ? toast.avatar : toast.avatar}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              {getIcon(toast.type)}
              <span className="text-xs font-semibold text-foreground truncate">
                {toast.name}
              </span>
              {toast.location && toast.type !== "view" && (
                <span className="text-[10px] text-muted-foreground">
                  • {toast.location}
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground leading-tight">
              <span className="text-foreground font-medium">
                {getLabel(toast.type)}
              </span>{" "}
              <span className="text-violet-400 font-medium truncate">
                {toast.tool}
              </span>
            </p>
            <p className="text-[10px] text-muted-foreground/70 mt-0.5">
              {toast.time}
            </p>
          </div>

          {/* Dismiss */}
          <button
            onClick={() => dismiss(toast.id)}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
