"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Users, ShoppingBag, DollarSign, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { REVENUE_DATA, CATEGORY_REVENUE, ADMIN_CUSTOMERS, ADMIN_STATS } from "@/lib/admin-data"

const fmt = (n: number) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M đ"
  if (n >= 1000) return (n / 1000).toFixed(0) + "K đ"
  return n.toLocaleString("vi-VN") + "đ"
}
const fmtFull = (n: number) => n.toLocaleString("vi-VN") + "đ"

// ─── Mini SVG Line Chart ───────────────────────────────────────────────────
function MiniChart({ data, color }: { data: number[]; color: string }) {
  const W = 200, H = 50
  const max = Math.max(...data), min = Math.min(...data)
  const px = (i: number) => (i / (data.length - 1)) * W
  const py = (v: number) => H - ((v - min) / (max - min || 1)) * H * 0.9 - 5
  const path = data.map((v, i) => `${i === 0 ? "M" : "L"} ${px(i)} ${py(v)}`).join(" ")
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-8">
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Revenue Chart (30 days) ───────────────────────────────────────────────
function BigRevenueChart() {
  const data = REVENUE_DATA
  const W = 800, H = 200
  const PL = 0, PR = 0, PT = 10, PB = 30
  const cW = W - PL - PR, cH = H - PT - PB
  const maxV = Math.max(...data.map(d => d.revenue))
  const minV = Math.min(...data.map(d => d.revenue)) * 0.7
  const px = (i: number) => PL + (i / (data.length - 1)) * cW
  const py = (v: number) => PT + (1 - (v - minV) / (maxV - minV)) * cH
  const [hov, setHov] = useState<number | null>(null)

  const linePath = data.map((d, i) => {
    if (i === 0) return `M ${px(i)} ${py(d.revenue)}`
    const ppx = px(i - 1), ppy = py(data[i - 1].revenue)
    const cpx = px(i), cpy = py(d.revenue)
    const cp1x = ppx + (cpx - ppx) / 2
    const cp2x = cpx - (cpx - ppx) / 2
    return `C ${cp1x} ${ppy} ${cp2x} ${cpy} ${cpx} ${cpy}`
  }).join(" ")

  const areaPath = `${linePath} L ${px(data.length - 1)} ${PT + cH} L ${px(0)} ${PT + cH} Z`

  return (
    <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-white">Doanh thu 30 ngày</h3>
          <p className="text-xs text-[#8b8b9e] mt-0.5">Tổng: <span className="text-white font-semibold">{fmtFull(data.reduce((s, d) => s + d.revenue, 0))}</span></p>
        </div>
        <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20 font-semibold flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />+12.5%
        </span>
      </div>
      <div className="relative" onMouseLeave={() => setHov(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 200 }}>
          <defs>
            <linearGradient id="anlRevGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75, 1].map(p => (
            <line key={p} x1={PL} y1={PT + (1 - p) * cH} x2={W - PR} y2={PT + (1 - p) * cH}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
          ))}
          <path d={areaPath} fill="url(#anlRevGrad)" />
          <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
          {data.map((d, i) => (
            <g key={i}>
              <rect x={px(i) - (W / data.length) / 2} y={0} width={W / data.length} height={H} fill="transparent" onMouseEnter={() => setHov(i)} />
              {hov === i && (
                <>
                  <line x1={px(i)} y1={PT} x2={px(i)} y2={PT + cH} stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx={px(i)} cy={py(d.revenue)} r={4} fill="#3b82f6" stroke="#09090d" strokeWidth="2" />
                </>
              )}
              {i % 5 === 0 && (
                <text x={px(i)} y={H - 4} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)">{d.date}</text>
              )}
            </g>
          ))}
        </svg>
        {hov !== null && (
          <div className="absolute pointer-events-none z-10 bg-[#1a1a24] border border-[rgba(255,255,255,0.12)] rounded-xl px-3 py-2 shadow-xl text-xs"
            style={{ left: `${(hov / (data.length - 1)) * 100}%`, top: 0, transform: "translateX(-50%)", whiteSpace: "nowrap" }}>
            <p className="text-[#8b8b9e]">{data[hov].date}</p>
            <p className="text-white font-bold">{fmtFull(data[hov].revenue)}</p>
            <p className="text-blue-400">{data[hov].orders} đơn</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const ICONS = { revenue: DollarSign, orders: ShoppingBag, customers: Users, products: Package }
  const COLORS: Record<string, string> = { revenue: "#3b82f6", orders: "#8b5cf6", customers: "#10b981", products: "#f59e0b" }
  const miniData = REVENUE_DATA.slice(-7).map(d => d.revenue)
  const orderMini = REVENUE_DATA.slice(-7).map(d => d.orders)
  const statCards = [
    { key: "revenue", label: ADMIN_STATS.revenue.label, value: fmt(ADMIN_STATS.revenue.value), change: ADMIN_STATS.revenue.change, color: COLORS.revenue },
    { key: "orders", label: ADMIN_STATS.orders.label, value: ADMIN_STATS.orders.value, change: ADMIN_STATS.orders.change, color: COLORS.orders },
    { key: "customers", label: ADMIN_STATS.customers.label, value: ADMIN_STATS.customers.value.toLocaleString(), change: ADMIN_STATS.customers.change, color: COLORS.customers },
    { key: "products", label: ADMIN_STATS.products.label, value: ADMIN_STATS.products.value, change: ADMIN_STATS.products.change, color: COLORS.products },
  ]

  const topCustomers = [...ADMIN_CUSTOMERS].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5)

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Analytics</h1>
        <p className="text-sm text-[#8b8b9e] mt-0.5">Tổng quan hiệu suất hệ thống — tháng 3/2026</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ key, label, value, change, color }, i) => {
          const Icon = ICONS[key as keyof typeof ICONS]
          const up = change >= 0
          return (
            <motion.div key={key} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + "20" }}>
                  <Icon className="w-4.5 h-4.5" style={{ color }} />
                </div>
                <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5",
                  up ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10")}>
                  {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {up ? "+" : ""}{change}%
                </span>
              </div>
              <p className="text-2xl font-extrabold text-white">{value}</p>
              <p className="text-xs text-[#8b8b9e] mt-0.5">{label}</p>
              <MiniChart data={key === "orders" ? orderMini : miniData} color={color} />
            </motion.div>
          )
        })}
      </div>

      {/* Revenue chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <BigRevenueChart />
      </motion.div>

      {/* Category Revenue + Top Customers */}
      <motion.div className="grid lg:grid-cols-2 gap-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        {/* Category breakdown */}
        <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-5">
          <h3 className="font-bold text-white mb-4">Doanh thu theo danh mục</h3>
          <div className="space-y-4">
            {CATEGORY_REVENUE.map(cat => (
              <div key={cat.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white font-medium">{cat.label}</span>
                  <div className="text-right">
                    <span className="text-white font-bold">{fmt(cat.revenue)}</span>
                    <span className="text-[#8b8b9e] text-xs ml-1.5">{cat.pct}%</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-white/8 overflow-hidden">
                  <motion.div className={cn("h-full rounded-full", cat.color)}
                    initial={{ width: 0 }} animate={{ width: `${cat.pct}%` }} transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers */}
        <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-5">
          <h3 className="font-bold text-white mb-4">Khách hàng chi tiêu cao nhất</h3>
          <div className="space-y-3">
            {topCustomers.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3">
                <span className="text-[#4a4a5e] text-xs font-bold w-4">{i + 1}</span>
                <div className={cn("w-8 h-8 rounded-full bg-linear-to-br flex items-center justify-center text-white font-bold text-xs shrink-0", c.color)}>
                  {c.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{c.name}</p>
                  <div className="mt-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                    <motion.div className="h-full rounded-full bg-blue-500"
                      initial={{ width: 0 }} animate={{ width: `${(c.totalSpent / topCustomers[0].totalSpent) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.07, ease: "easeOut" }} />
                  </div>
                </div>
                <p className="text-sm font-bold text-white shrink-0 text-right">
                  {fmt(c.totalSpent)}
                  <span className={cn("block text-[10px] font-normal", c.plan === "Pro" ? "text-violet-400" : "text-[#8b8b9e]")}>{c.plan}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Conversion Stats */}
      <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        {[
          { label: "Tỷ lệ chuyển đổi", value: "4.7%", sub: "Khách thành đơn hàng", color: "text-green-400" },
          { label: "Giá trị đơn TB", value: "141,800đ", sub: "Trung bình tháng này", color: "text-blue-400" },
          { label: "Tỷ lệ hoàn thành", value: "87.5%", sub: "Đơn hàng hoàn thành", color: "text-violet-400" },
          { label: "Tỷ lệ hủy", value: "12.5%", sub: "Đơn hàng bị hủy", color: "text-red-400" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-4">
            <p className={cn("text-2xl font-extrabold", color)}>{value}</p>
            <p className="text-sm font-semibold text-white mt-1">{label}</p>
            <p className="text-xs text-[#8b8b9e] mt-0.5">{sub}</p>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
