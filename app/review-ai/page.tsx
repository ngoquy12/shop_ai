"use client";

import { motion, Variants } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Hash, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAIReviews } from "@/features/ai-reviews/hooks/use-ai-reviews";
import { Suspense, useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";

const staggerVar: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVar: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

function ReviewAIPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const observerRef = useRef<HTMLDivElement>(null);

  const tagFilter = searchParams.get("tag");
  const limit = 12;

  const { data: postsResponse, isLoading: isQueryLoading } = useAIReviews({
    status: "PUBLISHED",
    search: searchQuery || undefined,
    page,
    limit,
  });

  // Extract unique tags from posts (derived state)
  const tags = useMemo(() => {
    const uniqueTags = new Set<string>();
    postsResponse?.data?.forEach((post) => {
      post.postTags?.forEach((pt) => {
        uniqueTags.add(pt.tag.name);
      });
    });
    return uniqueTags;
  }, [postsResponse]);

  // Use URL param directly for selected tag
  const selectedTag = tagFilter;

  // Filter posts by selected tag (derived state)
  const filteredPosts = useMemo(() => {
    if (!postsResponse?.data) return [];
    return postsResponse.data.filter((post) => {
      if (!selectedTag) return true;
      return post.postTags?.some((pt) => pt.tag.name === selectedTag);
    });
  }, [postsResponse, selectedTag]);

  const hasNextPage = (postsResponse?.meta?.totalRecords || 0) > page * limit;

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isQueryLoading &&
          !isFetchingMore
        ) {
          setIsFetchingMore(true);
          setPage((prev) => {
            setIsFetchingMore(false);
            return prev + 1;
          });
        }
      },
      { threshold: 0.1 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isQueryLoading, isFetchingMore]);

  const handleTagClick = (tagName: string) => {
    if (selectedTag === tagName) {
      router.push("/review-ai");
    } else {
      router.push(`/review?tag=${encodeURIComponent(tagName)}`);
    }
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  // Strip HTML tags from content
  const stripHtml = (html: string): string => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* ── HEADER ── */}
      <section className="relative pt-12 pb-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-300 h-300 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-350 mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="bg-blue-500/15 text-blue-400 border-none font-bold mb-4 tracking-widest px-3 py-1 rounded-full text-xs">
              Chuyên Gia Phân Tích
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 leading-tight">
              Review{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-500">
                Trải Nghiệm AI
              </span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Khám phá các bài viết đánh giá chuyên sâu, đa chiều và thực tế
              nhất về các công cụ trí tuệ nhân tạo.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── SEARCH & TAGS BAR ── */}
      <section className="border-y border-border/40 bg-black/40 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-350 mx-auto px-4 sm:px-6 py-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:bg-white/10"
              />
            </div>
            {selectedTag && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleTagClick(selectedTag)}
                className="text-blue-400 hover:text-blue-300"
              >
                <X className="w-4 h-4 mr-2" />
                {selectedTag}
              </Button>
            )}
            {filteredPosts.length > 0 && (
              <Badge
                variant="secondary"
                className="bg-blue-500/10 text-blue-400 border border-blue-500/20"
              >
                {filteredPosts.length} bài viết
              </Badge>
            )}
          </div>

          {/* Tags Cloud */}
          {tags.size > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground mr-2">Tags:</span>
              {Array.from(tags)
                .slice(0, 20)
                .map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "secondary"}
                    className={`cursor-pointer transition-colors ${
                      selectedTag === tag
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                    onClick={() => handleTagClick(tag)}
                  >
                    <Hash className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CONTENT GRID ── */}
      <section className="py-6">
        <div className="max-w-400 mx-auto px-4 sm:px-6">
          {isQueryLoading && filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-400" />
              <p className="text-muted-foreground">Đang tải bài viết...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <Hash className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Không tìm thấy bài viết nào
              </p>
            </div>
          ) : (
            <>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                variants={staggerVar}
                initial="hidden"
                animate="show"
              >
                {filteredPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    variants={cardVar}
                    className="group relative flex flex-col bg-card rounded-xl overflow-hidden border border-border/50 hover:border-blue-500/30 transition-colors"
                  >
                    {/* Image Section */}
                    <Link
                      href={`/review/${post.slug}`}
                      className="relative aspect-video w-full overflow-hidden block"
                    >
                      <Image
                        src={
                          post.thumbnailUrl ||
                          "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200"
                        }
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    </Link>

                    {/* Content Section */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.postTags?.map((postTag) => (
                          <Badge
                            key={postTag.tag.id}
                            variant="secondary"
                            className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] px-2 py-0.5 cursor-pointer hover:bg-blue-500/20"
                            onClick={() => handleTagClick(postTag.tag.name)}
                          >
                            <Hash className="w-3 h-3 mr-1" />
                            {postTag.tag.name}
                          </Badge>
                        ))}
                      </div>

                      <Link
                        href={`/review/${post.slug}`}
                        className="block group-hover:text-blue-400 transition-colors"
                      >
                        <h3 className="text-lg font-bold mb-2 tracking-tight line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                        {stripHtml(post.content)}
                      </p>

                      <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-4 text-xs text-muted-foreground">
                        <span>{post.author.fullName}</span>
                        <span>
                          {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Loading indicator for infinite scroll */}
              {isFetchingMore && (
                <div className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-400" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Đang tải thêm...
                  </p>
                </div>
              )}

              {/* Observer target */}
              {hasNextPage && <div ref={observerRef} className="h-10" />}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ReviewAIPage() {
  return (
    <Suspense fallback={null}>
      <ReviewAIPageContent />
    </Suspense>
  );
}
