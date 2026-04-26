"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthCard, AlertBox } from "@/components/auth/auth-ui";
import { cn } from "@/lib/utils";

const OTP_LENGTH = 6;

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    const newOtp = Array(OTP_LENGTH).fill("");
    text.split("").forEach((c, i) => (newOtp[i] = c));
    setOtp(newOtp);
    inputsRef.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setError("Vui lòng nhập đủ mã xác nhận 6 chữ số.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    if (code !== "123456") {
      setError("Mã xác nhận không đúng. Vui lòng kiểm tra lại.");
      return;
    }
    setSuccess(true);
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    await new Promise((r) => setTimeout(r, 1000));
    setResending(false);
  };

  return (
    <AuthCard
      title="Xác nhận email 📧"
      subtitle={
        success
          ? "Email đã được xác nhận thành công!"
          : "Nhập mã 6 chữ số đã gửi đến email của bạn"
      }
    >
      {success ? (
        <div className="space-y-5 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
            <span className="text-4xl">🎉</span>
          </div>
          <AlertBox
            type="success"
            message="Tài khoản của bạn đã được xác nhận. Chào mừng đến với VideoPrompt!"
          />
          <Button
            asChild
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Link href="/">Vào trang chủ</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {error && <AlertBox type="error" message={error} />}

          <AlertBox
            type="info"
            message="Mã thử nghiệm: 123456 — Mã sẽ hết hạn sau 10 phút."
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP inputs */}
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  disabled={loading}
                  className={cn(
                    "w-11 h-14 sm:w-12 sm:h-16 text-center text-xl font-bold rounded-xl border-2 bg-card",
                    "transition-all duration-200 outline-none",
                    "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                    digit
                      ? "border-blue-500/60 text-foreground"
                      : "border-border/60 text-muted-foreground",
                    loading && "opacity-60 cursor-not-allowed",
                  )}
                  aria-label={`OTP digit ${i + 1}`}
                />
              ))}
            </div>

            <Button
              id="btn-verify-submit"
              type="submit"
              size="lg"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Đang xác nhận...
                </>
              ) : (
                "Xác nhận tài khoản"
              )}
            </Button>
          </form>

          {/* Resend */}
          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="flex items-center gap-1.5 text-blue-500 hover:text-blue-600 hover:underline underline-offset-4 font-medium disabled:opacity-60"
            >
              <RefreshCw
                className={cn("w-3.5 h-3.5", resending && "animate-spin")}
              />
              {resending ? "Đang gửi..." : "Gửi lại mã"}
            </button>
            <Link
              href="/dang-nhap"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Quay lại
            </Link>
          </div>
        </div>
      )}
    </AuthCard>
  );
}
