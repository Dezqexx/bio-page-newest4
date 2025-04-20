
import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
    
    // If we have more than one track, try to avoid playing the same track twice
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
      // Update audio source
      audioRef.current.src = audioUrls[currentTrackIndex];
      audioRef.current.load();
      
      // Play if autoplay is enabled and component is visible
      if (autoplay && isVisible) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
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

  // Update volume when it changes
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

  const skipToNextTrack = () => {
    setCurrentTrackIndex(getRandomTrack());
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  if (!isVisible || audioUrls.length === 0) return null;

  return (
    <div className="fixed top-4 left-4 flex flex-col items-center gap-2">
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <button
              onClick={togglePlay}
              className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-[#00ff00]/20 hover:bg-black/40 transition-all duration-300"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Volume2 className="w-6 h-6 text-[#00ff00]" />
              ) : (
                <VolumeX className="w-6 h-6 text-[#00ff00]" />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-1 bg-black/80 text-[#00ff00] text-xs text-center rounded select-none">
            {isPlaying ? "mute" : "mute"}
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button
              onClick={skipToNextTrack}
              className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-[#00ff00]/20 hover:bg-black/40 transition-all duration-300"
              title="Next Track"
            >
              <SkipForward className="w-6 h-6 text-[#00ff00]" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-1 bg-black/80 text-[#00ff00] text-xs text-center rounded select-none">
            skip song
          </PopoverContent>
        </Popover>
      </div>

      <div className="w-32 h-12 bg-black/20 backdrop-blur-sm border border-[#00ff00]/20 rounded-full p-2">
        <Slider
          defaultValue={[1]}
          value={[volume]}
          max={1}
          step={0.01}
          orientation="horizontal"
          className="w-full"
          onValueChange={handleVolumeChange}
        />
      </div>

      <audio ref={audioRef}></audio>
    </div>
  );
};

export default AudioPlayer;

