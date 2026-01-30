// Mock data structure - will be replaced with API calls to your backend

export const mockPlaylists = [
  { id: "1", name: "Liked Songs", songCount: 234 },
  { id: "2", name: "My Playlist #1", songCount: 45 },
  { id: "3", name: "Chill Vibes", songCount: 67 },
  { id: "4", name: "Workout Mix", songCount: 89 },
  { id: "5", name: "Road Trip", songCount: 32 },
];

export const mockSongs = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: 203, // seconds
    coverUrl: null, // placeholder - add your images later
    audioUrl: null, // will come from backend
  },
  {
    id: "2",
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: 189,
    coverUrl: null,
    audioUrl: null,
  },
  {
    id: "3",
    title: "Save Your Tears",
    artist: "The Weeknd",
    album: "After Hours",
    duration: 215,
    coverUrl: null,
    audioUrl: null,
  },
  {
    id: "4",
    title: "Stay",
    artist: "The Kid LAROI, Justin Bieber",
    album: "F*ck Love 3",
    duration: 138,
    coverUrl: null,
    audioUrl: null,
  },
  {
    id: "5",
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    album: "SOUR",
    duration: 178,
    coverUrl: null,
    audioUrl: null,
  },
  {
    id: "6",
    title: "Heat Waves",
    artist: "Glass Animals",
    album: "Dreamland",
    duration: 234,
    coverUrl: null,
    audioUrl: null,
  },
];

// Helper to format duration (seconds -> mm:ss)
export function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
