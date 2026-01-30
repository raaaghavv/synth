"use client";

import { mockSongs } from "@/lib/mockData";
import SongCard from "@/components/SongCard";

export default function Home() {
  const handlePlay = (song) => {
    console.log("Playing:", song.title);
    // TODO: Connect to backend / player state
  };

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <section>
        <h1 className="text-3xl font-bold text-white mb-6">Good evening</h1>

        {/* Quick picks grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {mockSongs.slice(0, 6).map((song) => (
            <button
              key={song.id}
              onClick={() => handlePlay(song)}
              className="flex items-center gap-4 bg-[var(--background-elevated)] hover:bg-[var(--background-highlight)] rounded-md overflow-hidden transition-colors group"
            >
              {/* Album art placeholder */}
              <div className="w-16 h-16 bg-[var(--background-highlight)] flex-shrink-0 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[var(--foreground-muted)]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
              <span className="font-semibold text-white truncate pr-4">
                {song.title}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Recently Played */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Recently played</h2>
          <button className="text-sm font-semibold text-[var(--foreground-muted)] hover:underline">
            Show all
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {mockSongs.map((song) => (
            <SongCard key={song.id} song={song} onPlay={handlePlay} />
          ))}
        </div>
      </section>

      {/* Made for you */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Made for you</h2>
          <button className="text-sm font-semibold text-[var(--foreground-muted)] hover:underline">
            Show all
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {[...mockSongs].reverse().map((song) => (
            <SongCard key={`made-${song.id}`} song={song} onPlay={handlePlay} />
          ))}
        </div>
      </section>
    </div>
  );
}
