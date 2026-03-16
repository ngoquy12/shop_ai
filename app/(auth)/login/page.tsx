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
  AlertBox,
} from "@/components/auth/auth-ui"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.")
      return
    }
    setLoading("credentials")
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(null)
    setError("Email hoặc mật khẩu không đúng. Vui lòng thử lại.")
  }

  const handleSocial = async (provider: "google" | "facebook") => {
    setError("")
    setLoading(provider)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(null)
  }

  return (
    <AuthCard
      title="Chào mừng trở lại 👋"
      subtitle="Đăng nhập để tiếp tục sử dụng VideoPrompt"
      illustrationSlot={
        <AuthIllustration
          emoji="🤖"
          title="Hàng trăm công cụ AI chỉ trong một nền tảng"
          points={[
            "Tài khoản AI chính chủ giá tốt nhất",
            "Khóa học AI thực chiến từ chuyên gia",
            "Website chuyên nghiệp theo yêu cầu",
            "Hỗ trợ 24/7 từ đội ngũ chuyên nghiệp",
          ]}
        />
      }
    >
      {/* Social login */}
      <SocialButtons
        loading={loading}
        onGoogle={() => handleSocial("google")}
        onFacebook={() => handleSocial("facebook")}
      />

      <AuthDivider />

      {/* Error */}
      {error && <AlertBox type="error" message={error} />}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="space-y-1.5">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            placeholder="ban@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11"
            autoComplete="email"
            disabled={!!loading}
            required
          />
        </div>

        <PasswordInput
          id="login-password"
          label="Mật khẩu"
          placeholder="••••••••"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          autoComplete="current-password"
          disabled={!!loading}
        />

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember-me"
              checked={remember}
              onCheckedChange={(v) => setRemember(!!v)}
            />
            <Label htmlFor="remember-me" className="text-sm font-normal cursor-pointer">
              Ghi nhớ đăng nhập
            </Label>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm text-blue-500 hover:text-blue-600 hover:underline underline-offset-4 font-medium"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Button
          id="btn-login-submit"
          type="submit"
          size="lg"
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20"
          disabled={!!loading}
        >
          {loading === "credentials" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Đang đăng nhập...
            </>
          ) : (
            "Đăng nhập"
          )}
        </Button>
      </form>

      {/* Footer link */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="text-blue-500 hover:text-blue-600 font-semibold hover:underline underline-offset-4"
        >
          Đăng ký ngay
        </Link>
      </p>
    </AuthCard>
  )
}
