import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface AudioPlayerProps {
  audioUrls: string[];
  autoplay?: boolean;
  isVisible: boolean;
}

const AudioPlayer = ({ audioUrls, autoplay = false, isVisible }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Get a random track that's different from the current one (if possible)
  const getRandomTrack = () => {
    if (audioUrls.length === 0) return -1;
    if (audioUrls.length === 1) return 0;
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * audioUrls.length);
    } while (newIndex === currentTrackIndex && audioUrls.length > 1);
    return newIndex;
  };

  // Initialize with a random track on component mount
  useEffect(() => {
    if (audioUrls.length > 0 && currentTrackIndex === -1) {
      setCurrentTrackIndex(getRandomTrack());
    }
  }, [audioUrls]);

  // Play logic when track changes or autoplay triggers
  useEffect(() => {
    if (audioRef.current && currentTrackIndex !== -1) {
      audioRef.current.src = audioUrls[currentTrackIndex];
      audioRef.current.load();
      if (autoplay && isVisible) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => {
            console.error("Failed to autoplay audio:", err);
          });
      }
    }
  }, [currentTrackIndex, autoplay, isVisible, audioUrls]);

  // Set up ended event listener to play next track
  useEffect(() => {
    const handleEnded = () => {
      setCurrentTrackIndex(getRandomTrack());
    };
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener('ended', handleEnded);
    }
    return () => {
      if (audioElement) {
        audioElement.removeEventListener('ended', handleEnded);
      }
    };
  }, [currentTrackIndex, audioUrls]);

  // Update volume dom
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const isMuted = volume === 0;

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

  // Mute/unmute functionality (clicking the button toggles between 0 and previous value)
  const handleMute = () => {
    if (isMuted) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  if (!isVisible || audioUrls.length === 0) return null;

  return (
    <div className="fixed top-4 left-4 flex flex-col items-center gap-2">
      {/* Mute Button with custom green tooltip */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleMute}
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
      <div className="h-28 mt-2 bg-black/20 backdrop-blur-sm border border-[#00ff00]/20 rounded-full p-2 flex flex-col items-center justify-center">
        <Slider
          defaultValue={[1]}
          value={[volume]}
          max={1}
          step={0.01}
          orientation="vertical"
          className="h-24"
          onValueChange={handleVolumeChange}
        />
      </div>
      <audio ref={audioRef}></audio>
    </div>
  );
};

export default AudioPlayer;
