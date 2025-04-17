
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
    // Add event listener to handle playback state changes
    const handlePlayStateChange = () => {
      if (audioRef.current) {
        setIsPlaying(!audioRef.current.paused);
      }
    };

    // Set up event listeners
    if (audioRef.current) {
      audioRef.current.addEventListener('play', handlePlayStateChange);
      audioRef.current.addEventListener('pause', handlePlayStateChange);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('play', handlePlayStateChange);
        audioRef.current.removeEventListener('pause', handlePlayStateChange);
      }
    };
  }, [audioRef]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Ensure audio is not muted
        audioRef.current.muted = false;
        audioRef.current.volume = 1;
        
        // Try to play the audio
        audioRef.current.play()
          .catch(err => {
            console.error("Error playing audio:", err);
          });
      }
    }
  };

  return (
    <div className="fixed top-4 left-4">
      <button
        onClick={togglePlay}
        className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-[#00ff00]/20 hover:bg-black/40 transition-all duration-300 cursor-custom"
      >
        {isPlaying ? (
          <Volume2 className="w-6 h-6 text-[#00ff00] cursor-custom" />
        ) : (
          <VolumeX className="w-6 h-6 text-[#00ff00] cursor-custom" />
        )}
      </button>
      <audio ref={audioRef} loop preload="auto" crossOrigin="anonymous">
        <source src={audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
