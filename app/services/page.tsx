import type { Metadata } from "next";
import Link from "next/link";
import { Wrench, Bot, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Dịch Vụ AI & Web Toàn Diện",
  description:
    "VideoPrompt cung cấp đầy đủ dịch vụ AI & Web: Tài khoản AI chính chủ, Thiết kế & phát triển website chuyên nghiệp, Khóa học AI thực chiến từ chuyên gia.",
  keywords: [
    "dịch vụ AI", "cung cấp tài khoản AI", "thiết kế website", "khóa học AI",
    "VideoPrompt", "dịch vụ công nghệ AI Việt Nam",
  ],
  openGraph: {
    title: "Dịch Vụ AI & Web Toàn Diện | VideoPrompt",
    description: "Tài khoản AI, website chuyên nghiệp, khóa học thực chiến — tất cả trong một nền tảng.",
    type: "website",
    locale: "vi_VN",
  },
};

const services = [
  {
    icon: "🤖",
    title: "Cung cấp tài khoản AI",
    desc: "Tài khoản chính chủ các công cụ AI hàng đầu với giá ưu đãi nhất thị trường.",
    href: "/ai-tools",
    badge: "Phổ biến",
    features: ["Bảo hành tài khoản", "Hỗ trợ 24/7", "Giá tốt nhất"],
  },
  {
    icon: "🌐",
    title: "Thiết kế & Phát triển Website",
    desc: "Website chuyên nghiệp theo yêu cầu. Từ landing page đến web app AI.",
    href: "/lam-website",
    badge: "Hot",
    features: ["Responsive mọi thiết bị", "SEO tối ưu", "Bàn giao mã nguồn"],
  },
  {
    icon: "📚",
    title: "Đào tạo & Khóa học AI",
    desc: "Khóa học AI thực chiến từ cơ bản đến nâng cao với chuyên gia.",
    href: "/khoa-hoc-ai",
    badge: "Mới",
    features: ["Video HD chất lượng cao", "Học theo tốc độ riêng", "Chứng chỉ"],
  },
];

export default function ServicesRoute() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-violet-500/5 pointer-events-none" />
        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 bg-card text-sm text-muted-foreground mb-6">
            <Wrench className="w-4 h-4 text-blue-500" />
            Dịch vụ toàn diện về AI & Web
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Dịch Vụ của Chúng Tôi
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Giải pháp công nghệ AI toàn diện — từ cung cấp tool đến đào tạo và
            phát triển sản phẩm.
          </p>
        </div>
      </div>

      {/* Services */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.href}
              className="group rounded-2xl border border-border/60 bg-card overflow-hidden hover:border-blue-500/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{s.icon}</div>
                  <Badge variant="secondary" className="text-xs">
                    {s.badge}
                  </Badge>
                </div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">
                  {s.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">
                  {s.desc}
                </p>
                <ul className="space-y-2 mb-6">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
                >
                  <Link href={s.href}>
                    Xem chi tiết
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Why us */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-10">
            Lý do khách hàng tin tưởng
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { icon: Bot, value: "50+", label: "AI Tools" },
              { icon: CheckCircle2, value: "200+", label: "Dự án web" },
              { icon: Clock, value: "24/7", label: "Hỗ trợ" },
              { icon: Wrench, value: "99%", label: "Hài lòng" },
            ].map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="p-4 rounded-xl bg-card border border-border/60"
              >
                <Icon className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-extrabold">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
