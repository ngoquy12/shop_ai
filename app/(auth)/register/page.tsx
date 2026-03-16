"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AuthCard,
  AuthIllustration,
  SocialButtons,
  AuthDivider,
  PasswordInput,
  PasswordStrength,
  AlertBox,
} from "@/components/auth/auth-ui"

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  })
  const [loading, setLoading] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  const set = (key: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.fullName.trim()) e.fullName = "Vui lòng nhập họ tên."
    if (!form.email.includes("@")) e.email = "Email không hợp lệ."
    if (form.password.length < 8) e.password = "Mật khẩu ít nhất 8 ký tự."
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Mật khẩu xác nhận không khớp."
    if (!form.agree) e.agree = "Bạn cần đồng ý với điều khoản sử dụng."
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setLoading("credentials")
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(null)
    setSuccess(true)
  }

  const handleSocial = async (provider: "google" | "facebook") => {
    setErrors({})
    setLoading(provider)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(null)
  }

  if (success) {
    return (
      <AuthCard
        title="Kiểm tra email của bạn 📬"
        subtitle="Chúng tôi đã gửi link xác nhận đến email bạn đăng ký"
      >
        <div className="text-center py-4 space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/15 flex items-center justify-center">
            <span className="text-4xl">✉️</span>
          </div>
          <AlertBox
            type="success"
            message={`Email xác nhận đã được gửi đến ${form.email}. Vui lòng kiểm tra hộp thư (kể cả Spam).`}
          />
          <p className="text-sm text-muted-foreground">
            Không nhận được email?{" "}
            <button
              className="text-blue-500 hover:underline font-medium"
              onClick={() => setSuccess(false)}
            >
              Gửi lại
            </button>
          </p>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login">Quay lại đăng nhập</Link>
          </Button>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Tạo tài khoản miễn phí ✨"
      subtitle="Tham gia cùng 7.000+ người dùng VideoPrompt"
      illustrationSlot={
        <AuthIllustration
          emoji="🚀"
          title="Bắt đầu hành trình AI của bạn"
          points={[
            "Truy cập 50+ công cụ AI hàng đầu",
            "Giảm giá đến 90% so với giá gốc",
            "Học AI từ các chuyên gia thực chiến",
            "Hỗ trợ tư vấn miễn phí 24/7",
          ]}
        />
      }
    >
      {/* Social */}
      <SocialButtons
        loading={loading}
        onGoogle={() => handleSocial("google")}
        onFacebook={() => handleSocial("facebook")}
      />

      <AuthDivider />

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full name */}
        <div className="space-y-1.5">
          <Label htmlFor="reg-fullname">Họ và tên</Label>
          <Input
            id="reg-fullname"
            type="text"
            placeholder="Nguyễn Văn A"
            value={form.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            className={`h-11 ${errors.fullName ? "border-destructive" : ""}`}
            disabled={!!loading}
          />
          {errors.fullName && (
            <p className="text-xs text-destructive">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="reg-email">Email</Label>
          <Input
            id="reg-email"
            type="email"
            placeholder="ban@email.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className={`h-11 ${errors.email ? "border-destructive" : ""}`}
            disabled={!!loading}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <PasswordInput
            id="reg-password"
            label="Mật khẩu"
            placeholder="Ít nhất 8 ký tự"
            value={form.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              set("password", e.target.value)
            }
            error={errors.password}
            disabled={!!loading}
          />
          <PasswordStrength password={form.password} />
        </div>

        {/* Confirm password */}
        <PasswordInput
          id="reg-confirm-password"
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu"
          value={form.confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            set("confirmPassword", e.target.value)
          }
          error={errors.confirmPassword}
          disabled={!!loading}
        />

        {/* Terms */}
        <div className="space-y-1">
          <div className="flex items-start gap-2.5">
            <Checkbox
              id="agree-terms"
              checked={form.agree}
              onCheckedChange={(v) => set("agree", !!v)}
              className="mt-0.5"
            />
            <Label
              htmlFor="agree-terms"
              className="text-sm font-normal leading-relaxed cursor-pointer"
            >
              Tôi đồng ý với{" "}
              <Link
                href="/terms"
                className="text-blue-500 hover:underline underline-offset-4 font-medium"
              >
                Điều khoản sử dụng
              </Link>{" "}
              và{" "}
              <Link
                href="/privacy"
                className="text-blue-500 hover:underline underline-offset-4 font-medium"
              >
                Chính sách bảo mật
              </Link>
            </Label>
          </div>
          {errors.agree && (
            <p className="text-xs text-destructive pl-6">{errors.agree}</p>
          )}
        </div>

        <Button
          id="btn-register-submit"
          type="submit"
          size="lg"
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20"
          disabled={!!loading}
        >
          {loading === "credentials" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Đang tạo tài khoản...
            </>
          ) : (
            "Tạo tài khoản"
          )}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        Đã có tài khoản?{" "}
        <Link
          href="/login"
          className="text-blue-500 hover:text-blue-600 font-semibold hover:underline underline-offset-4"
        >
          Đăng nhập
        </Link>
      </p>
    </AuthCard>
  )
}
