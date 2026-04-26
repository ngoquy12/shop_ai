"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateManualDeposit } from "../hooks/use-manual-deposits";
import { uploadDepositProofImagesFn } from "../api/manual-deposits.api";
import { Upload, X, Loader2 } from "lucide-react";

export function ManualDepositForm() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [note, setNote] = useState("");
  const [proofImages, setProofImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const createDeposit = useCreateManualDeposit();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const { urls } = await uploadDepositProofImagesFn(Array.from(files));
      setProofImages((prev) => [...prev, ...urls]);
    } catch (error) {
      alert("Lỗi khi upload ảnh: " + (error as Error).message);
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setProofImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !method || proofImages.length === 0) {
      alert(
        "Vui lòng điền đầy đủ thông tin và tải lên ít nhất một ảnh chứng từ",
      );
      return;
    }

    createDeposit.mutate(
      {
        amount: parseFloat(amount),
        method,
        note,
        proofImages,
      },
      {
        onSuccess: () => {
          alert("Gửi yêu cầu nạp tiền thành công!");
          setAmount("");
          setMethod("");
          setNote("");
          setProofImages([]);
        },
        onError: (error) => {
          alert("Có lỗi xảy ra: " + error.message);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="amount">Số tiền (VNĐ)</Label>
        <Input
          id="amount"
          type="number"
          placeholder="Nhập số tiền muốn nạp"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="10000"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="method">Phương thức thanh toán</Label>
        <Select value={method} onValueChange={setMethod} required>
          <SelectTrigger>
            <SelectValue placeholder="Chọn phương thức thanh toán" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BANK">Chuyển khoản ngân hàng</SelectItem>
            <SelectItem value="MOMO">MoMo</SelectItem>
            <SelectItem value="ZALOPAY">ZaloPay</SelectItem>
            <SelectItem value="CASH">Tiền mặt</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
        <Textarea
          id="note"
          placeholder="Nhập ghi chú nếu cần"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">Ảnh chứng từ (bắt buộc)</Label>
        <div className="flex items-center gap-4">
          <Input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={uploading}
            className="cursor-pointer"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            asChild
            disabled={uploading}
          >
            <label htmlFor="images" className="cursor-pointer">
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
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
                  width={100}
                  height={96}
                  className="w-full h-24 object-cover rounded-md"
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
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={createDeposit.isPending || uploading}
      >
        {createDeposit.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Đang gửi...
          </>
        ) : (
          "Gửi yêu cầu nạp tiền"
        )}
      </Button>
    </form>
  );
}
