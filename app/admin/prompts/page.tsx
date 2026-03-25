"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, Search, Edit2, Trash2, Copy, Eye, Star, Crown,
  ChevronDown, ChevronUp, X, ToggleLeft, ToggleRight, CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { ADMIN_PROMPTS, PROMPT_CATEGORIES, type AdminPrompt } from "@/lib/admin-data"

// ─── Category colors ───────────────────────────────────────────────────────
const CAT_CLS: Record<string, string> = {
  video:     "bg-violet-500/15 text-violet-400 border-violet-500/20",
  image:     "bg-pink-500/15 text-pink-400 border-pink-500/20",
  marketing: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  coding:    "bg-blue-500/15 text-blue-400 border-blue-500/20",
  writing:   "bg-teal-500/15 text-teal-400 border-teal-500/20",
  business:  "bg-amber-500/15 text-amber-400 border-amber-500/20",
  seo:       "bg-green-500/15 text-green-400 border-green-500/20",
}

const EMPTY: Omit<AdminPrompt, "id" | "createdAt"> = {
  title: "", category: "marketing", content: "", tags: [],
  isPremium: false, isFeatured: false, views: 0, copies: 0, status: "active",
}

// ─── Prompt Form Sheet ─────────────────────────────────────────────────────
function PromptSheet({ open, onClose, prompt, onSave }: {
  open: boolean; onClose: () => void
  prompt: AdminPrompt | null; onSave: (p: AdminPrompt) => void
}) {
  const [form, setForm] = useState(prompt ? { ...prompt } : { ...EMPTY })
  const [tagInput, setTagInput] = useState("")
  const [copied, setCopied] = useState(false)
  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm(f => ({ ...f, [k]: v }))

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !form.tags.includes(t)) set("tags", [...form.tags, t])
    setTagInput("")
  }

  const copyContent = () => {
    navigator.clipboard.writeText(form.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    onSave({ ...form, id: prompt?.id ?? `p${Date.now()}`, createdAt: prompt?.createdAt ?? new Date().toISOString().split("T")[0] })
    onClose()
  }

  const categories = PROMPT_CATEGORIES.filter(c => c.id !== "all")

  return (
    <Sheet open={open} onOpenChange={o => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl bg-[#111118] border-[rgba(255,255,255,0.08)] text-white overflow-y-auto">
        <SheetHeader className="mb-5">
          <SheetTitle className="text-white text-xl font-bold">
            {prompt ? "Chỉnh sửa prompt" : "Thêm prompt mới"}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 pb-8">
          {/* Title */}
          <div className="space-y-1.5">
            <Label className="text-[#8b8b9e] text-xs">Tiêu đề *</Label>
            <Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="VD: Tạo video viral TikTok" className="admin-input" />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-[#8b8b9e] text-xs">Danh mục</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <button key={c.id} type="button" onClick={() => set("category", c.id)}
                  className={cn("h-8 px-3 rounded-xl text-xs font-semibold border transition-all",
                    form.category === c.id
                      ? "border-blue-500/50 bg-blue-500/15 text-blue-400"
                      : "border-[rgba(255,255,255,0.08)] text-[#8b8b9e] hover:text-white")}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt content */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-[#8b8b9e] text-xs">Nội dung Prompt *</Label>
              <button onClick={copyContent}
                className={cn("flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg transition-all",
                  copied ? "text-green-400 bg-green-500/10" : "text-[#8b8b9e] hover:text-white hover:bg-white/8")}>
                {copied ? <><CheckCircle2 className="w-3 h-3" /> Đã copy</> : <><Copy className="w-3 h-3" /> Copy</>}
              </button>
            </div>
            <Textarea
              value={form.content}
              onChange={e => set("content", e.target.value)}
              rows={10}
              placeholder="Nhập nội dung prompt... Dùng [PLACEHOLDER] cho các giá trị cần thay thế."
              className="admin-input resize-y font-mono text-xs leading-relaxed"
            />
            <p className="text-[10px] text-[#8b8b9e]">{form.content.length} ký tự · {form.content.split("\n").length} dòng</p>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-[#8b8b9e] text-xs">Tags</Label>
            <div className="flex gap-2">
              <Input value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Nhập tag, nhấn Enter..." className="admin-input h-9 text-sm" />
              <Button type="button" size="sm" onClick={addTag} className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-3">+</Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.tags.map(t => (
                <span key={t} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/20 text-blue-400">
                  {t}
                  <button onClick={() => set("tags", form.tags.filter(x => x !== t))}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2">
            {[
              { key: "isPremium" as const, label: "Prompt Premium", icon: <Crown className="w-3.5 h-3.5" />, desc: "Chỉ thành viên Pro mới xem được" },
              { key: "isFeatured" as const, label: "Nổi bật", icon: <Star className="w-3.5 h-3.5" />, desc: "Hiển thị ưu tiên ở đầu danh sách" },
            ].map(({ key, label, icon, desc }) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)]">
                <div className="flex items-start gap-2.5">
                  <span className="text-[#8b8b9e] mt-0.5">{icon}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="text-xs text-[#8b8b9e] mt-0.5">{desc}</p>
                  </div>
                </div>
                <button type="button" onClick={() => set(key, !form[key])}>
                  {form[key] ? <ToggleRight className="w-8 h-8 text-blue-500" /> : <ToggleLeft className="w-8 h-8 text-[#8b8b9e]" />}
                </button>
              </div>
            ))}
            {/* Status */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)]">
              <div>
                <p className="text-sm font-medium text-white">Trạng thái hoạt động</p>
                <p className="text-xs text-[#8b8b9e] mt-0.5">Hiển thị prompt cho người dùng</p>
              </div>
              <button type="button" onClick={() => set("status", form.status === "active" ? "inactive" : "active")}>
                {form.status === "active" ? <ToggleRight className="w-8 h-8 text-blue-500" /> : <ToggleLeft className="w-8 h-8 text-[#8b8b9e]" />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              {prompt ? "Lưu thay đổi" : "Thêm prompt"}
            </Button>
            <Button variant="outline" onClick={onClose} className="border-[rgba(255,255,255,0.12)] text-[#8b8b9e] hover:text-white bg-transparent">Hủy</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Expanded Row ──────────────────────────────────────────────────────────
function ExpandedRow({ prompt, onCopy }: { prompt: AdminPrompt; onCopy: () => void }) {
  return (
    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <td colSpan={9} className="px-0">
        <div className="mx-4 mb-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[rgba(255,255,255,0.06)]">
            <p className="text-xs font-bold text-[#8b8b9e] uppercase tracking-wider">Nội dung prompt</p>
            <button onClick={onCopy}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/20 hover:bg-blue-500/25 transition-colors">
              <Copy className="w-3 h-3" /> Copy prompt
            </button>
          </div>
          <pre className="px-4 py-3 text-xs text-white/80 leading-relaxed whitespace-pre-wrap font-mono max-h-52 overflow-y-auto scrollbar-none">
            {prompt.content}
          </pre>
        </div>
      </td>
    </motion.tr>
  )
}

// ─── Prompts Page ──────────────────────────────────────────────────────────
export default function PromptsPage() {
  const [prompts, setPrompts] = useState<AdminPrompt[]>(ADMIN_PROMPTS)
  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState<"all" | "premium" | "free">("all")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<AdminPrompt | null>(null)
  const [sortKey, setSortKey] = useState<"views" | "copies" | "title" | "createdAt">("copies")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [copied, setCopied] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = prompts
    if (search) list = list.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
    if (catFilter !== "all") list = list.filter(p => p.category === catFilter)
    if (typeFilter === "premium") list = list.filter(p => p.isPremium)
    if (typeFilter === "free") list = list.filter(p => !p.isPremium)
    return [...list].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey]
      if (typeof av === "number" && typeof bv === "number") return sortDir === "desc" ? bv - av : av - bv
      return sortDir === "desc" ? String(bv).localeCompare(String(av)) : String(av).localeCompare(String(bv))
    })
  }, [prompts, search, catFilter, typeFilter, sortKey, sortDir])

  const toggleSort = (k: typeof sortKey) => {
    if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(k); setSortDir("desc") }
  }

  const renderSortTh = (k: typeof sortKey, label: string, align = "left") => (
    <th onClick={() => toggleSort(k)}
      className={cn("px-4 py-3 text-xs font-bold text-[#8b8b9e] uppercase tracking-wider cursor-pointer hover:text-white transition-colors whitespace-nowrap text-" + align)}>
      <span className={cn("flex items-center gap-1", align !== "left" && "justify-end")}>
        {label}
        {sortKey === k ? sortDir === "desc" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3 opacity-20" />}
      </span>
    </th>
  )

  const handleSave = (p: AdminPrompt) => {
    setPrompts(prev => {
      const idx = prev.findIndex(x => x.id === p.id)
      if (idx >= 0) { const copy = [...prev]; copy[idx] = p; return copy }
      return [p, ...prev]
    })
  }

  const handleDelete = (id: string) => {
    if (confirm("Xóa prompt này?")) {
      setPrompts(prev => prev.filter(p => p.id !== id))
      setSelected(s => { const n = new Set(s); n.delete(id); return n })
    }
  }

  const copyPrompt = (p: AdminPrompt) => {
    navigator.clipboard.writeText(p.content)
    setCopied(p.id)
    setTimeout(() => setCopied(null), 2000)
  }

  const toggleFeatured = (id: string) => setPrompts(prev => prev.map(p => p.id === id ? { ...p, isFeatured: !p.isFeatured } : p))
  const toggleStatus = (id: string) => setPrompts(prev => prev.map(p => p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p))
  const bulkDelete = () => { setPrompts(prev => prev.filter(p => !selected.has(p.id))); setSelected(new Set()) }

  const allChecked = filtered.length > 0 && filtered.every(p => selected.has(p.id))

  const catLabel = (id: string) => PROMPT_CATEGORIES.find(c => c.id === id)?.label ?? id

  return (
    <div className="space-y-5 w-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Prompt Library</h1>
          <p className="text-sm text-[#8b8b9e] mt-0.5">
            {prompts.length} prompts · {prompts.filter(p => p.isPremium).length} premium · {prompts.filter(p => p.isFeatured).length} nổi bật
          </p>
        </div>
        <Button onClick={() => { setEditing(null); setSheetOpen(true) }} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white h-9">
          <Plus className="w-4 h-4" /> Thêm prompt
        </Button>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-2.5 items-center">
        <div className="relative min-w-[220px] flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8b9e]" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm prompt, tag..." className="pl-9 admin-input h-9" />
        </div>
        {(["all", "premium", "free"] as const).map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={cn("h-9 px-3 rounded-xl text-xs font-semibold border transition-all",
              typeFilter === t ? "border-blue-500/50 bg-blue-500/15 text-blue-400" : "border-[rgba(255,255,255,0.08)] text-[#8b8b9e] hover:text-white bg-transparent")}>
            {t === "all" ? "Tất cả" : t === "premium" ? "👑 Premium" : "🆓 Free"}
          </button>
        ))}
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {PROMPT_CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCatFilter(c.id)}
            className={cn("h-8 px-3 rounded-xl text-xs font-semibold border transition-all",
              catFilter === c.id ? "border-violet-500/40 bg-violet-500/15 text-violet-400" : "border-[rgba(255,255,255,0.08)] text-[#8b8b9e] hover:text-white bg-transparent")}>
            {c.label}
            <span className="ml-1.5 opacity-60">
              {c.id === "all" ? prompts.length : prompts.filter(p => p.category === c.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Bulk action bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-orange-500/20 bg-orange-500/8">
            <span className="text-sm font-semibold text-orange-400">Đã chọn {selected.size} prompt</span>
            <div className="flex gap-2 ml-auto">
              <Button size="sm" onClick={bulkDelete} className="h-7 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20 text-xs gap-1.5">
                <Trash2 className="w-3 h-3" /> Xóa đã chọn
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelected(new Set())} className="h-7 text-xs border-[rgba(255,255,255,0.12)] text-[#8b8b9e] bg-transparent">Bỏ chọn</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table — full width */}
      <div className="w-full rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#111118] overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm table-fixed" style={{ minWidth: 900 }}>
            <colgroup>
              <col style={{ width: 40 }} />
              <col style={{ width: "35%" }} />
              <col style={{ width: 110 }} />
              <col style={{ width: 90 }} />
              <col style={{ width: 80 }} />
              <col style={{ width: 80 }} />
              <col style={{ width: 80 }} />
              <col style={{ width: 90 }} />
              <col style={{ width: 110 }} />
            </colgroup>
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.07)]">
                <th className="px-4 py-3">
                  <input type="checkbox" checked={allChecked}
                    onChange={() => allChecked ? setSelected(new Set()) : setSelected(new Set(filtered.map(p => p.id)))}
                    className="w-4 h-4 rounded accent-blue-500 cursor-pointer" />
                </th>
                {renderSortTh("title", "Tiêu đề")}
                <th className="px-4 py-3 text-xs font-bold text-[#8b8b9e] uppercase tracking-wider text-left">Danh mục</th>
                <th className="px-4 py-3 text-xs font-bold text-[#8b8b9e] uppercase tracking-wider text-center">Loại</th>
                {renderSortTh("views", "Lượt xem", "right")}
                {renderSortTh("copies", "Đã copy", "right")}
                <th className="px-4 py-3 text-xs font-bold text-[#8b8b9e] uppercase tracking-wider text-center">Nổi bật</th>
                <th className="px-4 py-3 text-xs font-bold text-[#8b8b9e] uppercase tracking-wider text-center">Trạng thái</th>
                <th className="px-4 py-3 text-xs font-bold text-[#8b8b9e] uppercase tracking-wider text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map(p => (
                  <>
                    <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className={cn("border-b border-[rgba(255,255,255,0.04)] group hover:bg-white/3 transition-colors",
                        selected.has(p.id) && "bg-blue-500/5")}>
                    <td className="px-4 py-3">
                        <input type="checkbox" checked={selected.has(p.id)}
                          onChange={e => {
                            const n = new Set(selected)
                            if (e.target.checked) n.add(p.id); else n.delete(p.id)
                            setSelected(n)
                          }}
                          className="w-4 h-4 rounded accent-blue-500 cursor-pointer" />
                      </td>
                      {/* Title */}
                      <td className="px-4 py-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <button onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                              className="font-semibold text-white hover:text-blue-400 transition-colors text-left line-clamp-1 flex items-center gap-1.5">
                              {p.title}
                              {expanded === p.id
                                ? <ChevronUp className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                : <ChevronDown className="w-3.5 h-3.5 text-[#8b8b9e] shrink-0" />}
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {p.tags.slice(0, 3).map(t => (
                              <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.06)] text-[#8b8b9e]">{t}</span>
                            ))}
                            {p.tags.length > 3 && <span className="text-[9px] text-[#8b8b9e]">+{p.tags.length - 3}</span>}
                          </div>
                        </div>
                      </td>
                      {/* Category */}
                      <td className="px-4 py-3">
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap", CAT_CLS[p.category] ?? "bg-[rgba(255,255,255,0.06)] text-[#8b8b9e]")}>
                          {catLabel(p.category)}
                        </span>
                      </td>
                      {/* Type */}
                      <td className="px-4 py-3 text-center">
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 w-fit mx-auto",
                          p.isPremium ? "bg-amber-500/15 text-amber-400 border-amber-500/20" : "bg-[rgba(255,255,255,0.06)] text-[#8b8b9e] border-[rgba(255,255,255,0.08)]")}>
                          {p.isPremium && <Crown className="w-3 h-3" />}
                          {p.isPremium ? "Premium" : "Free"}
                        </span>
                      </td>
                      {/* Views */}
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-semibold text-white flex items-center justify-end gap-1">
                          <Eye className="w-3.5 h-3.5 text-[#8b8b9e]" />
                          {p.views >= 1000 ? `${(p.views / 1000).toFixed(1)}K` : p.views}
                        </span>
                      </td>
                      {/* Copies */}
                      <td className="px-4 py-3 text-right">
                        <span className={cn("text-sm font-semibold flex items-center justify-end gap-1", copied === p.id ? "text-green-400" : "text-white")}>
                          <Copy className="w-3.5 h-3.5 text-[#8b8b9e]" />
                          {p.copies >= 1000 ? `${(p.copies / 1000).toFixed(1)}K` : p.copies}
                        </span>
                      </td>
                      {/* Featured toggle */}
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => toggleFeatured(p.id)}
                          className={cn("inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all",
                            p.isFeatured ? "bg-amber-500/15 text-amber-400 border-amber-500/20 hover:bg-amber-500/25" : "bg-[rgba(255,255,255,0.05)] text-[#8b8b9e] border-[rgba(255,255,255,0.08)] hover:bg-white/10")}>
                          <Star className={cn("w-3 h-3", p.isFeatured && "fill-amber-400")} />
                          {p.isFeatured ? "Yes" : "No"}
                        </button>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => toggleStatus(p.id)}
                          className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all",
                            p.status === "active" ? "bg-green-500/15 text-green-400 border-green-500/20" : "bg-[rgba(255,255,255,0.06)] text-[#8b8b9e] border-[rgba(255,255,255,0.08)]")}>
                          {p.status === "active" ? "Active" : "Inactive"}
                        </button>
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => copyPrompt(p)} title="Copy prompt"
                            className={cn("w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                              copied === p.id ? "bg-green-500/15 text-green-400" : "hover:bg-blue-500/15 text-[#8b8b9e] hover:text-blue-400")}>
                            {copied === p.id ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button onClick={() => { setEditing(p); setSheetOpen(true) }} title="Chỉnh sửa"
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-500/15 text-[#8b8b9e] hover:text-blue-400 transition-colors">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(p.id)} title="Xóa"
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-500/15 text-[#8b8b9e] hover:text-red-400 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                    {/* Expanded content */}
                    <AnimatePresence>
                      {expanded === p.id && (
                        <ExpandedRow key={`exp-${p.id}`} prompt={p} onCopy={() => copyPrompt(p)} />
                      )}
                    </AnimatePresence>
                  </>
                ))}
              </AnimatePresence>

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-[#8b8b9e]">
                      <span className="text-4xl">✍️</span>
                      <p className="font-semibold text-white">Không tìm thấy prompt</p>
                      <p className="text-sm">Thử thay đổi bộ lọc hoặc thêm prompt mới</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[rgba(255,255,255,0.07)]">
          <p className="text-xs text-[#8b8b9e]">
            Hiển thị <span className="text-white font-semibold">{filtered.length}</span> / {prompts.length} prompts
          </p>
          <div className="flex items-center gap-4 text-xs text-[#8b8b9e]">
            <span>Tổng views: <span className="text-white font-semibold">{prompts.reduce((s, p) => s + p.views, 0).toLocaleString()}</span></span>
            <span>Tổng copies: <span className="text-blue-400 font-semibold">{prompts.reduce((s, p) => s + p.copies, 0).toLocaleString()}</span></span>
          </div>
        </div>
      </div>

      <PromptSheet open={sheetOpen} onClose={() => setSheetOpen(false)} prompt={editing} onSave={handleSave} />
    </div>
  )
}
