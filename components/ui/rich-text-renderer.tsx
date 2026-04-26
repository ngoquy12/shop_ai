import React from "react";
import { cn } from "@/lib/utils";

interface RichTextRendererProps {
  content?: string;
  className?: string;
}

/**
 * Component hiển thị chuẩn xác các nội dung được nhập từ Rich Text Editor
 * Nó sử dụng @tailwindcss/typography (class `prose`) để khôi phục mặc định List, Heading, Blockquote...
 * bị Tailwind reset mất.
 */
export const RichTextRenderer: React.FC<RichTextRendererProps> = ({
  content,
  className,
}) => {
  if (!content) return null;

  return (
    <div
      className={cn(
        // Cấu hình tailwind typography (prose) hỗ trợ Dark mode (invert)
        "prose dark:prose-invert max-w-none w-full",
        // Chỉnh styles cho toàn thư, kế thừa màu theme
        "text-foreground",
        // Chỉnh styles cho Heading
        "prose-headings:font-bold prose-headings:text-foreground",
        "prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg",
        // Chỉnh styles ho List (Bắt buộc phải có để hiển thị ul, ol từ tiptap)
        "prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6",
        "prose-li:my-1 prose-li:text-muted-foreground marker:text-muted-foreground",
        // Đoạn văn và Links
        "prose-p:leading-relaxed prose-p:mb-4 prose-p:text-muted-foreground",
        "prose-a:text-blue-500 prose-a:no-underline hover:prose-a:underline",
        "prose-strong:text-foreground prose-strong:font-bold",
        // Blockquote
        "prose-blockquote:border-l-4 prose-blockquote:border-muted-foreground/30 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground",
        // Hình ảnh (nếu có)
        "prose-img:rounded-lg prose-img:shadow-sm",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
