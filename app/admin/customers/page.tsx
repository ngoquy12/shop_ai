"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ChevronDown, ChevronUp, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ADMIN_CUSTOMERS, type AdminCustomer } from "@/lib/admin-data"

const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ"
const relDate = (d: string) => {
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
  if (diff === 0) return "Hôm nay"
  if (diff === 1) return "Hôm qua"
  return `${diff} ngày trước`
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>(ADMIN_CUSTOMERS)
  const [search, setSearch] = useState("")
  const [planFilter, setPlanFilter] = useState<"all" | "Free" | "Pro">("all")
  const [sortKey, setSortKey] = useState<"totalSpent" | "orderCount">("totalSpent")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  const filtered = useMemo(() => {
    let list = customers
    if (planFilter !== "all") list = list.filter(c => c.plan === planFilter)
    if (search) list = list.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    )
    return [...list].sort((a, b) => sortDir === "desc" ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey])
  }, [customers, planFilter, search, sortKey, sortDir])

  const togglePlan = (id: string) => setCustomers(prev =>
    prev.map(c => c.id === id ? { ...c, plan: c.plan === "Pro" ? "Free" : "Pro" } : c))
  const toggleStatus = (id: string) => setCustomers(prev =>
    prev.map(c => c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c))

  const proCount = customers.filter(c => c.plan === "Pro").length
  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0)

  const renderSortTh = (k: typeof sortKey, label: string, align = "right") => (
    <th className={`px-4 py-3 text-xs font-bold uppercase tracking-wider text-${align}`}>
      <span onClick={() => { if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortKey(k); setSortDir("desc") } }}
        className={cn("flex items-center gap-1 cursor-pointer select-none", align !== "left" && "justify-end",
          sortKey === k ? "text-white" : "text-[#8b8b9e] hover:text-white transition-colors")}>
        {label}
        {sortKey === k ? sortDir === "desc" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3 opacity-20" />}
      </span>
    </th>
  )

  return (
    <div className="space-y-5 w-full">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Khách hàng</h1>
        <p className="text-sm text-[#8b8b9e] mt-0.5">
          {customers.length} tài khoản · <span className="text-violet-400">{proCount} Pro</span> · Tổng chi tiêu: <span className="text-green-400 font-semibold">{fmt(totalRevenue)}</span>
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Tổng khách hàng", value: customers.length, color: "text-white" },
          { label: "Thành viên Pro", value: proCount, color: "text-violet-400" },
          { label: "Tỷ lệ Pro", value: `${Math.round(proCount / customers.length * 100)}%`, color: "text-blue-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-4">
            <p className={cn("text-2xl font-extrabold", color)}>{value}</p>
            <p className="text-xs text-[#8b8b9e] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8b9e]" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tên, email..." className="pl-9 admin-input h-9" />
        </div>
        {(["all", "Pro", "Free"] as const).map(p => (
          <button key={p} onClick={() => setPlanFilter(p)}
            className={cn("h-9 px-3 rounded-xl text-xs font-semibold border transition-all",
              planFilter === p ? "border-blue-500/50 bg-blue-500/15 text-blue-400" : "border-[rgba(255,255,255,0.08)] text-[#8b8b9e] hover:text-white bg-transparent")}>
            {p === "all" ? "Tất cả" : p}
            <span className="ml-1.5 opacity-60">{p === "all" ? customers.length : customers.filter(c => c.plan === p).length}</span>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#111118] overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col style={{ width: "30%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "15%" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.07)]">
                <th className="text-left px-4 py-3 text-xs font-bold text-[#8b8b9e] uppercase tracking-wider">Khách hàng</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-[#8b8b9e] uppercase tracking-wider">Plan</th>
                {renderSortTh("totalSpent", "Chi tiêu")}
                {renderSortTh("orderCount", "Đơn hàng", "center")}
                <th className="text-left px-4 py-3 text-xs font-bold text-[#8b8b9e] uppercase tracking-wider">Hoạt động</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-[#8b8b9e] uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
              <AnimatePresence>
                {filtered.map(c => (
                  <motion.tr key={c.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="hover:bg-white/3 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={cn("w-9 h-9 rounded-full bg-linear-to-br flex items-center justify-center text-white font-bold text-xs shrink-0", c.color)}>
                          {c.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{c.name}</p>
                          <p className="text-xs text-[#8b8b9e]">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => togglePlan(c.id)}
                        className={cn("inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all",
                          c.plan === "Pro" ? "bg-violet-500/15 text-violet-400 border-violet-500/20 hover:bg-violet-500/25" : "bg-[rgba(255,255,255,0.06)] text-[#8b8b9e] border-[rgba(255,255,255,0.08)] hover:bg-white/10")}>
                        {c.plan === "Pro" && <Sparkles className="w-3 h-3" />}
                        {c.plan}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <p className="font-bold text-white">{c.totalSpent > 0 ? fmt(c.totalSpent) : <span className="text-[#8b8b9e]">—</span>}</p>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-white">{c.orderCount}</td>
                    <td className="px-4 py-3 text-xs text-[#8b8b9e] whitespace-nowrap">
                      <p>Đăng nhập: {relDate(c.lastLogin)}</p>
                      <p className="text-[10px]">Tham gia: {relDate(c.joinedAt)}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleStatus(c.id)}
                        className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all",
                          c.status === "active" ? "bg-green-500/15 text-green-400 border-green-500/20" : "bg-[rgba(255,255,255,0.06)] text-[#8b8b9e] border-[rgba(255,255,255,0.08)]")}>
                        {c.status === "active" ? "Active" : "Inactive"}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-[rgba(255,255,255,0.07)]">
          <p className="text-xs text-[#8b8b9e]">Hiển thị <span className="text-white font-semibold">{filtered.length}</span> / {customers.length} khách hàng</p>
        </div>
      </div>
    </div>
  )
}
