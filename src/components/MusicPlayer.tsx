
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import TiltCard from '@/components/TiltCard';

interface Song {
  url: string;
  name: string;
}

interface MusicPlayerProps {
  songs: Song[];
}

const MusicPlayer = ({ songs }: MusicPlayerProps) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    // Initialize audio element
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const handleTimeUpdate = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
          setCurrentTime(audio.currentTime);
        }
      };
      
      const handleDurationChange = () => {
        setDuration(audio.duration);
      };
      
      const handleEnded = () => {
        handleSkipForward();
      };
      
      // Add event listeners
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('durationchange', handleDurationChange);
      audio.addEventListener('ended', handleEnded);
      
      // Load initial song
      audio.src = songs[currentSongIndex].url;
      audio.load();
      
      return () => {
        // Clean up event listeners
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('durationchange', handleDurationChange);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [songs, currentSongIndex]);
  
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleSkipBack = () => {
    const newIndex = currentSongIndex === 0 
      ? songs.length - 1 
      : currentSongIndex - 1;
    
    setCurrentSongIndex(newIndex);
    
    if (isPlaying && audioRef.current) {
      audioRef.current.src = songs[newIndex].url;
      audioRef.current.load();
      audioRef.current.play();
    }
  };
  
  const handleSkipForward = () => {
    const newIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(newIndex);
    
    if (isPlaying && audioRef.current) {
      audioRef.current.src = songs[newIndex].url;
      audioRef.current.load();
      audioRef.current.play();
    }
  };
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const progressBar = e.currentTarget;
      const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
      const progressWidth = progressBar.clientWidth;
      const seekPercentage = clickPosition / progressWidth;
      
      const seekTime = seekPercentage * duration;
      audioRef.current.currentTime = seekTime;
      setProgress(seekPercentage * 100);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <TiltCard className="mt-6 text-center p-4 border-2 border-[#00ff00]/50 rounded-lg bg-black/30 backdrop-blur-sm max-w-[320px] w-full">
      <div className="mb-4">
        <h3 className="text-[#00ff00] font-medium text-lg mb-1">
          {songs[currentSongIndex].name}
        </h3>
      </div>
      
      <div className="flex justify-center items-center space-x-4 mb-4">
        <button
          onClick={handleSkipBack}
          className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-[#00ff00]/20 hover:bg-black/40 transition-all duration-300"
        >
          <SkipBack className="w-6 h-6 text-[#00ff00]" />
        </button>
        
        <button
          onClick={togglePlay}
          className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-[#00ff00]/20 hover:bg-black/40 transition-all duration-300"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-[#00ff00]" />
          ) : (
            <Play className="w-6 h-6 text-[#00ff00]" />
          )}
        </button>
        
        <button
          onClick={handleSkipForward}
          className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-[#00ff00]/20 hover:bg-black/40 transition-all duration-300"
        >
          <SkipForward className="w-6 h-6 text-[#00ff00]" />
        </button>
      </div>
      
      <div className="w-full">
        <div 
          className="relative cursor-pointer"
          onClick={handleProgressClick}
        >
          <Progress 
            value={progress} 
            className="h-1 bg-[#00ff00]/20" 
            indicatorClassName="bg-[#00ff00]"
          />
        </div>
        <div className="flex justify-between text-[#00ff00]/60 text-[10px] mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      <audio ref={audioRef} />
    </TiltCard>
  );
};

export default MusicPlayer;
