"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Crown,
  Zap,
  ShieldCheck,
  Sparkles,
  Rocket,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  membershipApi,
  MembershipPlan,
} from "@/features/membership/api/membership.api";

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPremium: boolean;
  isCurrent: boolean;
  onUpgrade: () => void;
  isLoading: boolean;
  highlight?: boolean;
}

const PricingCard = ({
  title,
  price,
  period,
  description,
  features,
  isPremium,
  isCurrent,
  onUpgrade,
  isLoading,
  highlight = false,
}: PricingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "relative p-10 rounded-[3rem] border backdrop-blur-3xl transition-all duration-500 overflow-hidden group h-full flex flex-col",
        highlight
          ? "bg-linear-to-b from-white/8 to-white/3 border-orange-500/30 shadow-[0_0_80px_rgba(249,115,22,0.12)]"
          : isPremium
            ? "bg-linear-to-b from-white/6 to-white/2 border-white/10 shadow-[0_0_80px_rgba(249,115,22,0.08)]"
            : "bg-white/3 border-white/5 hover:border-white/10 shadow-2xl hover:shadow-cyan-500/5",
      )}
    >
      {/* Subtle Glow Accent */}
      <div
        className={cn(
          "absolute -top-32 -right-32 w-64 h-64 blur-[100px] rounded-full transition-all duration-1000 opacity-20 group-hover:opacity-30",
          isPremium ? "bg-cyan-500" : "bg-cyan-500",
        )}
      />

      <div className="relative z-10 space-y-10 flex-1 flex flex-col">
        <div className="space-y-5">
          <div
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-all group-hover:scale-110",
              isPremium
                ? "bg-linear-to-br from-cyan-500 to-cyan-600 shadow-cyan-500/30"
                : "bg-linear-to-br from-white/10 to-white/5 shadow-white/5",
            )}
          >
            {isPremium ? (
              <Crown className="w-7 h-7 text-white" />
            ) : (
              <Zap className="w-7 h-7 text-white" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold text-white tracking-tight leading-none">
                {title}
              </h3>
              {highlight && (
                <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-[8px] font-black uppercase text-black tracking-widest">
                  Tiết kiệm %
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-white/40 tracking-wide uppercase text-[10px] mt-2">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-white tracking-tighter">
            {price}
          </span>
          <span className="text-xs font-semibold text-white/30 tracking-widest uppercase">
            / {period}
          </span>
        </div>

        <div className="space-y-4 pt-8 border-t border-white/10 flex-1">
          {features.map((feature: string, i: number) => (
            <div key={i} className="flex items-start gap-4 group/item">
              <div
                className={cn(
                  "w-5 h-5 mt-0.5 rounded-full flex items-center justify-center transition-all shrink-0",
                  isPremium
                    ? "bg-cyan-500/10 text-cyan-400 group-hover/item:bg-cyan-500 group-hover/item:text-black"
                    : "bg-white/5 text-white/40 group-hover/item:bg-white group-hover/item:text-black",
                )}
              >
                <Check className="w-3 h-3 stroke-[3px]" />
              </div>
              <span className="text-sm font-medium text-white/60 group-hover/item:text-white transition-colors leading-relaxed">
                {feature}
              </span>
            </div>
          ))}
        </div>

        <Button
          disabled={isCurrent || isLoading}
          onClick={onUpgrade}
          className={cn(
            "w-full h-14 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:grayscale mt-auto",
            isCurrent
              ? "bg-white/5 border border-white/5 text-white/30 cursor-default"
              : isPremium
                ? "bg-linear-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white shadow-cyan-500/20"
                : "bg-white text-black hover:bg-white/90",
          )}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isCurrent ? (
            "Gói của bạn"
          ) : isPremium ? (
            "Nâng cấp ngay"
          ) : (
            "Gói hiện tại"
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default function MembershipPage() {
  const { user } = useAuthStore();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const router = useRouter();

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["membership-plans"],
    queryFn: () => membershipApi.getPlans(),
  });

  const handleUpgrade = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để nâng cấp!");
      router.push("/login?callback=/membership");
      return;
    }

    // Chuyển sang trang thanh toán
    router.push(`/membership/checkout?plan=${billingPeriod}`);
  };

  const faqs = [
    {
      question: "Shop AI Premium là gì?",
      answer:
        "Shop AI Premium là gói hội viên cao cấp cho phép bạn truy cập toàn bộ kho Prompt chất lượng cao, các công cụ AI bản quyền và nhận ưu đãi đặc quyền từ hệ sinh thái Shop AI.",
    },
    {
      question: "Sự khác biệt giữa gói Tháng và gói Năm?",
      answer:
        "Gói Năm giúp bạn tiết kiệm lên đến 30% chi phí so với gói Tháng. Ngoài ra, hội viên gói Năm còn nhận được các khóa học Premium độc quyền và hỗ trợ ưu tiên từ đội ngũ chuyên gia.",
    },
    {
      question: "Tôi có thể hủy gói bất kỳ lúc nào không?",
      answer:
        "Có, bạn hoàn toàn có thể hủy gia hạn gói hội viên bất kỳ lúc nào trong cài đặt tài khoản. Sau khi hủy, bạn vẫn được sử dụng quyền lợi Premium cho đến khi hết thời hạn gói hiện tại.",
    },
    {
      question: "Hỗ trợ các phương thức thanh toán nào?",
      answer:
        "Chúng tôi hỗ trợ đa dạng phương thức: Chuyển khoản ngân hàng, Ví điện tử (Momo, ZaloPay), và các loại thẻ nội địa/quốc tế qua cổng thanh toán bảo mật.",
    },
    {
      question: "Prompt Premium có gì đặc biệt?",
      answer:
        "Prompt Premium được tinh chỉnh bởi các chuyên gia, đảm bảo độ chính xác cao, có hướng dẫn sử dụng chi tiết và các tham số tối ưu cho từng mô hình AI như ChatGPT, Midjourney, Claude...",
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(price)
      .replace("₫", "đ");
  };

  const freePlan =
    plans.find((p: MembershipPlan) => p.type === "FREE") ||
    plans.find((p: MembershipPlan) => p.price === 0);
  const premiumPlans = plans.filter(
    (p: MembershipPlan) => p.type === "PREMIUM",
  );

  const displayPremiumPlan =
    billingPeriod === "monthly"
      ? premiumPlans.find((p: MembershipPlan) => p.duration <= 31) ||
        premiumPlans.find((p: MembershipPlan) => p.duration < 365)
      : premiumPlans.find((p: MembershipPlan) => p.duration >= 365);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
      {/* Background Decorative Gradient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/5 blur-[120px] rounded-full animate-float-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/5 blur-[120px] rounded-full animate-float-slow [animation-delay:2s]" />
      </div>

      <div className="relative py-10">
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8 mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 font-bold uppercase text-[10px] tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Gói Hội Viên Độc Quyền
            </div>

            <h1 className="text-[38px] sm:text-[48px] font-bold leading-tight tracking-tight text-white m-0">
              Nâng Tầm Trải Nghiệm <br />
              <span className="bg-linear-to-r from-orange-400 via-amber-200 to-orange-400 bg-clip-text text-transparent opacity-90">
                AI Premium Power
              </span>
            </h1>

            <p className="text-white/40 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
              Mở khóa sức mạnh tuyệt đối từ hàng ngàn Prompt đỉnh cao, công cụ
              AI bản quyền và đội ngũ hỗ trợ chuyên nghiệp 24/7.
            </p>

            {/* Billing Toggle (Monthly/Yearly) */}
            <div className="flex justify-center mt-12">
              <div className="p-1 rounded-2xl bg-white/2 border border-white/5 flex gap-1">
                <button
                  onClick={() => setBillingPeriod("monthly")}
                  className={cn(
                    "px-8 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest",
                    billingPeriod === "monthly"
                      ? "bg-white text-black shadow-lg shadow-white/5"
                      : "text-white/40 hover:text-white/60",
                  )}
                >
                  Theo Tháng
                </button>
                <button
                  onClick={() => setBillingPeriod("yearly")}
                  className={cn(
                    "px-8 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest relative overflow-hidden",
                    billingPeriod === "yearly"
                      ? "bg-white text-black shadow-lg shadow-white/5"
                      : "text-white/40 hover:text-white/60",
                  )}
                >
                  Theo Năm
                  <span className="absolute top-0 right-0 px-1.5 py-0.5 bg-cyan-500 text-[6px] font-black text-black">
                    -30%
                  </span>
                </button>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto items-stretch">
            {freePlan ? (
              <PricingCard
                title={freePlan.name}
                price={
                  freePlan.price === 0 ? "0đ" : formatPrice(freePlan.price)
                }
                period={
                  freePlan.duration >= 365
                    ? "năm"
                    : freePlan.duration >= 28
                      ? "tháng"
                      : "vĩnh viễn"
                }
                description={freePlan.description || ""}
                features={freePlan.features || []}
                isPremium={false}
                isCurrent={!user?.isPremium}
                onUpgrade={() => {}}
                isLoading={false}
              />
            ) : (
              <div className="p-10 rounded-[3rem] border border-white/5 bg-white/0.03 flex items-center justify-center">
                <p className="text-white/20">Chưa có gói miễn phí</p>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={billingPeriod}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {displayPremiumPlan ? (
                  <PricingCard
                    title={displayPremiumPlan.name}
                    price={formatPrice(displayPremiumPlan.price)}
                    period={
                      displayPremiumPlan.duration >= 365 ? "năm" : "tháng"
                    }
                    description={displayPremiumPlan.description || ""}
                    features={displayPremiumPlan.features || []}
                    isPremium={true}
                    isCurrent={user?.isPremium ?? false}
                    onUpgrade={handleUpgrade}
                    isLoading={isLoading}
                    highlight={billingPeriod === "yearly"}
                  />
                ) : (
                  <div className="p-10 rounded-[3rem] border border-white/5 bg-white/0.03 flex items-center justify-center h-full">
                    <p className="text-white/20">
                      Chưa có gói Premium{" "}
                      {billingPeriod === "monthly" ? "tháng" : "năm"}
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Benefits Grid */}
          <div className="mt-32 grid grid-cols-1 sm:grid-cols-3 gap-8 mb-32">
            <div className="p-8 rounded-[2.5rem] bg-white/2 border border-white/5 space-y-4">
              <Rocket className="w-10 h-10 text-cyan-500" />
              <h4 className="text-lg font-bold tracking-tight">
                Tốc độ & Tiện lợi
              </h4>
              <p className="text-sm text-white/40 leading-relaxed font-medium">
                Tiết kiệm 90% thời gian tạo nội dung với kho Prompt được tinh
                chỉnh sẵn.
              </p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-white/2 border border-white/5 space-y-4">
              <ShieldCheck className="w-10 h-10 text-cyan-500" />
              <h4 className="text-lg font-bold tracking-tight">
                Chất lượng chuyên gia
              </h4>
              <p className="text-sm text-white/40 leading-relaxed font-medium">
                Mọi Prompt được kiểm duyệt bởi đội ngũ kỹ thuật AI dày dặn kinh
                nghiệm.
              </p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-white/2 border border-white/5 space-y-4">
              <Sparkles className="w-10 h-10 text-amber-500" />
              <h4 className="text-lg font-bold tracking-tight">
                Cập nhật liên tục
              </h4>
              <p className="text-sm text-white/40 leading-relaxed font-medium">
                Luôn đi đầu xu hướng với các Prompt cho các mô hình AI mới nhất
                trên thị trường.
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto pt-20 border-t border-white/5">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-[32px] font-bold tracking-tight">
                Câu hỏi thường gặp
              </h2>
              <p className="text-white/40 font-medium">
                Giải đáp các thắc mắc về gói hội viên Premium
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="rounded-3xl bg-white/2 border border-white/5 px-8 py-2 overflow-hidden hover:bg-white/4 transition-all"
                >
                  <AccordionTrigger className="text-sm font-bold text-white hover:text-orange-400 no-underline hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm font-medium text-white/40 leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-32 p-12 rounded-[4rem] bg-linear-to-b from-white/4 to-transparent border border-white/5 text-center"
          >
            <div className="space-y-8 max-w-xl mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-cyan-500/20 flex items-center justify-center mx-auto">
                <Flame className="w-10 h-10 text-cyan-500" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight leading-tight">
                Bắt đầu hành trình <br /> chinh phục AI ngay hôm nay
              </h2>
              <p className="text-white/40 font-medium">
                Đừng bỏ lỡ cơ hội sở hữu bộ công cụ mạnh mẽ nhất để nâng cao
                hiệu suất công việc của bạn.
              </p>
              <Button
                onClick={() => setBillingPeriod("yearly")}
                className="h-14 px-12 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-black font-black uppercase tracking-widest text-[11px]"
              >
                Nhận ưu đãi gói Năm ngay
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
