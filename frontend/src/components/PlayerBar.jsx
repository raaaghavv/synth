"use client";

import Link from "next/link";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  Maximize2,
} from "lucide-react";
import { formatDuration } from "@/lib/mockData";

export default function PlayerBar({
  currentSong = null,
  isPlaying = false,
  progress = 0, // 0-100
  duration = 0, // seconds
  volume = 80, // 0-100
  onPlayPause = () => {},
  onNext = () => {},
  onPrevious = () => {},
  onSeek = () => {},
  onVolumeChange = () => {},
  onShuffle = () => {},
  onRepeat = () => {},
}) {
  const currentTime = (progress / 100) * duration;

  return (
    <footer className="h-20 bg-black border-t border-[var(--background-highlight)] flex items-center px-4">
      {/* Left - Song Info */}
      <div className="w-72 flex items-center gap-3">
        {currentSong ? (
          <>
            {/* Album art placeholder */}
            <div className="w-14 h-14 rounded bg-[var(--background-highlight)] flex-shrink-0">
              {currentSong.coverUrl && (
                <img
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  className="w-full h-full object-cover rounded"
                />
              )}
            </div>
            <div className="min-w-0">
              <Link
                href="/player"
                className="text-sm text-white hover:underline truncate block"
              >
                {currentSong.title}
              </Link>
              <p className="text-xs text-[var(--foreground-muted)] truncate">
                {currentSong.artist}
              </p>
            </div>
          </>
        ) : (
          <div className="text-sm text-[var(--foreground-muted)]">
            No song playing
          </div>
        )}
      </div>

      {/* Center - Player Controls */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto">
        {/* Control Buttons */}
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={onShuffle}
            className="text-[var(--foreground-muted)] hover:text-white transition-colors"
          >
            <Shuffle size={18} />
          </button>
          <button
            onClick={onPrevious}
            className="text-[var(--foreground-muted)] hover:text-white transition-colors"
          >
            <SkipBack size={22} fill="currentColor" />
          </button>
          <button
            onClick={onPlayPause}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause size={18} className="text-black" fill="black" />
            ) : (
              <Play size={18} className="text-black ml-0.5" fill="black" />
            )}
          </button>
          <button
            onClick={onNext}
            className="text-[var(--foreground-muted)] hover:text-white transition-colors"
          >
            <SkipForward size={22} fill="currentColor" />
          </button>
          <button
            onClick={onRepeat}
            className="text-[var(--foreground-muted)] hover:text-white transition-colors"
          >
            <Repeat size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center gap-2">
          <span className="text-xs text-[var(--foreground-muted)] w-10 text-right">
            {formatDuration(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="flex-1 h-1 accent-[var(--accent)]"
            style={{
              background: `linear-gradient(to right, var(--accent) ${progress}%, #535353 ${progress}%)`,
            }}
          />
          <span className="text-xs text-[var(--foreground-muted)] w-10">
            {formatDuration(duration)}
          </span>
        </div>
      </div>

      {/* Right - Volume & Extra Controls */}
      <div className="w-72 flex items-center justify-end gap-3">
        <Volume2 size={18} className="text-[var(--foreground-muted)]" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="w-24 h-1 accent-[var(--accent)]"
          style={{
            background: `linear-gradient(to right, var(--foreground) ${volume}%, #535353 ${volume}%)`,
          }}
        />
        <Link
          href="/player"
          className="text-[var(--foreground-muted)] hover:text-white transition-colors ml-2"
        >
          <Maximize2 size={16} />
        </Link>
      </div>
    </footer>
  );
}
