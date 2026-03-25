"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Clock, CheckCircle2, XCircle, Loader2, Package, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ADMIN_ORDERS, type AdminOrder } from "@/lib/admin-data"

function fmt(n: number) { return n.toLocaleString("vi-VN") + "đ" }
function relTime(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 60000
  if (diff < 60) return `${Math.round(diff)} phút trước`
  if (diff < 1440) return `${Math.round(diff / 60)} giờ trước`
  return `${Math.round(diff / 1440)} ngày trước`
}
function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

const STATUS_MAP = {
  pending:    { label: "Chờ xử lý",  cls: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20", icon: Clock },
  processing: { label: "Đang xử lý", cls: "bg-blue-500/15 text-blue-400 border-blue-500/20", icon: Loader2 },
  completed:  { label: "Hoàn thành", cls: "bg-green-500/15 text-green-400 border-green-500/20", icon: CheckCircle2 },
  cancelled:  { label: "Đã hủy",     cls: "bg-red-500/15 text-red-400 border-red-500/20", icon: XCircle },
}

const STATUS_KEYS = Object.keys(STATUS_MAP) as Array<keyof typeof STATUS_MAP>

const TIMELINE: Record<string, { label: string; color: string }[]> = {
  pending:    [{ label: "Đã đặt hàng", color: "bg-green-500" }, { label: "Chờ xác nhận", color: "bg-yellow-500" }],
  processing: [{ label: "Đã đặt hàng", color: "bg-green-500" }, { label: "Đã xác nhận", color: "bg-blue-500" }, { label: "Đang xử lý", color: "bg-blue-400" }],
  completed:  [{ label: "Đã đặt hàng", color: "bg-green-500" }, { label: "Đã xác nhận", color: "bg-blue-500" }, { label: "Đã xử lý", color: "bg-violet-500" }, { label: "Hoàn thành", color: "bg-green-500" }],
  cancelled:  [{ label: "Đã đặt hàng", color: "bg-green-500" }, { label: "Đã hủy", color: "bg-red-500" }],
}

// ─── Order Detail Modal ───────────────────────────────────────────────────
function OrderModal({ order, onClose, onStatusChange }: {
  order: AdminOrder; onClose: () => void
  onStatusChange: (id: string, s: AdminOrder["status"]) => void
}) {
  const st = STATUS_MAP[order.status]
  const timeline = TIMELINE[order.status]

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        className="relative z-10 w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#111118] text-white shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.08)] bg-[#0d0d14]">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Đơn hàng #{order.id}
          </h2>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-[#8b8b9e] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
          {/* Status badge + time */}
          <div className="flex items-center justify-between">
            <span className={cn("text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5", st.cls)}>
              <st.icon className="w-3.5 h-3.5" />
              {st.label}
            </span>
            <span className="text-xs text-[#8b8b9e]">{fmtDate(order.date)}</span>
          </div>

          {/* Timeline */}
          <div className="relative pl-4">
            {timeline.map((step, i) => (
              <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
                <div className={cn("w-2.5 h-2.5 rounded-full shrink-0 -ml-4 relative z-10", step.color)} />
                {i < timeline.length - 1 && <div className="absolute left-[5px] top-3 bottom-0 w-px bg-[rgba(255,255,255,0.08)]" />}
                <span className="text-sm text-white">{step.label}</span>
              </div>
            ))}
          </div>

          {/* Customer info */}
          <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] p-4 space-y-2">
            <p className="text-xs font-bold text-[#8b8b9e] uppercase tracking-wider mb-3">Khách hàng</p>
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-full bg-linear-to-br flex items-center justify-center text-white font-bold text-sm", order.customer.color)}>
                {order.customer.initials}
              </div>
              <div>
                <p className="font-semibold text-white">{order.customer.name}</p>
                <p className="text-xs text-[#8b8b9e]">{order.customer.email}</p>
              </div>
            </div>
            <div className="flex gap-4 pt-1">
              <div className="text-xs text-[#8b8b9e]">Thanh toán: <span className="text-white font-semibold">{order.paymentMethod}</span></div>
            </div>
          </div>

          {/* Order items */}
          <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] overflow-hidden">
            <p className="text-xs font-bold text-[#8b8b9e] uppercase tracking-wider px-4 py-3 border-b border-[rgba(255,255,255,0.07)]">Sản phẩm</p>
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.05)] last:border-0">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{item.name}</p>
                    <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full", item.type === "course" ? "bg-violet-500/20 text-violet-400" : "bg-blue-500/20 text-blue-400")}>
                      {item.type === "course" ? "Khóa học" : "AI Tool"}
                    </span>
                  </div>
                </div>
                <p className="text-sm font-bold text-white">{fmt(item.price)}</p>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-3 bg-[rgba(255,255,255,0.02)]">
              <p className="text-sm font-bold text-white">Tổng cộng</p>
              <p className="text-base font-extrabold text-green-400">{fmt(order.total)}</p>
            </div>
          </div>

          {/* Change status */}
          {order.status !== "completed" && order.status !== "cancelled" && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-[#8b8b9e] uppercase tracking-wider">Đổi trạng thái</p>
              <div className="grid grid-cols-2 gap-2">
                {order.status === "pending" && (
                  <Button onClick={() => { onStatusChange(order.id, "processing"); onClose() }} className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
                    → Đang xử lý
                  </Button>
                )}
                {(order.status === "pending" || order.status === "processing") && (
                  <Button onClick={() => { onStatusChange(order.id, "completed"); onClose() }} className="bg-green-600 hover:bg-green-700 text-white text-sm">
                    ✓ Hoàn thành
                  </Button>
                )}
                <Button onClick={() => { onStatusChange(order.id, "cancelled"); onClose() }} variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent text-sm col-span-1">
                  ✕ Hủy đơn
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(ADMIN_ORDERS)
  const [statusFilter, setStatusFilter] = useState<"all" | AdminOrder["status"]>("all")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<AdminOrder | null>(null)

  const filtered = useMemo(() => {
    let list = orders
    if (statusFilter !== "all") list = list.filter(o => o.status === statusFilter)
    if (search) list = list.filter(o =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase())
    )
    return list
  }, [orders, statusFilter, search])

  const changeStatus = (id: string, status: AdminOrder["status"]) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  const COUNTS = {
    all: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    processing: orders.filter(o => o.status === "processing").length,
    completed: orders.filter(o => o.status === "completed").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  }

  const totalRevenue = orders.filter(o => o.status === "completed").reduce((s, o) => s + o.total, 0)

  return (
    <div className="space-y-5 w-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Đơn hàng</h1>
          <p className="text-sm text-[#8b8b9e] mt-0.5">{orders.length} đơn · Doanh thu hoàn thành: <span className="text-green-400 font-semibold">{fmt(totalRevenue)}</span></p>
        </div>
      </div>

      {/* KPI mini cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {([
          { key: "pending", label: "Chờ xử lý", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
          { key: "processing", label: "Đang xử lý", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
          { key: "completed", label: "Hoàn thành", color: "text-green-400 bg-green-500/10 border-green-500/20" },
          { key: "cancelled", label: "Đã hủy", color: "text-red-400 bg-red-500/10 border-red-500/20" },
        ] as const).map(({ key, label, color }) => (
          <button key={key} onClick={() => setStatusFilter(statusFilter === key ? "all" : key)}
            className={cn("rounded-xl border p-3 text-left transition-all", color, statusFilter === key ? "ring-2 ring-current/30" : "hover:opacity-80")}>
            <p className="text-2xl font-extrabold">{COUNTS[key]}</p>
            <p className="text-xs font-medium opacity-80 mt-0.5">{label}</p>
          </button>
        ))}
      </div>

      {/* Search + status filter tabs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8b9e]" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm mã đơn, khách hàng..." className="pl-9 admin-input h-9" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(["all", ...STATUS_KEYS] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={cn("h-9 px-3 rounded-xl text-xs font-semibold border transition-all",
                statusFilter === s
                  ? "border-blue-500/50 bg-blue-500/15 text-blue-400"
                  : "border-[rgba(255,255,255,0.08)] text-[#8b8b9e] hover:text-white bg-transparent"
              )}>
              {s === "all" ? "Tất cả" : STATUS_MAP[s].label}
              <span className="ml-1.5 opacity-60">{COUNTS[s]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders table */}
      <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#111118] overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "27%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "3%" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.07)]">
                {["Mã đơn", "Thời gian", "Khách hàng", "Sản phẩm", "Tổng tiền", "Thanh toán", "Trạng thái", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-[#8b8b9e] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
              <AnimatePresence>
                {filtered.map(order => {
                  const st = STATUS_MAP[order.status]
                  return (
                    <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="group hover:bg-white/3 transition-colors cursor-pointer" onClick={() => setSelected(order)}>
                      <td className="px-4 py-3 font-mono text-xs text-blue-400 font-semibold">{order.id}</td>
                      <td className="px-4 py-3 text-[#8b8b9e] text-xs whitespace-nowrap">{relTime(order.date)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={cn("w-8 h-8 rounded-full bg-linear-to-br flex items-center justify-center text-white font-bold text-xs shrink-0", order.customer.color)}>
                            {order.customer.initials}
                          </div>
                          <div>
                            <p className="font-medium text-white text-xs">{order.customer.name}</p>
                            <p className="text-[10px] text-[#8b8b9e]">{order.customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {order.items.map((item, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.06)] text-[#8b8b9e]">{item.icon} {item.name}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold text-white whitespace-nowrap">{fmt(order.total)}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.06)] text-[#8b8b9e]">{order.paymentMethod}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 w-fit", st.cls)}>
                          <st.icon className="w-3 h-3" />{st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[#8b8b9e] group-hover:text-white text-xs transition-colors">Chi tiết →</span>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-[#8b8b9e]">
                    <Package className="w-12 h-12 opacity-30" />
                    <p className="font-semibold text-white">Không có đơn hàng</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-[rgba(255,255,255,0.07)]">
          <p className="text-xs text-[#8b8b9e]">Hiển thị <span className="text-white font-semibold">{filtered.length}</span> / {orders.length} đơn hàng</p>
        </div>
      </div>

      {/* Order detail sheet */}
      <AnimatePresence>
        {selected && <OrderModal order={selected} onClose={() => setSelected(null)} onStatusChange={changeStatus} />}
      </AnimatePresence>
    </div>
  )
}
