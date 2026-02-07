"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  Volume1,
  VolumeX,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { formatDuration } from "@/lib/mockData";
import { usePlayer } from "@/context/PlayerContext";

export default function PlayerBar() {
  const pathname = usePathname();
  const router = useRouter();
  const isPlayerPage = pathname === "/player";

  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    shuffle,
    repeat,
    togglePlay,
    playNext,
    playPrevious,
    seekTo,
    changeVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
  } = usePlayer();

  const currentTime = (progress / 100) * duration;

  // Build cover URL if song has cover image
  const coverUrl = currentSong?.coverImage
    ? `${process.env.NEXT_PUBLIC_API_URL}/${currentSong.coverImage}`
    : null;

  const handleTogglePlayer = () => {
    if (isPlayerPage) {
      router.back();
    } else {
      router.push("/player");
    }
  };

  return (
    <footer className="h-20 bg-black border-t border-background-highlight flex items-center px-4">
      {/* Left - Song Info */}
      <div className="w-72 flex items-center gap-3">
        {currentSong ? (
          <>
            {/* Album art */}
            <div className="w-14 h-14 rounded bg-background-highlight shrink-0 relative overflow-hidden">
              {coverUrl && (
                <Image
                  src={coverUrl}
                  alt={currentSong.title}
                  fill
                  className="object-cover rounded"
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
              <p className="text-xs text-foreground-muted truncate">
                {currentSong.artist}
              </p>
            </div>
          </>
        ) : (
          <div className="text-sm text-foreground-muted">No song playing</div>
        )}
      </div>

      {/* Center - Player Controls */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto">
        {/* Control Buttons */}
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={toggleShuffle}
            className={`transition-colors ${
              shuffle ? "text-accent" : "text-foreground-muted hover:text-white"
            }`}
          >
            <Shuffle size={18} />
          </button>
          <button
            onClick={playPrevious}
            className="text-foreground-muted hover:text-white transition-colors"
          >
            <SkipBack size={22} fill="currentColor" />
          </button>
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause size={18} className="text-black" fill="black" />
            ) : (
              <Play size={18} className="text-black ml-0.5" fill="black" />
            )}
          </button>
          <button
            onClick={playNext}
            className="text-foreground-muted hover:text-white transition-colors"
          >
            <SkipForward size={22} fill="currentColor" />
          </button>
          <button
            onClick={toggleRepeat}
            className={`transition-colors ${
              repeat ? "text-accent" : "text-foreground-muted hover:text-white"
            }`}
          >
            <Repeat size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center gap-2">
          <span className="text-xs text-foreground-muted w-10 text-right">
            {formatDuration(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => seekTo(Number(e.target.value))}
            className="flex-1 h-1 accent-accent"
            style={{
              background: `linear-gradient(to right, var(--accent) ${progress}%, #535353 ${progress}%)`,
            }}
          />
          <span className="text-xs text-foreground-muted w-10">
            {formatDuration(duration)}
          </span>
        </div>
      </div>

      {/* Right - Volume & Extra Controls */}
      <div className="w-72 flex items-center justify-end gap-3">
        <button
          onClick={toggleMute}
          className="text-foreground-muted hover:text-white transition-colors"
        >
          {isMuted || volume === 0 ? (
            <VolumeX size={18} />
          ) : volume < 50 ? (
            <Volume1 size={18} />
          ) : (
            <Volume2 size={18} />
          )}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => changeVolume(Number(e.target.value))}
          className="w-24 h-1 accent-accent"
          style={{
            background: `linear-gradient(to right, var(--foreground) ${volume}%, #535353 ${volume}%)`,
          }}
        />
        <button
          onClick={handleTogglePlayer}
          className="text-foreground-muted hover:text-white transition-colors ml-2"
        >
          {isPlayerPage ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>
    </footer>
  );
}
