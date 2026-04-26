"use client";

import { useState, useMemo } from "react";
import { Prompt, PromptVariable } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy, Sparkles, Wand2, Lock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PromptPlaygroundProps {
  prompt: Prompt;
  hasAccess: boolean;
}

export function PromptPlayground({ prompt, hasAccess }: PromptPlaygroundProps) {
  const variables = useMemo(
    () => (prompt.variables || []) as PromptVariable[],
    [prompt.variables],
  );

  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    variables.forEach((v) => {
      initial[v.name] = "";
    });
    return initial;
  });

  const [prevPromptId, setPrevPromptId] = useState(prompt.id);

  if (prompt.id !== prevPromptId) {
    setPrevPromptId(prompt.id);
    const initial: Record<string, string> = {};
    variables.forEach((v) => {
      initial[v.name] = "";
    });
    setValues(initial);
  }

  // Generate dynamic prompt
  const generatedPrompt = useMemo(() => {
    if (!hasAccess) return "Bạn cần trả phí để xem và sử dụng prompt này.";
    if (!prompt.instructions) return "";

    let result = prompt.instructions;

    // Replace logic: replace [variableName] with the value or [variableName] if empty
    variables.forEach((v) => {
      const val = values[v.name];
      const search = new RegExp(`\\[${v.name}\\]`, "g");
      result = result.replace(search, val || `[${v.label}]`);
    });

    return result;
  }, [prompt.instructions, variables, values, hasAccess]);

  const handleCopy = () => {
    if (!hasAccess) {
      toast.error("Vui lòng nâng cấp để copy prompt");
      return;
    }
    navigator.clipboard.writeText(generatedPrompt);
    toast.success("Đã copy vào bộ nhớ đệm!");
  };

  if (!hasAccess) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
            <Wand2 className="w-5 h-5 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Prompt Playground
          </h2>
        </div>
        <div className="p-8 rounded-2xl bg-card border border-white/5 shadow-xl text-center backdrop-blur-md relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
          <div className="absolute inset-0 bg-white/5 opacity-50 blur-3xl" />
          <div className="relative z-10 flex flex-col items-center">
            <Lock className="w-10 h-10 text-white/20 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">
              Mở khóa để sử dụng
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Tương tác trực tiếp với{" "}
              {variables.length > 0
                ? `${variables.length} biến số`
                : "prompt này"}{" "}
              ngay trên trình duyệt và tự động sinh bản sao hoàn hảo nhất.
            </p>
            <Button
              className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-[10px] tracking-widest px-8"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Nâng cấp để xem
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!prompt.instructions) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
            <Wand2 className="w-5 h-5 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Prompt Playground
          </h2>
        </div>
        {variables.length > 0 && (
          <span className="text-[10px] font-bold tracking-widest text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">
            Có {variables.length} tùy biến
          </span>
        )}
      </div>

      <div
        className={cn(
          "grid gap-6",
          variables.length > 0 ? "lg:grid-cols-[1fr_1.5fr]" : "grid-cols-1",
        )}
      >
        {/* SIDE 1: Inputs */}
        {variables.length > 0 && (
          <div className="space-y-4 bg-card/40 backdrop-blur-md rounded-2xl border border-white/5 p-6 shadow-xl h-fit">
            <div className="flex gap-2 items-center mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white tracking-widest">
                Biến số đầu vào
              </h3>
            </div>
            {variables.map((v) => (
              <div key={v.name} className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">
                  {v.label}
                </Label>
                <Input
                  className="bg-black/50 border-white/10 text-white h-11 focus-visible:ring-cyan-500/50"
                  placeholder={`Nhập ${v.label.toLowerCase()}...`}
                  type={v.type === "number" ? "number" : "text"}
                  value={values[v.name] || ""}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [v.name]: e.target.value }))
                  }
                />
              </div>
            ))}
          </div>
        )}

        {/* SIDE 2: Output */}
        <div className="space-y-4 bg-[#0a0a0b] rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <Button
              size="sm"
              onClick={handleCopy}
              className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold h-8 text-[10px] tracking-wider"
            >
              <Copy className="w-3.5 h-3.5 mr-1" /> Copy
            </Button>
          </div>

          <div className="flex gap-2 items-center mb-4 border-b border-white/10 pb-4">
            <div className="w-2 h-2 rounded-full bg-red-500/80" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
            <div className="w-2 h-2 rounded-full bg-green-500/80" />
            <span className="text-[10px] font-mono text-muted-foreground ml-2 opacity-50">
              Output.txt
            </span>
          </div>

          <pre className="text-sm text-white/90 font-mono whitespace-pre-wrap leading-relaxed overflow-auto max-h-[400px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {generatedPrompt}
          </pre>
        </div>
      </div>
    </div>
  );
}
