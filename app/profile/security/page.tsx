"use client"

import { useState } from "react"
import { Eye, EyeOff, Shield, Smartphone, Monitor, CheckCircle2, AlertTriangle, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const SESSIONS = [
  { device: "Chrome · Macbook Pro", location: "Hà Nội, Việt Nam", time: "Hiện tại", current: true, icon: Monitor },
  { device: "Safari · iPhone 15", location: "Hà Nội, Việt Nam", time: "2 giờ trước", current: false, icon: Smartphone },
  { device: "Chrome · Windows 11", location: "TP. Hồ Chí Minh", time: "1 ngày trước", current: false, icon: Monitor },
]

function PasswordInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <div className="relative">
        <Input type={show ? "text" : "password"} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} className="pr-10 h-11 rounded-xl border-border/60" />
        <button type="button" onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "Ít nhất 8 ký tự", ok: password.length >= 8 },
    { label: "Chứa chữ hoa", ok: /[A-Z]/.test(password) },
    { label: "Chứa số", ok: /\d/.test(password) },
    { label: "Ký tự đặc biệt", ok: /[^A-Za-z0-9]/.test(password) },
  ]
  const strength = checks.filter(c => c.ok).length
  const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"]
  const labels = ["Yếu", "Trung bình", "Khá", "Mạnh"]
  if (!password) return null
  return (
    <div className="space-y-2 mt-2">
      <div className="flex gap-1.5 h-1.5">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={cn("flex-1 rounded-full transition-all duration-300", i < strength ? colors[strength - 1] : "bg-muted")} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <p className={cn("text-xs font-medium", strength <= 1 ? "text-red-500" : strength === 2 ? "text-orange-500" : strength === 3 ? "text-yellow-500" : "text-green-500")}>
          Mật khẩu {labels[strength - 1] || "Rất yếu"}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {checks.map(({ label, ok }) => (
          <div key={label} className="flex items-center gap-1.5 text-[11px]">
            <div className={cn("w-3 h-3 rounded-full flex items-center justify-center", ok ? "bg-green-500" : "bg-muted")}>
              {ok && <span className="text-[8px] text-white font-bold">✓</span>}
            </div>
            <span className={ok ? "text-foreground" : "text-muted-foreground"}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SecurityPage() {
  const [currentPw, setCurrentPw] = useState("")
  const [newPw, setNewPw] = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPw || !newPw || newPw !== confirmPw) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setCurrentPw(""); setNewPw(""); setConfirmPw("")
      setTimeout(() => setSuccess(false), 4000)
    }, 1500)
  }

  const mismatch = confirmPw.length > 0 && newPw !== confirmPw

  return (
    <div className="space-y-5">
      {/* Success toast */}
      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-500 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />Mật khẩu đã được thay đổi thành công!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change password */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Key className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold text-base">Thay đổi mật khẩu</h3>
            <p className="text-xs text-muted-foreground">Sử dụng mật khẩu mạnh, không dùng lại ở chỗ khác</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <PasswordInput label="Mật khẩu hiện tại" value={currentPw} onChange={setCurrentPw} placeholder="••••••••" />
          <div>
            <PasswordInput label="Mật khẩu mới" value={newPw} onChange={setNewPw} placeholder="Ít nhất 8 ký tự" />
            <PasswordStrength password={newPw} />
          </div>
          <div>
            <PasswordInput label="Xác nhận mật khẩu mới" value={confirmPw} onChange={setConfirmPw} placeholder="Nhập lại mật khẩu mới" />
            {mismatch && (
              <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-500">
                <AlertTriangle className="w-3 h-3" />Mật khẩu không khớp
              </p>
            )}
          </div>
          <Button type="submit" disabled={!currentPw || !newPw || mismatch || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-6 gap-2 w-full sm:w-auto">
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Đang cập nhật...</>
            ) : (
              <>Đổi mật khẩu</>
            )}
          </Button>
        </form>
      </div>

      {/* 2FA */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", twoFAEnabled ? "bg-green-500/10" : "bg-muted")}>
              <Smartphone className={cn("w-5 h-5", twoFAEnabled ? "text-green-400" : "text-muted-foreground")} />
            </div>
            <div>
              <h3 className="font-bold text-base">Xác thực 2 bước (2FA)</h3>
              <p className="text-xs text-muted-foreground">Bảo vệ tài khoản bằng mã OTP qua ứng dụng hoặc SMS</p>
              {twoFAEnabled && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full bg-green-500/15 text-green-500 border border-green-500/20">
                  <CheckCircle2 className="w-2.5 h-2.5" />Đã bật
                </span>
              )}
            </div>
          </div>
          <button onClick={() => setTwoFAEnabled(e => !e)}
            className={cn("relative w-12 h-6 rounded-full transition-colors shrink-0", twoFAEnabled ? "bg-blue-600" : "bg-muted")}>
            <motion.span animate={{ left: twoFAEnabled ? "calc(100% - 22px)" : "2px" }}
              className="absolute top-[2px] w-5 h-5 bg-white rounded-full shadow-sm" style={{ position: "absolute" }} />
          </button>
        </div>
      </div>

      {/* Active sessions */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="font-bold text-base">Phiên đăng nhập đang hoạt động</h3>
            <p className="text-xs text-muted-foreground">{SESSIONS.length} thiết bị đang đăng nhập vào tài khoản của bạn</p>
          </div>
        </div>
        <div className="space-y-3">
          {SESSIONS.map(({ device, location, time, current, icon: Icon }) => (
            <div key={device} className={cn("flex items-center gap-3 p-3.5 rounded-xl border", current ? "border-blue-500/30 bg-blue-500/5" : "border-border/50 bg-muted/30")}>
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", current ? "bg-blue-500/15" : "bg-muted")}>
                <Icon className={cn("w-4.5 h-4.5", current ? "text-blue-400" : "text-muted-foreground")} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{device}</p>
                  {current && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-500">Thiết bị này</span>}
                </div>
                <p className="text-xs text-muted-foreground">{location} · {time}</p>
              </div>
              {!current && (
                <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10 rounded-lg h-8 text-xs">
                  Đăng xuất
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-4 w-full rounded-xl h-10 text-sm border-destructive/30 text-destructive hover:bg-destructive/10">
          Đăng xuất khỏi tất cả thiết bị khác
        </Button>
      </div>
    </div>
  )
}
