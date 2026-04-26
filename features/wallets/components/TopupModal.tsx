"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateDeposit } from "../hooks/use-wallets";
import { Loader2, Search, Copy } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

interface TopupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TopupModal({ isOpen, onClose }: TopupModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [step, setStep] = useState<1 | 2>(1); // 1: Input, 2: QR

  const createDeposit = useCreateDeposit();

  const handleNext = () => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < 10000) {
      toast.error("Vui lòng nhập số tiền hợp lệ (Tối thiểu 10,000đ)");
      return;
    }

    createDeposit.mutate(
      { amount: numAmount },
      {
        onSuccess: () => {
          setStep(2);
        },
      },
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép vào bộ nhớ tạm");
  };

  const handleClose = () => {
    setStep(1);
    setAmount("");
    createDeposit.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className={step === 2 ? "sm:max-w-3xl" : "sm:max-w-md"}>
        <DialogHeader>
          <DialogTitle>Nạp tiền vào Số dư</DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Nhập số tiền bạn muốn nạp vào ví"
              : "Quét mã QR bằng ứng dụng ngân hàng của bạn. Số tiền sẽ được cộng tự động trong vài phút."}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="flex items-center space-x-2 py-4">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Ví dụ: 50000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="10000"
                step="10000"
                className="text-lg flex-1"
              />
              {/* {amount && Number(amount) >= 10000 && (
                <div className="text-xs text-muted-foreground font-medium">
                  Khả dụng: {formatCurrency(Number(amount))}
                </div>
              )} */}
            </div>
            <Button
              size={"lg"}
              onClick={handleNext}
              disabled={createDeposit.isPending || !amount}
            >
              {createDeposit.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Tạo QR Nạp
            </Button>
          </div>
        )}

        {step === 2 && createDeposit.data && (
          <div className="flex flex-col space-y-6 py-2">
            {/* Split layout: Info (Left) and QR (Right) */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Column: Info Box */}
              <div className="flex-1 space-y-3 bg-muted/30 p-5 rounded-xl text-sm border border-border relative">
                <div className="flex justify-between items-center pb-2 border-b border-border/50 border-dashed">
                  <span className="text-muted-foreground font-medium">
                    Ngân hàng
                  </span>
                  <strong className="text-foreground">
                    {createDeposit.data.bankId}
                  </strong>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border/50 border-dashed">
                  <span className="text-muted-foreground font-medium">
                    Số tài khoản
                  </span>
                  <div className="flex items-center gap-2">
                    <strong className="text-foreground">
                      {createDeposit.data.accountNo}
                    </strong>
                    <button
                      onClick={() =>
                        copyToClipboard(createDeposit.data.accountNo)
                      }
                      className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border/50 border-dashed">
                  <span className="text-muted-foreground font-medium">
                    Chủ tài khoản
                  </span>
                  <strong className="text-foreground">
                    {createDeposit.data.accountName}
                  </strong>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border/50 border-dashed">
                  <span className="text-muted-foreground font-medium">
                    Số tiền nạp
                  </span>
                  <div className="flex items-center gap-2">
                    <strong className="text-emerald-600 text-lg font-bold">
                      {formatCurrency(createDeposit.data.amount)}
                    </strong>
                  </div>
                </div>
                <div className="flex flex-col pt-1">
                  <span className="text-muted-foreground font-medium mb-1.5">
                    Nội dung chuyển khoản (Bắt buộc ghi)
                  </span>
                  <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-2.5 flex justify-between items-center shadow-sm">
                    <strong className="text-indigo-700 tracking-widest font-mono text-lg">
                      {createDeposit.data.transferCode}
                    </strong>
                    <button
                      onClick={() =>
                        copyToClipboard(createDeposit.data.transferCode)
                      }
                      className="text-indigo-600 hover:bg-indigo-100 p-2 rounded-md transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-[13px] font-medium flex items-center justify-center gap-2 mt-5 bg-orange-50 text-orange-700/80 border border-orange-100/50 px-4 py-2.5 rounded-lg w-full">
                  <Search className="w-4 h-4 animate-pulse flex-shrink-0" />
                  Hệ thống tự động xử lý trong 1-3 phút.
                </div>
              </div>

              {/* Right Column: QR Code */}
              <div className="w-full md:w-[320px] shrink-0 flex flex-col items-center justify-start space-y-2">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-border w-full flex flex-col items-center justify-center">
                  <Image
                    src={createDeposit.data.qrUrl}
                    alt="VietQR"
                    width={280}
                    height={280}
                    className="w-[280px] object-contain rounded-xl"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleClose}
              variant="outline"
              className="w-full font-medium h-11"
            >
              Đóng và Chờ đối soát
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
