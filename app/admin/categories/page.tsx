"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, Edit2, Trash2, FolderTree, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type Category = {
  id: string; name: string; slug: string; type: "course" | "tool" | "prompt";
  description: string; status: "active" | "inactive"; count: number;
}

const MOCK_CATEGORIES: Category[] = [
  { id: "1", name: "Lập trình & Phát triển", slug: "lap-trinh-phat-trien", type: "course", description: "Các khóa học về code và AI coding", status: "active", count: 15 },
  { id: "2", name: "Marketing & Sales", slug: "marketing-sales", type: "course", description: "Ứng dụng AI trong marketing", status: "active", count: 8 },
  { id: "3", name: "Video AI", slug: "video-ai", type: "tool", description: "Công cụ tạo và chỉnh sửa video", status: "active", count: 12 },
  { id: "4", name: "AI Chat", slug: "ai-chat", type: "tool", description: "Chatbot và trợ lý ảo AI", status: "active", count: 24 },
  { id: "5", name: "Viết lách", slug: "viet-lach", type: "prompt", description: "Prompt tối ưu cho copywriter", status: "active", count: 45 },
  { id: "6", name: "Thiết kế ảnh", slug: "thiet-ke-anh", type: "prompt", description: "Prompt cho Midjourney, Stable Diffusion", status: "active", count: 89 },
]

const EMPTY: Omit<Category, "id" | "count"> = {
  name: "", slug: "", type: "course", description: "", status: "active"
}

const TYPE_MAP = {
  course: { label: "Khóa học", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
  tool: { label: "AI Tool", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  prompt: { label: "Prompt", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" }
}

function CategoryModal({ open, category, onClose, onSave }: {
  open: boolean; category: Category | null; onClose: () => void; onSave: (c: Omit<Category, "id" | "count">) => void
}) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (open) {
      setTimeout(() => setForm(category ? { ...category } : { ...EMPTY }), 0)
    }
  }, [open, category])

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
                <FolderTree className="w-5 h-5 text-blue-400" />
                {category ? "Sửa danh mục" : "Thêm danh mục mới"}
              </h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-[#8b8b9e] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[#8b8b9e] text-xs">Tên danh mục</Label>
                <Input value={form.name} onChange={e => {
                  set("name", e.target.value)
                  if (!category) set("slug", e.target.value.toLowerCase().replace(/đ/g, "d").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""))
                }} className="admin-input" placeholder="Nhập tên..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[#8b8b9e] text-xs">Loại</Label>
                  <select value={form.type} onChange={e => set("type", e.target.value as "course" | "tool" | "prompt")}
                    className="w-full h-10 px-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-sm text-white focus:outline-none focus:border-blue-500/50">
                    <option value="course" className="bg-[#111118]">Khóa học</option>
                    <option value="tool" className="bg-[#111118]">AI Tool</option>
                    <option value="prompt" className="bg-[#111118]">Prompt</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#8b8b9e] text-xs">Trạng thái</Label>
                  <select value={form.status} onChange={e => set("status", e.target.value as "active" | "inactive")}
                    className="w-full h-10 px-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-sm text-white focus:outline-none focus:border-blue-500/50">
                    <option value="active" className="bg-[#111118]">Hoạt động</option>
                    <option value="inactive" className="bg-[#111118]">Ẩn</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[#8b8b9e] text-xs">Đường dẫn tĩnh (Slug)</Label>
                <Input value={form.slug} onChange={e => set("slug", e.target.value)} className="admin-input font-mono text-xs" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[#8b8b9e] text-xs">Mô tả (Không bắt buộc)</Label>
                <Textarea value={form.description} onChange={e => set("description", e.target.value)} className="admin-input resize-none" rows={3} placeholder="Mô tả danh mục..." />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-[rgba(255,255,255,0.08)] bg-[#0d0d14]">
              <Button variant="ghost" onClick={onClose} className="hover:bg-white/5 text-white">Hủy</Button>
              <Button onClick={() => { onSave(form); onClose() }} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20">
                Lưu danh mục
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default function CategoriesPage() {
  const [data, setData] = useState<Category[]>(MOCK_CATEGORIES)
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState<"all" | "course" | "tool" | "prompt">("all")
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<Category | null>(null)

  const filtered = useMemo(() => {
    let list = data
    if (filterType !== "all") list = list.filter(c => c.type === filterType)
    if (search) list = list.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.toLowerCase().includes(search.toLowerCase()))
    return list
  }, [data, search, filterType])

  const handleSave = (c: Omit<Category, "id" | "count">) => {
    if (selected) {
      setData(prev => prev.map(item => item.id === selected.id ? { ...item, ...c } : item))
    } else {
      setData(prev => [{ ...c, id: Date.now().toString(), count: 0 } as Category, ...prev])
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Chắc chắn xóa danh mục này?")) setData(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="space-y-5 w-full">
      <div className="flex max-sm:flex-col sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            Quản lý Danh mục
          </h1>
          <p className="text-sm text-[#8b8b9e] mt-0.5">Phân loại sản phẩm, khóa học và prompt</p>
        </div>
        <Button onClick={() => { setSelected(null); setModalOpen(true) }} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-semibold shadow-lg shadow-blue-500/20">
          <Plus className="w-4 h-4" /> Thêm danh mục
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8b9e]" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm tên hoặc slug..." className="pl-9 admin-input h-10" />
        </div>
        {(["all", "course", "tool", "prompt"] as const).map(t => (
          <button key={t} onClick={() => setFilterType(t)}
            className={cn("h-10 px-4 rounded-xl text-sm font-semibold border transition-all",
              filterType === t ? "border-blue-500/50 bg-blue-500/15 text-blue-400" : "border-[rgba(255,255,255,0.08)] text-[#8b8b9e] hover:text-white bg-[rgba(255,255,255,0.02)]")}>
            {t === "all" ? "Tất cả" : TYPE_MAP[t].label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#111118] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.07)] bg-[#0d0d14]">
                <th className="px-5 py-3.5 font-bold text-[#8b8b9e] uppercase text-xs tracking-wider">Tên danh mục</th>
                <th className="px-5 py-3.5 font-bold text-[#8b8b9e] uppercase text-xs tracking-wider">Phân loại</th>
                <th className="px-5 py-3.5 font-bold text-[#8b8b9e] uppercase text-xs tracking-wider text-center">Số lượng</th>
                <th className="px-5 py-3.5 font-bold text-[#8b8b9e] uppercase text-xs tracking-wider text-center">Trạng thái</th>
                <th className="px-5 py-3.5 font-bold text-[#8b8b9e] uppercase text-xs tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
              <AnimatePresence>
                {filtered.map(cat => {
                  const tm = TYPE_MAP[cat.type]
                  return (
                    <motion.tr key={cat.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-white/3 transition-colors group">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-white">{cat.name}</p>
                        <p className="text-xs text-[#8b8b9e] font-mono mt-0.5">/{cat.slug}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border", tm.color)}>
                          {tm.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="font-semibold text-white">{cat.count}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border",
                          cat.status === "active" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-white/5 text-[#8b8b9e] border-white/10")}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", cat.status === "active" ? "bg-green-400" : "bg-[#8b8b9e]")} />
                          {cat.status === "active" ? "Hoạt động" : "Đã ẩn"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setSelected(cat); setModalOpen(true) }} className="p-1.5 rounded-md hover:bg-white/10 text-[#8b8b9e] hover:text-white transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-md hover:bg-red-500/15 text-[#8b8b9e] hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-[#8b8b9e]">Không tìm thấy danh mục nào.</td></tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <CategoryModal open={modalOpen} category={selected} onClose={() => setModalOpen(false)} onSave={handleSave} />
    </div>
  )
}
