"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp, TrendingDown, ArrowRight, ShoppingBag,
  Users, Package, DollarSign, RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  ADMIN_STATS, REVENUE_DATA, ADMIN_ORDERS, TOP_PRODUCTS,
  type AdminOrder,
} from "@/lib/admin-data"

// ─── Helpers ───────────────────────────────────────────────────────────────
function fmt(n: number) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M đ"
  if (n >= 1000) return (n / 1000).toFixed(0) + "K đ"
  return n.toLocaleString("vi-VN") + "đ"
}
function fmtFull(n: number) { return n.toLocaleString("vi-VN") + "đ" }
function relTime(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 60000
  if (diff < 60) return `${Math.round(diff)} phút trước`
  if (diff < 1440) return `${Math.round(diff / 60)} giờ trước`
  return `${Math.round(diff / 1440)} ngày trước`
}

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending:    { label: "Chờ xử lý",  cls: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" },
  processing: { label: "Đang xử lý", cls: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
  completed:  { label: "Hoàn thành", cls: "bg-green-500/15 text-green-400 border-green-500/20" },
  cancelled:  { label: "Đã hủy",     cls: "bg-red-500/15 text-red-400 border-red-500/20" },
}

// ─── Stat Card ─────────────────────────────────────────────────────────────
function StatCard({
  label, value, change, icon, color, prefix = "",
}: {
  label: string; value: number; change: number; icon: React.ElementType
  color: string; prefix?: string
}) {
  const Icon = icon
  const up = change >= 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="relative rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-5 overflow-hidden group"
    >
      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none", color)} />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color.replace("opacity-0", "opacity-100").split(" ")[0])}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <span className={cn(
            "flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
            up ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10"
          )}>
            {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {up ? "+" : ""}{change}%
          </span>
        </div>
        <p className="text-2xl font-extrabold text-white">
          {prefix}{typeof value === "number" && value > 9999 ? fmt(value) : value.toLocaleString()}
        </p>
        <p className="text-sm text-[#8b8b9e] mt-0.5">{label}</p>
      </div>
    </motion.div>
  )
}

// ─── Revenue Chart (SVG) ───────────────────────────────────────────────────
function RevenueChart() {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const [range, setRange] = useState<7 | 30>(30)
  const data = REVENUE_DATA.slice(-range)

  const W = 700, H = 160
  const PL = 0, PR = 0, PT = 10, PB = 30
  const cW = W - PL - PR, cH = H - PT - PB

  const maxV = Math.max(...data.map((d) => d.revenue))
  const minV = Math.min(...data.map((d) => d.revenue)) * 0.7

  const px = (i: number) => PL + (i / (data.length - 1)) * cW
  const py = (v: number) => PT + (1 - (v - minV) / (maxV - minV)) * cH

  // Smooth cubic bezier path
  const linePath = data
    .map((d, i) => {
      if (i === 0) return `M ${px(i)} ${py(d.revenue)}`
      const ppx = px(i - 1), ppy = py(data[i - 1].revenue)
      const cpx = px(i), cpy = py(d.revenue)
      const cp1x = ppx + (cpx - ppx) / 2
      const cp2x = cpx - (cpx - ppx) / 2
      return `C ${cp1x} ${ppy} ${cp2x} ${cpy} ${cpx} ${cpy}`
    })
    .join(" ")

  const areaPath = `${linePath} L ${px(data.length - 1)} ${PT + cH} L ${px(0)} ${PT + cH} Z`

  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0)
  const totalOrders = data.reduce((s, d) => s + d.orders, 0)

  return (
    <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-white">Doanh thu</h3>
          <p className="text-2xl font-extrabold text-white mt-0.5">
            {fmt(totalRevenue)}
            <span className="text-sm font-normal text-[#8b8b9e] ml-2">{totalOrders} đơn hàng</span>
          </p>
        </div>
        <div className="flex gap-1 p-1 rounded-xl bg-[#0d0d14] border border-[rgba(255,255,255,0.07)]">
          {([7, 30] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                range === r ? "bg-blue-500 text-white" : "text-[#8b8b9e] hover:text-white"
              )}
            >
              {r}N
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ height: 160 }}
          onMouseLeave={() => setHoverIdx(null)}
        >
          <defs>
            <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((pct) => (
            <line
              key={pct}
              x1={PL} y1={PT + (1 - pct) * cH}
              x2={W - PR} y2={PT + (1 - pct) * cH}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4"
            />
          ))}
          {/* Area */}
          <path d={areaPath} fill="url(#adminRevGrad)" />
          {/* Line */}
          <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
          {/* Hover areas + dots */}
          {data.map((d, i) => (
            <g key={i}>
              <rect
                x={px(i) - (W / data.length) / 2} y={0}
                width={W / data.length} height={H}
                fill="transparent"
                onMouseEnter={() => setHoverIdx(i)}
              />
              {hoverIdx === i && (
                <>
                  <line x1={px(i)} y1={PT} x2={px(i)} y2={PT + cH} stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx={px(i)} cy={py(d.revenue)} r={5} fill="#3b82f6" stroke="#09090d" strokeWidth="2" />
                </>
              )}
            </g>
          ))}
          {/* X-axis labels — show every N-th */}
          {data.map((d, i) => {
            const step = range === 30 ? 5 : 1
            if (i % step !== 0 && i !== data.length - 1) return null
            return (
              <text key={i} x={px(i)} y={H - 4} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)">
                {d.date}
              </text>
            )
          })}
        </svg>

        {/* Tooltip */}
        {hoverIdx !== null && (
          <div
            className="absolute pointer-events-none z-10 bg-[#1a1a24] border border-[rgba(255,255,255,0.12)] rounded-xl px-3 py-2 shadow-xl text-xs"
            style={{
              left: `${(hoverIdx / (data.length - 1)) * 100}%`,
              top: 0,
              transform: "translateX(-50%)",
              whiteSpace: "nowrap",
            }}
          >
            <p className="text-[#8b8b9e]">{data[hoverIdx].date}</p>
            <p className="text-white font-bold">{fmtFull(data[hoverIdx].revenue)}</p>
            <p className="text-blue-400">{data[hoverIdx].orders} đơn</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Recent Orders ─────────────────────────────────────────────────────────
function RecentOrders({ orders }: { orders: AdminOrder[] }) {
  return (
    <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#111118] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.07)]">
        <h3 className="font-bold text-white">Đơn hàng gần đây</h3>
        <Link href="/admin/orders" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
          Xem tất cả <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="divide-y divide-[rgba(255,255,255,0.05)]">
        {orders.slice(0, 6).map((order) => {
          const st = STATUS_MAP[order.status]
          return (
            <div key={order.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/3 transition-colors">
              {/* Avatar */}
              <div className={cn("w-9 h-9 rounded-full bg-linear-to-br flex items-center justify-center shrink-0 text-white font-bold text-xs", order.customer.color)}>
                {order.customer.initials}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{order.customer.name}</p>
                <p className="text-xs text-[#8b8b9e] truncate">{order.id} · {relTime(order.date)}</p>
              </div>
              {/* Status */}
              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0", st.cls)}>
                {st.label}
              </span>
              {/* Total */}
              <p className="text-sm font-bold text-white shrink-0 w-28 text-right">{fmtFull(order.total)}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Top Products ──────────────────────────────────────────────────────────
function TopProductsList() {
  const maxRevenue = Math.max(...TOP_PRODUCTS.map((p) => p.revenue))
  return (
    <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#111118] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.07)]">
        <h3 className="font-bold text-white">Sản phẩm bán chạy</h3>
        <Link href="/admin/products" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
          Xem tất cả <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="p-5 space-y-4">
        {TOP_PRODUCTS.map((p, i) => (
          <div key={p.name} className="flex items-center gap-3">
            <span className="text-[#4a4a5e] text-xs font-bold w-4">{i + 1}</span>
            <span className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0", p.color + "/20")}>
              {p.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{p.name}</p>
              <div className="mt-1.5 h-1.5 rounded-full bg-white/8 overflow-hidden">
                <div
                  className={cn("h-full rounded-full", p.color)}
                  style={{ width: `${(p.revenue / maxRevenue) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-bold text-white">{fmt(p.revenue)}</p>
              <p className="text-[10px] text-[#8b8b9e]">{p.sold} đã bán</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Activity Feed ─────────────────────────────────────────────────────────
const ACTIVITIES = [
  { icon: "🛒", text: "Đơn hàng mới #VP-2026-001 — 450,000đ", time: "2 phút", color: "bg-blue-500" },
  { icon: "👤", text: "Khách hàng mới: Trần Minh Khoa đăng ký", time: "8 phút", color: "bg-green-500" },
  { icon: "✅", text: "Đơn #VP-2026-003 hoàn thành thành công", time: "32 phút", color: "bg-emerald-500" },
  { icon: "🔥", text: "Flash Sale kích hoạt — 12 sản phẩm giảm giá", time: "1 giờ", color: "bg-orange-500" },
  { icon: "⭐", text: "Đánh giá 5★ từ Nguyễn Thị Lan", time: "2 giờ", color: "bg-yellow-500" },
]

function ActivityFeed() {
  return (
    <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#111118] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.07)]">
        <h3 className="font-bold text-white">Hoạt động gần đây</h3>
        <button className="text-[#8b8b9e] hover:text-white transition-colors">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="p-4 space-y-3">
        {ACTIVITIES.map((a, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm", a.color + "/20")}>
              {a.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/80 leading-snug">{a.text}</p>
              <p className="text-xs text-[#8b8b9e] mt-0.5">{a.time} trước</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Dashboard Page ────────────────────────────────────────────────────────
export default function DashboardPage() {
  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

  const STAT_CARDS = [
    { label: ADMIN_STATS.revenue.label, value: ADMIN_STATS.revenue.value, change: ADMIN_STATS.revenue.change, icon: DollarSign, color: "bg-blue-500/20 hover:from-blue-500/5 hover:to-transparent bg-gradient-to-br" },
    { label: ADMIN_STATS.orders.label, value: ADMIN_STATS.orders.value, change: ADMIN_STATS.orders.change, icon: ShoppingBag, color: "bg-violet-500/20 hover:from-violet-500/5 hover:to-transparent bg-gradient-to-br" },
    { label: ADMIN_STATS.customers.label, value: ADMIN_STATS.customers.value, change: ADMIN_STATS.customers.change, icon: Users, color: "bg-green-500/20 hover:from-green-500/5 hover:to-transparent bg-gradient-to-br" },
    { label: ADMIN_STATS.products.label, value: ADMIN_STATS.products.value, change: ADMIN_STATS.products.change, icon: Package, color: "bg-orange-500/20 hover:from-orange-500/5 hover:to-transparent bg-gradient-to-br" },
  ]

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Dashboard</h1>
          <p className="text-sm text-[#8b8b9e] mt-0.5">Tổng quan hệ thống VideoPrompt — Cập nhật lúc 25/03/2026</p>
        </div>
        <Link href="/admin/products" className="flex items-center gap-2 h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors">
          Thêm sản phẩm
        </Link>
      </div>

      {/* Stat Cards */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {STAT_CARDS.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} change={s.change} icon={s.icon} color={s.color} />
        ))}
      </motion.div>

      {/* Revenue Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <RevenueChart />
      </motion.div>

      {/* Orders + Top Products + Activity */}
      <motion.div
        className="grid lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="lg:col-span-2">
          <RecentOrders orders={ADMIN_ORDERS} />
        </div>
        <div className="space-y-6">
          <TopProductsList />
          <ActivityFeed />
        </div>
      </motion.div>
    </div>
  )
}
