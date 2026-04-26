"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  ChevronRight,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  Download,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMyOrders } from "@/features/orders/hooks/use-orders";

function fmt(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

function fmtDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_CONFIG = {
  PENDING: {
    label: "Chờ xử lý",
    icon: Clock,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
  },
  PAID: {
    label: "Hoàn thành",
    icon: CheckCircle2,
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
  },
  CANCELLED: {
    label: "Đã huỷ",
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
  },
  FAILED: {
    label: "Thất bại",
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
  },
};

const TABS = [
  { key: "all", label: "Tất cả" },
  { key: "PENDING", label: "Chờ xử lý" },
  { key: "PAID", label: "Hoàn thành" },
  { key: "CANCELLED", label: "Đã huỷ" },
];

interface OrderItem {
  itemType: string;
  itemName: string;
  price: number;
  quantity: number;
  fulfillmentContent?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  items?: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
}

function OrderCard({ order }: { order: Order }) {
  const cfg =
    STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] ||
    STATUS_CONFIG.PENDING;
  const Icon = cfg.icon;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden hover-lift transition-all duration-200 animate-slide-up">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 sm:p-5 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-sm">#{order.orderNumber}</p>
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border",
                  cfg.bg,
                  cfg.color,
                )}
              >
                <Icon className="w-3 h-3" />
                {cfg.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {fmtDate(order.createdAt)}
            </p>
            <p className="text-xs text-muted-foreground">
              {order.items?.length || 0} sản phẩm • {order.paymentMethod}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="font-extrabold text-lg text-cyan-400">
            {fmt(order.totalAmount)}
          </p>
          <ChevronRight
            className={cn(
              "w-4 h-4 text-muted-foreground ml-auto mt-1 transition-transform duration-200",
              expanded && "rotate-90",
            )}
          />
        </div>
      </div>

      {/* Expanded items */}
      {expanded && (
        <div className="border-t border-border/50 bg-muted/20 animate-slide-down">
          <div className="p-4 sm:p-5">
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
              Sản phẩm
            </p>
            <div className="space-y-4 mb-5">
              {order.items?.map((item: OrderItem, i: number) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 pb-4 border-b border-border/10 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-card border border-border/50 flex items-center justify-center text-lg shrink-0">
                      {item.itemType === "COURSE" ? "📚" : "🤖"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">
                        {item.itemName}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {item.itemType === "COURSE"
                          ? "Khóa học"
                          : "AI Tool / Prompt"}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-cyan-400">
                      {fmt(item.price)}
                    </span>
                  </div>

                  {/* Fulfillment Information */}
                  {item.fulfillmentContent && (
                    <div className="ml-12 p-3 rounded-xl bg-green-500/5 border border-green-500/20 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-[11px] font-bold text-green-500 uppercase">
                          Thông tin bàn giao
                        </p>
                      </div>
                      <div className="bg-background/50 p-3 rounded-lg border border-border/30">
                        <pre className="text-xs text-foreground font-mono whitespace-pre-wrap break-all">
                          {item.fulfillmentContent}
                        </pre>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-[10px] text-green-500 hover:text-green-400 hover:bg-green-500/10 gap-1 px-2"
                        onClick={() => {
                          if (item.fulfillmentContent) {
                            navigator.clipboard.writeText(
                              item.fulfillmentContent,
                            );
                            alert("Đã sao chép nội dung bàn giao!");
                          }
                        }}
                      >
                        <Download className="w-3 h-3" /> Sao chép
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {order.status === "PAID" && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tải hoá đơn
                  </Button>
                </>
              )}
              {order.status === "PENDING" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs text-cyan-400 border-cyan-500/30"
                >
                  <RotateCcw className="w-3.5 h-3.5 animate-spin-slow" />
                  Đang xử lý thanh toán...
                </Button>
              )}
              {order.status === "CANCELLED" && (
                <Button
                  size="sm"
                  asChild
                  className="gap-1.5 text-xs bg-cyan-500 hover:bg-cyan-600"
                >
                  <Link href="/cong-cu-ai">Đặt lại ngay</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function OrdersPage() {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const { data } = useMyOrders();

  const orders = (data?.data as Order[]) || [];

  const filtered = orders.filter((o: Order) => {
    const matchTab = tab === "all" || o.status === tab;
    const matchSearch =
      !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.items?.some((i: OrderItem) =>
        i.itemName.toLowerCase().includes(search.toLowerCase()),
      );
    return matchTab && matchSearch;
  });

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
            <span className="text-foreground font-medium">
              Lịch sử mua hàng
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-slide-up">
          <div>
            <h1 className="text-2xl font-extrabold">Đơn hàng của tôi</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {orders.length} đơn hàng
            </p>
          </div>
          <Button
            asChild
            size="sm"
            className="bg-cyan-500 hover:bg-cyan-600 gap-2"
          >
            <Link href="/cong-cu-ai">+ Mua thêm</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 animate-slide-up-delay">
          {[
            {
              label: "Tổng đơn",
              value: orders.length,
              color: "text-foreground",
            },
            {
              label: "Hoàn thành",
              value: orders.filter((o: Order) => o.status === "PAID").length,
              color: "text-green-400",
            },
            {
              label: "Đang xử lý",
              value: orders.filter((o: Order) => o.status === "PENDING").length,
              color: "text-cyan-400",
            },
            {
              label: "Tổng chi tiêu",
              value: fmt(
                orders
                  .filter((o: Order) => o.status === "PAID")
                  .reduce((s: number, o: Order) => s + o.totalAmount, 0),
              ),
              color: "text-violet-400",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-xl border border-border/50 bg-card/60 p-3 text-center"
            >
              <p className={cn("text-xl font-extrabold", color)}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4 animate-slide-up-delay">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo mã đơn hoặc tên sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-11"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border/40 mb-6">
          {TABS.map((t) => {
            const count =
              t.key === "all"
                ? orders.length
                : orders.filter((o: Order) => o.status === t.key).length;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex-1 text-xs font-semibold px-2 py-1.5 rounded-lg transition-all duration-150",
                  tab === t.key
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
                <span
                  className={cn(
                    "ml-1 text-[10px] font-bold",
                    tab === t.key
                      ? "text-cyan-400"
                      : "text-muted-foreground/60",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Orders list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 animate-scale-in">
            <Package className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground">Không tìm thấy đơn hàng nào</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order: Order, i: number) => (
              <div key={order.id} style={{ animationDelay: `${i * 60}ms` }}>
                <OrderCard order={order} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
