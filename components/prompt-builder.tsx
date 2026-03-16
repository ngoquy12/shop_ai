"use client";

import { useState } from "react";
import { Wand2, Copy, Check, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TOOLS = [
  "ChatGPT",
  "Claude",
  "Midjourney",
  "Gemini",
  "Grok",
  "Sora",
  "DALL-E 3",
  "Stable Diffusion",
];
const GOALS = [
  "Tạo ảnh sản phẩm",
  "Viết nội dung marketing",
  "Tạo video quảng cáo",
  "Thiết kế logo",
  "Viết email bán hàng",
  "Tạo ảnh chân dung",
  "Phân tích dữ liệu",
  "Viết code",
];
const STYLES = [
  "Chuyên nghiệp",
  "Sáng tạo",
  "Tối giản",
  "Cinematic",
  "Anime",
  "Thiên nhiên",
  "Luxury",
  "Vintage",
];
const LANGS = ["Tiếng Việt", "English", "Tiếng Nhật", "Tiếng Hàn"];

const TEMPLATES: Record<string, string> = {
  "Tạo ảnh sản phẩm": `Professional product photography of [your product], {style} aesthetic, studio lighting setup with soft shadows, pristine white background, sharp focus, ultra-high resolution 8K, shot on RED camera, commercial grade, suitable for e-commerce and marketing. The product should appear premium, clean and highly desirable. Color grading: {color}.`,

  "Viết nội dung marketing": `Viết {lang} nội dung marketing {style} cho [sản phẩm/dịch vụ]. Cấu trúc theo AIDA (Attention - Interest - Desire - Action). Hook mạnh trong câu đầu, nêu rõ pain point, đưa ra giải pháp độc đáo, social proof và strong CTA. Tone giọng: thuyết phục, gần gũi. Độ dài: khoảng 200 từ.`,

  "Tạo video quảng cáo": `Create a {duration}-second cinematic product advertisement for [product name]. {style} visual style, dynamic camera movements (slow zoom, dolly shot), professional color grading with {color} palette. Include: hero shot at 0s, product features at 5s, lifestyle shot at 15s, strong CTA overlay at end. BGM: upbeat commercial music.`,

  "Thiết kế logo": `Design a modern {style} logo for [brand name] in the [industry] industry. The logo should convey [brand values]. Use geometric shapes with clean lines, color palette: {color}. Include: primary full color version, monochrome version, icon-only version. Style: minimalist vector, scalable, memorable and timeless.`,

  "Viết email bán hàng": `Viết {lang} email bán hàng {style} cho [tên sản phẩm] gửi đến [đối tượng khách hàng]. Subject line: gây tò mò, tạo FOMO. Body: personalized greeting, pain point → solution → benefits (5 điểm bullet), social proof (số liệu cụ thể), limited offer, CTA button rõ ràng. P.S. tạo urgency. Giới hạn 300 từ.`,

  "Tạo ảnh chân dung": `{style} portrait photography of [subject description], {mood} lighting, shallow depth of field (f/1.8), shot on Sony A7 with 85mm portrait lens. Cinematic color grading, sharp eyes, natural expression. Background: [setting]. Post-processing: subtle skin retouching, color grade matching {color} tones. Magazine editorial quality.`,

  "Phân tích dữ liệu": `Analyze the following data and provide insights in {lang}: [paste data here]. Structure your analysis as: 1) Executive Summary (3 key findings), 2) Trend Analysis with specific percentages, 3) Anomalies and outliers, 4) Root Cause Analysis, 5) Actionable Recommendations (priority order), 6) Predicted outcomes for next 30/60/90 days. Use {style} tone.`,

  "Viết code": `Write {lang} clean, production-ready code for [describe what you need]. Requirements: modular architecture, comprehensive error handling, detailed inline comments, follow SOLID principles, include unit tests. Stack: [your tech stack]. Output format: complete working code with setup instructions and usage examples. Performance optimized and security hardened.`,
};

const COLORS_FOR_STYLE: Record<string, string> = {
  "Chuyên nghiệp": "navy blue and silver",
  "Sáng tạo": "vibrant purple and electric blue",
  "Tối giản": "black and white with accent gold",
  Cinematic: "desaturated teal and orange",
  Anime: "pastel pink and soft blue",
  "Thiên nhiên": "forest green and earth tones",
  Luxury: "deep gold and obsidian black",
  Vintage: "warm sepia and rust",
};

function SelectPill({
  options,
  value,
  onChange,
  label,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150",
              value === opt
                ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-500/20 scale-105"
                : "border-border/60 text-muted-foreground hover:text-foreground hover:border-violet-500/40 bg-card",
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PromptBuilder() {
  const [tool, setTool] = useState("ChatGPT");
  const [goal, setGoal] = useState("Tạo ảnh sản phẩm");
  const [style, setStyle] = useState("Chuyên nghiệp");
  const [lang, setLang] = useState("Tiếng Việt");
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const rawPrompt = TEMPLATES[goal] ?? TEMPLATES["Tạo ảnh sản phẩm"];
  const finalPrompt = rawPrompt
    .replace(/{style}/g, style)
    .replace(/{lang}/g, lang)
    .replace(/{color}/g, COLORS_FOR_STYLE[style] ?? "elegant neutrals")
    .replace(/{duration}/g, "30")
    .replace(/{mood}/g, style === "Cinematic" ? "dramatic" : "soft natural");

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerated(false);
    await new Promise((r) => setTimeout(r, 1200));
    setGenerating(false);
    setGenerated(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(finalPrompt).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Section bg glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-violet-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-blue-500/6 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-semibold mb-4">
            <Wand2 className="w-4 h-4" />
            Prompt Builder AI
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Tạo prompt hoàn hảo{" "}
            <span className="gradient-text-animated">trong 10 giây</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Không cần biết viết prompt. Chọn mục tiêu → Chọn phong cách → Copy
            ngay.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Form */}
          <div className="space-y-6 animate-slide-up-delay">
            <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-6 space-y-5">
              {/* Tool */}
              <SelectPill
                options={TOOLS}
                value={tool}
                onChange={setTool}
                label="🤖 Công cụ AI"
              />

              {/* Goal */}
              <SelectPill
                options={GOALS}
                value={goal}
                onChange={setGoal}
                label="🎯 Mục tiêu"
              />

              {/* Style */}
              <SelectPill
                options={STYLES}
                value={style}
                onChange={setStyle}
                label="✨ Phong cách"
              />

              {/* Language */}
              <SelectPill
                options={LANGS}
                value={lang}
                onChange={setLang}
                label="🌐 Ngôn ngữ output"
              />

              {/* Generate button */}
              <Button
                id="btn-generate-prompt"
                onClick={handleGenerate}
                disabled={generating}
                className="w-full h-12 text-base font-bold bg-linear-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-lg shadow-violet-500/30 border-0 gap-2 animate-gradient"
              >
                {generating ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    Đang tạo prompt...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />✨ Tạo Prompt ngay
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right: Result */}
          <div className="animate-slide-in-right">
            <div
              className={cn(
                "relative h-full rounded-2xl border bg-card/80 backdrop-blur-sm overflow-hidden transition-all duration-500",
                generated
                  ? "border-violet-500/40 shadow-xl shadow-violet-500/10"
                  : "border-border/60",
              )}
            >
              {/* Header bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 bg-muted/30">
                <div className="flex items-center gap-2">
                  <span className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/60" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <span className="w-3 h-3 rounded-full bg-green-500/60" />
                  </span>
                  <span className="text-xs text-muted-foreground font-mono ml-1">
                    prompt.txt — {tool}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setGenerated(false)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                  <button
                    onClick={handleCopy}
                    disabled={!generated}
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200",
                      generated
                        ? copied
                          ? "bg-green-600 text-white"
                          : "bg-violet-600 hover:bg-violet-700 text-white"
                        : "bg-muted text-muted-foreground cursor-not-allowed",
                    )}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3" /> Đã copy!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Content area */}
              <div className="p-5 min-h-[340px] flex flex-col">
                {!generated && !generating && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-10">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center animate-float">
                        <Wand2 className="w-8 h-8 text-violet-400" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-violet-500/20 animate-pulse-ring" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Prompt của bạn sẽ xuất hiện ở đây
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Chọn các tùy chọn bên trái và bấm tạo
                      </p>
                    </div>
                    {/* Preview placeholders */}
                    <div className="w-full space-y-2 mt-4">
                      {[80, 95, 70, 85, 60].map((w, i) => (
                        <div
                          key={i}
                          className="h-3 rounded-full bg-muted animate-pulse"
                          style={{
                            width: `${w}%`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {generating && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 rounded-full border-2 border-violet-500/30 animate-spin-slow" />
                      <div className="absolute inset-1 rounded-full border-2 border-t-violet-500 animate-spin" />
                      <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-violet-400 animate-pulse" />
                    </div>
                    <div className="w-full space-y-2">
                      {[90, 75, 85, 65, 80, 70].map((w, i) => (
                        <div
                          key={i}
                          className="h-3 rounded-full bg-muted overflow-hidden"
                        >
                          <div
                            className="h-full bg-linear-to-r from-violet-500/40 to-blue-500/40 animate-shimmer"
                            style={{ width: `${w}%` }}
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground animate-pulse">
                      AI đang tối ưu prompt cho {tool}...
                    </p>
                  </div>
                )}

                {generated && !generating && (
                  <div className="flex-1 flex flex-col animate-scale-in">
                    {/* Token count */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-medium">
                        ✓ Prompt tối ưu cho {tool}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {finalPrompt.split(" ").length} từ
                      </span>
                    </div>

                    {/* Prompt text */}
                    <div className="flex-1 relative rounded-xl bg-muted/40 border border-border/40 p-4 font-mono text-xs text-foreground/90 leading-relaxed overflow-y-auto">
                      {/* Highlight [placeholder] parts */}
                      {finalPrompt.split(/(\[.*?\])/).map((part, i) =>
                        part.startsWith("[") ? (
                          <span
                            key={i}
                            className="text-yellow-400 bg-yellow-500/10 px-0.5 rounded"
                          >
                            {part}
                          </span>
                        ) : (
                          <span key={i}>{part}</span>
                        ),
                      )}
                    </div>

                    {/* Hint */}
                    <p className="text-[11px] text-muted-foreground mt-3 flex items-center gap-1">
                      <span className="text-yellow-400">💡</span>
                      Thay thế text trong{" "}
                      <span className="text-yellow-400 font-mono">
                        [ngoặc vuông]
                      </span>{" "}
                      bằng nội dung của bạn
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
