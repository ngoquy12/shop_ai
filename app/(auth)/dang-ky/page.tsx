"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  verifyEmailFn,
  sendVerificationEmailFn,
} from "@/features/auth/api/auth.api";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AuthCard,
  SocialButtons,
  AuthDivider,
  PasswordInput,
  PasswordStrength,
  AlertBox,
} from "@/components/auth/auth-ui";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRegister } from "@/features/auth/hooks/use-register";
import { useFirebaseLogin } from "@/features/auth/hooks/use-login";

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [loading, setLoading] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { mutateAsync: register } = useRegister();
  const { mutateAsync: firebaseLogin } = useFirebaseLogin();
  const { mutateAsync: verifyEmail, isPending: isVerifying } = useMutation({
    mutationFn: verifyEmailFn,
  });
  const { mutateAsync: resendEmail, isPending: isResending } = useMutation({
    mutationFn: sendVerificationEmailFn,
  });

  const [otp, setOtp] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      const savedEmail = sessionStorage.getItem("registerEmail");
      if (savedEmail) {
        setForm((f) => ({ ...f, email: savedEmail }));
        setSuccess(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const validate = (data = form) => {
    const e: Record<string, string> = {};

    if (!data.fullName.trim()) e.fullName = "Vui lòng nhập họ và tên.";

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!data.email.trim()) {
      e.email = "Vui lòng nhập email.";
    } else if (!emailRegex.test(data.email)) {
      e.email = "Email không hợp lệ. Vui lòng nhập lại";
    }

    if (!data.password) {
      e.password = "Vui lòng nhập mật khẩu.";
    } else if (data.password.length < 8) {
      e.password = "Mật khẩu ít nhất 8 ký tự.";
    }

    if (!data.confirmPassword) {
      e.confirmPassword = "Vui lòng nhập lại mật khẩu.";
    } else if (data.password !== data.confirmPassword) {
      e.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    if (!data.agree) e.agree = "Bạn cần đồng ý với điều khoản sử dụng.";

    return e;
  };

  const set = (key: string, value: string | boolean) => {
    setForm((f) => {
      const newForm = { ...f, [key]: value };

      // Validation real-time
      const errs = validate(newForm);
      setErrors((prev) => {
        const newErrors = { ...prev };

        if (errs[key]) {
          newErrors[key] = errs[key];
        } else {
          delete newErrors[key];
        }

        if (key === "password" && newForm.confirmPassword) {
          if (errs.confirmPassword)
            newErrors.confirmPassword = errs.confirmPassword;
          else delete newErrors.confirmPassword;
        }

        return newErrors;
      });

      return newForm;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      setLoading("credentials");
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });
      sessionStorage.setItem("registerEmail", form.email);
      setLoading(null);
      setSuccess(true);
    } catch (error) {
      setLoading(null);
      if (error instanceof Error) {
        setApiError(
          error.message || "Tạo tài khoản thất bại. Vui lòng thử lại.",
        );
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        setApiError(
          (error as { message: string }).message ||
            "Tạo tài khoản thất bại. Vui lòng thử lại.",
        );
      } else {
        setApiError("Tạo tài khoản thất bại. Vui lòng thử lại.");
      }
    }
  };

  const handleSocial = async (provider: "google") => {
    try {
      setErrors({});
      setApiError(null);
      setLoading(provider);

      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      await firebaseLogin({ idToken });

      // Thành công, chuyển hướng về trang chủ hoặc trang trước đó
      router.push(callbackUrl);
    } catch (err: unknown) {
      setLoading(null);
      const error = err as { code?: string };
      if (error?.code === "auth/popup-closed-by-user") return;
      setApiError("Đăng ký bằng Google thất bại. Vui lòng thử lại!");
      console.error("Lỗi Google Auth:", error);
    }
  };

  const handleReset = () => {
    sessionStorage.removeItem("registerEmail");
    setSuccess(false);
    setApiError(null);
    setOtp("");
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (otp.length !== 6) {
      setApiError("Mã OTP phải gồm 6 chữ số.");
      return;
    }
    try {
      await verifyEmail({ email: form.email, otpCode: otp });
      sessionStorage.removeItem("registerEmail");
      router.push("/dang-nhap");
    } catch (error) {
      if (error instanceof Error) {
        setApiError(
          error.message || "Xác thực thất bại. Vui lòng kiểm tra lại OTP.",
        );
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        setApiError(
          (error as { message: string }).message ||
            "Xác thực thất bại. Vui lòng kiểm tra lại OTP.",
        );
      } else {
        setApiError("Xác thực thất bại. Vui lòng kiểm tra lại OTP.");
      }
    }
  };

  const handleResend = async () => {
    setApiError(null);
    try {
      await resendEmail({ email: form.email });
      alert("Đã gửi lại mã OTP. Vui lòng kiểm tra email.");
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message || "Không thể gửi lại email vào lúc này.");
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        setApiError(
          (error as { message: string }).message ||
            "Không thể gửi lại email vào lúc này.",
        );
      } else {
        setApiError("Không thể gửi lại email vào lúc này.");
      }
    }
  };

  if (success) {
    return (
      <AuthCard
        title="Nhập mã xác thực 📬"
        subtitle="Chúng tôi đã gửi mã OTP gồm 6 chữ số đến email của bạn"
      >
        <div className="text-center py-4 space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/15 flex items-center justify-center">
            <span className="text-4xl">🔐</span>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            {apiError && <AlertBox type="error" message={apiError} />}
            <div className="space-y-2">
              <Label htmlFor="otp-code">Mã OTP</Label>
              <Input
                id="otp-code"
                type="text"
                placeholder="Ví dụ: 123456"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="h-12 text-center text-lg font-bold tracking-[0.5em]"
                disabled={isVerifying}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isVerifying || otp.length !== 6}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Đang xác thực...
                </>
              ) : (
                "Xác thực email"
              )}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mt-4">
            Không nhận được email?{" "}
            <button
              className="text-primary hover:underline font-medium"
              onClick={handleResend}
              disabled={isResending}
            >
              {isResending ? "Đang gửi lại..." : "Gửi lại mã"}
            </button>
          </p>
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={handleReset}
          >
            Đăng ký bằng email khác
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Tạo tài khoản miễn phí"
      subtitle="Tham gia cùng 7.000+ người dùng VideoPrompt"
    >
      {/* Social */}
      <SocialButtons
        loading={loading}
        onGoogle={() => handleSocial("google")}
        googleLabel="Đăng ký với Google"
      />

      <AuthDivider />

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {apiError && <AlertBox type="error" message={apiError} />}
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
                className="text-primary hover:underline underline-offset-4 font-medium"
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
          className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold shadow-md shadow-primary/20"
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
          href="/dang-nhap"
          className="text-primary hover:text-primary/90 font-semibold hover:underline underline-offset-4"
        >
          Đăng nhập
        </Link>
      </p>
    </AuthCard>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterPageContent />
    </Suspense>
  );
}
