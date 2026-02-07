"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ChevronDown,
  MoreHorizontal,
  Play,
  Pause,
  PictureInPicture2,
  Maximize,
} from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";

export default function PlayerPage() {
  const router = useRouter();
  const {
    currentSong,
    viewMode,
    setViewMode,
    videoRef,
    persistentVideoContainerRef,
    togglePlay,
    isPlaying,
    setPipMode,
    pipVideoContainerRef,
  } = usePlayer();
  const videoContainerRef = useRef(null);
  const [showPlayPauseIcon, setShowPlayPauseIcon] = useState(false);

  // Build cover URL
  const coverUrl = currentSong?.coverImage
    ? `${process.env.NEXT_PUBLIC_API_URL}/${currentSong.coverImage}`
    : null;

  // Check if video is available for current song
  const hasVideo = currentSong?.hasVideo ?? false;

  // Move video element to visible container when in video mode, back to persistent when leaving
  useEffect(() => {
    if (viewMode === "video" && videoContainerRef.current && videoRef.current) {
      const visibleContainer = videoContainerRef.current;
      const persistentContainer = persistentVideoContainerRef?.current;
      const video = videoRef.current;

      // Move to visible container
      if (!visibleContainer.contains(video)) {
        visibleContainer.appendChild(video);
      }

      return () => {
        // Move back to persistent container when leaving or switching to song mode
        if (persistentContainer && visibleContainer.contains(video)) {
          persistentContainer.appendChild(video);
        }
      };
    }
  }, [viewMode, videoRef, persistentVideoContainerRef]);

  // Handle video click - toggle play and show icon
  const handleVideoClick = (e) => {
    // Don't trigger if clicking on control buttons
    if (e.target.closest(".video-controls")) return;
    togglePlay();
    setShowPlayPauseIcon(true);
  };

  // Auto-hide play/pause icon after delay
  useEffect(() => {
    if (showPlayPauseIcon) {
      const timer = setTimeout(() => {
        setShowPlayPauseIcon(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [showPlayPauseIcon]);

  // Picture-in-Picture handler - custom PiP mode
  const handlePiP = (e) => {
    e.stopPropagation();
    setPipMode(true);
    router.push("/"); // Navigate to home
  };

  // Fullscreen handler
  const handleFullscreen = async (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await video.requestFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  return (
    <div className="min-h-full flex flex-col bg-linear-to-b from-[#3d3d3d] to-[#121212] -m-6">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => router.back()}
          className="text-white hover:text-foreground-muted transition-colors p-2"
        >
          <ChevronDown size={28} />
        </button>

        {/* Song/Video Toggle */}
        <div className="flex bg-[#333] rounded-full p-1">
          <button
            onClick={() => setViewMode("song")}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
              viewMode === "song"
                ? "bg-[#535353] text-white"
                : "text-foreground-muted hover:text-white"
            }`}
          >
            Song
          </button>
          <button
            onClick={() => setViewMode("video")}
            disabled={!hasVideo}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
              viewMode === "video"
                ? "bg-[#535353] text-white"
                : "text-foreground-muted hover:text-white"
            } ${!hasVideo ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Video
          </button>
        </div>

        <button className="text-white hover:text-foreground-muted transition-colors p-2">
          <MoreHorizontal size={24} />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-8">
        {viewMode === "song" ? (
          <>
            {/* Album Art */}
            <div className="relative w-full max-w-[450px] aspect-square rounded-lg bg-background-highlight shadow-2xl flex items-center justify-center overflow-hidden">
              {coverUrl ? (
                <Image
                  src={coverUrl}
                  alt={currentSong?.title || "Album cover"}
                  fill
                  className="object-cover"
                />
              ) : (
                <svg
                  className="w-32 h-32 text-foreground-muted"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              )}
            </div>

            {/* Song Info */}
            <div className="w-full max-w-[340px] mt-8 text-center">
              <h1 className="text-2xl font-bold text-white mb-1 truncate">
                {currentSong?.title || "No song playing"}
              </h1>
              <p className="text-foreground-muted truncate">
                {currentSong?.artist || "Select a song to play"}
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Video View */}
            <div
              ref={videoContainerRef}
              onClick={handleVideoClick}
              className="group relative max-h-[75vh] aspect-video rounded-lg bg-black shadow-2xl flex items-center justify-center overflow-hidden cursor-pointer"
            >
              {/* Video element will be attached here by useEffect */}

              {/* Video Controls - Top Right (show on hover) */}
              <div className="video-controls absolute top-3 right-3 flex items-center gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={handlePiP}
                  className="relative p-2 rounded bg-black/50 hover:bg-black/70 text-white transition-colors group/btn"
                  aria-label="Picture-in-Picture"
                >
                  <PictureInPicture2 size={20} />
                  <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs bg-black/90 text-white rounded whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none">
                    Picture-in-Picture
                  </span>
                </button>
                <button
                  onClick={handleFullscreen}
                  className="relative p-2 rounded bg-black/50 hover:bg-black/70 text-white transition-colors group/btn"
                  aria-label="Fullscreen"
                >
                  <Maximize size={20} />
                  <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs bg-black/90 text-white rounded whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none">
                    Fullscreen
                  </span>
                </button>
              </div>

              {/* Play/Pause Icon Overlay */}
              {showPlayPauseIcon && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="w-20 h-20 rounded-full bg-black/60 flex items-center justify-center animate-scale-fade">
                    {isPlaying ? (
                      <Play size={40} className="text-white ml-1" />
                    ) : (
                      <Pause size={40} className="text-white" />
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
