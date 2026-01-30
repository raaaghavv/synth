"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Heart,
  ListMusic,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import { mockSongs, formatDuration } from "@/lib/mockData";

export default function PlayerPage() {
  // Using first song as mock current song
  const currentSong = mockSongs[0];
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35); // Demo progress

  const currentTime = (progress / 100) * currentSong.duration;

  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#4a3a5c] to-[var(--background)] -m-6 p-8">
      {/* Back button */}
      <div className="absolute top-4 left-72 ml-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-white hover:text-[var(--foreground-muted)] transition-colors"
        >
          <ChevronDown size={28} />
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full py-8">
        {/* Album Art */}
        <div className="w-72 h-72 md:w-80 md:h-80 rounded-lg bg-[var(--background-highlight)] shadow-2xl mb-8 flex items-center justify-center">
          {currentSong.coverUrl ? (
            <img
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <svg
              className="w-24 h-24 text-[var(--foreground-muted)]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          )}
        </div>

        {/* Song Info */}
        <div className="w-full flex items-start justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white mb-1 truncate">
              {currentSong.title}
            </h1>
            <p className="text-[var(--foreground-muted)] truncate">
              {currentSong.artist}
            </p>
          </div>
          <button className="text-[var(--foreground-muted)] hover:text-white transition-colors p-2">
            <Heart size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full mb-4">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full h-1 accent-white"
            style={{
              background: `linear-gradient(to right, #fff ${progress}%, #535353 ${progress}%)`,
            }}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-[var(--foreground-muted)]">
              {formatDuration(currentTime)}
            </span>
            <span className="text-xs text-[var(--foreground-muted)]">
              {formatDuration(currentSong.duration)}
            </span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-between w-full mb-8">
          <button className="text-[var(--foreground-muted)] hover:text-white transition-colors">
            <Shuffle size={22} />
          </button>
          <button className="text-white hover:scale-105 transition-transform">
            <SkipBack size={32} fill="white" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause size={28} className="text-black" fill="black" />
            ) : (
              <Play size={28} className="text-black ml-1" fill="black" />
            )}
          </button>
          <button className="text-white hover:scale-105 transition-transform">
            <SkipForward size={32} fill="white" />
          </button>
          <button className="text-[var(--foreground-muted)] hover:text-white transition-colors">
            <Repeat size={22} />
          </button>
        </div>

        {/* Extra Controls */}
        <div className="flex items-center justify-between w-full">
          <button className="text-[var(--foreground-muted)] hover:text-white transition-colors">
            <MoreHorizontal size={20} />
          </button>
          <button className="text-[var(--foreground-muted)] hover:text-white transition-colors">
            <ListMusic size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
