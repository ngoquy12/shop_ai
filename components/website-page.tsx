"use client";

import {
  Globe2,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Clock,
  LifeBuoy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { websiteServices, type WebsiteService } from "@/lib/data";
import { cn } from "@/lib/utils";

function ServiceCard({ service }: { service: WebsiteService }) {
  const badgeColorMap: Record<string, string> = {
    "Phổ biến": "bg-blue-500/15 text-blue-500 border-blue-500/20",
    Hot: "bg-orange-500/15 text-orange-500 border-orange-500/20",
    Mới: "bg-green-500/15 text-green-500 border-green-500/20",
    AI: "bg-violet-500/15 text-violet-500 border-violet-500/20",
  };

  return (
    <div
      className={cn(
        "group relative rounded-2xl border bg-card overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col",
        service.popular
          ? "border-blue-500/40 shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)]"
          : "border-border/60 hover:border-blue-500/30 hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.1)]",
      )}
    >
      {service.popular && (
        <div className="absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-blue-500 via-violet-500 to-blue-500" />
      )}

      {/* Hover glow */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-violet-500/0 group-hover:from-blue-500/5 group-hover:to-violet-500/5 transition-all duration-300 pointer-events-none rounded-2xl" />

      <div className="p-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{service.icon}</div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-foreground leading-tight">
                {service.name}
              </h3>
            </div>
          </div>
          {service.badge && (
            <Badge
              className={cn(
                "shrink-0 border text-xs font-semibold",
                badgeColorMap[service.badge] || "bg-muted",
              )}
            >
              {service.badge}
            </Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
          {service.description}
        </p>

        {/* Features */}
        <ul className="space-y-2 mb-6 flex-1">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <span className="text-foreground/80">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Price + CTA */}
        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Giá từ</p>
              <p className="text-xl font-extrabold text-foreground">
                {service.price}
              </p>
            </div>
            <Button
              className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
              aria-label={`Contact about ${service.name}`}
            >
              Tư vấn ngay
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WebsitePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-87.5 bg-blue-500/8 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-62.5 h-62.5 bg-green-500/8 dark:bg-green-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-400 mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 bg-card text-sm text-muted-foreground mb-6">
            <Globe2 className="w-4 h-4 text-blue-500" />
            Dịch vụ thiết kế & phát triển web chuyên nghiệp
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Làm Website{" "}
            <span className="bg-linear-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent">
              Theo Yêu Cầu
            </span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-8">
            Từ landing page đơn giản đến web app phức tạp. Thiết kế đẹp, code
            sạch, giao hàng đúng hạn. Hỗ trợ 24/7 sau khi bàn giao.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 sm:gap-16 text-center">
            {[
              { value: "200+", label: "Dự án hoàn thành" },
              { value: "4.9★", label: "Đánh giá trung bình" },
              { value: "7 ngày", label: "Cam kết giao hàng" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-extrabold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { icon: Sparkles, label: "Thiết kế premium" },
            { icon: Clock, label: "Giao hàng đúng hạn" },
            { icon: LifeBuoy, label: "Hỗ trợ sau bàn giao" },
            { icon: MessageCircle, label: "Tư vấn miễn phí" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/60 text-sm text-muted-foreground"
            >
              <Icon className="w-4 h-4 text-blue-500" />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Services grid */}
      <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Các gói dịch vụ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {websiteServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-10 rounded-2xl border border-blue-500/20 bg-linear-to-br from-blue-500/5 via-violet-500/5 to-blue-500/5 p-8 text-center">
          <h3 className="text-xl font-bold mb-2">
            Không tìm thấy gói phù hợp?
          </h3>
          <p className="text-muted-foreground mb-5">
            Liên hệ với chúng tôi để nhận báo giá tùy chỉnh theo yêu cầu cụ thể
            của bạn.
          </p>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Liên hệ tư vấn ngay
          </Button>
        </div>
      </div>
    </div>
  );
}
