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
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Copy,
  CheckCircle2,
  AlertCircle,
  Upload,
  X,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { useCreateManualDeposit } from "../hooks/use-manual-deposits";
import { useBankQR } from "../hooks/use-bank-qr";
import { uploadDepositProofImagesFn } from "../api/manual-deposits.api";

interface ManualDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManualDepositModal({
  isOpen,
  onClose,
}: ManualDepositModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [transferContent, setTransferContent] = useState<string>("");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [proofImages, setProofImages] = useState<string[]>([]);
  const { data: bankInfo } = useBankQR(isOpen);
  const createDeposit = useCreateManualDeposit();

  console.log("Ngân hàng:", bankInfo);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const { urls } = await uploadDepositProofImagesFn(Array.from(files));
      setProofImages((prev) => [...prev, ...urls]);
      toast.success("Đã tải lên ảnh thành công");
    } catch (error) {
      toast.error("Lỗi khi upload ảnh: " + (error as Error).message);
    } finally {
      // Reset file input
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setProofImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < 10000) {
      toast.error("Vui lòng nhập số tiền hợp lệ (Tối thiểu 10,000đ)");
      return;
    }

    if (!transferContent.trim()) {
      toast.error("Vui lòng nhập nội dung chuyển khoản");
      return;
    }

    if (proofImages.length === 0) {
      toast.error("Vui lòng tải lên ít nhất một ảnh chứng từ");
      return;
    }

    createDeposit.mutate(
      {
        amount: numAmount,
        method: "BANK",
        note: transferContent,
        proofImages,
      },
      {
        onSuccess: () => {
          setStep(3);
          toast.success("Đã gửi yêu cầu nạp tiền lên quản trị viên");
        },
        onError: (error: { message?: string }) => {
          toast.error(
            "Có lỗi xảy ra: " + (error.message || "Vui lòng thử lại"),
          );
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
    setTransferContent("");
    setProofImages([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nạp tiền thủ công</DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Quét mã QR để chuyển khoản nhanh chóng"
              : step === 2
                ? "Nhập thông tin chuyển khoản và tải lên ảnh chứng từ"
                : "Yêu cầu của bạn đã được gửi, quản trị viên sẽ kiểm tra và duyệt trong thời gian sớm nhất"}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: QR Code Display */}
        {step === 1 && (
          <div className="space-y-4 py-4">
            {/* Bank Info */}
            <div className="bg-muted/50 p-4 rounded-xl space-y-4 border border-border/50">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Ngân hàng
                  </span>
                  <span className="font-semibold">
                    {bankInfo?.bankName || "..."}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Số tài khoản
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {bankInfo?.bankAccountNo || "..."}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() =>
                        copyToClipboard(bankInfo?.bankAccountNo || "")
                      }
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Chủ tài khoản
                  </span>
                  <span className="font-semibold">
                    {bankInfo?.bankAccountName || "..."}
                  </span>
                </div>
              </div>
              {/* QR Code */}
              {bankInfo?.qrImageUrl ? (
                <div className="bg-white p-4 rounded-lg flex items-center justify-center border">
                  <Image
                    src={bankInfo.qrImageUrl}
                    alt="QR Code chuyển khoản"
                    width={192}
                    height={192}
                    className="w-48 h-48 object-contain"
                    priority
                    unoptimized
                  />
                </div>
              ) : (
                <div className="bg-white p-4 rounded-lg flex items-center justify-center border">
                  <div className="text-center text-xs text-muted-foreground">
                    <div className="w-32 h-32 bg-gray-100 mx-auto mb-2 rounded flex items-center justify-center">
                      <span className="text-gray-400">QR Code</span>
                    </div>
                    <p>Đang tải mã QR...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="text-xs text-blue-800">
                <p className="font-semibold mb-1">Hướng dẫn:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Quét mã QR hoặc chuyển khoản theo thông tin trên</li>
                  <li>
                    Sau khi chuyển xong, nhấn &quot;Tiếp tục&quot; để nhập thông
                    tin
                  </li>
                </ul>
              </div>
            </div>

            <Button onClick={() => setStep(2)} className="w-full">
              Tiếp tục
            </Button>
          </div>
        )}

        {/* Step 2: Form Input */}
        {step === 2 && (
          <div className="space-y-4 py-4">
            {/* Amount Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium mb-2!">Số tiền nạp</label>
              <Input
                type="number"
                placeholder="Ví dụ: 50000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="10000"
                step="10000"
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">Tối thiểu 10,000đ</p>
            </div>

            {/* Transfer Content Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Nội dung chuyển khoản
              </label>
              <Textarea
                placeholder="VD: NAP 123456 - Nguyen Van A"
                value={transferContent}
                onChange={(e) => setTransferContent(e.target.value)}
                rows={2}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Nhập nội dung bạn đã chuyển khoản để admin dễ dàng đối soát
              </p>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Ảnh chứng từ <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />
                <Button type="button" variant="outline" size="icon" asChild>
                  <label htmlFor="images" className="cursor-pointer">
                    <Upload className="h-4 w-4" />
                  </label>
                </Button>
              </div>
              {proofImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {proofImages.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={image}
                        alt={`Proof ${index + 1}`}
                        width={96}
                        height={96}
                        className="w-full h-24 object-cover rounded-md"
                        unoptimized
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Tải lên ít nhất một ảnh biên lai chuyển khoản
              </p>
            </div>

            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="text-xs text-amber-800">
                <p className="font-semibold mb-1">Lưu ý quan trọng:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Chuyển khoản đúng số tiền đã nhập</li>
                  <li>Nội dung chuyển khoản phải khớp với thông tin nhập</li>
                  <li>Yêu cầu sẽ được duyệt thủ công trong 1-24h</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1"
              >
                Quay lại
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  createDeposit.isPending ||
                  !amount ||
                  !transferContent ||
                  proofImages.length === 0
                }
                className="flex-1"
              >
                {createDeposit.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  "Gửi yêu cầu"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="space-y-4 py-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
              <div>
                <p className="font-semibold text-green-800 mb-1">
                  Yêu cầu đã được gửi thành công
                </p>
                <p className="text-sm text-green-700">
                  Quản trị viên sẽ kiểm tra tài khoản ngân hàng và duyệt yêu cầu
                  của bạn trong thời gian sớm nhất.
                </p>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-xl space-y-2 border border-border/50">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Số tiền</span>
                <span className="font-semibold text-lg">
                  {formatCurrency(Number(amount))}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Nội dung CK
                </span>
                <span className="font-semibold text-sm">{transferContent}</span>
              </div>
            </div>

            <Button onClick={handleClose} variant="outline" className="w-full">
              Đóng
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
