"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AuthCard,
  PasswordInput,
  PasswordStrength,
  AlertBox,
} from "@/components/auth/auth-ui"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.")
      return
    }
    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp.")
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    setSuccess(true)
  }

  return (
    <AuthCard
      title="Đặt lại mật khẩu 🔐"
      subtitle={
        success
          ? "Mật khẩu đã được cập nhật thành công"
          : "Tạo mật khẩu mới cho tài khoản của bạn"
      }
    >
      {success ? (
        <div className="space-y-5 text-center">
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-green-500" />
            </div>
            <AlertBox
              type="success"
              message="Mật khẩu đã được đặt lại thành công. Hãy đăng nhập với mật khẩu mới."
            />
          </div>
          <Button
            id="btn-goto-login"
            asChild
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Link href="/login">Đăng nhập ngay</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          {error && <AlertBox type="error" message={error} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <PasswordInput
                id="reset-password"
                label="Mật khẩu mới"
                placeholder="Ít nhất 8 ký tự"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                disabled={loading}
              />
              <PasswordStrength password={password} />
            </div>

            <PasswordInput
              id="reset-confirm"
              label="Xác nhận mật khẩu mới"
              placeholder="Nhập lại mật khẩu mới"
              value={confirm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirm(e.target.value)
              }
              error={confirm && confirm !== password ? "Mật khẩu không khớp" : ""}
              disabled={loading}
            />

            <Button
              id="btn-reset-submit"
              type="submit"
              size="lg"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Đang cập nhật...
                </>
              ) : (
                "Đặt lại mật khẩu"
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Link đặt lại mật khẩu chỉ có hiệu lực trong{" "}
            <span className="font-semibold text-foreground">15 phút</span>
          </p>
        </div>
      )}
    </AuthCard>
  )
}
