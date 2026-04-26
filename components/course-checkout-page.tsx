"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Wallet
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/lib/data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

function formatPrice(price: number) {
  return price.toLocaleString("vi-VN") + "đ";
}

const PAYMENT_METHODS = [
  { id: "vnpay", name: "Thanh toán qua VNPay", icon: "💳", desc: "Thẻ ATM / Internet Banking / QR Code" },
  { id: "momo", name: "Ví Momo", icon: "🪪", desc: "Quét mã QR qua ứng dụng Momo" },
  { id: "zalopay", name: "Ví ZaloPay", icon: "📱", desc: "Thanh toán tiện lợi qua Zalo" },
  { id: "transfer", name: "Chuyển khoản Ngân hàng", icon: "🏦", desc: "Chuyển khoản trực tiếp 24/7" },
];

export function CourseCheckoutPage({ course }: { course: Course }) {
  const [method, setMethod] = useState("vnpay");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const discountAmount = course.originalPrice - course.price;
  const totalAmount = course.price;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Vui lòng điền đầy đủ thông tin liên hệ!");
      return;
    }
    
    setIsProcessing(true);
    // Simulate API call for payment checkout
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      toast.success("Thanh toán thành công! Chào mừng bạn đến với khóa học.");
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-card border border-border/60 rounded-3xl p-8 text-center shadow-2xl shadow-green-500/10"
        >
          <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black mb-2">Thanh toán thành công!</h2>
          <p className="text-muted-foreground mb-8">
            Cảm ơn bạn đã đăng ký khóa học <span className="font-bold text-foreground">{course.name}</span>. Email hướng dẫn đã được gửi tới <b>{formData.email}</b>.
          </p>
          <Button asChild className="w-full h-12 rounded-xl bg-violet-600 hover:bg-violet-700 font-bold">
            <Link href={`/khoa-hoc-ai/${course.id}/learn`}>Vào Học Ngay</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <div className="border-b border-border/60 bg-card py-6 sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href={`/khoa-hoc-ai/${course.id}`} className="font-bold text-lg flex items-center gap-2 hover:text-violet-500 transition-colors">
            <ChevronRight className="w-5 h-5 rotate-180" /> Quay lại
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Lock className="w-4 h-4 text-green-500" /> Thanh toán an toàn và bảo mật
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-10">
          
          {/* L LEFT COLUMN - BILLING & PAYMENT */}
          <div className="flex-1 space-y-10">
            {/* THÔNG TIN THANH TOÁN */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                1. Thông tin liên hệ
              </h2>
              <div className="bg-card border border-border/60 rounded-3xl p-6 sm:p-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Họ và tên <span className="text-red-500">*</span></label>
                  <Input 
                    type="text" 
                    placeholder="VD: Nguyễn Văn A" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="h-12 rounded-xl border-border/60 focus-visible:ring-violet-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Email <span className="text-red-500">*</span></label>
                    <Input 
                      type="email" 
                      placeholder="VD: email@example.com" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="h-12 rounded-xl border-border/60 focus-visible:ring-violet-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Số điện thoại <span className="text-red-500">*</span></label>
                    <Input 
                      type="tel" 
                      placeholder="VD: 0912345678" 
                      required 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="h-12 rounded-xl border-border/60 focus-visible:ring-violet-500"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* PHƯƠNG THỨC THANH TOÁN */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                2. Phương thức thanh toán
              </h2>
              <div className="bg-card border border-border/60 rounded-3xl p-6 sm:p-8 space-y-4">
                {PAYMENT_METHODS.map((pm) => (
                  <label
                    key={pm.id}
                    onClick={() => setMethod(pm.id)}
                    className={cn(
                      "flex items-center p-4 border rounded-2xl cursor-pointer transition-all duration-200",
                      method === pm.id 
                        ? "border-violet-500 bg-violet-500/5 ring-1 ring-violet-500" 
                        : "border-border/60 hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border border-border/80 mr-4 shrink-0 bg-background relative">
                       {method === pm.id && (
                         <div className="absolute inset-0 m-1 rounded-full bg-violet-500" />
                       )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold flex items-center gap-2">
                        <span className="text-xl">{pm.icon}</span> {pm.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{pm.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* R RIGHT COLUMN - ORDER SUMMARY */}
          <div className="lg:w-[400px]">
            <div className="sticky top-32">
              <h2 className="text-2xl font-bold mb-6">Tóm tắt đơn hàng</h2>
              <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl z-0" />
                
                {/* Course sum */}
                <div className="flex gap-4 mb-6 relative z-10">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-border/50">
                    <div className="w-full h-full bg-linear-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center text-3xl">
                      {course.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight mb-2 line-clamp-2">{course.name}</h3>
                    <Badge className="bg-violet-500/10 text-violet-500 border-violet-500/20 font-bold px-2 py-0.5 text-[10px]">VIP</Badge>
                  </div>
                </div>

                {/* Subtotals */}
                <div className="space-y-3 border-y border-border/50 py-4 mb-4 relative z-10">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Giá gốc:</span>
                    <span className="font-medium line-through">{formatPrice(course.originalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Giảm giá:</span>
                    <span className="font-bold text-red-500">-{formatPrice(discountAmount)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-end mb-6 relative z-10">
                  <span className="font-bold text-base">Tổng cộng:</span>
                  <div className="text-right">
                    <div className="text-3xl font-black text-violet-500">{formatPrice(totalAmount)}</div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center mb-6 leading-relaxed relative z-10">
                  Bằng việc hoàn tất thanh toán, bạn đồng ý với các <Link href="#" className="text-violet-500 hover:underline">Điều khoản dịch vụ</Link> của Gu AI.
                </p>

                <Button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full h-14 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-lg shadow-xl shadow-violet-500/20 gap-2 relative z-10"
                >
                  {isProcessing ? (
                    <span className="animate-pulse">Đang xử lý...</span>
                  ) : (
                    <>
                      Hoàn tất thanh toán <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>

              <div className="mt-6 flex flex-col gap-4 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                  <p>Mọi giao dịch đều được mã hóa bằng thuật toán SSL tiêu chuẩn quốc tế.</p>
                </div>
                <div className="flex gap-3">
                  <Wallet className="w-5 h-5 text-violet-500 shrink-0" />
                  <p>Bảo hành hoàn tiền 100% trong 30 ngày nếu bạn không hài lòng.</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
