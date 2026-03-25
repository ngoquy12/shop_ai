"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save, Globe, Zap, Bell, CreditCard, Search, ToggleLeft, ToggleRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type Settings = {
  siteName: string; siteDesc: string; siteUrl: string; metaKeywords: string
  flashSaleEnabled: boolean; flashSaleEndTime: string; flashSaleLabel: string
  fomoEnabled: boolean; fomoMessage: string; fomoDelay: number
  payVietQR: boolean; payMoMo: boolean; payZaloPay: boolean
  emailNotif: boolean; orderNotif: boolean; adminEmail: string
}

const INITIAL: Settings = {
  siteName: "VideoPrompt", siteDesc: "Nền tảng cung cấp AI Tools, khóa học AI và Prompt chuyên nghiệp hàng đầu Việt Nam", siteUrl: "https://videoprompt.vn", metaKeywords: "AI tools, ChatGPT, Midjourney, khóa học AI, prompt AI",
  flashSaleEnabled: true, flashSaleEndTime: "2026-03-31T23:59", flashSaleLabel: "🔥 Flash Sale",
  fomoEnabled: true, fomoMessage: "🔥 {name} từ {city} vừa mua {product}", fomoDelay: 8,
  payVietQR: true, payMoMo: true, payZaloPay: true,
  emailNotif: true, orderNotif: true, adminEmail: "admin@videoprompt.vn",
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#111118] overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[rgba(255,255,255,0.07)]">
        <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-blue-400">
          {icon}
        </div>
        <h2 className="font-bold text-white">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}

function Toggle({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        {desc && <p className="text-xs text-[#8b8b9e] mt-0.5">{desc}</p>}
      </div>
      <button type="button" onClick={() => onChange(!value)} className="transition-colors shrink-0">
        {value ? <ToggleRight className="w-8 h-8 text-blue-500" /> : <ToggleLeft className="w-8 h-8 text-[#8b8b9e]" />}
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const [form, setForm] = useState<Settings>(INITIAL)
  const [saved, setSaved] = useState(false)
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Cài đặt hệ thống</h1>
          <p className="text-sm text-[#8b8b9e] mt-0.5">Quản lý thông tin và cấu hình VideoPrompt</p>
        </div>
        <Button onClick={handleSave} className={cn("gap-2 font-semibold transition-all",
          saved ? "bg-green-600 hover:bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white")}>
          {saved ? <><CheckCircle2 className="w-4 h-4" /> Đã lưu!</> : <><Save className="w-4 h-4" /> Lưu thay đổi</>}
        </Button>
      </div>

      {/* Site Info */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Section icon={<Globe className="w-4 h-4" />} title="Thông tin website">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[#8b8b9e] text-xs">Tên website</Label>
              <Input value={form.siteName} onChange={e => set("siteName", e.target.value)} className="admin-input" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[#8b8b9e] text-xs">URL website</Label>
              <Input value={form.siteUrl} onChange={e => set("siteUrl", e.target.value)} className="admin-input" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[#8b8b9e] text-xs">Mô tả SEO (Meta Description)</Label>
            <Textarea value={form.siteDesc} onChange={e => set("siteDesc", e.target.value)} rows={3} className="admin-input resize-none" />
            <p className="text-[10px] text-[#8b8b9e]">{form.siteDesc.length}/160 ký tự</p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[#8b8b9e] text-xs">Từ khóa SEO</Label>
            <Input value={form.metaKeywords} onChange={e => set("metaKeywords", e.target.value)} className="admin-input" placeholder="ai tools, chatgpt, ..." />
          </div>
        </Section>
      </motion.div>

      {/* Flash Sale */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Section icon={<Zap className="w-4 h-4" />} title="Flash Sale">
          <Toggle label="Kích hoạt Flash Sale" desc="Hiển thị banner và đồng hồ đếm ngược trên trang chủ" value={form.flashSaleEnabled} onChange={v => set("flashSaleEnabled", v)} />
          {form.flashSaleEnabled && (
            <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-[rgba(255,255,255,0.06)]">
              <div className="space-y-1.5">
                <Label className="text-[#8b8b9e] text-xs">Nhãn hiển thị</Label>
                <Input value={form.flashSaleLabel} onChange={e => set("flashSaleLabel", e.target.value)} className="admin-input" placeholder="🔥 Flash Sale" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[#8b8b9e] text-xs">Thời gian kết thúc</Label>
                <Input type="datetime-local" value={form.flashSaleEndTime} onChange={e => set("flashSaleEndTime", e.target.value)} className="admin-input" />
              </div>
            </div>
          )}
        </Section>
      </motion.div>

      {/* FOMO Notification */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Section icon={<Bell className="w-4 h-4" />} title="FOMO Notification">
          <Toggle label="Kích hoạt thông báo FOMO" desc="Hiển thị pop-up mua hàng gần đây để tăng chuyển đổi" value={form.fomoEnabled} onChange={v => set("fomoEnabled", v)} />
          {form.fomoEnabled && (
            <div className="space-y-4 pt-2 border-t border-[rgba(255,255,255,0.06)]">
              <div className="space-y-1.5">
                <Label className="text-[#8b8b9e] text-xs">Nội dung thông báo</Label>
                <Input value={form.fomoMessage} onChange={e => set("fomoMessage", e.target.value)} className="admin-input"
                  placeholder="{name} từ {city} vừa mua {product}" />
                <p className="text-[10px] text-[#8b8b9e]">Dùng: <code className="text-blue-400">{"{name}"}</code>, <code className="text-blue-400">{"{city}"}</code>, <code className="text-blue-400">{"{product}"}</code></p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[#8b8b9e] text-xs">Hiển thị sau (giây)</Label>
                <div className="flex items-center gap-3">
                  <input type="range" min={3} max={30} value={form.fomoDelay} onChange={e => set("fomoDelay", Number(e.target.value))}
                    className="flex-1 accent-blue-500" />
                  <span className="text-white font-bold w-12 text-center bg-[rgba(255,255,255,0.06)] rounded-lg py-1 text-sm">{form.fomoDelay}s</span>
                </div>
              </div>
              {/* Preview */}
              <div className="p-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]">
                <p className="text-xs text-[#8b8b9e] mb-2">Xem trước:</p>
                <div className="flex items-center gap-2.5 bg-[#1a1a24] rounded-xl p-3 border border-[rgba(255,255,255,0.06)]">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">NT</div>
                  <p className="text-xs text-white">{form.fomoMessage.replace("{name}", "Nguyễn T.").replace("{city}", "Hà Nội").replace("{product}", "ChatGPT Plus")}</p>
                </div>
              </div>
            </div>
          )}
        </Section>
      </motion.div>

      {/* Payment Methods */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Section icon={<CreditCard className="w-4 h-4" />} title="Phương thức thanh toán">
          <Toggle label="VietQR / Chuyển khoản" desc="Thanh toán qua mã QR ngân hàng" value={form.payVietQR} onChange={v => set("payVietQR", v)} />
          <div className="border-t border-[rgba(255,255,255,0.05)]" />
          <Toggle label="MoMo" desc="Thanh toán qua ví MoMo" value={form.payMoMo} onChange={v => set("payMoMo", v)} />
          <div className="border-t border-[rgba(255,255,255,0.05)]" />
          <Toggle label="ZaloPay" desc="Thanh toán qua ví ZaloPay" value={form.payZaloPay} onChange={v => set("payZaloPay", v)} />
        </Section>
      </motion.div>

      {/* Notification Settings */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Section icon={<Search className="w-4 h-4" />} title="Thông báo Admin">
          <Toggle label="Thông báo đơn hàng mới" desc="Nhận email khi có đơn hàng mới" value={form.orderNotif} onChange={v => set("orderNotif", v)} />
          <div className="border-t border-[rgba(255,255,255,0.05)]" />
          <Toggle label="Thông báo email tổng hợp" desc="Nhận báo cáo hàng ngày qua email" value={form.emailNotif} onChange={v => set("emailNotif", v)} />
          {(form.emailNotif || form.orderNotif) && (
            <div className="space-y-1.5 pt-2 border-t border-[rgba(255,255,255,0.06)]">
              <Label className="text-[#8b8b9e] text-xs">Email nhận thông báo</Label>
              <Input value={form.adminEmail} onChange={e => set("adminEmail", e.target.value)} className="admin-input" type="email" />
            </div>
          )}
        </Section>
      </motion.div>

      {/* Save button bottom */}
      <div className="flex justify-end pb-4">
        <Button onClick={handleSave} className={cn("gap-2 font-semibold",
          saved ? "bg-green-600 hover:bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white")}>
          {saved ? <><CheckCircle2 className="w-4 h-4" /> Đã lưu thành công!</> : <><Save className="w-4 h-4" /> Lưu thay đổi</>}
        </Button>
      </div>
    </div>
  )
}
