
import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  autoplay?: boolean;
  audioRef?: React.RefObject<HTMLAudioElement>;
}

const AudioPlayer = ({ audioUrl, autoplay = false, audioRef: externalAudioRef }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const internalAudioRef = useRef<HTMLAudioElement>(null);
  
  // Use the external ref if provided, otherwise use internal ref
  const audioRef = externalAudioRef || internalAudioRef;

  useEffect(() => {
    if (autoplay && audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error("Failed to autoplay audio:", err);
        });
    }
  }, [autoplay, audioRef]);

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
