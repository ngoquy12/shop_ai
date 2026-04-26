"use client";

import { usePrompts } from "../hooks/use-prompts";
import { PromptCard } from "./prompt-card";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce"; // Assuming a useDebounce hook exists or I will create it. Actually, I can just use local state for simplicity or use react-query features.
import { Prompt } from "../types";

export function PromptList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch] = useDebounce(searchTerm, 500); // Wait, I will use a simple form submit instead of debounce to save a file right now.

  const { data, isLoading, isError } = usePrompts({
    page,
    limit: 12,
    search: debouncedSearch,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-4 rounded-xl border">
        <div className="relative w-full md:w-96 text-muted-foreground">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
          <Input
            className="pl-9 w-full bg-background"
            placeholder="Tìm kiếm prompt (VD: SEO, Marketing...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {/* Thêm filter Category sau này */}
          <Button variant="outline" size="sm">
            Mới nhất
          </Button>
          <Button variant="outline" size="sm">
            Nổi bật
          </Button>
          <Button variant="outline" size="sm">
            Miễn phí
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      )}

      {isError && (
        <div className="text-center py-10 text-destructive font-medium">
          Không thể tải danh sách Prompt. Vui lòng thử lại sau.
        </div>
      )}

      {data && data.data && data.data.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          Không tìm thấy Prompt nào phù hợp.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.data?.map((prompt: Prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>

      {data && data.meta?.totalRecords > (data.data?.length || 0) && (
        <div className="flex justify-center mt-8">
          <Button onClick={() => setPage((p) => p + 1)} variant="secondary">
            Tải thêm...
          </Button>
        </div>
      )}
    </div>
  );
}
