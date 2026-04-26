import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Định dạng số tiền sang VNĐ (đ)
 * Ví dụ: 1000000 -> 1.000.000 đ
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "0 đ";
  return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
}
