"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  Package,
  ChevronRight,
  Shield,
  Zap,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MOCK_CART_ITEMS, type CartItem } from "@/lib/shop-data";

function fmt(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

function DurationToggle({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex rounded-lg border border-border/60 overflow-hidden text-xs">
      {["1 tháng", "1 năm"].map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "px-2.5 py-1 font-medium transition-colors",
            value === opt
              ? "bg-blue-600 text-white"
              : "text-muted-foreground hover:text-foreground hover:bg-accent",
          )}
        >
          {opt}
          {opt === "1 năm" && (
            <span className="ml-1 text-[9px] bg-green-500/20 text-green-400 px-1 py-0.5 rounded">
              -20%
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function CartItemRow({
  item,
  onRemove,
  onDurationChange,
}: {
  item: CartItem;
  onRemove: (id: string) => void;
  onDurationChange: (id: string, d: string) => void;
}) {
  return (
    <div className="flex gap-4 py-5 animate-fade-in group">
      {/* Thumbnail */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-border/50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {item.type === "tool" && item.icon && (
          <div className="absolute top-1 left-1 w-6 h-6 rounded-md bg-background/80 backdrop-blur-sm flex items-center justify-center text-sm">
            {item.icon}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Badge variant="secondary" className="text-[10px] mb-1 h-4">
              {item.type === "tool" ? "🤖 Công cụ AI" : "📚 Khóa học"}
            </Badge>
            <h3 className="font-semibold text-sm leading-snug text-foreground line-clamp-2">
              {item.name}
            </h3>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="shrink-0 text-muted-foreground hover:text-destructive transition-colors p-1"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center flex-wrap gap-3 mt-2">
          {/* Duration toggle for tools */}
          {item.type === "tool" && item.duration && (
            <DurationToggle
              value={item.duration}
              onChange={(d) => onDurationChange(item.id, d)}
            />
          )}

          {/* Price */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-muted-foreground line-through">
              {fmt(item.originalPrice)}
            </span>
            <span className="font-bold text-blue-400">{fmt(item.price)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartPage() {
  const [items, setItems] = useState<CartItem[]>(MOCK_CART_ITEMS);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;

  const totalSaved =
    items.reduce((s, i) => s + (i.originalPrice - i.price) * i.quantity, 0) +
    discount;

  const remove = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const changeDuration = (id: string, dur: string) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const yearMultiplier = dur === "1 năm" ? 10 : 1;
        const basePrice =
          dur === "1 năm"
            ? Math.round(
                MOCK_CART_ITEMS.find((x) => x.id === id)!.price * 10 * 0.8,
              )
            : MOCK_CART_ITEMS.find((x) => x.id === id)!.price;
        return { ...i, duration: dur, price: basePrice };
      }),
    );
  };

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
              <Badge className="ml-1 h-5 text-[11px] bg-blue-600">
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
            <Button asChild className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Link href="/ai-tools">
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
                  onClick={() => setItems([])}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Xóa tất cả
                </button>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card divide-y divide-border/50">
                {items.map((item) => (
                  <div key={item.id} className="px-5">
                    <CartItemRow
                      item={item}
                      onRemove={remove}
                      onDurationChange={changeDuration}
                    />
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
                    <Icon className="w-5 h-5 text-blue-400 mx-auto mb-1" />
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
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">
                        {item.icon && `${item.icon} `}
                        {item.name}
                        {item.duration && (
                          <span className="text-xs text-muted-foreground/60">
                            {" "}
                            ({item.duration})
                          </span>
                        )}
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
                    <p className="font-extrabold text-2xl text-blue-400">
                      {fmt(total)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Đã bao gồm VAT
                    </p>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full h-12 bg-linear-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold gap-2 text-base shadow-lg shadow-blue-500/25 border-0"
                >
                  <Link href="/checkout">
                    Tiến hành thanh toán
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>

                <Link
                  href="/ai-tools"
                  className="block text-center text-xs text-muted-foreground hover:text-foreground mt-3 transition-colors"
                >
                  ← Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
