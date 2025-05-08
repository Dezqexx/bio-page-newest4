
import React, { useState, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
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
  progress: number; // 0-100
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
  // State to manage slider drag
  const [seeking, setSeeking] = useState(false);
  const [dragValue, setDragValue] = useState(progress);

  // Format time helper
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // When the user is dragging, show dragValue, otherwise progress
  const displayProgress = seeking ? dragValue : progress;

  // Handlers for the slider
  const handleSliderChange = (value: number[]) => {
    setSeeking(true);
    setDragValue(value[0]);
  };
  
  const handleSliderCommit = (value: number[]) => {
    setSeeking(false);
    onSeek(value[0] / 100);
  };

  return (
    <TiltCard className="mt-6 text-center p-4 border-2 border-[#00ff00]/50 rounded-lg backdrop-blur-sm max-w-[320px] w-full glow">
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
      
      {/* Slider: draggable, progress bar with ball */}
      <div className="w-full relative flex items-center cursor-pointer px-1">
        <Slider
          value={[displayProgress]}
          min={0}
          max={100}
          step={0.1}
          onValueChange={handleSliderChange}
          onValueCommit={handleSliderCommit}
          className="h-4"
          thumbClassName="w-4 h-4 bg-[#00ff00] border-2 border-[#252d19] shadow-lg transition-all"
          trackClassName="h-1 bg-[#00ff00]/20"
          rangeClassName="bg-[#00ff00]"
        />
      </div>
      <div className="flex justify-between text-[#00ff00]/60 text-[10px] mt-1">
        <span>{formatTime(seeking ? (dragValue / 100) * duration : currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </TiltCard>
  );
};

export default MusicPlayer;
