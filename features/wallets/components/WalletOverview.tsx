"use client";

import React from "react";
import { useBalance } from "../hooks/use-wallets";
import { Wallet, TrendingUp, Percent } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function WalletOverview() {
  const { data: balanceData, isLoading } = useBalance();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-muted/40 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  // Mock data cho Tổng nạp và Chiết khấu (sẽ lấy từ API sau)
  const totalDeposited = 0; // Sẽ tính từ WalletTransaction type DEPOSIT
  const discount = 0; // Sẽ tính từ hệ thống

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Số dư khả dụng */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Wallet className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
            Khả dụng
          </span>
        </div>
        <p className="text-3xl font-bold mb-1">
          {formatCurrency(balanceData?.balance || 0)}
        </p>
        <p className="text-sm text-blue-100">Số dư hiện tại trong ví</p>
      </div>

      {/* Tổng nạp */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <TrendingUp className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
            Tổng nạp
          </span>
        </div>
        <p className="text-3xl font-bold mb-1">
          {formatCurrency(totalDeposited)}
        </p>
        <p className="text-sm text-emerald-100">Tổng số tiền đã nạp</p>
      </div>

      {/* Chiết khấu */}
      <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-6 text-white shadow-lg shadow-violet-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Percent className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
            Chiết khấu
          </span>
        </div>
        <p className="text-3xl font-bold mb-1">{discount}%</p>
        <p className="text-sm text-violet-100">Chiết khấu hiện tại</p>
      </div>
    </div>
  );
}
