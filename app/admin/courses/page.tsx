"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, Edit2, Trash2, Star, Users, ToggleLeft, ToggleRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { ADMIN_COURSES, type AdminCourse } from "@/lib/admin-data"

function fmt(n: number) { return n.toLocaleString("vi-VN") + "đ" }

const BADGE_CLS = {
  New: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Bestseller: "bg-amber-500/15 text-amber-400 border-amber-500/20",
}

const LEVELS: AdminCourse["level"][] = ["Cơ bản", "Trung cấp", "Nâng cao"]

const EMPTY_COURSE: Omit<AdminCourse, "id" | "createdAt"> = {
  title: "", subtitle: "", instructor: { name: "", avatar: "" },
  level: "Cơ bản", price: 0, originalPrice: 0, lessons: 0, duration: "",
  students: 0, rating: 4.5, badge: null, status: "active", thumbnail: "📚", slug: "", tags: [],
}

// ─── Course Form Modal ─────────────────────────────────────────────────────
function CourseModal({ open, onClose, course, onSave }: {
  open: boolean; onClose: () => void
  course: AdminCourse | null; onSave: (c: AdminCourse) => void
}) {
  const [form, setForm] = useState(course ? { ...course } : { ...EMPTY_COURSE })
  const [tagInput, setTagInput] = useState("")

  useEffect(() => {
    if (open) setTimeout(() => setForm(course ? { ...course } : { ...EMPTY_COURSE }), 0)
  }, [open, course])

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm(f => ({ ...f, [k]: v }))
  const addTag = () => { const t = tagInput.trim(); if (t && !form.tags.includes(t)) set("tags", [...form.tags, t]); setTagInput("") }

  const handleSave = () => {
    onSave({ ...form, id: course?.id ?? String(Date.now()), createdAt: course?.createdAt ?? new Date().toISOString().split("T")[0] })
    onClose()
  }

  const EMOJIS = ["📚","🚀","💻","🎨","🎬","📱","⚡","📊","✍️","🎯","🔬","💡"]

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="relative z-10 w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#111118] text-white shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.08)] bg-[#0d0d14]">
              <h2 className="text-xl font-bold">{course ? "Chỉnh sửa khóa học" : "Thêm khóa học mới"}</h2>
              <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-[#8b8b9e] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-5">
                  <div className="space-y-1.5 flex flex-col items-center p-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.07)] rounded-xl">
                    <Label className="text-[#8b8b9e] text-xs self-start w-full">Thumbnail Khóa học</Label>
                    <div className="flex flex-wrap gap-2 mt-2 w-full justify-center">
                      {EMOJIS.map(e => (
                        <button key={e} type="button" onClick={() => set("thumbnail", e)}
                          className={cn("w-10 h-10 text-2xl rounded-xl border-2 flex items-center justify-center transition-all",
                            form.thumbnail === e ? "border-blue-500 bg-blue-500/15" : "border-[rgba(255,255,255,0.08)] hover:border-white/20")}>
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[#8b8b9e] text-xs">Tiêu đề khóa học *</Label>
                    <Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="VD: AI Marketing Masterclass" className="admin-input h-10" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label className="text-[#8b8b9e] text-xs">Mô tả ngắn (Subtitle)</Label>
                    <Textarea value={form.subtitle} onChange={e => set("subtitle", e.target.value)} rows={3} className="admin-input resize-none" placeholder="Mô tả nội dung khóa học..." />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[#8b8b9e] text-xs">Slug URL</Label>
                    <Input value={form.slug} onChange={e => set("slug", e.target.value)} className="admin-input h-10" placeholder="vd: ai-marketing-masterclass" />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[#8b8b9e] text-xs">Badge nổi bật</Label>
                    <div className="flex gap-2">
                      {([null, "New", "Bestseller"] as const).map(b => (
                        <button key={String(b)} type="button" onClick={() => set("badge", b)}
                          className={cn("px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex-1",
                            form.badge === b ? "border-blue-500/50 bg-blue-500/15 text-blue-400" : "border-[rgba(255,255,255,0.08)] text-[#8b8b9e]")}>
                          {b === null ? "Không có" : b}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[#8b8b9e] text-xs">Giảng viên</Label>
                      <Input value={form.instructor.name} onChange={e => set("instructor", { ...form.instructor, name: e.target.value })} placeholder="Họ tên GV" className="admin-input h-10" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[#8b8b9e] text-xs">Cấp độ</Label>
                      <select value={form.level} onChange={e => set("level", e.target.value as AdminCourse["level"])}
                        className="w-full h-10 px-3 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] text-white text-sm focus:outline-none">
                        {LEVELS.map(l => <option key={l} value={l} className="bg-[#111118]">{l}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[#8b8b9e] text-xs">Giá gốc (đ)</Label>
                      <Input type="number" value={form.originalPrice || ""} onChange={e => set("originalPrice", Number(e.target.value))} className="admin-input h-10" placeholder="0" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[#8b8b9e] text-xs">Giá bán mới (đ)</Label>
                      <Input type="number" value={form.price || ""} onChange={e => set("price", Number(e.target.value))} className="admin-input h-10" placeholder="0" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[#8b8b9e] text-xs">Số bài học</Label>
                      <Input type="number" value={form.lessons || ""} onChange={e => set("lessons", Number(e.target.value))} className="admin-input h-10" placeholder="0" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[#8b8b9e] text-xs">Thời lượng tổng</Label>
                      <Input value={form.duration} onChange={e => set("duration", e.target.value)} className="admin-input h-10" placeholder="VD: 8h 30m" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[#8b8b9e] text-xs">Tags</Label>
                    <div className="flex gap-2">
                      <Input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Nhập tag..." className="admin-input h-10 text-sm" />
                      <Button type="button" onClick={addTag} className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-4">+</Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {form.tags.map(t => (
                        <span key={t} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/20 text-blue-400">
                          {t}<button onClick={() => set("tags", form.tags.filter(x => x !== t))}><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] mt-2">
                    <div>
                      <p className="text-sm font-medium text-white">Trạng thái hoạt động</p>
                      <p className="text-xs text-[#8b8b9e] mt-0.5">Hiển thị công khai khóa học</p>
                    </div>
                    <button type="button" onClick={() => set("status", form.status === "active" ? "inactive" : "active")}>
                      {form.status === "active" ? <ToggleRight className="w-9 h-9 text-blue-500" /> : <ToggleLeft className="w-9 h-9 text-[#8b8b9e]" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[rgba(255,255,255,0.08)] bg-[#0d0d14]">
              <Button type="button" variant="outline" onClick={onClose} className="border-[rgba(255,255,255,0.12)] text-[#8b8b9e] hover:text-white bg-transparent h-10 px-6">Hủy bỏ</Button>
              <Button type="button" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10 px-8">
                {course ? "Lưu thay đổi" : "Thêm khóa học"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default function CoursesAdminPage() {
  const [courses, setCourses] = useState<AdminCourse[]>(ADMIN_COURSES)
  const [search, setSearch] = useState("")
  const [levelFilter, setLevelFilter] = useState<"all" | AdminCourse["level"]>("all")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<AdminCourse | null>(null)
  const [sortDir] = useState<"asc" | "desc">("desc")
  const [sortKey] = useState<"students" | "price" | "rating">("students")

  const filtered = useMemo(() => {
    let list = courses
    if (search) list = list.filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
    if (levelFilter !== "all") list = list.filter(c => c.level === levelFilter)
    return [...list].sort((a, b) => sortDir === "desc" ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey])
  }, [courses, search, levelFilter, sortDir, sortKey])

  const handleSave = (c: AdminCourse) => {
    setCourses(prev => {
      const idx = prev.findIndex(x => x.id === c.id)
      if (idx >= 0) { const copy = [...prev]; copy[idx] = c; return copy }
      return [c, ...prev]
    })
  }

  const handleDelete = (id: string) => {
    if (confirm("Xóa khóa học này?")) setCourses(prev => prev.filter(c => c.id !== id))
  }

  const toggleStatus = (id: string) => setCourses(prev => prev.map(c => c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c))

  const LEVEL_COLORS: Record<AdminCourse["level"], string> = {
    "Cơ bản": "bg-green-500/15 text-green-400 border-green-500/20",
    "Trung cấp": "bg-blue-500/15 text-blue-400 border-blue-500/20",
    "Nâng cao": "bg-violet-500/15 text-violet-400 border-violet-500/20",
  }



  return (
    <div className="space-y-5 w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Khóa học</h1>
          <p className="text-sm text-[#8b8b9e] mt-0.5">{courses.length} khóa học · {courses.filter(c => c.status === "active").length} đang hoạt động</p>
        </div>
        <Button onClick={() => { setEditing(null); setSheetOpen(true) }} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white h-9">
          <Plus className="w-4 h-4" /> Thêm khóa học
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8b9e]" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm khóa học..." className="pl-9 admin-input h-9" />
        </div>
        {(["all", ...LEVELS] as const).map(l => (
          <button key={l} onClick={() => setLevelFilter(l)}
            className={cn("h-9 px-3 rounded-xl text-xs font-semibold border transition-all",
              levelFilter === l ? "border-blue-500/50 bg-blue-500/15 text-blue-400" : "border-[rgba(255,255,255,0.08)] text-[#8b8b9e] hover:text-white bg-transparent")}>
            {l === "all" ? "Tất cả" : l}
          </button>
        ))}
      </div>

      {/* Grid cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map(c => (
            <motion.div key={c.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="group rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-4 flex flex-col gap-3 hover:border-[rgba(255,255,255,0.12)] transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.06)] flex items-center justify-center text-2xl shrink-0">{c.thumbnail}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full border", LEVEL_COLORS[c.level])}>{c.level}</span>
                    {c.badge && <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full border", BADGE_CLS[c.badge])}>{c.badge}</span>}
                    {c.status === "inactive" && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[rgba(255,255,255,0.06)] text-[#8b8b9e] border border-[rgba(255,255,255,0.08)]">Ẩn</span>}
                  </div>
                  <p className="text-sm font-bold text-white leading-snug line-clamp-2">{c.title}</p>
                  <p className="text-xs text-[#8b8b9e] mt-0.5">GV: {c.instructor.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "Học viên", value: c.students.toLocaleString(), icon: <Users className="w-3.5 h-3.5" /> },
                  { label: "Bài học", value: c.lessons, icon: null },
                  { label: "Rating", value: c.rating, icon: <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="rounded-lg bg-[rgba(255,255,255,0.04)] p-2">
                    <div className="flex items-center justify-center gap-1 text-[#8b8b9e] mb-0.5">{icon}<p className="text-[10px]">{label}</p></div>
                    <p className="text-sm font-bold text-white">{value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-extrabold text-white">{fmt(c.price)}</p>
                  {c.originalPrice > c.price && <p className="text-xs text-[#8b8b9e] line-through">{fmt(c.originalPrice)}</p>}
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => toggleStatus(c.id)}
                    className={cn("text-[10px] font-bold px-2 py-1 rounded-full border transition-all",
                      c.status === "active" ? "bg-green-500/15 text-green-400 border-green-500/20" : "bg-[rgba(255,255,255,0.06)] text-[#8b8b9e] border-[rgba(255,255,255,0.08)]")}>
                    {c.status === "active" ? "Đang bán" : "Ẩn"}
                  </button>
                  <button onClick={() => { setEditing(c); setSheetOpen(true) }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-500/15 text-[#8b8b9e] hover:text-blue-400 transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(c.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-500/15 text-[#8b8b9e] hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-[#8b8b9e]">
          <p className="text-4xl mb-3">📚</p>
          <p className="font-semibold text-white">Không tìm thấy khóa học</p>
        </div>
      )}

      <CourseModal open={sheetOpen} onClose={() => setSheetOpen(false)} course={editing} onSave={handleSave} />
    </div>
  )
}
