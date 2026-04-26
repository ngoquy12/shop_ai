"use client"

import { useState } from "react"
import { Bell, Mail, Smartphone, Globe2, CheckCircle2, Volume2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={cn("relative w-11 h-6 rounded-full transition-colors shrink-0", checked ? "bg-blue-600" : "bg-muted")}>
      <motion.span animate={{ left: checked ? "calc(100% - 22px)" : "2px" }} transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="absolute top-[2px] w-5 h-5 bg-white rounded-full shadow-sm" style={{ position: "absolute" }} />
    </button>
  )
}

const NOTIF_SETTINGS = [
  {
    section: "Email", icon: Mail, color: "text-blue-400", bg: "bg-blue-500/10",
    items: [
      { key: "email_orders", label: "Cập nhật đơn hàng", desc: "Xác nhận, giao hàng, hoàn thành", defaultOn: true },
      { key: "email_promo", label: "Khuyến mãi & Flash Sale", desc: "Ưu đãi độc quyền qua email", defaultOn: true },
      { key: "email_courses", label: "Khóa học mới", desc: "Thông báo khi có khóa học phù hợp", defaultOn: false },
      { key: "email_digest", label: "Bản tin hàng tuần", desc: "Tips AI và tin tức mỗi thứ 2", defaultOn: true },
    ]
  },
  {
    section: "Push Notification", icon: Bell, color: "text-violet-400", bg: "bg-violet-500/10",
    items: [
      { key: "push_orders", label: "Trạng thái đơn hàng", desc: "Thông báo ngay khi có thay đổi", defaultOn: true },
      { key: "push_flash", label: "Flash Sale sắp diễn ra", desc: "Nhắc trước 30 phút", defaultOn: true },
      { key: "push_messages", label: "Tin nhắn hỗ trợ", desc: "Phản hồi từ đội ngũ hỗ trợ", defaultOn: true },
    ]
  },
  {
    section: "SMS", icon: Smartphone, color: "text-green-400", bg: "bg-green-500/10",
    items: [
      { key: "sms_otp", label: "Mã OTP xác thực", desc: "Mã đăng nhập và bảo mật", defaultOn: true },
      { key: "sms_orders", label: "Xác nhận đơn hàng", desc: "SMS khi đơn được xác nhận", defaultOn: false },
    ]
  },
  {
    section: "Trình duyệt", icon: Globe2, color: "text-orange-400", bg: "bg-orange-500/10",
    items: [
      { key: "browser_all", label: "Cho phép thông báo trình duyệt", desc: "Hiển thị thông báo ngay cả khi không mở trang", defaultOn: false },
    ]
  },
]

export default function NotificationsPage() {
  const [settings, setSettings] = useState(() => {
    const init: Record<string, boolean> = {}
    NOTIF_SETTINGS.forEach(s => s.items.forEach(item => { init[item.key] = item.defaultOn }))
    return init
  })
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
            <CheckCircle2 className="w-4 h-4 shrink-0" />Cài đặt thông báo đã được lưu!
          </motion.div>
        )}
      </AnimatePresence>

      {NOTIF_SETTINGS.map(({ section, icon: Icon, color, bg, items }) => (
        <div key={section} className="rounded-2xl border border-border/60 bg-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", bg)}>
              <Icon className={cn("w-5 h-5", color)} />
            </div>
            <div>
              <h3 className="font-bold text-base">{section}</h3>
              <p className="text-xs text-muted-foreground">{items.length} tùy chọn</p>
            </div>
          </div>
          <div className="space-y-4">
            {items.map(({ key, label, desc }) => (
              <div key={key} className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
                <Toggle checked={settings[key]} onChange={v => setSettings(s => ({ ...s, [key]: v }))} />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <Volume2 className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-bold text-base">Giờ không làm phiền</h3>
            <p className="text-xs text-muted-foreground">Tắt tất cả thông báo trong khoảng thời gian này</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Từ</label>
              <input type="time" defaultValue="22:00"
                className="block w-full mt-1 px-3 py-2 rounded-xl border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Đến</label>
              <input type="time" defaultValue="07:00"
                className="block w-full mt-1 px-3 py-2 rounded-xl border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 h-11 rounded-xl text-sm transition-colors">
          Lưu tất cả cài đặt
        </button>
      </div>
    </div>
  )
}
