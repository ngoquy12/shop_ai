"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Flame,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Bot,
  ShoppingCart,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { RichTextRenderer } from "@/components/ui/rich-text-renderer";
import { toast } from "sonner";
import { useAddToCart } from "@/features/carts/hooks/use-carts";
import { useAiToolDetail } from "@/features/ai-tools/hooks/use-ai-tools";

export function AIToolDetailPage({ id }: { id: string }) {
  const { data: tool, isLoading, error } = useAiToolDetail(id);
  const router = useRouter();
  const { mutate: addToCart, isPending } = useAddToCart();

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  if (error || !tool) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold mb-4">Lỗi tải dữ liệu</h2>
        <Button variant="outline" onClick={() => router.back()}>
          Quay lại
        </Button>
      </div>
    );
  }

  const discountPercentage = tool.oldPrice
    ? Math.round(((tool.oldPrice - tool.price) / tool.oldPrice) * 100)
    : 0;
  const tagsList =
    tool.tags?.map((t: { name: string; slug?: string }) => t.name) || [];
  const featuresList = tool.features
    ? Array.isArray(tool.features)
      ? tool.features
      : JSON.parse(tool.features as string)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 -ml-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-32 bg-blue-500/5 blur-3xl rounded-full" />
              <div className="flex items-start gap-6 relative z-10">
                <div className="w-24 h-24 relative rounded-2xl flex items-center justify-center text-white bg-white font-extrabold text-3xl shadow-lg shrink-0 overflow-hidden">
                  {tool.thumbnailUrl ? (
                    <Image
                      src={tool.thumbnailUrl}
                      alt={tool.name}
                      fill
                      unoptimized
                      className="object-cover p-2"
                    />
                  ) : (
                    tool.name.charAt(0).toUpperCase()
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h1 className="text-3xl font-bold text-foreground">
                      {tool.name}
                    </h1>
                    {tool.isHot && (
                      <Badge className="bg-orange-500/15 text-orange-500 border-none font-bold">
                        <Flame className="w-4 h-4 mr-1" /> HOT
                      </Badge>
                    )}
                  </div>
                  <Badge
                    variant="secondary"
                    className="mb-4 text-sm px-3 py-1 bg-muted"
                  >
                    {tool.category?.name || "All"}
                  </Badge>
                  <div className="text-lg text-muted-foreground leading-relaxed mt-2 line-clamp-3 overflow-hidden">
                    <RichTextRenderer
                      content={tool.description}
                      className="prose-p:mb-1!  prose-headings:!mb-2! prose-headings:!mt-0! prose-ul:!my-1!"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-10"
            >
              {/* Tính năng nổi bật đưa lên trước */}
              {featuresList.length > 0 && (
                <div className="bg-[#0b1121] border border-blue-500/20 p-6 rounded-3xl shadow-lg">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white tracking-wide">
                    <Sparkles className="w-5 h-5 text-blue-400" /> Tính năng nổi
                    bật
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    {featuresList.map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 group">
                        <CheckCircle2 className="text-green-500 w-5 h-5 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                        <span className="text-gray-200 font-medium leading-relaxed">
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Mô tả chi tiết thụt lùi xuống */}
              <div className="px-1">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-violet-500" /> Mô tả chi
                  tiết
                </h2>
                <div className="bg-muted/20 p-5 rounded-2xl border border-border/40">
                  {tool.content ? (
                    <RichTextRenderer content={tool.content} />
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">
                      Công cụ AI tuyệt vời được đánh giá cao dành cho công việc
                      thiết kế và lập trình hàng ngày. Nó mang lại khả năng tối
                      ưu hóa vượt trội, tăng tốc quy trình làm việc của bạn lên
                      đến 10 lần.
                    </p>
                  )}
                </div>
              </div>

              {/* Hướng dẫn & Video sử dụng */}
              {tool.tutorialVideoUrl && (
                <div className="px-1 pt-4">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Bot className="w-5 h-5 text-orange-500" /> Hướng dẫn sử
                    dụng
                  </h2>
                  <div className="bg-black/20 rounded-2xl overflow-hidden border border-white/10 aspect-video relative group flex items-center justify-center">
                    {tool.tutorialVideoType === "UPLOAD" ? (
                      <video
                        src={tool.tutorialVideoUrl}
                        controls
                        controlsList="nodownload"
                        className="w-full h-full object-contain bg-black"
                      />
                    ) : (
                      (() => {
                        let embedUrl = tool.tutorialVideoUrl;
                        if (embedUrl.includes("youtube.com/watch?v=")) {
                          embedUrl = embedUrl.replace("watch?v=", "embed/");
                          const ampersandPosition = embedUrl.indexOf("&");
                          if (ampersandPosition !== -1) {
                            embedUrl = embedUrl.substring(0, ampersandPosition);
                          }
                        } else if (embedUrl.includes("youtu.be/")) {
                          embedUrl = embedUrl.replace(
                            "youtu.be/",
                            "youtube.com/embed/",
                          );
                        }
                        return (
                          <iframe
                            src={embedUrl}
                            className="w-full h-full border-none bg-black"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                        );
                      })()
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 leading-relaxed px-2">
                    Xem video trên để nắm bắt nhanh các thao tác cơ bản. Đừng
                    quên thiết lập API Key của bạn trước khi bắt đầu để mở khóa
                    toàn bộ sức mạnh của công cụ.
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          <div className="md:col-span-1 border-l border-border/50 md:pl-8">
            <div className="sticky top-24 bg-card rounded-3xl p-6 shadow-xl border border-border/60">
              <div className="text-base font-semibold text-muted-foreground mb-4 tracking-wider">
                Thông tin mua hàng
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <div className="text-3xl font-extrabold text-blue-500">
                  {tool.price
                    ? Number(tool.price).toLocaleString("vi-VN")
                    : "0"}
                  đ
                </div>
                {discountPercentage > 0 && (
                  <div className="text-lg text-muted-foreground line-through font-medium">
                    {tool.oldPrice
                      ? Number(tool.oldPrice).toLocaleString("vi-VN")
                      : "0"}
                    đ
                  </div>
                )}
              </div>

              {discountPercentage > 0 && (
                <div className="inline-block px-3 py-1 bg-red-100 text-red-600 font-bold rounded-full text-xs mb-6">
                  Tiết kiệm {discountPercentage}%
                </div>
              )}

              <div className="space-y-3 mb-6">
                {tagsList.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground mb-2">
                      Tags:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tagsList.map((tag: string) => (
                        <Badge variant="outline" key={tag}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  className="w-full text-base font-bold rounded-xl h-12 shadow-blue-500/20 shadow-lg bg-blue-600 hover:bg-blue-700"
                >
                  Mua Ngay Bây Giờ
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full rounded-xl h-12 border-border/60"
                  disabled={isPending}
                  onClick={() => {
                    addToCart(
                      {
                        itemType: "AITOOL",
                        itemId: tool.id,
                        quantity: 1,
                      },
                      {
                        onSuccess: () => {
                          toast.success(`Đã thêm ${tool.name} vào giỏ hàng`);
                        },
                      },
                    );
                  }}
                >
                  {isPending ? (
                    "Đang thêm..."
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Thêm vào giỏ hàng
                    </>
                  )}
                </Button>
                {tool.link && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full rounded-xl h-12 border-border/60"
                    onClick={() => window.open(tool.link as string, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Trang chủ chính thức
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
