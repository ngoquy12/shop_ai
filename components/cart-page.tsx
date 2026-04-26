"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Trash2,
  Tag,
  ArrowRight,
  Package,
  ChevronRight,
  Shield,
  Zap,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  useMyCart,
  useRemoveFromCart,
  useClearCart,
} from "@/features/carts/hooks/use-carts";
import { CartItemResponse } from "@/features/carts/types";

function fmt(n: number | undefined) {
  if (n === undefined) return "0đ";
  return n.toLocaleString("vi-VN") + "đ";
}

function CartItemRow({ item }: { item: CartItemResponse }) {
  const removeMutation = useRemoveFromCart();

  return (
    <div
      className={cn(
        "flex gap-4 py-5 animate-fade-in group",
        removeMutation.isPending && "opacity-50 pointer-events-none",
      )}
    >
      {/* Thumbnail */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-border/50">
        <Image
          src={item.thumbnailUrl || "https://via.placeholder.com/150"}
          alt={item.name}
          width={96}
          height={96}
          className="w-full h-full object-cover"
        />
        {item.itemType === "AITOOL" && (
          <div className="absolute top-1 left-1 w-6 h-6 rounded-md bg-background/80 backdrop-blur-sm flex items-center justify-center text-sm">
            🤖
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Badge variant="secondary" className="text-[10px] mb-1 h-4">
              {item.itemType === "AITOOL"
                ? "🤖 Công cụ AI"
                : item.itemType === "PROMPT"
                  ? "✍️ Prompt"
                  : "📚 Khóa học"}
            </Badge>
            <h3 className="font-semibold text-sm leading-snug text-foreground line-clamp-2">
              {item.name}
            </h3>
          </div>
          <button
            className="shrink-0 text-muted-foreground hover:text-destructive transition-colors p-1 disabled:opacity-50"
            aria-label="Remove item"
            disabled={removeMutation.isPending}
            onClick={() => removeMutation.mutate(item.itemId)}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center flex-wrap gap-3 mt-2">
          {/* Price */}
          <div className="flex items-center gap-2 ml-auto">
            {item.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {fmt(item.oldPrice)}
              </span>
            )}
            <span className="font-bold text-cyan-400">{fmt(item.price)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartPage() {
  const cartQuery = useMyCart();
  const clearCartMutation = useClearCart();

  const items = cartQuery.data?.items || [];
  const subtotal = cartQuery.data?.totalAmount || 0;

  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;

  const totalOldPrice = items.reduce((acc: number, item: CartItemResponse) => {
    return acc + (item.oldPrice || item.price) * (item.quantity || 1);
  }, 0);
  const totalSaved = discount + (totalOldPrice - subtotal);

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "VIDEOPROMPT10") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Mã coupon không hợp lệ");
      setCouponApplied(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/40 backdrop-blur-sm sticky top-16 z-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium">Giỏ hàng</span>
            {items.length > 0 && (
              <Badge className="ml-1 h-5 text-[11px] bg-cyan-500">
                {items.length}
              </Badge>
            )}
          </nav>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          /* Empty state */
          <div className="text-center py-24 animate-scale-in">
            <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6 animate-float">
              <ShoppingCart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Giỏ hàng trống</h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              Bạn chưa thêm gì vào giỏ. Khám phá các công cụ AI và khóa học nào!
            </p>
            <Button asChild className="bg-cyan-500 hover:bg-cyan-600 gap-2">
              <Link href="/cong-cu-ai">
                <Package className="w-4 h-4" />
                Khám phá ngay
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Cart items */}
            <div className="lg:col-span-2 space-y-2">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-extrabold">
                  Giỏ hàng{" "}
                  <span className="text-muted-foreground font-normal text-lg">
                    ({items.length} sản phẩm)
                  </span>
                </h1>
                <button
                  onClick={() => clearCartMutation.mutate()}
                  disabled={clearCartMutation.isPending}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Xóa tất cả
                </button>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card divide-y divide-border/50">
                {items.map((item: CartItemResponse) => (
                  <div key={item.id} className="px-5">
                    <CartItemRow item={item} />
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="rounded-2xl border border-border/60 bg-card p-5">
                <p className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-violet-400" />
                  Mã giảm giá
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập mã VIDEOPROMPT10"
                    value={coupon}
                    onChange={(e) => {
                      setCoupon(e.target.value);
                      setCouponError("");
                    }}
                    className={cn(
                      "h-10 text-sm",
                      couponApplied && "border-green-500/50",
                      couponError && "border-destructive/50",
                    )}
                  />
                  <Button
                    onClick={applyCoupon}
                    variant={couponApplied ? "outline" : "default"}
                    className="shrink-0 h-10"
                    disabled={couponApplied}
                  >
                    {couponApplied ? "✓ Đã áp dụng" : "Áp dụng"}
                  </Button>
                </div>
                {couponApplied && (
                  <p className="text-xs text-green-400 mt-2 animate-slide-up">
                    🎉 Giảm thêm 10% — bạn tiết kiệm {fmt(discount)}
                  </p>
                )}
                {couponError && (
                  <p className="text-xs text-destructive mt-2">{couponError}</p>
                )}
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Shield, label: "Bảo hành", desc: "30 ngày" },
                  { icon: Zap, label: "Kích hoạt", desc: "Ngay lập tức" },
                  { icon: RefreshCw, label: "Hoàn tiền", desc: "Nếu lỗi 100%" },
                ].map(({ icon: Icon, label, desc }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-border/50 bg-card/60 p-3 text-center"
                  >
                    <Icon className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                    <p className="text-xs font-semibold">{label}</p>
                    <p className="text-[11px] text-muted-foreground">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Summary */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-border/60 bg-card p-6 sticky top-32">
                <h2 className="font-bold text-base mb-4">Tóm tắt đơn hàng</h2>

                {/* Line items */}
                <div className="space-y-2 mb-4">
                  {items.map((item: CartItemResponse) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">
                        {item.itemType === "AITOOL"
                          ? "🤖 "
                          : item.itemType === "PROMPT"
                            ? "✍️ "
                            : "📚 "}
                        {item.name}
                      </span>
                      <span className="font-medium shrink-0">
                        {fmt(item.price)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="my-3" />

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span>{fmt(subtotal)}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-green-400 animate-slide-up">
                      <span>Mã giảm giá (-10%)</span>
                      <span>-{fmt(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-green-400 text-xs">
                    <span>Bạn tiết kiệm</span>
                    <span>-{fmt(totalSaved)}</span>
                  </div>
                </div>

                <Separator className="my-3" />

                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold text-lg">Tổng cộng</span>
                  <div className="text-right">
                    <p className="font-extrabold text-2xl text-cyan-400">
                      {fmt(total)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Đã bao gồm VAT
                    </p>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full h-12 bg-linear-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold gap-2 text-base shadow-lg shadow-cyan-500/25 border-0"
                >
                  <Link href="/thanh-toan">
                    Tiến hành thanh toán
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>

                <Link
                  href="/cong-cu-ai"
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground mt-4 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
