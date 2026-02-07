"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const router = useRouter();
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  // Player state
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [viewMode, setViewModeState] = useState("song"); // "song" or "video"
  const [pipMode, setPipMode] = useState(false); // PiP mini player mode
  const pipVideoContainerRef = useRef(null);

  // Queue state
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);

  // Refs to access current values in event handlers
  const queueRef = useRef(queue);
  const queueIndexRef = useRef(queueIndex);
  const shuffleRef = useRef(shuffle);
  const repeatRef = useRef(repeat);
  const previousVolumeRef = useRef(volume);
  const viewModeRef = useRef(viewMode);

  // Keep refs in sync
  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);
  useEffect(() => {
    queueIndexRef.current = queueIndex;
  }, [queueIndex]);
  useEffect(() => {
    shuffleRef.current = shuffle;
  }, [shuffle]);
  useEffect(() => {
    repeatRef.current = repeat;
  }, [repeat]);
  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode]);

  // Get the active media element based on viewMode
  const getActiveMedia = useCallback(() => {
    return viewModeRef.current === "video"
      ? videoRef.current
      : audioRef.current;
  }, []);

  // Build stream URL with type param
  const getStreamUrl = useCallback((songId, type = "audio") => {
    return `${process.env.NEXT_PUBLIC_API_URL}/api/v1/songs/${songId}/stream?type=${type}`;
  }, []);

  // Play a specific song (defined early so it can be used in handlers)
  const playSongInternal = useCallback(
    (song) => {
      const audio = audioRef.current;
      if (!audio) return;

      // Always start with audio when a new song is selected
      const streamUrl = getStreamUrl(song.id, "audio");
      audio.src = streamUrl;
      audio.play();
      setCurrentSong(song);
      setViewModeState("song");
    },
    [getStreamUrl],
  );

  // Initialize audio element on mount
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume / 100;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (repeatRef.current) {
        audio.currentTime = 0;
        audio.play();
      } else {
        // Play next song using refs
        const currentQueue = queueRef.current;
        const currentIndex = queueIndexRef.current;
        const isShuffle = shuffleRef.current;

        if (currentQueue.length === 0) return;

        let nextIndex;
        if (isShuffle) {
          nextIndex = Math.floor(Math.random() * currentQueue.length);
        } else {
          nextIndex = (currentIndex + 1) % currentQueue.length;
        }

        queueIndexRef.current = nextIndex;
        setQueueIndex(nextIndex);
        playSongInternal(currentQueue[nextIndex]);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.pause();
      audio.src = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize video element on mount - attach to persistent container
  const persistentVideoContainerRef = useRef(null);

  useEffect(() => {
    // Create video element
    const video = document.createElement("video");
    video.volume = volume / 100;
    video.playsInline = true;
    video.className = "w-full h-full object-contain";
    videoRef.current = video;

    // Attach to persistent container (stays in DOM)
    if (persistentVideoContainerRef.current) {
      persistentVideoContainerRef.current.appendChild(video);
    }

    const handleTimeUpdate = () => {
      if (viewModeRef.current === "video") {
        setCurrentTime(video.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (viewModeRef.current === "video") {
        setDuration(video.duration);
      }
    };

    const handleEnded = () => {
      if (viewModeRef.current !== "video") return;

      if (repeatRef.current) {
        video.currentTime = 0;
        video.play();
      } else {
        const currentQueue = queueRef.current;
        const currentIndex = queueIndexRef.current;
        const isShuffle = shuffleRef.current;

        if (currentQueue.length === 0) return;

        let nextIndex;
        if (isShuffle) {
          nextIndex = Math.floor(Math.random() * currentQueue.length);
        } else {
          nextIndex = (currentIndex + 1) % currentQueue.length;
        }

        queueIndexRef.current = nextIndex;
        setQueueIndex(nextIndex);
        playSongInternal(currentQueue[nextIndex]);
      }
    };

    const handlePlay = () => {
      if (viewModeRef.current === "video") setIsPlaying(true);
    };
    const handlePause = () => {
      if (viewModeRef.current === "video") setIsPlaying(false);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.pause();
      video.src = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Keyboard shortcuts: Spacebar for play/pause, Arrow Up/Down for volume
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in an input or textarea
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        return;
      }

      switch (e.code) {
        case "Space":
          e.preventDefault(); // Prevent page scroll
          const activeMedia = getActiveMedia();
          if (activeMedia) {
            if (activeMedia.paused) {
              activeMedia.play();
            } else {
              activeMedia.pause();
            }
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          setVolume((prev) => Math.min(100, prev + 5));
          break;
        case "ArrowDown":
          e.preventDefault();
          setVolume((prev) => Math.max(0, prev - 5));
          break;
        case "ArrowLeft":
          e.preventDefault();
          const mediaLeft = getActiveMedia();
          if (mediaLeft) {
            mediaLeft.currentTime = Math.max(0, mediaLeft.currentTime - 5);
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          const mediaRight = getActiveMedia();
          if (mediaRight) {
            mediaRight.currentTime = Math.min(
              mediaRight.duration,
              mediaRight.currentTime + 5,
            );
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [getActiveMedia]);

  // Move video to PiP container when pipMode is active
  useEffect(() => {
    const video = videoRef.current;
    const pipContainer = pipVideoContainerRef.current;

    if (pipMode && viewMode === "video" && video && pipContainer) {
      // Move video to PiP container
      if (!pipContainer.contains(video)) {
        pipContainer.appendChild(video);
      }
    }
    // Note: When pipMode becomes false, video stays wherever it is
    // PlayerPage will move it to visible container, or it stays in persistent
  }, [pipMode, viewMode]);

  // Switch between song and video view with time sync
  const setViewMode = useCallback(
    (newMode) => {
      if (newMode === viewModeRef.current) return;
      if (!currentSong) return;

      const audio = audioRef.current;
      const video = videoRef.current;

      if (newMode === "video") {
        // Switch from audio to video
        const savedTime = audio.currentTime;
        const wasPlaying = !audio.paused;
        audio.pause();

        const videoStreamUrl = getStreamUrl(currentSong.id, "video");
        video.src = videoStreamUrl;
        video.currentTime = savedTime;
        if (wasPlaying) {
          video.play();
        }
      } else {
        // Switch from video to audio
        const savedTime = video.currentTime;
        const wasPlaying = !video.paused;
        video.pause();

        const audioStreamUrl = getStreamUrl(currentSong.id, "audio");
        audio.src = audioStreamUrl;
        audio.currentTime = savedTime;
        if (wasPlaying) {
          audio.play();
        }
      }

      setViewModeState(newMode);
      viewModeRef.current = newMode;
    },
    [currentSong, getStreamUrl],
  );

  // Play a specific song (public API)
  const playSong = (song, songList = null) => {
    // If songList provided, update queue
    if (songList && songList.length > 0) {
      setQueue(songList);
      queueRef.current = songList;
      const index = songList.findIndex((s) => s.id === song.id);
      const newIndex = index >= 0 ? index : 0;
      setQueueIndex(newIndex);
      queueIndexRef.current = newIndex;
    }

    playSongInternal(song);
  };

  // Toggle play/pause
  const togglePlay = () => {
    const media = getActiveMedia();
    if (!media || !currentSong) return;

    if (isPlaying) {
      media.pause();
    } else {
      media.play();
    }
  };

  // Seek to position (0-100 percentage)
  const seekTo = (percentage) => {
    const media = getActiveMedia();
    if (!media || !duration) return;

    const time = (percentage / 100) * duration;
    media.currentTime = time;
  };

  // Seek to specific time in seconds
  const seekToTime = (time) => {
    const media = getActiveMedia();
    if (!media) return;
    media.currentTime = time;
  };

  // Play next song
  const playNext = () => {
    if (queue.length === 0) return;

    let nextIndex;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = (queueIndex + 1) % queue.length;
    }

    setQueueIndex(nextIndex);
    queueIndexRef.current = nextIndex;
    playSongInternal(queue[nextIndex]);
  };

  // Play previous song
  const playPrevious = () => {
    const media = getActiveMedia();

    // If more than 3 seconds in, restart current song
    if (media && media.currentTime > 3) {
      media.currentTime = 0;
      return;
    }

    if (queue.length === 0) return;

    let prevIndex;
    if (shuffle) {
      prevIndex = Math.floor(Math.random() * queue.length);
    } else {
      prevIndex = queueIndex === 0 ? queue.length - 1 : queueIndex - 1;
    }

    setQueueIndex(prevIndex);
    queueIndexRef.current = prevIndex;
    playSongInternal(queue[prevIndex]);
  };

  // Toggle shuffle
  const toggleShuffle = () => {
    setShuffle((prev) => !prev);
  };

  // Toggle repeat
  const toggleRepeat = () => {
    setRepeat((prev) => !prev);
  };

  // Change volume (0-100)
  const changeVolume = (newVolume) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (newVolume > 0) {
      previousVolumeRef.current = newVolume;
    }
  };

  // Toggle mute
  const toggleMute = () => {
    const audio = audioRef.current;
    const video = videoRef.current;
    if (!audio) return;

    if (isMuted) {
      // Unmute - restore previous volume
      const restoredVolume = previousVolumeRef.current || 80;
      setVolume(restoredVolume);
      audio.volume = restoredVolume / 100;
      if (video) video.volume = restoredVolume / 100;
      setIsMuted(false);
    } else {
      // Mute - save current volume and set to 0
      previousVolumeRef.current = volume;
      setVolume(0);
      audio.volume = 0;
      if (video) video.volume = 0;
      setIsMuted(true);
    }
  };

  // Calculate progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const value = {
    // State
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    progress,
    shuffle,
    repeat,
    queue,
    isMuted,
    viewMode,
    videoRef,
    persistentVideoContainerRef,

    // Actions
    playSong,
    togglePlay,
    seekTo,
    seekToTime,
    playNext,
    playPrevious,
    toggleShuffle,
    toggleRepeat,
    changeVolume,
    toggleMute,
    setQueue,
    setViewMode,
    pipMode,
    setPipMode,
    pipVideoContainerRef,
  };

  return (
    <PlayerContext.Provider value={value}>
      {/* Persistent video container - hidden but keeps video in DOM */}
      <div
        ref={persistentVideoContainerRef}
        className="fixed -z-10 opacity-0 pointer-events-none w-0 h-0 overflow-hidden"
        aria-hidden="true"
      />
      {/* PiP Mini Player */}
      {pipMode && viewMode === "video" && (
        <div className="fixed bottom-20 right-6 z-50 shadow-2xl rounded-lg overflow-hidden group">
          <div
            ref={pipVideoContainerRef}
            className="w-80 aspect-video bg-black"
          />
          {/* PiP Controls */}
          <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => {
                const video = videoRef.current;
                const wasPlaying = video && !video.paused;
                setPipMode(false);
                router.push("/player"); // Navigate back to player
                // Keep video playing
                if (wasPlaying && video) {
                  setTimeout(() => video.play(), 50);
                }
              }}
              className="p-1.5 rounded bg-black/60 hover:bg-black/80 text-white transition-colors text-xs"
              title="Back to Player"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </button>
            <button
              onClick={() => {
                const video = videoRef.current;
                const wasPlaying = video && !video.paused;
                setPipMode(false);
                // Video keeps playing in background, just hide the PiP preview
                if (wasPlaying && video) {
                  setTimeout(() => video.play(), 50);
                }
              }}
              className="p-1.5 rounded bg-black/60 hover:bg-black/80 text-white transition-colors"
              title="Close Preview"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
