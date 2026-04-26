"use client";

import React from "react";
import { Clock, XCircle, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { Button } from "@/components/ui/button";
import { useMyDepositRequests } from "../hooks/use-manual-deposits";

dayjs.locale("vi");

const statusConfig = {
  PENDING: { label: "Chờ duyệt", color: "amber", icon: Clock },
  APPROVED: { label: "Đã duyệt", color: "green", icon: CheckCircle },
  REJECTED: { label: "Đã từ chối", color: "red", icon: XCircle },
  SUCCESS: { label: "Thành công", color: "green", icon: CheckCircle },
  FAILED: { label: "Thất bại", color: "red", icon: AlertCircle },
  CANCELLED: { label: "Đã hủy", color: "gray", icon: XCircle },
};

export function PendingDeposits() {
  console.log("[DEBUG] [PendingDeposits] Component rendered");
  const { data: response, isLoading } = useMyDepositRequests();
  console.log(
    "[DEBUG] [PendingDeposits] isLoading:",
    isLoading,
    "data:",
    response,
  );
  const deposits = response?.data || [];

  if (isLoading) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="animate-spin w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full mx-auto mb-3" />
        <p className="text-slate-500 text-sm">Đang tải...</p>
      </div>
    );
  }

  if (!deposits || deposits.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
        <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h4 className="text-slate-700 font-medium mb-1">
          Không có yêu cầu nạp tiền nào
        </h4>
        <p className="text-slate-500 text-sm">
          Các yêu cầu nạp tiền của bạn sẽ xuất hiện tại đây
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {deposits.map((deposit) => {
        const config =
          statusConfig[deposit.status as keyof typeof statusConfig] ||
          statusConfig.PENDING;
        const StatusIcon = config.icon;

        return (
          <div
            key={deposit.id}
            className={`border rounded-xl p-4 flex items-center justify-between gap-4 ${
              deposit.status === "PENDING"
                ? "border-amber-200 bg-amber-50/30"
                : "border-slate-200"
            }`}
          >
            <div className="flex items-center gap-4 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  deposit.status === "PENDING"
                    ? "bg-amber-50"
                    : deposit.status === "APPROVED" ||
                        deposit.status === "SUCCESS"
                      ? "bg-green-50"
                      : "bg-slate-100"
                }`}
              >
                <StatusIcon
                  className={`w-5 h-5 ${
                    deposit.status === "PENDING"
                      ? "text-amber-600"
                      : deposit.status === "APPROVED" ||
                          deposit.status === "SUCCESS"
                        ? "text-green-600"
                        : "text-slate-500"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-slate-900">
                    {formatCurrency(deposit.amount)}
                  </p>
                  <Badge
                    variant="outline"
                    className={`${
                      deposit.status === "PENDING"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : deposit.status === "APPROVED" ||
                            deposit.status === "SUCCESS"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : deposit.status === "REJECTED"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {config.label}
                  </Badge>
                </div>
                {deposit.note && (
                  <p className="text-xs text-slate-500 truncate">
                    Ghi chú: {deposit.note}
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-1">
                  {dayjs(deposit.createdAt).format("HH:mm - DD/MM/YYYY")}
                </p>
                {deposit.processedAt && deposit.status !== "PENDING" && (
                  <p className="text-xs text-slate-400">
                    Xử lý:{" "}
                    {dayjs(deposit.processedAt).format("HH:mm - DD/MM/YYYY")}
                  </p>
                )}
              </div>
            </div>
            {deposit.status === "PENDING" && (
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-red-600"
                // onClick={() => handleCancelDeposit(deposit.id)}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
