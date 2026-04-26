"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Check,
  Scan,
  Copy,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Lock,
  Crown,
  Zap,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { membershipApi } from "@/features/membership/api/membership.api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

function fmt(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

const PAYMENT_METHODS = [
  {
    id: "vietqr",
    label: "VietQR / Chuyển khoản",
    icon: "🏦",
    desc: "Chuyển khoản qua mã QR",
    color: "blue",
  },
  {
    id: "momo",
    label: "Ví MoMo",
    icon: "💜",
    desc: "Ví điện tử MoMo",
    color: "violet",
  },
  {
    id: "zalopay",
    label: "ZaloPay",
    icon: "🔵",
    desc: "Thanh toán ZaloPay",
    color: "blue",
  },
];

interface Plan {
  name: string;
  price: number;
  period: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const PLANS: Record<string, Plan> = {
  monthly: {
    name: "Premium Tháng",
    price: 199000,
    period: "tháng",
    description: "Trải nghiệm đầy đủ tính năng Premium",
    icon: Zap,
    color: "cyan",
  },
  yearly: {
    name: "Premium Năm",
    price: 1590000,
    period: "năm",
    description: "Tiết kiệm 30% & Đặc quyền tối đa",
    icon: Crown,
    color: "orange",
  },
};

export function MembershipCheckoutPage() {
  const searchParams = useSearchParams();
  const planKey = searchParams.get("plan") || "monthly";
  const plan = PLANS[planKey] || PLANS.monthly;
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [step, setStep] = useState(1); // 1: Payment, 2: Success
  const [method, setMethod] = useState("vietqr");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(600); // 10 minutes

  useEffect(() => {
    if (!user) {
      router.push("/login?callback=/membership/checkout");
    }
  }, [user, router]);

  useEffect(() => {
    if (step === 1 && countdown > 0) {
      const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    // Simulation: Wait 2 seconds then call the upgrade API
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const res = await membershipApi.upgrade();
      updateUser({
        isPremium: res.isPremium,
        premiumExpiresAt: res.premiumExpiresAt,
      });
      setStep(2);
      toast.success("Thanh toán thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ hỗ trợ.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500/30">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            href="/bang-gia"
            className="group flex items-center gap-2 text-sm font-bold text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Thay đổi gói
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-500 to-amber-600 flex items-center justify-center">
              <Crown className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold tracking-tight">Shop AI Premium</span>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Transaction Details */}
          <div className="lg:col-span-12 xl:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <section>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-orange-500">
                        1
                      </div>
                      <h2 className="text-2xl font-bold tracking-tight">
                        Chọn phương thức thanh toán
                      </h2>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      {PAYMENT_METHODS.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setMethod(m.id)}
                          className={cn(
                            "relative p-6 rounded-[2rem] border transition-all duration-300 text-left overflow-hidden group",
                            method === m.id
                              ? "bg-white/5 border-orange-500/50 shadow-[0_0_40px_rgba(249,115,22,0.1)]"
                              : "bg-white/[0.02] border-white/5 hover:border-white/10",
                          )}
                        >
                          <div
                            className={cn(
                              "absolute -top-12 -right-12 w-24 h-24 blur-3xl rounded-full opacity-20 transition-opacity",
                              method === m.id
                                ? "opacity-40"
                                : "group-hover:opacity-30",
                              m.id === "momo" ? "bg-violet-500" : "bg-blue-500",
                            )}
                          />

                          <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform origin-left">
                            {m.icon}
                          </span>
                          <p className="font-bold text-sm mb-1">{m.label}</p>
                          <p className="text-[10px] text-white/40 font-medium">
                            {m.desc}
                          </p>

                          {method === m.id && (
                            <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                              <Check className="w-3 h-3 text-black stroke-[4px]" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="p-8 sm:p-12 rounded-[3.5rem] bg-linear-to-b from-white/[0.04] to-transparent border border-white/5 relative overflow-hidden">
                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                      <div className="space-y-6">
                        <div>
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-bold uppercase tracking-widest mb-4">
                            <Clock className="w-3 h-3" />
                            Hết hạn sau {formatTime(countdown)}
                          </div>
                          <h3 className="text-xl font-bold mb-2">
                            Thông tin chuyển khoản
                          </h3>
                          <p className="text-sm text-white/40 font-medium">
                            Vui lòng quét mã QR hoặc chuyển đúng số tiền và nội
                            dung để hệ thống kích hoạt tự động.
                          </p>
                        </div>

                        <div className="space-y-4">
                          {[
                            { label: "Ngân hàng", value: "MB Bank (Quân Đội)" },
                            { label: "Chủ tài khoản", value: "NGUYEN QUY" },
                            {
                              label: "Số tài khoản",
                              value: "09123456789",
                              copyable: true,
                            },
                            {
                              label: "Số tiền",
                              value: fmt(plan.price),
                              highlight: true,
                            },
                          ].map((item, i) => (
                            <div
                              key={i}
                              className="flex justify-between items-center group/item"
                            >
                              <span className="text-xs font-bold text-white/30 uppercase tracking-widest">
                                {item.label}
                              </span>
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "font-bold text-sm tracking-tight",
                                    item.highlight
                                      ? "text-orange-500"
                                      : "text-white",
                                  )}
                                >
                                  {item.value}
                                </span>
                                {item.copyable && (
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(item.value);
                                      toast.success("Đã copy số tài khoản!");
                                    }}
                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <p className="text-[10px] font-bold text-orange-500/60 uppercase tracking-widest mb-1">
                                Nội dung chuyển khoản
                              </p>
                              <p className="font-mono text-lg font-black tracking-widest text-white">
                                UPGRADE_PREMIUM_
                                {user.id.slice(0, 8).toUpperCase()}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `UPGRADE_PREMIUM_${user.id.slice(0, 8).toUpperCase()}`,
                                );
                                toast.success("Đã copy nội dung chuyển khoản!");
                              }}
                              className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-black hover:bg-orange-400 transition-colors shadow-lg shadow-orange-500/20"
                            >
                              <Copy className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="relative group">
                          <div className="absolute -inset-4 bg-linear-to-r from-orange-500 to-amber-500 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                          <div className="relative p-6 bg-white rounded-[2rem] shadow-2xl overflow-hidden">
                            <div className="w-48 h-48 bg-slate-100 rounded-xl flex items-center justify-center border-2 border-slate-200">
                              {/* QR Sim Placeholder */}
                              <Scan className="w-24 h-24 text-slate-300" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-lg">
                                  <div className="w-full h-full bg-linear-to-br from-orange-500 to-amber-600 rounded-sm flex items-center justify-center">
                                    <Crown className="w-5 h-5 text-white" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                          Quét mã VietQR bằng App Ngân hàng
                        </p>
                      </div>
                    </div>
                  </section>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Giao dịch an toàn</p>
                        <p className="text-xs text-white/40 font-medium">
                          Mã hóa 256-bit SSL & Kết nối bảo mật
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleConfirmPayment}
                      disabled={loading}
                      className="h-16 px-12 rounded-2xl bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest text-[11px] min-w-[240px] shadow-2xl active:scale-95 transition-all"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>Xác nhận đã chuyển khoản</>
                      )}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-xl mx-auto py-12 text-center space-y-8"
                >
                  <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 bg-orange-500 blur-3xl opacity-30 animate-pulse" />
                    <div className="relative w-32 h-32 rounded-[2.5rem] bg-linear-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-2xl shadow-orange-500/40 border border-orange-400/50">
                      <CheckCircle2 className="w-16 h-16 text-white stroke-[2.5px]" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-4xl font-extrabold tracking-tight">
                      Thanh Toán Hoàn Tất!
                    </h2>
                    <p className="text-white/40 font-medium text-lg leading-relaxed">
                      Chúc mừng <strong>{user.fullName}</strong>! Tài khoản của
                      bạn đã được nâng cấp lên Premium. Bây giờ bạn có thể trải
                      nghiệm toàn bộ kho Prompt & Công cụ AI.
                    </p>
                  </div>

                  <div className="p-8 rounded-[3rem] bg-white/[0.04] border border-white/5 grid grid-cols-2 gap-4 text-left">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                        Loại gói
                      </p>
                      <p className="font-bold">{plan.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                        Hết hạn
                      </p>
                      <p className="font-bold">Dự kiến sau 1 {plan.period}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      asChild
                      className="flex-1 h-14 rounded-2xl bg-white text-black hover:bg-white/90 font-bold uppercase tracking-widest text-[10px]"
                    >
                      <Link href="/prompts-ai">Khám phá Premium Prompt</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1 h-14 rounded-2xl border-white/10 hover:bg-white/5 font-bold uppercase tracking-widest text-[10px]"
                    >
                      <Link href="/tai-khoan">Quản lý tài khoản</Link>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Plan Summary */}
          {step === 1 && (
            <div className="lg:col-span-12 xl:col-span-4 sticky top-32">
              <div className="p-8 rounded-[3rem] bg-white/[0.03] border border-white/5 space-y-8 backdrop-blur-3xl shadow-2xl">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                      planKey === "yearly"
                        ? "bg-orange-500 text-black"
                        : "bg-cyan-500 text-black",
                    )}
                  >
                    <plan.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-white/40 font-medium">
                      {plan.description}
                    </p>
                  </div>
                </div>

                <Separator className="bg-white/5" />

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40 font-medium">
                      Giá gói ({plan.period})
                    </span>
                    <span className="font-bold text-white">
                      {fmt(plan.price)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40 font-medium">
                      Thuế VAT (0%)
                    </span>
                    <span className="font-bold text-white">0đ</span>
                  </div>
                  {planKey === "yearly" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400/80 font-bold">
                        Giảm giá (Ưu đãi Năm)
                      </span>
                      <span className="font-bold text-green-400">-30%</span>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-between items-baseline">
                  <span className="text-sm font-bold uppercase tracking-[0.2em] text-white/30">
                    Tổng cộng
                  </span>
                  <div className="text-right">
                    <p className="text-3xl font-black text-white tracking-tighter">
                      {fmt(plan.price)}
                    </p>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">
                      /{plan.period}
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
                    Quyền lợi bao gồm:
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Toàn bộ 10,000+ Premium Prompts",
                      "Công cụ AI đặc quyền",
                      "Xóa bỏ hoàn toàn quảng cáo",
                      "Hỗ trợ ưu tiên 24/7",
                    ].map((feature, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-xs font-medium text-white/60"
                      >
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest justify-center">
                  <Lock className="w-3 h-3" />
                  Thanh toán bảo mật bởi Shop AI
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Support */}
      <footer className="py-12 border-t border-white/5 mt-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-xs font-medium text-white/30">
            Cần hỗ trợ thanh toán? Liên hệ{" "}
            <Link
              href="tel:0912345678"
              className="text-white hover:text-orange-500 transition-colors"
            >
              0912 345 678
            </Link>
          </p>
          <div className="flex gap-8">
            <Link
              href="/dieu-khoan"
              className="text-[10px] font-bold text-white/20 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1"
            >
              Điều khoản <ExternalLink className="w-2.5 h-2.5" />
            </Link>
            <Link
              href="/chinh-sach-bao-mat"
              className="text-[10px] font-bold text-white/20 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1"
            >
              Chính sách bảo mật <ExternalLink className="w-2.5 h-2.5" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function MembershipCheckout() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
          Loading...
        </div>
      }
    >
      <MembershipCheckoutPage />
    </Suspense>
  );
}
