import { PromptDetail } from "@/features/prompts/components/prompt-detail";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getPromptDetailFn } from "@/features/prompts/api/prompts.api";
import { Metadata } from "next";
import Script from "next/script";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const prompt = await getPromptDetailFn(slug);
    if (!prompt) return { title: "Prompt Not Found" };

    return {
      title: `${prompt.title} - Shop AI Prompts`,
      description: prompt.excerpt || prompt.description,
      openGraph: {
        title: prompt.title,
        description: prompt.excerpt || prompt.description,
        type: "article",
      },
    };
  } catch {
    return { title: "Prompt Detail" };
  }
}

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="container mx-auto py-10 px-4 md:px-8 max-w-7xl">
      <div className="mb-6">
        <Link
          href="/prompts-ai"
          className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại chợ Prompt
        </Link>
      </div>

      <PromptDetail slug={slug} />

      {/* Tối ưu SEO bám theo Variables */}
      <Script
        id="prompt-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: `Prompt: ${slug}`,
            applicationCategory: "BusinessApplication",
            description:
              "Một prompt chuyên dụng cho AI, hỗ trợ cấu hình đa dạng biến số.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "VND",
            },
          }),
        }}
      />
    </div>
  );
}
