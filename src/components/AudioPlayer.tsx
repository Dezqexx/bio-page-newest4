
import React, { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
}

const AudioPlayer = ({ audioUrl }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  return (
    <div className="fixed top-4 left-4">
      <button
        onClick={togglePlay}
        className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-[#00ff00]/20 hover:bg-black/40 transition-all duration-300"
      >
        {isPlaying ? (
          <Volume2 className="w-6 h-6 text-[#00ff00]" />
        ) : (
          <VolumeX className="w-6 h-6 text-[#00ff00]" />
        )}
      </button>
      <audio ref={audioRef} loop>
        <source src={audioUrl} type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default AudioPlayer;
