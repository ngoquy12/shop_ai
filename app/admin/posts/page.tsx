"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, Edit2, Trash2, FileText, Image as ImageIcon, Eye, X, Calendar, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type BlogPost = {
  id: string; title: string; slug: string; category: string;
  excerpt: string; content: string; coverImage: string;
  status: "published" | "draft"; views: number; publishedAt: string;
}

const MOCK_POSTS: BlogPost[] = [
  { id: "1", title: "Top 10 AI Tools Tốt Nhất Cho Copywriter năm 2026", slug: "top-10-ai-tools-copywriter-2026", category: "AI Tools", excerpt: "Khám phá danh sách các công cụ AI giúp copywriter x10 hiệu suất và sáng tạo nội dung đỉnh cao.", content: "", coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80", status: "published", views: 2450, publishedAt: "2026-03-20T08:00:00" },
  { id: "2", title: "Hướng dẫn cài đặt và sử dụng Midjourney V6.1", slug: "huong-dan-dung-midjourney-v6-1", category: "Tutorials", excerpt: "Chi tiết các thiết lập và tham số prompt thần thánh trong bản cập nhật Midjourney mới nhất.", content: "", coverImage: "https://images.unsplash.com/photo-1686191128892-3b370a3f958a?auto=format&fit=crop&w=800&q=80", status: "published", views: 3210, publishedAt: "2026-03-15T14:30:00" },
  { id: "3", title: "Khóa học AI Automation sẽ thay đổi cách bạn làm việc", slug: "khoa-hoc-ai-automation", category: "Review", excerpt: "Tại sao mọi doanh nghiệp nhỏ đều cần học tự động hóa luồng làm việc với Zapier và GPT-5?", content: "", coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80", status: "draft", views: 0, publishedAt: "2026-03-26T09:00:00" },
  { id: "4", title: "15 Câu lệnh (Prompt) SEO chuẩn cấu trúc Google", slug: "15-prompt-seo-google", category: "Prompt", excerpt: "Dùng các prompt này để ra lệnh cho Claude Opus viết bài chuẩn SEO, pass AI detectors dễ dàng.", content: "", coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80", status: "published", views: 1845, publishedAt: "2026-03-10T11:15:00" }
]

const EMPTY: Omit<BlogPost, "id" | "views"> = {
  title: "", slug: "", category: "Tin tức",
  excerpt: "", content: "", coverImage: "",
  status: "published", publishedAt: ""
}

const CATEGORIES = ["Tin tức", "AI Tools", "Tutorials", "Chuyên đề SEO", "Prompt", "Review"]

function PostModal({ open, post, onClose, onSave }: {
  open: boolean; post: BlogPost | null; onClose: () => void; onSave: (p: Omit<BlogPost, "id" | "views">) => void
}) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (open) {
      setTimeout(() => setForm(post ? { ...post } : { ...EMPTY, publishedAt: new Date().toISOString().slice(0, 16) }), 0)
    }
  }, [open, post])

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm(f => ({ ...f, [k]: v }))

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="relative z-10 w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#111118] text-white shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.08)] bg-[#0d0d14]">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                {post ? "Sửa Bài Viết" : "Tạo Bài Viết SEO"}
              </h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-[#8b8b9e] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left side: Main Editor */}
                <div className="lg:col-span-2 space-y-5">
                  <div className="space-y-1.5">
                    <Label className="text-[#8b8b9e] text-xs font-bold uppercase tracking-wider">Tiêu đề (H1)</Label>
                    <Input value={form.title} onChange={e => {
                      set("title", e.target.value)
                      if (!post) set("slug", e.target.value.toLowerCase().replace(/đ/g, "d").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""))
                    }} className="admin-input text-base font-semibold" placeholder="Nhập tiêu đề thật hấp dẫn..." />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[#8b8b9e] text-xs font-bold uppercase tracking-wider">Mô tả ngắn (SEO Meta Description)</Label>
                    <Textarea value={form.excerpt} onChange={e => set("excerpt", e.target.value)} 
                      className="admin-input resize-none" rows={3} placeholder="Tóm tắt nội dung để hấp dẫn người đọc trên kết quả tìm kiếm Google..." />
                    <p className={cn("text-xs text-right mt-1", form.excerpt.length > 160 ? "text-red-400" : "text-[#8b8b9e]")}>
                      {form.excerpt.length}/160 ký tự (Tốt nhất)
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[#8b8b9e] text-xs font-bold uppercase tracking-wider flex justify-between">
                      <span>Nội dung bài viết (Markdown/HTML)</span>
                    </Label>
                    <div className="border border-[rgba(255,255,255,0.08)] bg-[#0d0d14] rounded-xl overflow-hidden focus-within:border-blue-500/50 transition-colors">
                      <div className="flex gap-2 p-2 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)]">
                        <Button type="button" variant="ghost" className="h-7 px-2 text-[11px] text-[#8b8b9e] hover:text-white">B</Button>
                        <Button type="button" variant="ghost" className="h-7 px-2 text-[11px] text-[#8b8b9e] hover:text-white italic">I</Button>
                        <div className="w-px h-7 bg-[rgba(255,255,255,0.1)] mx-1" />
                        <Button type="button" variant="ghost" className="h-7 px-2 text-[11px] text-[#8b8b9e] hover:text-white">H2</Button>
                        <Button type="button" variant="ghost" className="h-7 px-2 text-[11px] text-[#8b8b9e] hover:text-white">H3</Button>
                        <div className="w-px h-7 bg-[rgba(255,255,255,0.1)] mx-1" />
                        <Button type="button" variant="ghost" className="h-7 gap-1 px-2 text-[11px] text-[#8b8b9e] hover:text-white"><ImageIcon className="w-3 h-3"/> Ảnh</Button>
                      </div>
                      <Textarea value={form.content} onChange={e => set("content", e.target.value)} 
                        className="w-full bg-transparent border-none focus-visible:ring-0 p-4 min-h-[300px] resize-none text-sm font-mono leading-relaxed" 
                        placeholder="## Viết bài SEO chất lượng cao...&#10;&#10;Nội dung thân bài ở đây..." />
                    </div>
                  </div>
                </div>

                {/* Right side: Sidebar Meta */}
                <div className="space-y-5 lg:border-l lg:border-[rgba(255,255,255,0.08)] lg:pl-6">
                  
                  {/* Publish Panel */}
                  <div className="p-4 rounded-xl border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] space-y-4">
                    <p className="text-xs font-bold text-white tracking-wider flex items-center gap-1.5"><Globe className="w-4 h-4 text-blue-400" /> Đăng bài</p>
                    
                    <div className="space-y-1.5">
                      <Label className="text-[#8b8b9e] text-[11px]">Trạng thái</Label>
                      <select value={form.status} onChange={e => set("status", e.target.value as "published" | "draft")}
                        className="w-full h-9 px-3 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#111118] text-sm text-white focus:border-blue-500/50 outline-none">
                        <option value="published">Đã xuất bản</option>
                        <option value="draft">Bản nháp</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[#8b8b9e] text-[11px]">Thời gian đăng</Label>
                      <Input type="datetime-local" value={form.publishedAt} onChange={e => set("publishedAt", e.target.value)} className="admin-input h-9 text-xs" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[#8b8b9e] text-xs font-bold tracking-wider">Đường dẫn (Slug)</Label>
                    <Input value={form.slug} onChange={e => set("slug", e.target.value)} className="admin-input h-9 text-xs font-mono" />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[#8b8b9e] text-xs font-bold tracking-wider">Danh mục</Label>
                    <select value={form.category} onChange={e => set("category", e.target.value)}
                        className="w-full h-9 px-3 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-sm text-white focus:border-blue-500/50 outline-none">
                        {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#111118]">{c}</option>)}
                      </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[#8b8b9e] text-xs font-bold tracking-wider">Ảnh Bìa (Cover)</Label>
                    <Input value={form.coverImage} onChange={e => set("coverImage", e.target.value)} className="admin-input h-9 text-xs" placeholder="URL hình ảnh (https://...)" />
                    {form.coverImage && (
                      <div className="mt-3 relative w-full aspect-video rounded-lg overflow-hidden border border-[rgba(255,255,255,0.08)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={form.coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                </div>

              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-[rgba(255,255,255,0.08)] bg-[#0d0d14]">
              <Button variant="ghost" onClick={onClose} className="hover:bg-white/5 text-white">Hủy bỏ</Button>
              <Button onClick={() => { onSave(form); onClose() }} disabled={!form.title} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20 px-8">
                {form.status === "published" ? "Đăng bài ngay" : "Lưu bản nháp"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default function PostsPage() {
  const [data, setData] = useState<BlogPost[]>(MOCK_POSTS)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all")
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<BlogPost | null>(null)

  const filtered = useMemo(() => {
    let list = data
    if (statusFilter !== "all") list = list.filter(p => p.status === statusFilter)
    if (search) list = list.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase()))
    return [...list].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  }, [data, search, statusFilter])

  const handleSave = (p: Omit<BlogPost, "id" | "views">) => {
    if (selected) {
      setData(prev => prev.map(item => item.id === selected.id ? { ...item, ...p } : item))
    } else {
      setData(prev => [{ ...p, id: Date.now().toString(), views: 0 } as BlogPost, ...prev])
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Chắc chắn xóa bài viết này? Dữ liệu không thể khôi phục!")) setData(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex max-sm:flex-col sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            Bài viết Blog
          </h1>
          <p className="text-sm text-[#8b8b9e] mt-0.5">Quản lý nội dung SEO và bản tin hệ thống</p>
        </div>
        <Button onClick={() => { setSelected(null); setModalOpen(true) }} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-semibold shadow-lg shadow-blue-500/20">
          <Plus className="w-4 h-4" /> Viết bài mới
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-3 flex-1 min-w-[300px]">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8b9e]" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm tiêu đề..." className="pl-9 admin-input h-10" />
          </div>
          {(["all", "published", "draft"] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={cn("h-10 px-4 rounded-xl text-sm font-semibold border transition-all",
                statusFilter === s ? "border-blue-500/50 bg-blue-500/15 text-blue-400" : "border-[rgba(255,255,255,0.08)] text-[#8b8b9e] hover:text-white bg-[rgba(255,255,255,0.02)]")}>
              {s === "all" ? "Tất cả" : s === "published" ? "Đã đăng" : "Bản nháp"}
            </button>
          ))}
        </div>
        <p className="text-xs text-[#8b8b9e] font-medium hidden sm:block">
          Tổng cộng: <span className="text-white">{filtered.length}</span> bài viết
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {filtered.map(post => (
            <motion.div key={post.id} layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#111118] group hover:border-[rgba(255,255,255,0.15)] transition-colors">
              
              {/* Cover Thumbnail */}
              <div className="w-full sm:w-48 aspect-video sm:aspect-auto sm:h-32 shrink-0 rounded-xl overflow-hidden bg-[rgba(255,255,255,0.05)] relative">
                {post.coverImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-[rgba(255,255,255,0.2)]" />
                  </div>
                )}
                {post.status === "draft" && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
                    Bản nháp
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                <div>
                  <div className="flex gap-2 items-center mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      {post.category}
                    </span>
                    <span className="text-xs text-[#8b8b9e] flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.publishedAt).toLocaleDateString("vi-VN")}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">{post.title}</h3>
                  <p className="text-sm text-[#8b8b9e] mt-1.5 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                </div>
                
                <div className="flex items-center justify-between mt-4 border-t border-[rgba(255,255,255,0.05)] pt-3">
                  <div className="flex items-center gap-4 text-xs font-semibold text-[#8b8b9e]">
                    <span className="flex items-center gap-1.5" title="Lượt xem"><Eye className="w-3.5 h-3.5"/> {post.views}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <Button variant="ghost" className="h-8 px-2.5 text-[#8b8b9e] hover:text-white hover:bg-white/10" onClick={() => { setSelected(post); setModalOpen(true) }}>
                      <Edit2 className="w-3.5 h-3.5 mr-1" /> Sửa
                    </Button>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-[#8b8b9e] hover:text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(post.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>

            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-12 rounded-2xl border border-[rgba(255,255,255,0.05)] border-dashed">
            <FileText className="w-8 h-8 text-[rgba(255,255,255,0.2)] mx-auto mb-3" />
            <p className="text-[#8b8b9e]">Bạn chưa có bài viết nào.</p>
          </div>
        )}
      </div>

      <PostModal open={modalOpen} post={selected} onClose={() => setModalOpen(false)} onSave={handleSave} />
    </div>
  )
}
