
import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface AudioPlayerProps {
  isMuted: boolean;
  volume: number;
  onMute: () => void;
  onVolumeChange: (vol: number) => void;
}

// This component now only controls volume & mute! No audio tag, all external.
const AudioPlayer = ({ isMuted, volume, onMute, onVolumeChange }: AudioPlayerProps) => {
  const handleVolumeChange = (value: number[]) => {
    onVolumeChange(value[0]);
  };

  return (
    <div className="fixed top-4 left-4 flex flex-col items-center gap-1 z-30">
      {/* Mute Button with custom green tooltip */}
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <button
            onClick={onMute}
            className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-[#00ff00]/20 hover:bg-black/40 transition-all duration-300"
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6 text-[#00ff00]" />
            ) : (
              <Volume2 className="w-6 h-6 text-[#00ff00]" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-black/80 border-[#00ff00]/60">
          <span className="text-[#00ff00] font-semibold">
            {isMuted ? "unmute" : "mute"}
          </span>
        </TooltipContent>
      </Tooltip>
      {/* Vertical Volume Slider below the mute button */}
      <div className="h-24 mt-1 bg-black/20 backdrop-blur-sm border border-[#00ff00]/20 rounded-full p-2 flex flex-col items-center justify-center">
        <Slider
          defaultValue={[1]}
          value={[volume]}
          max={1}
          step={0.01}
          orientation="vertical"
          className="h-20 w-3"
          onValueChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
