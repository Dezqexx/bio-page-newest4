
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  currentTrackIndex: number;
  handleSkipForward: () => void;
  handleSkipBack: () => void;
  progress: number;
  duration: number;
  currentTime: number;
  handleSeek: (progress: number) => void;
  volume: number;
  setVolume: (volume: number) => void;
  song: { url: string; name: string };
}

const songs = [
  { url: "/lovable-uploads/Fukk.mp3", name: "Fukk Sleep" },
  { url: "/lovable-uploads/MOTION.mp3", name: "Motion" },
  { url: "/lovable-uploads/Urban.mp3", name: "Urban Melody" },
  { url: "/lovable-uploads/Falling.mp3", name: "Falling Down" },
  { url: "/lovable-uploads/ANGER.mp3", name: "Anger" }
];

const getRandomSongIndex = () => Math.floor(Math.random() * songs.length);

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(getRandomSongIndex());
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const savedPositions = useRef<Record<string, number>>({});
  const lastToggleTime = useRef<number>(0);
  const userInitiatedPause = useRef<boolean>(false);

  useEffect(() => {
    let audio = audioRef.current;
    if (!audio) {
      audio = new window.Audio();
      audioRef.current = audio;
    }
    
    const currentUrl = songs[currentTrackIndex].url;
    
    if (!audio.src || !audio.src.includes(currentUrl)) {
      const wasPlaying = !audio.paused;
      const savedPosition = savedPositions.current[currentUrl] || 0;
      
      audio.src = currentUrl;
      audio.load();
      
      if (savedPosition > 0) {
        audio.currentTime = savedPosition;
      }
      
      if (wasPlaying) {
        audio.play().catch(() => {});
      }
    }
    
    audio.volume = volume;

    if (isPlaying) {
      audio.play().catch(() => {});
    } else if (userInitiatedPause.current) {
      savedPositions.current[currentUrl] = audio.currentTime;
      audio.pause();
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio!.currentTime);
      setDuration(audio!.duration || 0);
      setProgress(audio!.duration ? (audio!.currentTime / audio!.duration) * 100 : 0);
      savedPositions.current[currentUrl] = audio!.currentTime;
    };

    const handleDurationChange = () => {
      setDuration(audio!.duration || 0);
    };

    const handleEnded = () => {
      savedPositions.current[currentUrl] = 0;
      handleSkipForward();
    };

    // Handle browser-initiated pause events (like tab focus loss)
    const handlePause = () => {
      if (!userInitiatedPause.current) {
        // If this was not user-initiated, resume playback
        if (isPlaying) {
          audio!.play().catch(() => {});
        }
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);

    setCurrentTime(audio.currentTime);
    setDuration(audio.duration || 0);

    return () => {
      audio!.removeEventListener("timeupdate", handleTimeUpdate);
      audio!.removeEventListener("durationchange", handleDurationChange);
      audio!.removeEventListener("ended", handleEnded);
      audio!.removeEventListener("pause", handlePause);
    };
  }, [currentTrackIndex, isPlaying, volume]);

  const togglePlay = () => {
    // Prevent rapid toggling by enforcing a cooldown period
    const now = Date.now();
    if (now - lastToggleTime.current < 300) {
      return; // Ignore toggle if less than 300ms since last toggle
    }
    lastToggleTime.current = now;
    
    // Mark this as a user-initiated action
    userInitiatedPause.current = !isPlaying;
    setIsPlaying(prev => !prev);
  };

  const handleSkipBack = () => {
    // Add debounce for skip actions too
    const now = Date.now();
    if (now - lastToggleTime.current < 300) {
      return;
    }
    lastToggleTime.current = now;
    
    const newIndex = currentTrackIndex === 0 ? songs.length - 1 : currentTrackIndex - 1;
    const url = songs[newIndex].url;
    savedPositions.current[url] = 0;
    setCurrentTrackIndex(newIndex);
  };

  const handleSkipForward = () => {
    // Add debounce for skip actions too
    const now = Date.now();
    if (now - lastToggleTime.current < 300) {
      return;
    }
    lastToggleTime.current = now;
    
    const newIndex = (currentTrackIndex + 1) % songs.length;
    const url = songs[newIndex].url;
    savedPositions.current[url] = 0;
    setCurrentTrackIndex(newIndex);
  };

  const handleSeek = (seekProgress: number) => {
    if (audioRef.current && duration) {
      const time = seekProgress * duration;
      audioRef.current.currentTime = time;
      
      const currentUrl = songs[currentTrackIndex].url;
      savedPositions.current[currentUrl] = time;
      
      setCurrentTime(time);
      setProgress(seekProgress * 100);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        togglePlay,
        currentTrackIndex,
        handleSkipForward,
        handleSkipBack,
        progress,
        duration,
        currentTime,
        handleSeek,
        volume,
        setVolume,
        song: songs[currentTrackIndex]
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
