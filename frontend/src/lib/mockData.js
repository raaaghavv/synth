export const mockPlaylists = [
  { id: "1", name: "Liked Songs", songCount: 234 },
  { id: "2", name: "My Playlist #1", songCount: 45 },
  { id: "3", name: "Chill Vibes", songCount: 67 },
  { id: "4", name: "Workout Mix", songCount: 89 },
  { id: "5", name: "Road Trip", songCount: 32 },
];

// Helper to format duration (seconds -> mm:ss)
export function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
