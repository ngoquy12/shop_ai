"use client";

import React from "react";
import { useWalletTransactions } from "../hooks/use-wallets";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowDownLeft, ArrowUpRight, RefreshCcw } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi");

export function WalletHistory() {
  const { data: transactions, isLoading } = useWalletTransactions();

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
        <p className="text-slate-500 text-sm">Đang tải lịch sử giao dịch...</p>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-16 rounded-2xl border border-slate-100 flex flex-col items-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
          <RefreshCcw className="w-6 h-6 text-slate-300" />
        </div>
        <h4 className="text-slate-700 font-medium text-base">
          Chưa có giao dịch nào
        </h4>
        <p className="text-slate-500 text-sm mt-1">
          Các giao dịch nạp tiền, trừ tiền mua khóa học sẽ xuất hiện tại đây.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((tx) => {
        const isDeposit = tx.type === "DEPOSIT";
        const isRefund = tx.type === "REFUND";
        const isPositive = isDeposit || isRefund;

        return (
          <div
            key={tx.id}
            className="border text-sm border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:shadow-md hover:border-slate-300"
          >
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isPositive ? "bg-emerald-50" : "bg-rose-50"}`}
              >
                {isPositive ? (
                  <ArrowDownLeft className="w-6 h-6 text-emerald-500" />
                ) : (
                  <ArrowUpRight className="w-6 h-6 text-rose-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-slate-200 line-clamp-1">
                    {tx.description}
                  </p>
                  {isDeposit && (
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none"
                    >
                      Nạp tiền
                    </Badge>
                  )}
                  {!isDeposit && !isRefund && (
                    <Badge
                      variant="outline"
                      className="bg-rose-50 text-rose-700 hover:bg-rose-100 border-none"
                    >
                      Thanh toán
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {dayjs(tx.createdAt).format("HH:mm - DD/MM/YYYY")} • Mã GD:{" "}
                  <span className="font-mono text-slate-400">
                    #{tx.id.split("-")[0]}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-row sm:flex-col justify-between sm:items-end w-full sm:w-auto border-t sm:border-t-0 p-3 sm:p-0 border-slate-100 sm:mt-0 mt-2">
              <div
                className={`font-bold text-lg leading-tight ${isPositive ? "text-emerald-600" : "text-slate-900"}`}
              >
                {isPositive ? "+" : "-"}
                {formatCurrency(tx.amount)}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                Số dư sau GD:{" "}
                <strong className="text-slate-700">
                  {formatCurrency(tx.balanceAfter)}
                </strong>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
