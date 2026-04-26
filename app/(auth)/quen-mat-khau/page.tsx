"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AuthCard,
  AlertBox,
  PasswordInput,
  PasswordStrength,
} from "@/components/auth/auth-ui";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  useForgotPassword,
  useResetPassword,
  useVerifyResetOtp,
} from "@/features/auth/hooks/use-forgot-password";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(() => {
    if (typeof window === "undefined") return 1;
    const storedStep = sessionStorage.getItem("resetStep");
    const storedExp = sessionStorage.getItem("otpExpiry");
    if (storedExp && storedStep) {
      const expTime = parseInt(storedExp, 10);
      if (expTime > Date.now()) {
        return parseInt(storedStep, 10) as 1 | 2 | 3;
      }
    }
    return 1;
  });

  const [email, setEmail] = useState(() => {
    if (typeof window === "undefined") return "";
    const storedEmail = sessionStorage.getItem("resetEmail");
    const storedExp = sessionStorage.getItem("otpExpiry");
    if (storedExp && storedEmail) {
      const expTime = parseInt(storedExp, 10);
      if (expTime > Date.now()) {
        return storedEmail;
      }
    }
    return "";
  });

  const [otp, setOtp] = useState(() => {
    if (typeof window === "undefined") return "";
    const storedOtp = sessionStorage.getItem("resetOtp");
    const storedExp = sessionStorage.getItem("otpExpiry");
    if (storedExp && storedOtp) {
      const expTime = parseInt(storedExp, 10);
      if (expTime > Date.now()) {
        return storedOtp;
      }
    }
    return "";
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [countdown, setCountdown] = useState(() => {
    if (typeof window === "undefined") return 0;
    const storedExp = sessionStorage.getItem("otpExpiry");
    if (storedExp) {
      const expTime = parseInt(storedExp, 10);
      const now = Date.now();
      if (expTime > now) {
        return Math.floor((expTime - now) / 1000);
      } else {
        // Clear expired session
        sessionStorage.removeItem("otpExpiry");
        sessionStorage.removeItem("resetEmail");
        sessionStorage.removeItem("resetStep");
        sessionStorage.removeItem("resetOtp");
      }
    }
    return 0;
  });

  const requestOtpFn = useForgotPassword();
  const verifyOtpFn = useVerifyResetOtp();
  const resetFn = useResetPassword();

  function clearSession() {
    sessionStorage.removeItem("otpExpiry");
    sessionStorage.removeItem("resetEmail");
    sessionStorage.removeItem("resetStep");
    sessionStorage.removeItem("resetOtp");
  }

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!email.trim() || !emailRegex.test(email)) {
      setErrorMsg("Vui lòng nhập một email hợp lệ.");
      return;
    }

    try {
      await requestOtpFn.mutateAsync({ email });
      setSuccessMsg("Mã OTP đã được gửi đến email của bạn.");
      setStep(2);

      const newExp = Date.now() + 10 * 60 * 1000;
      sessionStorage.setItem("otpExpiry", newExp.toString());
      sessionStorage.setItem("resetEmail", email);
      sessionStorage.setItem("resetStep", "2");
      setCountdown(600);
    } catch (err) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setErrorMsg(
        error?.response?.data?.message ||
          error?.message ||
          "Có lỗi xảy ra, vui lòng thử lại.",
      );
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (otp.length !== 6) {
      setErrorMsg("Mã OTP không hợp lệ.");
      return;
    }

    try {
      await verifyOtpFn.mutateAsync({ email, otpCode: otp });
      setSuccessMsg("Mã OTP hợp lệ. Vui lòng tạo mật khẩu mới.");
      setStep(3);
      sessionStorage.setItem("resetStep", "3");
      sessionStorage.setItem("resetOtp", otp);
    } catch (err) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setErrorMsg(
        error?.response?.data?.message ||
          error?.message ||
          "Mã OTP không chính xác.",
      );
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (newPassword.length < 8) {
      setErrorMsg("Mật khẩu phải chứa ít nhất 8 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      await resetFn.mutateAsync({ email, otpCode: otp, newPassword });
      setSuccessMsg("Đổi mật khẩu thành công! Đang chuyển hướng...");
      clearSession();
      setTimeout(() => {
        router.push("/dang-nhap");
      }, 2000);
    } catch (err) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const responseMsg = error?.response?.data?.message || error?.message;
      setErrorMsg(responseMsg || "Có lỗi xảy ra, vui lòng kiểm tra lại.");

      // If code is somehow invalidated at this point, we could go back to step 2 manually.
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const getTitle = () => {
    if (step === 1) return "Khôi phục mật khẩu 🔐";
    if (step === 2) return "Xác thực mã OTP 📩";
    return "Tạo mật khẩu mới 🔑";
  };

  const getSubtitle = () => {
    if (step === 1) return "Nhập email của bạn để nhận mã khôi phục";
    if (step === 2) return "Vui lòng nhập mã OTP đã được gửi đến email";
    return "Nhập mật khẩu mới của bạn";
  };

  return (
    <AuthCard title={getTitle()} subtitle={getSubtitle()}>
      {step === 1 && (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          {errorMsg && <AlertBox type="error" message={errorMsg} />}
          {successMsg && <AlertBox type="success" message={successMsg} />}

          <div className="space-y-1.5">
            <Label htmlFor="forgot-email">Email đã đăng ký</Label>
            <Input
              id="forgot-email"
              type="email"
              placeholder="ban@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
              disabled={requestOtpFn.isPending}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20"
            disabled={requestOtpFn.isPending}
          >
            {requestOtpFn.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Đang xử lý...
              </>
            ) : (
              "Gửi mã OTP"
            )}
          </Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          {errorMsg && <AlertBox type="error" message={errorMsg} />}
          {successMsg && <AlertBox type="success" message={successMsg} />}

          <div className="space-y-1.5 flex flex-col items-center">
            <Label htmlFor="reset-otp" className="w-full text-left">
              Mã OTP (6 chữ số)
            </Label>
            <InputOTP
              id="reset-otp"
              maxLength={6}
              value={otp}
              onChange={(val: string) => setOtp(val)}
              disabled={verifyOtpFn.isPending || countdown === 0}
            >
              <InputOTPGroup className="w-full justify-between gap-2">
                <InputOTPSlot
                  index={0}
                  className="w-12 h-12 text-lg sm:w-14 sm:h-14"
                />
                <InputOTPSlot
                  index={1}
                  className="w-12 h-12 text-lg sm:w-14 sm:h-14"
                />
                <InputOTPSlot
                  index={2}
                  className="w-12 h-12 text-lg sm:w-14 sm:h-14"
                />
                <InputOTPSlot
                  index={3}
                  className="w-12 h-12 text-lg sm:w-14 sm:h-14"
                />
                <InputOTPSlot
                  index={4}
                  className="w-12 h-12 text-lg sm:w-14 sm:h-14"
                />
                <InputOTPSlot
                  index={5}
                  className="w-12 h-12 text-lg sm:w-14 sm:h-14"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {countdown > 0 ? (
            <p className="text-sm text-center text-muted-foreground mt-2">
              Thời gian còn lại:{" "}
              <span className="font-semibold text-blue-600">
                {formatTime(countdown)}
              </span>
            </p>
          ) : (
            <p className="text-sm text-center text-red-500 font-medium mt-2">
              Mã OTP đã hết hạn. Vui lòng gửi lại.
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white mt-4 font-semibold shadow-md shadow-blue-500/20"
            disabled={
              verifyOtpFn.isPending || otp.length !== 6 || countdown === 0
            }
          >
            {verifyOtpFn.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Đang kiểm
                tra...
              </>
            ) : (
              "Xác thực mã OTP"
            )}
          </Button>

          <p className="text-sm text-center text-muted-foreground mt-4">
            Chưa nhận được mã?{" "}
            <button
              type="button"
              className="text-blue-500 hover:underline font-medium disabled:opacity-50"
              onClick={() => handleRequestOtp()}
              disabled={requestOtpFn.isPending || countdown > 540}
            >
              Gửi lại {countdown > 540 && `(${countdown - 540}s)`}
            </button>
          </p>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          {errorMsg && <AlertBox type="error" message={errorMsg} />}
          {successMsg && <AlertBox type="success" message={successMsg} />}

          <div className="space-y-1.5 pt-2">
            <PasswordInput
              id="reset-password"
              label="Mật khẩu mới"
              placeholder="Ít nhất 8 ký tự"
              value={newPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewPassword(e.target.value)
              }
              disabled={resetFn.isPending}
              error={
                newPassword.length > 0 && newPassword.length < 8
                  ? "Mật khẩu quá ngắn"
                  : undefined
              }
            />
            <PasswordStrength password={newPassword} />
          </div>

          <div className="space-y-1.5">
            <PasswordInput
              id="reset-confirm"
              label="Xác nhận mật khẩu mới"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
              disabled={resetFn.isPending}
              error={
                confirmPassword && newPassword !== confirmPassword
                  ? "Không khớp"
                  : undefined
              }
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white mt-4 font-semibold shadow-md shadow-blue-500/20"
            disabled={resetFn.isPending || newPassword.length < 8}
          >
            {resetFn.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Đang cập
                nhật...
              </>
            ) : (
              "Xác nhận đổi mật khẩu"
            )}
          </Button>
        </form>
      )}

      {/* Footer */}
      {(step === 1 || step === 2) && (
        <p className="text-center text-sm text-muted-foreground mt-6">
          Quay lại{" "}
          <Link
            href="/dang-nhap"
            className="text-blue-500 hover:text-blue-600 font-semibold hover:underline underline-offset-4"
          >
            Đăng nhập
          </Link>
        </p>
      )}
    </AuthCard>
  );
}
