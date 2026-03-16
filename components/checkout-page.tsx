"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Check,
  Smartphone,
  Scan,
  Copy,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { MOCK_CART_ITEMS } from "@/lib/shop-data";

function fmt(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

const STEPS = ["Thông tin", "Thanh toán", "Xác nhận"];

const PAYMENT_METHODS = [
  {
    id: "vietqr",
    label: "VietQR / Chuyển khoản",
    icon: "🏦",
    desc: "Chuyển khoản ngân hàng qua QR code",
  },
  { id: "momo", label: "Ví MoMo", icon: "💜", desc: "Thanh toán qua ví MoMo" },
  {
    id: "zalopay",
    label: "ZaloPay",
    icon: "🔵",
    desc: "Thanh toán qua ZaloPay",
  },
  {
    id: "card",
    label: "Thẻ tín dụng / Debit",
    icon: "💳",
    desc: "Visa, Mastercard, JCB",
  },
];

type FormData = {
  name: string;
  email: string;
  phone: string;
  note: string;
};

const subtotal = MOCK_CART_ITEMS.reduce((s, i) => s + i.price, 0);

// ── Step 1: Contact Info ─────────────────────────────────────
function StepInfo({
  form,
  setForm,
  onNext,
}: {
  form: FormData;
  setForm: (f: FormData) => void;
  onNext: () => void;
}) {
  const valid = form.name && form.email && form.phone;

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">
            Họ và tên <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Nguyễn Văn A"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="h-11"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">
            Số điện thoại <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            placeholder="0912 345 678"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="h-11"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          placeholder="email@example.com"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="h-11"
        />
        <p className="text-xs text-muted-foreground">
          Thông tin kích hoạt tài khoản sẽ gửi về email này
        </p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="note">Ghi chú (tuỳ chọn)</Label>
        <textarea
          id="note"
          rows={3}
          placeholder="Yêu cầu đặc biệt..."
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className="w-full rounded-xl border border-border/60 bg-background px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
      </div>
      <Button
        onClick={onNext}
        disabled={!valid}
        className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-semibold gap-2"
      >
        Tiếp tục chọn thanh toán
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

// ── Step 2: Payment ──────────────────────────────────────────
function QRPayment() {
  const [copied, setCopied] = useState(false);
  const [code] = useState(() => "VP-" + Math.random().toString(36).slice(2, 8).toUpperCase());

  return (
    <div className="space-y-4 animate-scale-in">
      <div className="rounded-2xl border border-border/60 bg-card p-5 text-center">
        {/* QR placeholder */}
        <div className="w-48 h-48 mx-auto mb-4 rounded-2xl bg-white p-3 flex items-center justify-center relative">
          <div className="absolute inset-3 border-4 border-blue-600 rounded-xl" />
          <div className="text-4xl">📱</div>
          <div className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4 border-blue-800 rounded-tl-lg" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4 border-blue-800 rounded-tr-lg" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4 border-blue-800 rounded-bl-lg" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4 border-blue-800 rounded-br-lg" />
        </div>
        <p className="text-sm font-semibold mb-1">Quét mã QR để thanh toán</p>
        <p className="text-xs text-muted-foreground mb-4">
          Tương thích mọi app ngân hàng
        </p>

        <div className="grid grid-cols-2 gap-3 text-left text-sm">
          {[
            { label: "Ngân hàng", value: "MB Bank" },
            { label: "Chủ tài khoản", value: "NGUYEN VAN KHOA" },
            { label: "Số TK", value: "0912345678901" },
            { label: "Số tiền", value: fmt(subtotal) },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="font-semibold text-sm">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-muted/50 border border-border/40 px-3 py-2">
          <p className="text-xs font-mono flex-1 text-muted-foreground">
            Nội dung: <span className="text-foreground font-bold">{code}</span>
          </p>
          <button
            onClick={() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className={cn(
              "text-xs font-semibold flex items-center gap-1 transition-colors",
              copied ? "text-green-400" : "text-blue-400",
            )}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground rounded-xl bg-blue-500/5 border border-blue-500/20 px-4 py-3">
        <Scan className="w-4 h-4 text-blue-400 shrink-0" />
        Đơn hàng sẽ được kích hoạt tự động sau khi chuyển khoản thành công (1-5
        phút)
      </div>
    </div>
  );
}

function StepPayment({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const [method, setMethod] = useState("vietqr");

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Method selector */}
      <div className="grid grid-cols-2 gap-2">
        {PAYMENT_METHODS.map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={cn(
              "flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all duration-150",
              method === m.id
                ? "border-blue-500/60 bg-blue-500/8 shadow-sm shadow-blue-500/10"
                : "border-border/60 bg-card hover:border-border",
            )}
          >
            <span className="text-xl">{m.icon}</span>
            <div className="min-w-0">
              <p className="text-xs font-semibold leading-tight">{m.label}</p>
              <p className="text-[10px] text-muted-foreground truncate">
                {m.desc}
              </p>
            </div>
            {method === m.id && (
              <div className="ml-auto w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Payment content */}
      {method === "vietqr" && <QRPayment />}

      {(method === "momo" || method === "zalopay") && (
        <div className="rounded-2xl border border-border/60 bg-card p-6 text-center animate-scale-in">
          <div className="text-5xl mb-3">{method === "momo" ? "💜" : "🔵"}</div>
          <p className="font-semibold mb-2">
            Thanh toán qua {method === "momo" ? "MoMo" : "ZaloPay"}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Nhấn nút bên dưới để mở ứng dụng và thanh toán
          </p>
          <Button className="bg-violet-600 hover:bg-violet-700 gap-2">
            <Smartphone className="w-4 h-4" />
            Mở {method === "momo" ? "MoMo" : "ZaloPay"}
          </Button>
        </div>
      )}

      {method === "card" && (
        <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-4 animate-scale-in">
          <div className="space-y-1.5">
            <Label>Số thẻ</Label>
            <Input
              placeholder="1234 5678 9012 3456"
              className="h-11 font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Ngày hết hạn</Label>
              <Input placeholder="MM/YY" className="h-11" />
            </div>
            <div className="space-y-1.5">
              <Label>CVV</Label>
              <Input placeholder="123" type="password" className="h-11" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Tên chủ thẻ</Label>
            <Input placeholder="NGUYEN VAN A" className="h-11 uppercase" />
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 gap-2">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2"
        >
          Xác nhận đặt hàng <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// ── Step 3: Success ──────────────────────────────────────────
function StepSuccess({ name }: { name: string }) {
  const [orderId] = useState(() => Date.now().toString().slice(-6))
  return (
    <div className="text-center py-8 animate-scale-in">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full bg-green-500/20 animate-pulse-ring" />
        <div className="relative w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center border border-green-500/30">
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </div>
      </div>
      <h2 className="text-2xl font-extrabold mb-2">Đặt hàng thành công! 🎉</h2>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        Cảm ơn <strong>{name || "bạn"}</strong>! Thông tin kích hoạt đã gửi về
        email của bạn. Vui lòng kiểm tra hộp thư.
      </p>

      <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4 max-w-sm mx-auto mb-6 text-left">
        <p className="text-xs font-semibold text-muted-foreground mb-2">
          Mã đơn hàng
        </p>
        <p className="font-mono font-bold text-lg text-foreground">
          VP-{orderId}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Lưu lại mã này để tra cứu đơn hàng
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Link href="/orders">Xem đơn hàng</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Về trang chủ</Link>
        </Button>
      </div>
    </div>
  );
}

// ── Main Checkout ────────────────────────────────────────────
export function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    note: "",
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/40 backdrop-blur-sm sticky top-16 z-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/cart"
              className="hover:text-foreground transition-colors"
            >
              Giỏ hàng
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium">Thanh toán</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main form */}
          <div className="lg:col-span-3">
            {/* Stepper */}
            {step < 2 && (
              <div className="flex items-center gap-0 mb-8">
                {STEPS.map((s, i) => (
                  <div
                    key={s}
                    className="flex items-center flex-1 last:flex-none"
                  >
                    <div
                      className={cn(
                        "flex items-center gap-2",
                        i < step
                          ? "text-green-400"
                          : i === step
                            ? "text-blue-400"
                            : "text-muted-foreground",
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300",
                          i < step
                            ? "bg-green-500 border-green-500 text-white"
                            : i === step
                              ? "border-blue-500 bg-blue-500/10 text-blue-400"
                              : "border-border text-muted-foreground",
                        )}
                      >
                        {i < step ? <Check className="w-4 h-4" /> : i + 1}
                      </div>
                      <span className="text-sm font-medium hidden sm:block">
                        {s}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={cn(
                          "flex-1 h-px mx-3 transition-colors duration-300",
                          i < step ? "bg-green-500" : "bg-border",
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Form title */}
            {step < 2 && (
              <h1 className="text-xl font-extrabold mb-6">{STEPS[step]}</h1>
            )}

            {step === 0 && (
              <StepInfo
                form={form}
                setForm={setForm}
                onNext={() => setStep(1)}
              />
            )}
            {step === 1 && (
              <StepPayment
                onNext={() => setStep(2)}
                onBack={() => setStep(0)}
              />
            )}
            {step === 2 && <StepSuccess name={form.name} />}
          </div>

          {/* Order summary */}
          {step < 2 && (
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-border/60 bg-card p-5 sticky top-32">
                <h2 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  Đơn hàng của bạn
                </h2>

                <div className="space-y-3 mb-4">
                  {MOCK_CART_ITEMS.map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-border/50 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium line-clamp-2 leading-tight">
                          {item.name}
                        </p>
                        {item.duration && (
                          <p className="text-[10px] text-muted-foreground">
                            {item.duration}
                          </p>
                        )}
                      </div>
                      <span className="text-xs font-bold shrink-0">
                        {fmt(item.price)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="my-3" />
                <div className="flex justify-between items-center">
                  <span className="font-bold">Tổng</span>
                  <span className="font-extrabold text-xl text-blue-400">
                    {fmt(subtotal)}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Lock className="w-3 h-3 text-green-400" />
                  Thanh toán an toàn 256-bit SSL
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
