"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Crown,
  Check,
  Shield,
  Zap,
  Star,
  ArrowRight,
  Coins,
  MoveLeft,
  ArrowLeft,
} from "lucide-react";

const PLANS = {
  monthly: {
    name: "Gói tháng",
    price: 99000,
    priceText: "99.000đ",
    period: "/tháng",
    features: [
      "Truy cập tất cả công cụ AI",
      "Không giới hạn số lượng prompt",
      "Hỗ trợ ưu tiên 24/7",
      "Cập nhật tính năng mới",
    ],
  },
  yearly: {
    name: "Gói năm",
    price: 999000,
    priceText: "999.000đ",
    period: "/năm",
    features: [
      "Truy cập tất cả công cụ AI",
      "Không giới hạn số lượng prompt",
      "Hỗ trợ ưu tiên 24/7",
      "Cập nhật tính năng mới",
      "Tiết kiệm 17% so với gói tháng",
    ],
  },
  lifetime: {
    name: "Gói trọn đời",
    price: 4999000,
    priceText: "4.999.000đ",
    period: "trọn đời",
    features: [
      "Truy cập tất cả công cụ AI",
      "Không giới hạn số lượng prompt",
      "Hỗ trợ ưu tiên 24/7",
      "Cập nhật tính năng mới",
      "Truy cập trọn đời",
      "Tiết kiệm 58% so với gói tháng",
    ],
  },
};

const PAYMENT_METHODS = [
  { id: "balance", name: "Số dư tài khoản", icon: Coins, type: "balance" },
];

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") || "monthly";
  const [selectedPlan, setSelectedPlan] = useState(planParam);
  const [paymentMethod, setPaymentMethod] = useState("balance");
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if plan is specified in URL (user came from membership page)
  const hasPlanParam = searchParams.has("plan");

  // Mock user balance - in real app, this would come from user data
  const userBalance = 1500000;
  const balanceText = "1.500.000đ";

  const currentPlan =
    PLANS[selectedPlan as keyof typeof PLANS] || PLANS.monthly;

  const hasEnoughBalance = userBalance >= currentPlan.price;

  const handlePayment = () => {
    setIsProcessing(true);
    // TODO: Implement payment logic
    setTimeout(() => {
      setIsProcessing(false);
      if (paymentMethod === "balance") {
        const remainingBalance = userBalance - currentPlan.price;
        alert(
          `Thanh toán ${currentPlan.name} bằng số dư tài khoản. Số dư còn lại: ${(remainingBalance / 1000).toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ`,
        );
      } else {
        alert(
          `Thanh toán ${currentPlan.name} qua ${paymentMethod.toUpperCase()}`,
        );
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Nâng cấp tài khoản
          </h1>
          <p className="text-slate-400 text-lg">
            Chọn gói phù hợp nhất với nhu cầu của bạn
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Plan Selection - only show if no plan specified in URL */}
          {!hasPlanParam ? (
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4">
                Chọn gói
              </h2>

              {Object.entries(PLANS).map(([key, plan]) => (
                <div
                  key={key}
                  className={`border-2 cursor-pointer transition-all hover:border-violet-500 rounded-xl ${
                    selectedPlan === key
                      ? "border-violet-500 bg-violet-500/10"
                      : "border-slate-700 bg-slate-900/50"
                  }`}
                  onClick={() => setSelectedPlan(key)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {plan.name}
                        </h3>
                        <p className="text-3xl font-bold text-violet-400">
                          {plan.priceText}
                          <span className="text-base font-normal text-slate-400 ml-2">
                            {plan.period}
                          </span>
                        </p>
                      </div>
                      {selectedPlan === key && (
                        <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="border-t border-slate-700 my-4" />
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-slate-300"
                        >
                          <Check className="w-4 h-4 text-green-400 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Selected Plan Summary - shown when plan is specified in URL */
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4">
                Gói đã chọn
              </h2>

              <div className="border-2 border-violet-500 bg-violet-500/10 rounded-xl">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {currentPlan.name}
                      </h3>
                      <p className="text-4xl font-bold text-violet-400">
                        {currentPlan.priceText}
                        <span className="text-lg font-normal text-slate-400 ml-2">
                          {currentPlan.period}
                        </span>
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="border-t border-slate-700 my-4" />
                  <ul className="space-y-3">
                    {currentPlan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-slate-300"
                      >
                        <Check className="w-4 h-4 text-green-400 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link
                href="/bang-gia"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-violet-400 transition-colors"
              >
                <ArrowLeft size={18} />
                Quay lại chọn gói khác
              </Link>
            </div>
          )}

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <div className="border border-slate-700 bg-slate-900/50 rounded-xl sticky top-24">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6">
                  Tóm tắt thanh toán
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-slate-300">
                    <span>Gói chọn:</span>
                    <span className="text-white font-medium">
                      {currentPlan.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Giá:</span>
                    <span className="text-white font-medium">
                      {currentPlan.priceText}
                    </span>
                  </div>
                  <div className="border-t border-slate-700" />
                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>Tổng thanh toán:</span>
                    <span className="text-violet-400">
                      {currentPlan.priceText}
                    </span>
                  </div>
                </div>

                {/* User Balance Display */}
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-600/10 border border-violet-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm text-slate-300">
                        Số dư tài khoản:
                      </span>
                    </div>
                    <span className="text-lg font-bold text-yellow-400">
                      {balanceText}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white mb-3">
                    Phương thức thanh toán
                  </h3>
                  <div className="space-y-2">
                    {PAYMENT_METHODS.map((method) => {
                      const isBalanceMethod = method.type === "balance";
                      const isInsufficient =
                        isBalanceMethod && !hasEnoughBalance;

                      return (
                        <label
                          key={method.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            paymentMethod === method.id
                              ? isBalanceMethod
                                ? "border-yellow-500 bg-yellow-500/10"
                                : "border-violet-500 bg-violet-500/10"
                              : isInsufficient
                                ? "border-slate-700 bg-slate-800/50 opacity-50 cursor-not-allowed"
                                : "border-slate-700 bg-slate-800/50 hover:bg-slate-800"
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                              if (!isInsufficient) {
                                setPaymentMethod(e.target.value);
                              }
                            }}
                            disabled={isInsufficient}
                            className="w-4 h-4 accent-violet-500"
                          />
                          <method.icon
                            className={`w-5 h-5 ${
                              isBalanceMethod
                                ? "text-yellow-400"
                                : "text-violet-400"
                            }`}
                          />
                          <div className="flex-1">
                            <span className="text-white">{method.name}</span>
                            {isBalanceMethod && hasEnoughBalance && (
                              <span className="ml-2 text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                                Đủ tiền
                              </span>
                            )}
                            {isBalanceMethod && !hasEnoughBalance && (
                              <span className="ml-2 text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
                                Không đủ tiền
                              </span>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 border-0 text-white font-semibold"
                >
                  {isProcessing ? (
                    "Đang xử lý..."
                  ) : (
                    <>
                      Thanh toán ngay
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <div className="mt-6 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    <div className="text-sm text-slate-400">
                      <p className="font-semibold text-slate-300 mb-1">
                        Bảo mật tuyệt đối
                      </p>
                      <p>
                        Thông tin thanh toán của bạn được bảo mật và mã hóa theo
                        tiêu chuẩn bảo mật quốc tế.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4 p-6 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">
                Kích hoạt ngay lập tức
              </h3>
              <p className="text-slate-400 text-sm">
                Sau khi thanh toán, tài khoản của bạn sẽ được nâng cấp ngay lập
                tức
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
              <Star className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">
                Hỗ trợ chuyên nghiệp
              </h3>
              <p className="text-slate-400 text-sm">
                Đội ngũ hỗ trợ 24/7 luôn sẵn sàng giải đáp mọi thắc mắc của bạn
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">
                Hoàn tiền trong 7 ngày
              </h3>
              <p className="text-slate-400 text-sm">
                Không hài lòng? Hoàn tiền 100% trong vòng 7 ngày, không cần lý
                do
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutPageContent />
    </Suspense>
  );
}
