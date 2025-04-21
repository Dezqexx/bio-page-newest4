
import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import TiltCard from '@/components/TiltCard';

interface Song {
  url: string;
  name: string;
}

interface MusicPlayerProps {
  song: Song;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  progress: number;
  currentTime: number;
  duration: number;
  onSeek: (seek: number) => void;
}

const MusicPlayer = ({
  song,
  isPlaying,
  onPlayPause,
  onSkipBack,
  onSkipForward,
  progress,
  currentTime,
  duration,
  onSeek
}: MusicPlayerProps) => {
  // Progress bar handler
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const seekPercent = x / rect.width;
    onSeek(seekPercent);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <TiltCard className="mt-6 text-center p-4 border-2 border-[#00ff00]/50 rounded-lg bg-black/30 backdrop-blur-sm max-w-[320px] w-full glow">
      <div className="mb-4">
        <h3 className="text-[#00ff00] font-medium text-lg mb-1">{song.name}</h3>
      </div>
      
      <div className="flex justify-center items-center space-x-4 mb-4">
        <button
          onClick={onSkipBack}
          className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-[#00ff00]/20 hover:bg-black/40 transition-all duration-300"
        >
          <SkipBack className="w-6 h-6 text-[#00ff00]" />
        </button>
        
        <button
          onClick={onPlayPause}
          className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-[#00ff00]/20 hover:bg-black/40 transition-all duration-300"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-[#00ff00]" />
          ) : (
            <Play className="w-6 h-6 text-[#00ff00]" />
          )}
        </button>
        
        <button
          onClick={onSkipForward}
          className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-[#00ff00]/20 hover:bg-black/40 transition-all duration-300"
        >
          <SkipForward className="w-6 h-6 text-[#00ff00]" />
        </button>
      </div>
      
      {/* Interactive progress bar */}
      <div className="w-full relative cursor-pointer" onClick={handleProgressClick}>
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
    </TiltCard>
  );
};

export default MusicPlayer;
