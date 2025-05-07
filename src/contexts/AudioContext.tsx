
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

interface Song {
  url: string;
  name: string;
}

interface AudioContextProps {
  songs: Song[];
  currentTrack: Song | null;
  currentTrackIndex: number;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  currentTime: number;
  togglePlay: () => void;
  handleSkipBack: () => void;
  handleSkipForward: () => void;
  handleSeek: (seekProgress: number) => void;
  handleMute: () => void;
  setVolume: (volume: number) => void;
}

const songs = [
  { url: "/lovable-uploads/Fukk.mp3", name: "Fukk Sleep" },
  { url: "/lovable-uploads/MOTION.mp3", name: "Motion" },
  { url: "/lovable-uploads/Urban.mp3", name: "Urban Melody" },
  { url: "/lovable-uploads/Falling.mp3", name: "Falling Down" },
  { url: "/lovable-uploads/ANGER.mp3", name: "Anger" }
];

const getRandomSongIndex = () => Math.floor(Math.random() * songs.length);

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(getRandomSongIndex());
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const savedPositions = useRef<Record<string, number>>({});

  useEffect(() => {
    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio();
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
    } else {
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

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);

    setCurrentTime(audio.currentTime);
    setDuration(audio.duration || 0);

    return () => {
      audio!.removeEventListener("timeupdate", handleTimeUpdate);
      audio!.removeEventListener("durationchange", handleDurationChange);
      audio!.removeEventListener("ended", handleEnded);
    };
  }, [currentTrackIndex, isPlaying, volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    setIsPlaying((v) => !v);
  };

  const handleSkipBack = () => {
    const newIndex = currentTrackIndex === 0 ? songs.length - 1 : currentTrackIndex - 1;
    const url = songs[newIndex].url;
    savedPositions.current[url] = 0;
    setCurrentTrackIndex(newIndex);
    setIsPlaying(true);
  };

  const handleSkipForward = () => {
    const newIndex = (currentTrackIndex + 1) % songs.length;
    const url = songs[newIndex].url;
    savedPositions.current[url] = 0;
    setCurrentTrackIndex(newIndex);
    setIsPlaying(true);
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

  const handleMute = () => {
    setVolume(v => (v === 0 ? 1 : 0));
  };

  return (
    <AudioContext.Provider value={{
      songs,
      currentTrack: songs[currentTrackIndex],
      currentTrackIndex,
      isPlaying,
      volume,
      progress,
      duration,
      currentTime,
      togglePlay,
      handleSkipBack,
      handleSkipForward,
      handleSeek,
      handleMute,
      setVolume
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
};
