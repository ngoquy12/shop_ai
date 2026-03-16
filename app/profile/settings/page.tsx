"use client"

import { useState } from "react"
import { Globe2, Sun, Moon, Languages, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

const LANGUAGES = [
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
]

const TIMEZONES = [
  { value: "Asia/Ho_Chi_Minh", label: "UTC+7 — Hà Nội, TP. HCM" },
  { value: "Asia/Bangkok", label: "UTC+7 — Bangkok" },
  { value: "America/New_York", label: "UTC-5 — New York" },
  { value: "Europe/London", label: "UTC+0 — London" },
]

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={cn("relative w-11 h-6 rounded-full transition-colors", checked ? "bg-blue-600" : "bg-muted")}>
      <motion.span animate={{ left: checked ? "calc(100% - 22px)" : "2px" }} transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="absolute top-[2px] w-5 h-5 bg-white rounded-full shadow-sm" style={{ position: "absolute" }} />
    </button>
  )
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [lang, setLang] = useState("vi")
  const [timezone, setTimezone] = useState("Asia/Ho_Chi_Minh")
  const [privacy, setPrivacy] = useState({ profilePublic: true, activityVisible: false, analyticsShare: true })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-5">
      <AnimatePresence>
        {saved && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-500 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />Cài đặt đã được lưu thành công!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Appearance */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <h3 className="font-bold text-base mb-5">Giao diện</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "light", label: "Sáng", icon: Sun },
            { value: "dark", label: "Tối", icon: Moon },
            { value: "system", label: "Hệ thống", icon: Globe2 },
          ].map(({ value, label, icon: Icon }) => (
            <button key={value} onClick={() => setTheme(value)}
              className={cn("flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all",
                theme === value ? "border-blue-500 bg-blue-500/10" : "border-border/50 hover:border-border"
              )}>
              <Icon className={cn("w-5 h-5", theme === value ? "text-blue-400" : "text-muted-foreground")} />
              <span className={cn("text-sm font-medium", theme === value ? "text-blue-400" : "text-muted-foreground")}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
            <Languages className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="font-bold text-base">Ngôn ngữ & Múi giờ</h3>
            <p className="text-xs text-muted-foreground">Cài đặt ngôn ngữ hiển thị của ứng dụng</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Ngôn ngữ giao diện</label>
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGES.map(({ code, label, flag }) => (
                <button key={code} onClick={() => setLang(code)}
                  className={cn("flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all",
                    lang === code ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-border/50 hover:border-border text-muted-foreground"
                  )}>
                  <span>{flag}</span>{label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Múi giờ</label>
            <select value={timezone} onChange={e => setTimezone(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30">
              {TIMEZONES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <h3 className="font-bold text-base mb-5">Quyền riêng tư</h3>
        <div className="space-y-4">
          {[
            { key: "profilePublic" as const, label: "Hồ sơ công khai", desc: "Người dùng khác có thể xem profile của bạn" },
            { key: "activityVisible" as const, label: "Hiện hoạt động", desc: "Hiển thị trạng thái online và lịch sử hoạt động" },
            { key: "analyticsShare" as const, label: "Chia sẻ dữ liệu phân tích", desc: "Giúp chúng tôi cải thiện dịch vụ (ẩn danh)" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
              <Toggle checked={privacy[key]} onChange={v => setPrivacy(p => ({ ...p, [key]: v }))} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 h-11 rounded-xl text-sm transition-colors">
          Lưu cài đặt
        </button>
      </div>
    </div>
  )
}
