
import { createContext, useContext, useRef, useState, useEffect } from 'react';

interface Song {
  url: string;
  name: string;
}

interface AudioContextValue {
  isPlaying: boolean;
  togglePlay: () => void;
  currentSong: Song;
  volume: number;
  setVolume: (volume: number) => void;
  handleMute: () => void;
  handleSkipBack: () => void;
  handleSkipForward: () => void;
  progress: number;
  currentTime: number;
  duration: number;
  handleSeek: (percent: number) => void;
}

const songs: Song[] = [
  {
    url: '/lovable-uploads/ANGER.mp3',
    name: 'ANGER - Tempest',
  },
  {
    url: '/lovable-uploads/Falling.mp3',
    name: 'Falling',
  },
  {
    url: '/lovable-uploads/Fukk.mp3',
    name: 'Fukk',
  },
  {
    url: '/lovable-uploads/MOTION.mp3',
    name: 'MOTION',
  },
  {
    url: '/lovable-uploads/Urban.mp3',
    name: 'Urban',
  },
];

const AudioContext = createContext<AudioContextValue | null>(null);

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}

interface AudioProviderProps {
  children: React.ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleSongEnd);

    // Set initial volume
    audio.volume = volume;

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleSongEnd);
    };
  }, []);

  // Handle time updates
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime);
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    }
  };

  // Handle loaded metadata
  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) {
      setDuration(audio.duration);
    }
  };

  // Handle when song ends
  const handleSongEnd = () => {
    handleSkipForward(); // Auto play next song
  };

  // Update the audio source when track changes or when we need to play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      // Load the current track
      audio.src = songs[currentTrackIndex].url;
      audio.load();
      
      // Play or pause the audio based on isPlaying state
      if (isPlaying) {
        const playPromise = audio.play();
        // Handle the play promise to avoid the DOMException
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Error playing audio:', error);
          });
        }
      } else {
        audio.pause();
      }
      
      // Update the volume
      audio.volume = volume;
    }
  }, [currentTrackIndex, isPlaying, volume]);

  const togglePlay = () => {
    console.log("Toggle Play Called, current state:", isPlaying);
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);
    
    const audio = audioRef.current;
    if (audio) {
      if (newIsPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Error playing audio:', error);
            // Revert state if play fails
            setIsPlaying(false);
          });
        }
      } else {
        audio.pause();
      }
    }
  };

  const handleSkipBack = () => {
    setCurrentTrackIndex((prevIndex) => {
      if (prevIndex <= 0) {
        return songs.length - 1;
      } else {
        return prevIndex - 1;
      }
    });
  };

  const handleSkipForward = () => {
    setCurrentTrackIndex((prevIndex) => {
      if (prevIndex >= songs.length - 1) {
        return 0;
      } else {
        return prevIndex + 1;
      }
    });
  };

  const handleMute = () => {
    setVolume(prev => prev === 0 ? 0.5 : 0);
  };

  const handleSeek = (percent: number) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      const newTime = audio.duration * percent;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(percent * 100);
    }
  };

  const value = {
    isPlaying,
    togglePlay,
    currentSong: songs[currentTrackIndex],
    volume,
    setVolume,
    handleMute,
    handleSkipBack,
    handleSkipForward,
    progress,
    currentTime,
    duration,
    handleSeek,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}
