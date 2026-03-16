"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthCard, AlertBox } from "@/components/auth/auth-ui"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email.includes("@")) {
      setError("Vui lòng nhập đúng định dạng email.")
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    setSent(true)
  }

  return (
    <AuthCard
      title="Quên mật khẩu? 🔑"
      subtitle={
        sent
          ? "Kiểm tra hộp thư của bạn"
          : "Nhập email để nhận link đặt lại mật khẩu"
      }
    >
      {sent ? (
        /* Success state */
        <div className="space-y-5">
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
            <AlertBox
              type="success"
              message={`Link đặt lại mật khẩu đã được gửi đến ${email}. Vui lòng kiểm tra hộp thư (kể cả Spam).`}
            />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Không nhận được?{" "}
            <button
              className="text-blue-500 hover:underline font-medium"
              onClick={() => setSent(false)}
            >
              Gửi lại email
            </button>
          </p>

          <Button variant="outline" className="w-full" asChild>
            <Link href="/login">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại đăng nhập
            </Link>
          </Button>
        </div>
      ) : (
        /* Form state */
        <div className="space-y-5">
          {error && <AlertBox type="error" message={error} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="forgot-email">Địa chỉ email</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="ban@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                disabled={loading}
                autoFocus
                required
              />
              <p className="text-xs text-muted-foreground">
                Nhập email đã đăng ký tài khoản VideoPrompt của bạn.
              </p>
            </div>

            <Button
              id="btn-forgot-submit"
              type="submit"
              size="lg"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Đang gửi...
                </>
              ) : (
                "Gửi link đặt lại mật khẩu"
              )}
            </Button>
          </form>

          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      )}
    </AuthCard>
  )
}
