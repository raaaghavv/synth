"use client";

import Link from "next/link";
import { Home, Search, Library, Plus } from "lucide-react";
import { mockPlaylists } from "@/lib/mockData";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-black flex flex-col h-full">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Synth</h1>
      </div>

      {/* Main Navigation */}
      <nav className="px-3">
        <Link
          href="/"
          className="flex items-center gap-4 px-3 py-2 text-[var(--foreground-muted)] hover:text-white transition-colors rounded-md"
        >
          <Home size={24} />
          <span className="font-semibold">Home</span>
        </Link>
      </nav>

      {/* Library Section */}
      <div className="mt-6 flex-1 flex flex-col min-h-0">
        <div className="px-3 mb-2">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-3 text-[var(--foreground-muted)] hover:text-white transition-colors cursor-pointer">
              <Library size={24} />
              <span className="font-semibold">Your Library</span>
            </div>
            <button className="text-[var(--foreground-muted)] hover:text-white transition-colors p-1 rounded-full hover:bg-[var(--background-highlight)]">
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Playlist List */}
        <div className="flex-1 overflow-y-auto px-2">
          <div className="space-y-1">
            {mockPlaylists.map((playlist) => (
              <button
                key={playlist.id}
                className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-[var(--background-highlight)] transition-colors text-left"
              >
                {/* Playlist thumbnail placeholder */}
                <div className="w-12 h-12 rounded bg-[var(--background-highlight)] flex items-center justify-center">
                  <Library
                    size={20}
                    className="text-[var(--foreground-muted)]"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{playlist.name}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">
                    Playlist • {playlist.songCount} songs
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
