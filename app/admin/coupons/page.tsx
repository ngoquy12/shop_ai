"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, Edit2, Trash2, Tag, Copy, X, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ"

type Coupon = {
  id: string; code: string; type: "percent" | "fixed";
  value: number; usageLimit: number | null; usageCount: number;
  expiresAt: string | null; status: "active" | "inactive";
}

const MOCK_COUPONS: Coupon[] = [
  { id: "1", code: "WELCOME20", type: "percent", value: 20, usageLimit: 100, usageCount: 45, expiresAt: "2026-12-31T23:59:00", status: "active" },
  { id: "2", code: "FLASHSALE", type: "percent", value: 40, usageLimit: 50, usageCount: 50, expiresAt: "2026-03-31T23:59:00", status: "inactive" },
  { id: "3", code: "MINUS50K", type: "fixed", value: 50000, usageLimit: null, usageCount: 154, expiresAt: null, status: "active" },
  { id: "4", code: "VIPMEMBER", type: "percent", value: 15, usageLimit: 200, usageCount: 12, expiresAt: "2026-06-30T23:59:00", status: "active" },
]

const EMPTY: Omit<Coupon, "id" | "usageCount"> = {
  code: "", type: "percent", value: 0, usageLimit: null, expiresAt: null, status: "active"
}

function CouponModal({ open, coupon, onClose, onSave }: {
  open: boolean; coupon: Coupon | null; onClose: () => void; onSave: (c: Omit<Coupon, "id" | "usageCount">) => void
}) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (open) setTimeout(() => setForm(coupon ? { ...coupon } : { ...EMPTY }), 0)
  }, [open, coupon])

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm(f => ({ ...f, [k]: v }))

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="relative z-10 w-full max-w-lg flex flex-col rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#111118] text-white shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.08)] bg-[#0d0d14]">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-400" />
                {coupon ? "Sửa mã giảm giá" : "Tạo mã giảm giá"}
              </h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-[#8b8b9e] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <Label className="text-[#8b8b9e] text-xs uppercase font-bold tracking-wider">Mã Coupon</Label>
                  <Input value={form.code} onChange={e => set("code", e.target.value.toUpperCase().replace(/\s/g, ""))} 
                    className="admin-input font-mono text-base tracking-widest text-orange-400 font-bold uppercase" placeholder="HÈ2026..." />
                </div>
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <Label className="text-[#8b8b9e] text-xs uppercase font-bold tracking-wider">Trạng thái</Label>
                  <select value={form.status} onChange={e => set("status", e.target.value as "active" | "inactive")}
                    className="w-full h-10 px-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-sm text-white focus:outline-none focus:border-blue-500/50">
                    <option value="active" className="bg-[#111118]">Hoạt động</option>
                    <option value="inactive" className="bg-[#111118]">Đã ẩn / Tạm ngưng</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 align-top">
                  <Label className="text-[#8b8b9e] text-xs uppercase font-bold tracking-wider">Hình thức giảm</Label>
                  <div className="flex gap-2 p-1 bg-[rgba(255,255,255,0.03)] rounded-xl border border-[rgba(255,255,255,0.08)] h-10">
                    <button type="button" onClick={() => set("type", "percent")} className={cn("flex-1 rounded-lg text-xs font-bold transition-colors", form.type === "percent" ? "bg-white/10 text-white" : "text-[#8b8b9e] hover:text-white")}>% Phần trăm</button>
                    <button type="button" onClick={() => set("type", "fixed")} className={cn("flex-1 rounded-lg text-xs font-bold transition-colors", form.type === "fixed" ? "bg-white/10 text-white" : "text-[#8b8b9e] hover:text-white")}>Tiền mặt</button>
                  </div>
                </div>
                <div className="space-y-1.5 align-top">
                  <Label className="text-[#8b8b9e] text-xs uppercase font-bold tracking-wider">Mức giảm</Label>
                  <div className="relative">
                    <Input type="number" min={0} value={form.value || ""} onChange={e => set("value", Number(e.target.value))} className="admin-input pr-10 font-bold" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b8b9e] text-xs font-bold">{form.type === "percent" ? "%" : "VNĐ"}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[#8b8b9e] text-xs uppercase font-bold tracking-wider">Hạn sử dụng (Không bắt buộc)</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8b9e]" />
                    <Input type="datetime-local" value={form.expiresAt || ""} onChange={e => set("expiresAt", e.target.value || null)} className="admin-input pl-9 text-xs" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#8b8b9e] text-xs uppercase font-bold tracking-wider">Lượt dùng tối đa</Label>
                  <Input type="number" min={1} value={form.usageLimit || ""} onChange={e => set("usageLimit", e.target.value ? Number(e.target.value) : null)} placeholder="Không giới hạn" className="admin-input" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-[rgba(255,255,255,0.08)] bg-[#0d0d14]">
              <Button variant="ghost" onClick={onClose} className="hover:bg-white/5 text-white">Hủy</Button>
              <Button onClick={() => { onSave(form); onClose() }} disabled={!form.code || !form.value} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20">
                Lưu Coupon
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default function CouponsPage() {
  const [data, setData] = useState<Coupon[]>(MOCK_COUPONS)
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<Coupon | null>(null)

  const [now, setNow] = useState(Date.now)
  
  useEffect(() => {
    const timer = setTimeout(() => setNow(Date.now()), 0)
    return () => clearTimeout(timer)
  }, [])

  const filtered = useMemo(() => {
    return data.filter(c => c.code.toLowerCase().includes(search.toLowerCase()))
  }, [data, search])

  const handleSave = (c: Omit<Coupon, "id" | "usageCount">) => {
    if (selected) {
      setData(prev => prev.map(item => item.id === selected.id ? { ...item, ...c } : item))
    } else {
      setData(prev => [{ ...c, id: Date.now().toString(), usageCount: 0 } as Coupon, ...prev])
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Chắc chắn xóa voucher này?")) setData(prev => prev.filter(c => c.id !== id))
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    // alert("Đã copy: " + code)
  }

  return (
    <div className="space-y-5 w-full">
      <div className="flex max-sm:flex-col sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            Mã giảm giá
          </h1>
          <p className="text-sm text-[#8b8b9e] mt-0.5">Tạo và quản lý các loại coupon ưu đãi</p>
        </div>
        <div className="flex gap-3">
          <div className="relative max-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8b9e]" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm mã..." className="pl-9 admin-input h-10" />
          </div>
          <Button onClick={() => { setSelected(null); setModalOpen(true) }} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-semibold shadow-lg shadow-blue-500/20">
            <Plus className="w-4 h-4" /> Tạo mã
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map(c => {
            const isLimitReached = c.usageLimit !== null && c.usageCount >= c.usageLimit
            const isExpired = c.expiresAt && new Date(c.expiresAt).getTime() < now
            const isActive = c.status === "active" && !isLimitReached && !isExpired

            return (
              <motion.div key={c.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className={cn("rounded-2xl border bg-[#111118] p-5 relative overflow-hidden group transition-colors", 
                  isActive ? "border-[rgba(255,255,255,0.08)] hover:border-blue-500/30" : "border-red-500/10 opacity-70")}>
                
                {/* Decorative circle */}
                <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full border-10 border-dashed border-[rgba(255,255,255,0.03)] opacity-50 group-hover:rotate-12 transition-transform duration-500" />
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <div onClick={() => copyCode(c.code)} className="px-3 py-1 bg-white/5 border border-[rgba(255,255,255,0.1)] rounded-lg font-mono text-base font-bold text-orange-400 cursor-copy hover:bg-white/10 transition-colors flex items-center gap-2" title="Copy code">
                      {c.code}
                      <Copy className="w-3 h-3 opacity-50" />
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => { setSelected(c); setModalOpen(true) }} className="w-7 h-7 rounded-md flex items-center justify-center bg-[rgba(255,255,255,0.05)] text-[#8b8b9e] hover:text-white hover:bg-white/10 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(c.id)} className="w-7 h-7 rounded-md flex items-center justify-center bg-red-500/10 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

                <div className="flex flex-col gap-1 mb-6 relative z-10">
                  <p className="text-3xl font-extrabold text-white">
                    {c.type === "percent" ? `Giảm ${c.value}%` : `-${fmt(c.value)}`}
                  </p>
                  <p className="text-xs text-[#8b8b9e]">
                    Đã dùng: <strong className="text-white">{c.usageCount}</strong> {c.usageLimit ? `/ ${c.usageLimit}` : "(Không giới hạn)"}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold relative z-10">
                  <span className={cn("px-2.5 py-1 rounded-md border backdrop-blur-md", isActive ? "bg-green-500/15 text-green-400 border-green-500/20" : isLimitReached ? "bg-red-500/15 text-red-400 border-red-500/20" : isExpired ? "bg-orange-500/15 text-orange-400 border-orange-500/20" : "bg-[rgba(255,255,255,0.05)] text-[#8b8b9e] border-[rgba(255,255,255,0.1)]")}>
                    {isActive ? "Đang chạy" : isLimitReached ? "Hết lượt" : isExpired ? "Hết hạn" : "Đã tạm dừng"}
                  </span>
                  
                  {c.expiresAt && (
                    <span className="text-[#8b8b9e] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      HSD: {new Date(c.expiresAt).toLocaleDateString("vi-VN")}
                    </span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 rounded-2xl border border-[rgba(255,255,255,0.05)] border-dashed">
          <p className="text-[#8b8b9e]">Không tìm thấy mã giảm giá nào phù hợp.</p>
        </div>
      )}

      <CouponModal open={modalOpen} coupon={selected} onClose={() => setModalOpen(false)} onSave={handleSave} />
    </div>
  )
}
