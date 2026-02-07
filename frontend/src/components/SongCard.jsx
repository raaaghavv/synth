"use client";

import { Play } from "lucide-react";

export default function SongCard({ song, onPlay = () => {} }) {
  return (
    <button
      onClick={() => onPlay(song)}
      className="group p-4 rounded-lg bg-[var(--background-elevated)] hover:bg-[var(--background-highlight)] transition-colors text-left w-full"
    >
      {/* Album Art */}
      <div className="relative aspect-square mb-4 rounded-md overflow-hidden bg-[var(--background-highlight)]">
        {song.coverImage ? (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/${song.coverImage}`}
            alt={song.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--foreground-muted)]">
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        )}
        {/* Play button overlay */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
          <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-lg hover:scale-105 hover:bg-[var(--accent-hover)] transition-all">
            <Play size={24} className="text-black ml-1" fill="black" />
          </div>
        </div>
      </div>

      {/* Song Info */}
      <h3 className="font-semibold text-white truncate mb-1">{song.title}</h3>
      <p className="text-sm text-[var(--foreground-muted)] truncate">
        {song.artist}
      </p>
    </button>
  );
}
