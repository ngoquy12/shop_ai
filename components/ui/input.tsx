import * as React from "react";

import { cn } from "@/lib/utils";

// Định nghĩa type size cho input
type InputSize = "sm" | "md" | "lg";

type InputProps = Omit<React.ComponentProps<"input">, "size"> & {
  size?: InputSize;
};

function Input({ className, type, size, ...props }: InputProps) {
  // Tạo một object để map size với height
  const sizeMap: Record<InputSize, string> = {
    sm: "h-9",
    md: "h-10",
    lg: "h-12",
  };

  // Lấy height từ sizeMap
  const height = sizeMap[size || "md"];

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        height,
        "w-full min-w-0 rounded-md border border-input bg-transparent px-4 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
