"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronRight, Volume2, VolumeX } from "lucide-react";
import { useInView, motion } from "framer-motion";
import {
  useVideos,
  useFeaturedVideos,
} from "@/features/videos/hooks/use-videos";
import { VideoPlayerModal } from "@/components/video-player-modal";
import { videosApi } from "@/features/videos/api/videos.api";
import type { Video } from "@/features/videos/types";

// ─── Video Banner Card Component ─────────────────────────────
function VideoBannerCard({
  video,
  onClick,
}: {
  video: Video;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(ref, { once: true, margin: "200px" });
  const [isMuted, setIsMuted] = useState(true);

  const videoUrl =
    video.type === "CLOUDINARY" ? video.cloudinaryUrl : video.youtubeUrl;
  const thumbnailUrl = video.thumbnailUrl || video.youtubeThumbnailUrl;

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
    // Track view on hover
    if (video.type === "CLOUDINARY") {
      videosApi.incrementView(video.id).catch((error) => {
        console.error("Failed to increment view count:", error);
      });
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "100px" }}
      transition={{ duration: 0.5 }}
      className="group relative rounded-3xl overflow-hidden aspect-16/11 cursor-pointer border-2 border-white/5 hover:border-blue-500 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] transition-all duration-300 bg-black"
      style={{ transform: "translateZ(0)" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isInView && videoUrl ? (
        <video
          ref={videoRef}
          loop
          muted={isMuted}
          playsInline
          poster={thumbnailUrl}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        thumbnailUrl && (
          <Image
            src={thumbnailUrl}
            alt={video.title}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        )
      )}

      {/* Mute/Unmute Icon - Top Right */}
      {isInView && videoUrl && (
        <button
          onClick={toggleMute}
          className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" />
          )}
        </button>
      )}
    </motion.div>
  );
}

// ─── Category Video Section Component ─────────────────────────────
export function CategoryVideoSection({
  categorySlug,
  title,
  onVideoClick,
}: {
  categorySlug: string;
  title: string;
  onVideoClick: (video: Video) => void;
}) {
  const { data: videosResponse, isLoading } = useVideos({
    limit: 8,
    categoryId: categorySlug,
  });

  const videos = videosResponse?.data || [];

  if (isLoading) {
    return (
      <section className="relative z-10 py-8">
        <div className="">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-4">
            {title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-16/11 rounded-3xl bg-white/5 border border-white/5 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="relative z-10 py-8">
      <div className="">
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-4">
          {title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {videos.map((video) => (
            <VideoBannerCard
              key={video.id}
              video={video}
              onClick={() => onVideoClick(video)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Video Banner Component ─────────────────────────────────
export function VideoBanner() {
  const { data: videosResponse, isLoading } = useFeaturedVideos();

  const videos = videosResponse?.data || [];
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  if (isLoading) {
    return (
      <section className="relative z-10 py-8">
        <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="aspect-16/11 rounded-3xl bg-white/5 border border-white/5 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <>
      <section className="relative z-10 py-8">
        <div className="">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                Video <span className="text-blue-400">Nổi Bật</span>
              </h2>
            </div>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold transition-all">
              Xem tất cả
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {videos.map((video) => (
              <VideoBannerCard
                key={video.id}
                video={video}
                onClick={() => handleVideoClick(video)}
              />
            ))}
          </div>

          {/* Mobile View All Button */}
          <button className="sm:hidden w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold transition-all">
            Xem tất cả video
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Category Sections */}
      <CategoryVideoSection
        categorySlug="tutorial"
        title="Video Hướng Dẫn"
        onVideoClick={handleVideoClick}
      />
      <CategoryVideoSection
        categorySlug="review"
        title="Video Review AI"
        onVideoClick={handleVideoClick}
      />
      <CategoryVideoSection
        categorySlug="showcase"
        title="Video Demo Sản Phẩm"
        onVideoClick={handleVideoClick}
      />

      {/* Video Player Modal */}
      <VideoPlayerModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
