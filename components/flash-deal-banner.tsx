"use client";

import { useState, useEffect } from "react";
import { Zap, TrendingDown, ArrowRight, Flame } from "lucide-react"
import Link from "next/link";

// Deal list for the scrolling ticker
const DEALS = [
  {
    tool: "Picsart Workspace AI",
    discount: 17,
    original: 300000,
    sale: 250000,
    hot: true,
  },
  {
    tool: "ChatGPT Plus",
    discount: 30,
    original: 500000,
    sale: 350000,
    hot: true,
  },
  {
    tool: "Midjourney Pro",
    discount: 25,
    original: 800000,
    sale: 600000,
    hot: false,
  },
  {
    tool: "Claude Pro",
    discount: 20,
    original: 450000,
    sale: 360000,
    hot: false,
  },
  {
    tool: "Gemini Advanced",
    discount: 35,
    original: 400000,
    sale: 260000,
    hot: true,
  },
  {
    tool: "Sora AI",
    discount: 15,
    original: 1200000,
    sale: 1020000,
    hot: false,
  },
  {
    tool: "ElevenLabs Creator",
    discount: 28,
    original: 600000,
    sale: 432000,
    hot: true,
  },
  {
    tool: "Grok AI Premium",
    discount: 22,
    original: 350000,
    sale: 273000,
    hot: false,
  },
];

function fmt(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

// Flip number animation digit


// 24h countdown from page load
function useCountdown(targetHours = 24) {
  const [time, setTime] = useState({ h: targetHours, m: 0, s: 0 });

  useEffect(() => {
    const end = Date.now() + targetHours * 60 * 60 * 1000;
    const tick = setInterval(() => {
      const diff = Math.max(0, end - Date.now());
      setTime({
        h: Math.floor(diff / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1_000),
      });
    }, 1_000);
    return () => clearInterval(tick);
  }, [targetHours]);

  return time;
}

export function FlashDealBanner() {
  const time = useCountdown(23)
  const [dismissed, setDismissed] = useState(false)

  const pad = (n: number) => String(n).padStart(2, "0")
  const countdownStr = `${pad(time.h)}:${pad(time.m)}:${pad(time.s)}`

  if (dismissed) return null

  return (
    <div className="relative z-20">
      {/* ── Slim announcement bar ──────────────────────── */}
      <div className="relative overflow-hidden bg-linear-to-r from-red-600 via-orange-500 to-red-500">
        {/* Shimmer */}
        <div className="absolute inset-0 animate-shimmer opacity-30 pointer-events-none" />

        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 flex items-center h-11 gap-3">
          {/* Left: label */}
          <div className="flex items-center gap-2 shrink-0">
            <Zap className="w-3.5 h-3.5 text-white fill-white" />
            <span className="text-white font-bold text-sm hidden sm:block">
              ⚡ Flash Sale hôm nay
            </span>
            <span className="text-white font-bold text-sm sm:hidden">⚡ Flash Sale</span>
            <span className="hidden sm:inline text-white/50 text-sm">·</span>
            <span className="text-white font-extrabold text-sm">Giảm đến 35%</span>
          </div>

          {/* Divider on md+ */}
          <div className="hidden md:block h-4 w-px bg-white/30 mx-1" />

          {/* Countdown inline */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-white/70 text-xs hidden md:block">Kết thúc sau</span>
            <span className="font-mono font-extrabold text-sm text-white tabular-nums tracking-wider bg-black/20 px-2.5 py-0.5 rounded-lg">
              {countdownStr}
            </span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* CTA */}
          <Link
            href="/ai-tools"
            className="hidden sm:inline-flex items-center gap-1.5 shrink-0 text-xs font-bold text-white bg-white/15 hover:bg-white/25 border border-white/25 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Flame className="w-3.5 h-3.5 text-orange-200" />
            Xem deal
            <ArrowRight className="w-3 h-3" />
          </Link>

          {/* Dismiss */}
          <button
            onClick={() => setDismissed(true)}
            className="w-7 h-7 shrink-0 flex items-center justify-center rounded-full hover:bg-white/15 text-white/60 hover:text-white transition-colors ml-1"
            aria-label="Đóng"
          >
            <span className="text-base leading-none">×</span>
          </button>
        </div>
      </div>

      {/* ── Scrolling ticker ──────────────────────────── */}
      <div className="bg-black/80 border-b border-orange-500/20 overflow-hidden h-8 flex items-center">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...DEALS, ...DEALS].map((deal, i) => (
            <div key={i} className="inline-flex items-center gap-2 px-5">
              {deal.hot && (
                <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-orange-500/30 text-orange-300 font-bold">
                  <Flame className="w-2.5 h-2.5" />HOT
                </span>
              )}
              <span className="text-xs text-white/80 font-medium">{deal.tool}</span>
              <span className="text-[11px] text-white/40 line-through">{fmt(deal.original)}</span>
              <span className="text-[11px] text-orange-300 font-bold">{fmt(deal.sale)}</span>
              <span className="inline-flex items-center gap-0.5 text-[9px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded-full font-bold">
                <TrendingDown className="w-2 h-2" />-{deal.discount}%
              </span>
              <span className="text-white/15 mx-1">|</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
