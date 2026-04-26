"use client";

import { motion, Variants } from "framer-motion";
import { DollarSign, Share2, TrendingUp, ShieldCheck, ArrowRight, Wallet, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const staggerVar: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } },
};

const BENEFITS = [
  {
    icon: DollarSign,
    title: "Hoa hồng lên đến 40%",
    desc: "Mức chiết khấu cao nhất thị trường cho mọi đơn hàng thành công qua link của bạn. Thanh toán nhanh chóng.",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    icon: TrendingUp,
    title: "Thu nhập thụ động trọn đời",
    desc: "Bạn vẫn nhận được hoa hồng khi khách hàng gia hạn gói Premium hoặc mua thêm các dịch vụ khác sau này.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Minh bạch tuyệt đối",
    desc: "Hệ thống tracking theo thời gian thực. Theo dõi chính xác lượt click, lượt chuyển đổi và tiền thưởng mỗi ngày.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
];

const STEPS = [
  { step: "01", title: "Đăng ký tài khoản", desc: "Trở thành hội viên Affiliate miễn phí chỉ trong 30 giây." },
  { step: "02", title: "Lấy Link giới thiệu", desc: "Tạo link theo dõi riêng biệt cho bất kỳ Prompt hoặc bộ công cụ nào." },
  { step: "03", title: "Chia sẻ & Lan tỏa", desc: "Gắn link lên Facebook, Tiktok, Blog cá nhân hoặc Group mxh của bạn." },
  { step: "04", title: "Nhận tiền thưởng", desc: "Rút tiền về tài khoản ngân hàng ngay khi đạt ngưỡng thanh toán tối thiểu." },
];

export default function AffiliatePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* ── HERO SECTION ── */}
      <section className="relative pt-32 pb-20 overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Badge className="bg-orange-500/15 text-orange-400 border-none font-bold mb-6 tracking-widest px-4 py-1.5 rounded-full">
                Affiliate Partner Program
              </Badge>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter mb-6 leading-[1.1]">
                Biến Đam Mê AI Thành <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-pink-500">Thu Nhập Thật</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
                Cùng Gu AI lan tỏa sức mạnh của công nghệ. Trở thành đối tác phân phối các bộ Prompt đỉnh cao và Khóa học Master AI với mức hoa hồng chưa từng có.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="lg" className="h-14 px-8 rounded-2xl bg-white text-black hover:bg-gray-200 font-bold text-base shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all">
                  Đăng Ký Đối Tác Ngay <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-8 rounded-2xl border-white/10 hover:bg-white/5 font-semibold text-base">
                  Xem Báo Cáo Doanh Thu
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="bg-[#11111a] border border-white/5 rounded-3xl p-8 shadow-2xl relative z-10">
                <div className="flex items-center justify-between border-b border-border/50 pb-6 mb-6">
                  <div>
                    <div className="text-sm text-gray-400 font-medium mb-1">Thu nhập tháng này</div>
                    <div className="text-4xl font-black text-white">24,500,000 đ</div>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Wallet className="w-8 h-8 text-green-400" />
                  </div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-black/40 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Share2 className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="font-bold text-sm">Chuyển đổi thành công</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Khách: Nguyen Van A</div>
                        </div>
                      </div>
                      <div className="font-bold text-green-400">+450,000đ</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="py-24 bg-card/50 relative border-y border-border/30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
              Đãi Ngộ Siêu Việt
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              Chúng tôi luôn coi trọng đối tác và cam kết mang lại mức lợi nhuận tốt nhất phân khúc.
            </p>
          </div>

          <motion.div
            className="grid sm:grid-cols-3 gap-8"
            variants={staggerVar}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {BENEFITS.map((b, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-[#0f0f13] border border-white/5 p-8 rounded-3xl hover:border-white/20 transition-colors">
                <div className={`w-14 h-14 ${b.bg} ${b.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <b.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{b.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {b.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-16">
            Bắt Đầu Dễ Dàng Như Thế Nào?
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-[28px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-orange-500/0" />
            
            {STEPS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative z-10 flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-full bg-[#111] border-2 border-border text-lg font-black flex items-center justify-center shadow-2xl mb-6 shadow-black/50 text-gray-300">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed px-4">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-20">
            <Button size="lg" className="h-16 px-12 rounded-full bg-linear-to-r from-orange-500 to-pink-600 hover:from-orange-400 hover:to-pink-500 text-white font-black text-lg tracking-widest shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all transform hover:scale-105">
              🚀 TRỞ THÀNH ĐỐI TÁC NGAY !
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
