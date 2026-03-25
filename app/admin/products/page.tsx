"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, Search, Edit2, Trash2,
  TrendingDown, Flame, CheckCircle2, XCircle, ChevronUp,
  ChevronDown, Download, Eye, ToggleLeft, ToggleRight, X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { ADMIN_PRODUCTS, type AdminProduct } from "@/lib/admin-data"
import { aiToolCategories } from "@/lib/data"

// ─── Utils ─────────────────────────────────────────────────────────────────
function fmt(n: number) { return n.toLocaleString("vi-VN") + "đ" }

const STATUS_CLS = {
  active: "bg-green-500/15 text-green-400 border-green-500/20",
  inactive: "bg-[rgba(255,255,255,0.06)] text-[#8b8b9e] border-[rgba(255,255,255,0.08)]",
}

const PRESET_COLORS = [
  "#E91E8C","#10a37f","#4285F4","#6C47FF","#1a1a2e",
  "#CC785C","#FF4D4D","#FF6B35","#20B2AA","#FF0000",
  "#8B5CF6","#F59E0B","#10B981","#EF4444","#3B82F6",
]

// ─── SortIcon (must be top-level, not defined inside render) ─────────────────
function SortIcon({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  if (!active) return <ChevronDown className="w-3 h-3 opacity-20" />
  return dir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
}

// ─── Empty Form ─────────────────────────────────────────────────────────────
const EMPTY_FORM: Omit<AdminProduct, "id" | "createdAt"> = {
  name: "", category: "video", description: "", tags: [],
  originalPrice: 0, salePrice: 0, discount: 0,
  hot: false, icon: "N", bgColor: "#3B82F6",
  soldCount: 0, externalUrl: "", status: "active",
}

// ─── Tag Input ─────────────────────────────────────────────────────────────
function TagInput({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [input, setInput] = useState("")
  const add = () => {
    const v = input.trim()
    if (v && !tags.includes(v)) onChange([...tags, v])
    setInput("")
  }
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="Nhập tag, nhấn Enter..."
          className="admin-input h-9 text-sm"
        />
        <Button type="button" size="sm" onClick={add} className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-3">
          Thêm
        </Button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span key={t} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/20 text-blue-400">
            {t}
            <button onClick={() => onChange(tags.filter((x) => x !== t))} className="ml-0.5 hover:text-blue-200">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Color Picker ─────────────────────────────────────────────────────────
function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {PRESET_COLORS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className={cn(
            "w-7 h-7 rounded-lg border-2 transition-all",
            value === c ? "border-white scale-110" : "border-transparent hover:scale-105"
          )}
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
  )
}

// ─── Product Form Sheet ─────────────────────────────────────────────────────
function ProductSheet({
  open, onClose, product, onSave,
}: {
  open: boolean; onClose: () => void
  product: AdminProduct | null; onSave: (p: AdminProduct) => void
}) {
  const [form, setForm] = useState<Omit<AdminProduct, "id" | "createdAt">>(
    product ? { ...product } : { ...EMPTY_FORM }
  )

  const isEdit = !!product

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) => {
    setForm((f) => {
      const next = { ...f, [k]: v }
      if (k === "originalPrice" || k === "salePrice") {
        const disc = next.originalPrice > 0
          ? Math.round((1 - next.salePrice / next.originalPrice) * 100)
          : 0
        next.discount = disc
      }
      return next
    })
  }

  const handleSave = () => {
    const now = new Date().toISOString().split("T")[0]
    onSave({
      ...form,
      id: product?.id ?? String(Date.now()),
      createdAt: product?.createdAt ?? now,
    })
    onClose()
  }

  const categories = aiToolCategories.filter((c) => c.id !== "all")

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg bg-[#111118] border-[rgba(255,255,255,0.08)] text-white overflow-y-auto"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-white text-xl font-bold">
            {isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-5 pb-8">
          {/* Preview */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)]">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0"
              style={{ backgroundColor: form.bgColor }}
            >
              {form.icon}
            </div>
            <div>
              <p className="font-semibold text-white leading-snug">{form.name || "Tên sản phẩm"}</p>
              <p className="text-sm text-blue-400 font-bold mt-0.5">
                {form.salePrice ? fmt(form.salePrice) : "—"}
                {form.discount > 0 && (
                  <span className="ml-1.5 text-[10px] bg-red-500/15 text-red-400 px-1.5 py-0.5 rounded-full border border-red-500/20 font-semibold">
                    -{form.discount}%
                  </span>
                )}
              </p>
            </div>
            {form.hot && (
              <span className="ml-auto flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/20">
                <Flame className="w-3 h-3" /> Hot
              </span>
            )}
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label className="text-[#8b8b9e] text-xs">Tên sản phẩm *</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="VD: ChatGPT Plus" className="admin-input" />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-[#8b8b9e] text-xs">Danh mục</Label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#111118]">{c.label}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-[#8b8b9e] text-xs">Mô tả</Label>
            <Textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="Mô tả ngắn gọn về sản phẩm..."
              className="admin-input resize-none"
            />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[#8b8b9e] text-xs">Giá gốc (đ)</Label>
              <Input
                type="number"
                value={form.originalPrice || ""}
                onChange={(e) => set("originalPrice", Number(e.target.value))}
                placeholder="0"
                className="admin-input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[#8b8b9e] text-xs">Giá sale (đ)</Label>
              <Input
                type="number"
                value={form.salePrice || ""}
                onChange={(e) => set("salePrice", Number(e.target.value))}
                placeholder="0"
                className="admin-input"
              />
            </div>
          </div>

          {/* Discount display */}
          {form.discount > 0 && (
            <div className="flex items-center gap-2 text-sm text-green-400">
              <TrendingDown className="w-4 h-4" />
              Giảm <strong>{form.discount}%</strong> — Tiết kiệm <strong>{fmt(form.originalPrice - form.salePrice)}</strong>
            </div>
          )}

          {/* External URL */}
          <div className="space-y-1.5">
            <Label className="text-[#8b8b9e] text-xs">External URL</Label>
            <Input value={form.externalUrl} onChange={(e) => set("externalUrl", e.target.value)} placeholder="https://..." className="admin-input" />
          </div>

          {/* Sold count */}
          <div className="space-y-1.5">
            <Label className="text-[#8b8b9e] text-xs">Số đã bán</Label>
            <Input type="number" value={form.soldCount || ""} onChange={(e) => set("soldCount", Number(e.target.value))} placeholder="0" className="admin-input" />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <Label className="text-[#8b8b9e] text-xs">Tags</Label>
            <TagInput tags={form.tags} onChange={(t) => set("tags", t)} />
          </div>

          {/* Icon + Color */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[#8b8b9e] text-xs">Ký tự icon</Label>
              <Input
                value={form.icon}
                onChange={(e) => set("icon", e.target.value.slice(0, 1).toUpperCase())}
                maxLength={1}
                className="admin-input text-center font-bold text-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[#8b8b9e] text-xs">Màu nền icon</Label>
              <div className="p-2 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]">
                <ColorPicker value={form.bgColor} onChange={(c) => set("bgColor", c)} />
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            {/* Hot Deal toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)]">
              <div>
                <p className="text-sm font-medium text-white">Hot Deal 🔥</p>
                <p className="text-xs text-[#8b8b9e] mt-0.5">Hiển thị badge Hot, ưu tiên trong danh sách</p>
              </div>
              <button type="button" onClick={() => set("hot", !form.hot)} className="transition-colors">
                {form.hot ? <ToggleRight className="w-8 h-8 text-blue-500" /> : <ToggleLeft className="w-8 h-8 text-[#8b8b9e]" />}
              </button>
            </div>
            {/* Status toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)]">
              <div>
                <p className="text-sm font-medium text-white">Đang bán</p>
                <p className="text-xs text-[#8b8b9e] mt-0.5">Hiển thị sản phẩm trên trang người dùng</p>
              </div>
              <button type="button" onClick={() => set("status", form.status === "active" ? "inactive" : "active")} className="transition-colors">
                {form.status === "active" ? <ToggleRight className="w-8 h-8 text-blue-500" /> : <ToggleLeft className="w-8 h-8 text-[#8b8b9e]" />}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              {isEdit ? "Lưu thay đổi" : "Thêm sản phẩm"}
            </Button>
            <Button variant="outline" onClick={onClose} className="border-[rgba(255,255,255,0.12)] text-[#8b8b9e] hover:text-white bg-transparent">
              Hủy
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Confirm Delete Dialog ─────────────────────────────────────────────────
function ConfirmDialog({ product, onConfirm, onCancel }: {
  product: AdminProduct; onConfirm: () => void; onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-sm rounded-2xl border border-red-500/20 bg-[#111118] p-6 shadow-2xl"
      >
        <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="text-center font-bold text-white text-lg mb-1">Xóa sản phẩm?</h3>
        <p className="text-center text-sm text-[#8b8b9e] mb-6">
          Bạn chắc chắn muốn xóa <strong className="text-white">&quot;{product.name}&quot;</strong>? Hành động này không thể hoàn tác.
        </p>
        <div className="flex gap-3">
          <Button onClick={onCancel} variant="outline" className="flex-1 border-[rgba(255,255,255,0.12)] text-[#8b8b9e] hover:text-white bg-transparent">
            Hủy
          </Button>
          <Button onClick={onConfirm} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
            Xóa vĩnh viễn
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Products Page ─────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>(ADMIN_PRODUCTS)
  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<AdminProduct | null>(null)
  const [deleting, setDeleting] = useState<AdminProduct | null>(null)
  const [sortKey, setSortKey] = useState<keyof AdminProduct>("createdAt")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  // Filter + sort
  const filtered = useMemo(() => {
    let list = products
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    if (catFilter !== "all") list = list.filter((p) => p.category === catFilter)
    if (statusFilter !== "all") list = list.filter((p) => p.status === statusFilter)
    list = [...list].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey]
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av
      return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
    })
    return list
  }, [products, search, catFilter, statusFilter, sortKey, sortDir])

  const toggleSort = (key: keyof AdminProduct) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else { setSortKey(key); setSortDir("desc") }
  }

  const allSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id))
  const toggleAll = () => {
    if (allSelected) setSelected(new Set())
    else setSelected(new Set(filtered.map((p) => p.id)))
  }

  const openAdd = () => { setEditing(null); setSheetOpen(true) }
  const openEdit = (p: AdminProduct) => { setEditing(p); setSheetOpen(true) }

  const handleSave = (p: AdminProduct) => {
    setProducts((prev) => {
      const idx = prev.findIndex((x) => x.id === p.id)
      if (idx >= 0) { const copy = [...prev]; copy[idx] = p; return copy }
      return [p, ...prev]
    })
  }

  const handleDelete = (p: AdminProduct) => setDeleting(p)

  const confirmDelete = () => {
    if (!deleting) return
    setProducts((prev) => prev.filter((p) => p.id !== deleting.id))
    setSelected((s) => { const n = new Set(s); n.delete(deleting.id); return n })
    setDeleting(null)
  }

  const toggleHot = (id: string) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, hot: !p.hot } : p))
  }

  const toggleStatus = (id: string) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p))
  }

  const bulkDelete = () => {
    setProducts((prev) => prev.filter((p) => !selected.has(p.id)))
    setSelected(new Set())
  }

  const cats = [{ id: "all", label: "Tất cả" }, ...aiToolCategories.filter((c) => c.id !== "all")]

  return (
    <div className="space-y-5 w-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-white">AI Tools</h1>
          <p className="text-sm text-[#8b8b9e] mt-0.5">{products.length} sản phẩm tổng cộng · {products.filter((p) => p.status === "active").length} đang bán</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 text-[#8b8b9e] border-[rgba(255,255,255,0.12)] hover:text-white bg-transparent h-9">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button onClick={openAdd} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white h-9">
            <Plus className="w-4 h-4" /> Thêm sản phẩm
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8b9e]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm sản phẩm..."
            className="pl-9 admin-input h-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "active", "inactive"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "h-9 px-3 rounded-xl text-sm font-medium border transition-all",
                statusFilter === s
                  ? "border-blue-500/50 bg-blue-500/15 text-blue-400"
                  : "border-[rgba(255,255,255,0.08)] text-[#8b8b9e] hover:text-white bg-transparent"
              )}
            >
              {s === "all" ? "Tất cả" : s === "active" ? "✅ Đang bán" : "⏸ Tạm dừng"}
            </button>
          ))}
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {cats.map((c) => (
          <button
            key={c.id}
            onClick={() => setCatFilter(c.id)}
            className={cn(
              "h-8 px-3 rounded-xl text-xs font-semibold border transition-all",
              catFilter === c.id
                ? "border-violet-500/40 bg-violet-500/15 text-violet-400"
                : "border-[rgba(255,255,255,0.08)] text-[#8b8b9e] hover:text-white bg-transparent"
            )}
          >
            {c.label}
            {c.id !== "all" && (
              <span className="ml-1.5 text-[10px] opacity-60">
                {products.filter((p) => p.category === c.id).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bulk action bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-orange-500/20 bg-orange-500/8"
          >
            <span className="text-sm font-semibold text-orange-400">Đã chọn {selected.size} sản phẩm</span>
            <div className="flex gap-2 ml-auto">
              <Button size="sm" onClick={bulkDelete} className="h-7 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20 text-xs gap-1.5">
                <Trash2 className="w-3 h-3" /> Xóa đã chọn
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelected(new Set())} className="h-7 text-xs border-[rgba(255,255,255,0.12)] text-[#8b8b9e] bg-transparent">
                Bỏ chọn
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#111118] overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col style={{ width: 44 }} />
              <col style={{ width: "32%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "11%" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.07)]">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                  />
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold text-[#8b8b9e] uppercase tracking-wider whitespace-nowrap">
                  Sản phẩm
                </th>
                <th
                  className="text-left px-4 py-3 text-xs font-bold text-[#8b8b9e] uppercase tracking-wider cursor-pointer hover:text-white transition-colors whitespace-nowrap"
                  onClick={() => toggleSort("category")}
                >
                  <span className="flex items-center gap-1">Danh mục <SortIcon active={sortKey === "category"} dir={sortDir} /></span>
                </th>
                <th
                  className="text-right px-4 py-3 text-xs font-bold text-[#8b8b9e] uppercase tracking-wider cursor-pointer hover:text-white transition-colors whitespace-nowrap"
                  onClick={() => toggleSort("salePrice")}
                >
                  <span className="flex items-center justify-end gap-1">Giá sale <SortIcon active={sortKey === "salePrice"} dir={sortDir} /></span>
                </th>
                <th
                  className="text-center px-4 py-3 text-xs font-bold text-[#8b8b9e] uppercase tracking-wider cursor-pointer hover:text-white transition-colors whitespace-nowrap"
                  onClick={() => toggleSort("soldCount")}
                >
                  <span className="flex items-center justify-center gap-1">Đã bán <SortIcon active={sortKey === "soldCount"} dir={sortDir} /></span>
                </th>
                <th className="text-center px-4 py-3 text-xs font-bold text-[#8b8b9e] uppercase tracking-wider">Hot</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-[#8b8b9e] uppercase tracking-wider">Trạng thái</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-[#8b8b9e] uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
              <AnimatePresence>
                {filtered.map((p) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    className={cn(
                      "group hover:bg-white/3 transition-colors",
                      selected.has(p.id) && "bg-blue-500/5"
                    )}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(p.id)}
                        onChange={(e) => {
                          const n = new Set(selected)
                          if (e.target.checked) n.add(p.id); else n.delete(p.id)
                          setSelected(n)
                        }}
                        className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                      />
                    </td>
                    {/* Product */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                          style={{ backgroundColor: p.bgColor }}
                        >
                          {p.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate max-w-[180px]">{p.name}</p>
                          <p className="text-[11px] text-[#8b8b9e] mt-0.5">ID: {p.id}</p>
                        </div>
                      </div>
                    </td>
                    {/* Category */}
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-lg bg-[rgba(255,255,255,0.06)] text-[#8b8b9e] whitespace-nowrap">
                        {aiToolCategories.find((c) => c.id === p.category)?.label ?? p.category}
                      </span>
                    </td>
                    {/* Price */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <p className="font-bold text-white">{fmt(p.salePrice)}</p>
                      <p className="text-[11px] text-[#8b8b9e] line-through">{fmt(p.originalPrice)}</p>
                    </td>
                    {/* Sold */}
                    <td className="px-4 py-3 text-center">
                      <span className="font-semibold text-white">{p.soldCount}</span>
                    </td>
                    {/* Hot toggle */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleHot(p.id)}
                        className={cn(
                          "inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all",
                          p.hot
                            ? "bg-orange-500/15 text-orange-400 border-orange-500/20 hover:bg-orange-500/25"
                            : "bg-[rgba(255,255,255,0.05)] text-[#8b8b9e] border-[rgba(255,255,255,0.08)] hover:bg-white/10"
                        )}
                      >
                        <Flame className="w-3 h-3" />{p.hot ? "Hot" : "Off"}
                      </button>
                    </td>
                    {/* Status toggle */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleStatus(p.id)}
                        className={cn(
                          "inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all",
                          STATUS_CLS[p.status]
                        )}
                      >
                        {p.status === "active" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {p.status === "active" ? "Đang bán" : "Tạm dừng"}
                      </button>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(p)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-500/15 text-[#8b8b9e] hover:text-blue-400 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/15 text-[#8b8b9e] hover:text-red-400 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {p.externalUrl && (
                          <a
                            href={p.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/8 text-[#8b8b9e] hover:text-white transition-colors"
                            title="Xem trang gốc"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-[#8b8b9e]">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-3xl">📦</div>
                      <p className="font-semibold text-white">Không tìm thấy sản phẩm</p>
                      <p className="text-sm">Thử thay đổi bộ lọc hoặc thêm sản phẩm mới</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[rgba(255,255,255,0.07)]">
          <p className="text-xs text-[#8b8b9e]">
            Hiển thị <span className="text-white font-semibold">{filtered.length}</span> / {products.length} sản phẩm
          </p>
          <div className="text-xs text-[#8b8b9e]">
            Tổng doanh thu: <span className="text-green-400 font-bold">
              {products.reduce((s, p) => s + p.salePrice * p.soldCount, 0).toLocaleString("vi-VN")}đ
            </span>
          </div>
        </div>
      </div>

      {/* Product Sheet */}
      <ProductSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        product={editing}
        onSave={handleSave}
      />

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleting && (
          <ConfirmDialog
            product={deleting}
            onConfirm={confirmDelete}
            onCancel={() => setDeleting(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
