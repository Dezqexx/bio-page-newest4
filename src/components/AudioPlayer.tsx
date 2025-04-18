import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Slider } from "@/components/ui/slider";

interface AudioPlayerProps {
  audioUrl: string;
  autoplay?: boolean;
  isVisible: boolean;
}

const AudioPlayer = ({ audioUrl, autoplay = false, isVisible }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (autoplay && audioRef.current && isVisible) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error("Failed to autoplay audio:", err);
        });
    }
  }, [autoplay, isVisible]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

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

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-4 flex flex-col items-center gap-2">
      <button
        onClick={togglePlay}
        className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-[#9b87f5]/20 hover:bg-black/40 transition-all duration-300"
      >
        {isPlaying ? (
          <Volume2 className="w-6 h-6 text-[#9b87f5]" />
        ) : (
          <VolumeX className="w-6 h-6 text-[#9b87f5]" />
        )}
      </button>

      <div className="h-24 bg-black/20 backdrop-blur-sm border border-[#9b87f5]/20 rounded-full p-2">
        <Slider
          defaultValue={[1]}
          value={[volume]}
          max={1}
          step={0.01}
          orientation="vertical"
          className="h-20"
          onValueChange={handleVolumeChange}
        />
      </div>

      <audio ref={audioRef} loop>
        <source src={audioUrl} type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default AudioPlayer;
