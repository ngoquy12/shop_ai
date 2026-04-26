"use client";

import { useState } from "react";
import { Star, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  promptId: string;
  onSubmit?: (data: { rating: number; comment: string }) => void;
  isSubmitting?: boolean;
}

export function ReviewForm({
  promptId: _promptId, // eslint-disable-line @typescript-eslint/no-unused-vars
  onSubmit,
  isSubmitting,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit?.({ rating, comment });
  };

  return (
    <div className="bg-card/40 border border-white/5 rounded-2xl p-6 space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight uppercase">
          Đánh giá sản phẩm
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div className="space-y-3">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="group relative"
              >
                <Star
                  className={cn(
                    "w-8 h-8 transition-all duration-200",
                    (hoverRating || rating) >= star
                      ? "text-yellow-400 fill-yellow-400 scale-110"
                      : "text-white/20 group-hover:text-yellow-400/50",
                  )}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-xs text-yellow-400 font-medium">
              {rating}/5 sao
            </p>
          )}
        </div>

        {/* Comment */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-white">
            Nhận xét của bạn
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn với sản phẩm này..."
            rows={4}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all resize-none"
            maxLength={500}
          />
          <p className="text-[10px] text-white/40 text-right">
            {comment.length}/500
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={rating === 0 || isSubmitting}
          className="w-full h-12 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm tracking-widest rounded-xl transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang gửi...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Gửi đánh giá
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
