"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Check,
  Scan,
  Copy,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn, formatCurrency } from "@/lib/utils";
import { CartItemResponse, CheckoutResponse } from "@/features/carts/types";
import { useCheckoutCart, useMyCart } from "@/features/carts/hooks/use-carts";

const STEPS = ["Thông tin", "Thanh toán", "Xác nhận"];

const PAYMENT_METHODS = [
  {
    id: "vietqr",
    label: "VietQR / Chuyển khoản",
    icon: "🏦",
    desc: "Chuyển khoản ngân hàng qua QR code",
  },
];

type FormData = {
  name: string;
  email: string;
  phone: string;
  note: string;
};

// ── Step 1: Contact Info ─────────────────────────────────────
function StepInfo({
  form,
  setForm,
  onNext,
  isLoading,
}: {
  form: FormData;
  setForm: (f: FormData) => void;
  onNext: () => void;
  isLoading: boolean;
}) {
  const valid = form.name && form.email;

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
          <Label htmlFor="phone">Số điện thoại</Label>
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
          Tài khoản sẽ được cấp phát về email này
        </p>
      </div>
      <Button
        onClick={onNext}
        disabled={!valid || isLoading}
        className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-semibold gap-2"
      >
        {isLoading ? "Đang tạo đơn..." : "Tiến hành chọn Thanh toán"}
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

// ── Step 2: Payment ──────────────────────────────────────────
function QRPayment({ orderData }: { orderData: CheckoutResponse | null }) {
  const [copied, setCopied] = useState(false);

  if (!orderData) return <div>Đang tải...</div>;

  const code = orderData.transferContent;
  const subtotal = orderData.totalAmount;

  return (
    <div className="space-y-4 animate-scale-in">
      <div className="rounded-2xl border border-border/60 bg-card p-5 text-center">
        {/* QR placeholder or use VietQR API */}
        <div className="w-48 h-48 mx-auto mb-4 rounded-2xl bg-white p-2">
          <Image
            src={`https://img.vietqr.io/image/MB-0912345678901-compact2.png?amount=${subtotal}&addInfo=${code}&accountName=QUAN%20LY%20SHOPAI`}
            alt="VietQR"
            width={192}
            height={192}
            className="w-full h-full object-contain"
          />
        </div>
        <p className="text-sm font-semibold mb-1">Quét mã QR để thanh toán</p>
        <p className="text-xs text-muted-foreground mb-4">
          Hệ thống duyệt tự động trong 10 giây
        </p>

        <div className="grid grid-cols-2 gap-3 text-left text-sm">
          {[
            { label: "Số tiền", value: formatCurrency(subtotal) },
            { label: "Ngân hàng", value: "MB Bank" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="font-semibold text-sm text-blue-500">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-muted/50 border border-border/40 px-3 py-2">
          <p className="text-xs font-mono flex-1 text-muted-foreground text-left">
            Thông điệp ghi chú:{" "}
            <span className="text-foreground font-bold">{code}</span>
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(code);
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
            {copied ? "Đã copy" : "Copy"}
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground rounded-xl bg-blue-500/5 border border-blue-500/20 px-4 py-3">
        <Scan className="w-4 h-4 text-blue-400 shrink-0" />
        Sau khi chuyển khoản, bộ đếm hệ thống tự động quét và kích hoạt đơn hàng
        cho bạn ngay lập tức.
      </div>
    </div>
  );
}

function StepPayment({
  onNext,
  onBack,
  orderData,
}: {
  onNext: () => void;
  onBack: () => void;
  orderData: CheckoutResponse | null;
}) {
  const [method, setMethod] = useState("vietqr");

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Method selector */}
      <div className="grid grid-cols-1 gap-2">
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

      <QRPayment orderData={orderData} />

      <div className="flex gap-3">
        <Button
          onClick={onNext}
          className="w-full bg-green-600 hover:bg-green-700 gap-2 font-bold"
        >
          Tôi đã thanh toán <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// ── Step 3: Success ──────────────────────────────────────────
function StepSuccess({ email }: { email: string }) {
  return (
    <div className="text-center py-8 animate-scale-in">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full bg-green-500/20 animate-pulse-ring" />
        <div className="relative w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center border border-green-500/30">
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </div>
      </div>
      <h2 className="text-2xl font-extrabold mb-2">Đơn hàng đang duyệt! 🎉</h2>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        Tài khoản truy cập AI sản phẩm sẽ được gửi tới <strong>{email}</strong>{" "}
        ngay sau khi quá trình đối soát tiền ngân hàng tải xong trong giây lát.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Link href="/don-hang">Kiểm tra đơn mua</Link>
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
  const cartQuery = useMyCart();
  const checkoutMutation = useCheckoutCart();
  const [orderResult, setOrderResult] = useState<CheckoutResponse | null>(null);

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    note: "",
  });

  const items = cartQuery.data?.items || [];
  const subtotal = cartQuery.data?.totalAmount || 0;

  const handleCreateOrder = async () => {
    try {
      const res = await checkoutMutation.mutateAsync(undefined);
      setOrderResult(res);
      setStep(1); // Proceed to QR step
    } catch {}
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/40 backdrop-blur-sm sticky top-16 z-20">
        <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/gio-hang"
              className="hover:text-foreground transition-colors"
            >
              Giỏ hàng
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium">
              Thanh toán tự động
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                onNext={handleCreateOrder}
                isLoading={checkoutMutation.isPending}
              />
            )}
            {step === 1 && (
              <StepPayment
                orderData={orderResult}
                onNext={() => setStep(2)}
                onBack={() => setStep(0)}
              />
            )}
            {step === 2 && <StepSuccess email={form.email} />}
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
                  {items.map((item: CartItemResponse) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-border/50 shrink-0">
                        <Image
                          src={
                            item.thumbnailUrl ||
                            "https://via.placeholder.com/150"
                          }
                          alt={item.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium line-clamp-2 leading-tight">
                          {item.name}
                        </p>
                      </div>
                      <span className="text-xs font-bold shrink-0">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="my-3" />
                <div className="flex justify-between items-center">
                  <span className="font-bold">Tổng</span>
                  <span className="font-extrabold text-xl text-blue-400">
                    {orderResult
                      ? formatCurrency(orderResult.totalAmount)
                      : formatCurrency(subtotal)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
