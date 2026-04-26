"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// ─── Google Icon ──────────────────────────────────────────────
export function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ─── Facebook Icon removed ──────────────────────────────────────────────

// ─── Auth wrapper layout ──────────────────────────────────────
interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  illustrationSlot?: React.ReactNode;
}

export function AuthCard({
  children,
  title,
  subtitle,
  illustrationSlot,
}: AuthCardProps) {
  return (
    <div className="flex-1 flex min-h-screen">
      {/* Left: Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 lg:px-16 relative">
        {/* Back Button */}
        <div className="absolute top-8 left-8 sm:left-12">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-all group font-medium bg-muted/40 px-3.5 py-2 rounded-full border border-border/50"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Quay lại trang chủ
          </Link>
        </div>

        <div className="relative w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </div>
      </div>

      {/* Right: Illustration (hidden on mobile) */}
      {illustrationSlot && (
        <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden bg-linear-to-br from-blue-600 via-violet-600 to-indigo-800">
          {illustrationSlot}
        </div>
      )}
    </div>
  );
}

// ─── Social Buttons ──────────────────────────────────────────
interface SocialButtonsProps {
  loading?: string | null;
  onGoogle?: () => void;
  googleLabel?: string;
}

export function SocialButtons({
  loading,
  onGoogle,
  googleLabel = "Tiếp tục với Google",
}: SocialButtonsProps) {
  return (
    <div className="grid grid-cols-1 gap-3">
      <Button
        id="btn-google-auth"
        variant="outline"
        className="h-11 gap-2.5 border-border/60 hover:bg-accent font-medium w-full"
        onClick={onGoogle}
        disabled={!!loading}
        type="button"
      >
        {loading === "google" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <GoogleIcon className="w-5 h-5" />
        )}
        {googleLabel}
      </Button>
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────
export function AuthDivider() {
  return (
    <div className="relative my-6">
      <Separator />
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
        hoặc tiếp tục với
      </span>
    </div>
  );
}

// ─── Password Input ───────────────────────────────────────────
interface PasswordInputProps extends React.ComponentProps<"input"> {
  id: string;
  label: string;
  error?: string;
}

export function PasswordInput({
  id,
  label,
  error,
  className,
  ...props
}: PasswordInputProps) {
  const [show, setShow] = useState(false);
  const { size: _size, ...rest } = props;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          className={cn(
            "h-11 pr-10",
            error && "border-destructive focus-visible:ring-destructive/30",
            className,
          )}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          tabIndex={-1}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Password Strength ────────────────────────────────────────
export function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "Ít nhất 8 ký tự", ok: password.length >= 8 },
    {
      label: "Chữ hoa và thường",
      ok: /[a-z]/.test(password) && /[A-Z]/.test(password),
    },
    { label: "Có số", ok: /\d/.test(password) },
    { label: "Ký tự đặc biệt", ok: /[^a-zA-Z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const strengthLabel = ["", "Yếu", "Trung bình", "Tốt", "Mạnh"][score] ?? "";
  const strengthColor = [
    "",
    "text-red-500",
    "text-yellow-500",
    "text-blue-500",
    "text-green-500",
  ][score];
  const barColor = [
    "bg-muted",
    "bg-red-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];

  if (!password) return null;

  return (
    <div className="space-y-2 pt-1">
      {/* Bar */}
      <div className="flex gap-1 h-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "flex-1 rounded-full transition-colors duration-300",
              i <= score ? barColor[score] : "bg-muted",
            )}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className={cn("text-xs font-medium", strengthColor)}>
          {strengthLabel && `Độ mạnh: ${strengthLabel}`}
        </span>
      </div>
      <ul className="grid grid-cols-2 gap-1">
        {checks.map((c) => (
          <li key={c.label} className="flex items-center gap-1.5 text-xs">
            <CheckCircle2
              className={cn(
                "w-3.5 h-3.5 transition-colors",
                c.ok ? "text-green-500" : "text-muted-foreground/40",
              )}
            />
            <span
              className={c.ok ? "text-foreground" : "text-muted-foreground"}
            >
              {c.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Alert Box ────────────────────────────────────────────────
interface AlertBoxProps {
  type: "error" | "success" | "info";
  message: string;
}

export function AlertBox({ type, message }: AlertBoxProps) {
  const styles = {
    error: "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400",
    success:
      "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400",
    info: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
  };
  const Icon = type === "success" ? CheckCircle2 : AlertCircle;
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm",
        styles[type],
      )}
    >
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

// ─── Illustration Panel ───────────────────────────────────────
interface IllustrationProps {
  emoji: string;
  title: string;
  points: string[];
}

export function AuthIllustration({ emoji, title, points }: IllustrationProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
      {/* Blob décor */}
      <div className="absolute top-16 right-16 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute bottom-16 left-10 w-56 h-56 bg-white/5 rounded-full blur-3xl" />

      <div className="relative z-10 text-center max-w-sm">
        <div className="text-7xl mb-6">{emoji}</div>
        <h2 className="text-2xl font-extrabold mb-4 leading-tight">{title}</h2>
        <ul className="space-y-3">
          {points.map((p) => (
            <li
              key={p}
              className="flex items-center gap-2.5 text-sm text-white/80"
            >
              <CheckCircle2 className="w-4 h-4 text-white/60 shrink-0" />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
