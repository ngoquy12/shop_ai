import { PromptList } from "@/features/prompts/components/prompt-list";

export const metadata = {
  title: "Chợ Prompts AI | VideoPrompt",
  description:
    "Khám phá hàng ngàn lời nhắc (prompts) tối ưu cho ChatGPT, Midjourney, Claude.",
};

export default function PromptsMarketplacePage() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 space-y-4 text-center md:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
          Chợ Prompt AI <span className="text-primary">Đỉnh Cao</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Nơi tập hợp các kỹ thuật &quot;Prompt Engineering&quot; xuất sắc nhất.
          Giúp bạn làm chủ AI và tối ưu hóa năng suất xử lý công việc gấp 10
          lần.
        </p>
      </div>

      <PromptList />
    </div>
  );
}
