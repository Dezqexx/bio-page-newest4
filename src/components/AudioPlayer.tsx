
import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Volume1, Volume, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface AudioPlayerProps {
  audioUrl: string;
  autoplay?: boolean;
  isVisible: boolean;
}

const AudioPlayer = ({ audioUrl, autoplay = false, isVisible }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.75); // Default volume
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

  // Select the appropriate volume icon based on the current volume level
  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="w-6 h-6 text-[#00ff00]" />;
    if (volume < 0.33) return <Volume className="w-6 h-6 text-[#00ff00]" />;
    if (volume < 0.66) return <Volume1 className="w-6 h-6 text-[#00ff00]" />;
    return <Volume2 className="w-6 h-6 text-[#00ff00]" />;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-4 volume-control-wrapper">
      <button
        onClick={togglePlay}
        className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-[#00ff00]/20 hover:bg-black/40 transition-all duration-300"
      >
        {isPlaying ? (
          getVolumeIcon()
        ) : (
          <VolumeX className="w-6 h-6 text-[#00ff00]" />
        )}
      </button>
      
      <div className="volume-slider-container">
        <Slider 
          defaultValue={[volume]} 
          max={1} 
          step={0.01} 
          value={[volume]} 
          onValueChange={handleVolumeChange}
          className="w-full"
        />
      </div>
      
      <audio ref={audioRef} loop>
        <source src={audioUrl} type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default AudioPlayer;
