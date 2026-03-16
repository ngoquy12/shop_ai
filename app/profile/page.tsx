"use client"

import { useState } from "react"
import { Camera, CheckCircle2, Edit2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"

const MOCK_PROFILE = {
  name: "Nguyễn Văn An",
  email: "nguyenvanan@gmail.com",
  phone: "0912 345 678",
  bio: "AI enthusiast & developer. Mình dùng AI hàng ngày để làm content, thiết kế và lập trình.",
  website: "https://nguyenvanan.dev",
  location: "Hà Nội, Việt Nam",
  joined: "Tháng 3, 2024",
  plan: "Pro",
}

function Field({ label, value, editing, name, onChange, type = "text", multiline = false }: {
  label: string; value: string; editing: boolean; name: string;
  onChange: (v: string) => void; type?: string; multiline?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <AnimatePresence mode="wait">
        {editing ? (
          <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {multiline ? (
              <textarea value={value} onChange={e => onChange(e.target.value)} rows={3}
                className="w-full text-sm rounded-xl border border-border/60 bg-background px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all" />
            ) : (
              <Input value={value} onChange={e => onChange(e.target.value)} type={type}
                className="h-10 rounded-xl border-border/60 bg-background" />
            )}
          </motion.div>
        ) : (
          <motion.p key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-sm text-foreground py-2.5 px-3 rounded-xl bg-muted/40 border border-border/30 min-h-[40px]">
            {value || <span className="text-muted-foreground italic">Chưa cập nhật</span>}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(MOCK_PROFILE)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(MOCK_PROFILE)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setProfile(draft)
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleCancel = () => {
    setDraft(profile)
    setEditing(false)
  }

  const update = (key: keyof typeof draft) => (v: string) => setDraft(d => ({ ...d, [key]: v }))

  return (
    <div className="space-y-5">
      {/* Saved toast */}
      <AnimatePresence>
        {saved && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-500 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />Thông tin đã được cập nhật thành công!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar card */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-xl shadow-blue-500/20">
              <span className="text-white font-extrabold text-2xl">NA</span>
            </div>
            <button className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-extrabold">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <p className="text-xs text-muted-foreground mt-1">Tham gia từ {profile.joined} · Thành viên {profile.plan}</p>
          </div>
          {!editing ? (
            <Button onClick={() => setEditing(true)} variant="outline" className="gap-2 rounded-xl h-9">
              <Edit2 className="w-3.5 h-3.5" />Chỉnh sửa
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-xl h-9">
                <Save className="w-3.5 h-3.5" />Lưu
              </Button>
              <Button onClick={handleCancel} variant="outline" className="gap-2 rounded-xl h-9">
                <X className="w-3.5 h-3.5" />Hủy
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Info form */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <h3 className="font-bold mb-5 text-base">Thông tin cá nhân</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Họ và tên" value={editing ? draft.name : profile.name} editing={editing} name="name" onChange={update("name")} />
          <Field label="Email" value={editing ? draft.email : profile.email} editing={editing} name="email" onChange={update("email")} type="email" />
          <Field label="Số điện thoại" value={editing ? draft.phone : profile.phone} editing={editing} name="phone" onChange={update("phone")} type="tel" />
          <Field label="Địa chỉ / Thành phố" value={editing ? draft.location : profile.location} editing={editing} name="location" onChange={update("location")} />
          <Field label="Website / Portfolio" value={editing ? draft.website : profile.website} editing={editing} name="website" onChange={update("website")} type="url" />
        </div>
        <div className="mt-4">
          <Field label="Giới thiệu bản thân" value={editing ? draft.bio : profile.bio} editing={editing} name="bio" onChange={update("bio")} multiline />
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <h3 className="font-bold text-destructive mb-1.5">Vùng nguy hiểm</h3>
        <p className="text-sm text-muted-foreground mb-4">Xóa tài khoản sẽ xóa toàn bộ dữ liệu vĩnh viễn và không thể khôi phục.</p>
        <Button variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive/60 rounded-xl h-9">
          Xóa tài khoản
        </Button>
      </div>
    </div>
  )
}
