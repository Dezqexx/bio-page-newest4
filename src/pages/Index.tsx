import { useState, useEffect, useRef, useCallback } from "react";
import BackgroundVideo from "@/components/BackgroundVideo";
import AudioPlayer from "@/components/AudioPlayer";
import SocialLinks from "@/components/SocialLinks";
import RainEffect from "@/components/RainEffect";
import useSparkleEffect from "@/hooks/useSparkleEffect";
import { MapPin, Calendar } from "lucide-react";
import EnterScreen from "@/components/EnterScreen";
import TiltCard from "@/components/TiltCard";
import DiscordPresence from "@/components/DiscordPresence";
import MusicPlayer from "@/components/MusicPlayer";
import "../assets/cursor.css";

const songs = [
  { url: "/lovable-uploads/Fukk.mp3", name: "Fukk Sleep" },
  { url: "/lovable-uploads/MOTION.mp3", name: "Motion" },
  { url: "/lovable-uploads/Urban.mp3", name: "Urban Melody" },
  { url: "/lovable-uploads/Falling.mp3", name: "Falling Down" },
  { url: "/lovable-uploads/ANGER.mp3", name: "Anger" }
];

// Generate a random index at module scope
const getRandomSongIndex = () => Math.floor(Math.random() * songs.length);

const Index = () => {
  useSparkleEffect();
  const [entered, setEntered] = useState(false);

  // Use a ref to prevent rerolling the song on every render after entering
  const randomStarted = useRef(false);

  // Initialize track index with a random value
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(getRandomSongIndex());
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const savedPositions = useRef<Record<string, number>>({});

  // Apply cursor to entire document
  useEffect(() => {
    document.body.classList.add("cursor-custom");
    return () => {
      document.body.classList.remove("cursor-custom");
    };
  }, []);

  // Audio attach and events logic
  useEffect(() => {
    if (!entered) return;
    let audio = audioRef.current;
    if (!audio) {
      audio = new window.Audio();
      audioRef.current = audio;
    }
    
    const currentUrl = songs[currentTrackIndex].url;
    
    // Only update the src if it's different or not set
    if (!audio.src || !audio.src.includes(currentUrl)) {
      const wasPlaying = !audio.paused;
      const savedPosition = savedPositions.current[currentUrl] || 0;
      
      audio.src = currentUrl;
      audio.load(); // Reload with new source
      
      // Restore position if available
      if (savedPosition > 0) {
        audio.currentTime = savedPosition;
      }
      
      // If switching tracks while playing, continue playing the new track
      if (wasPlaying) {
        audio.play().catch(() => {});
      }
    }
    
    audio.volume = volume;

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      // Save position when pausing
      savedPositions.current[currentUrl] = audio.currentTime;
      audio.pause();
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio!.currentTime);
      setDuration(audio!.duration || 0);
      setProgress(audio!.duration ? (audio!.currentTime / audio!.duration) * 100 : 0);
      // Continuously update saved position
      savedPositions.current[currentUrl] = audio!.currentTime;
    };

    const handleDurationChange = () => {
      setDuration(audio!.duration || 0);
    };

    const handleEnded = () => {
      // Clear saved position when track ends
      savedPositions.current[currentUrl] = 0;
      handleSkipForward();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);

    setCurrentTime(audio.currentTime);
    setDuration(audio.duration || 0);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTrackIndex, isPlaying, entered, volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = useCallback(() => {
    setIsPlaying((v) => !v);
  }, []);

  const handleSkipBack = useCallback(() => {
    // Get the new track index
    const newIndex = currentTrackIndex === 0 ? songs.length - 1 : currentTrackIndex - 1;
    
    // Reset the saved position for the song we're going back to
    const url = songs[newIndex].url;
    savedPositions.current[url] = 0;
    
    // Update the track index
    setCurrentTrackIndex(newIndex);
    setIsPlaying(true);
  }, [currentTrackIndex]);

  const handleSkipForward = useCallback(() => {
    // Get the new track index
    const newIndex = (currentTrackIndex + 1) % songs.length;
    
    // Reset the saved position for the song we're skipping to
    const url = songs[newIndex].url;
    savedPositions.current[url] = 0;
    
    // Update the track index
    setCurrentTrackIndex(newIndex);
    setIsPlaying(true);
  }, [currentTrackIndex]);

  const handleSeek = (seekProgress: number) => {
    if (audioRef.current && duration) {
      const time = seekProgress * duration;
      audioRef.current.currentTime = time;
      
      // Also update saved position
      const currentUrl = songs[currentTrackIndex].url;
      savedPositions.current[currentUrl] = time;
      
      setCurrentTime(time);
      setProgress(seekProgress * 100);
    }
  };

  const handleMute = useCallback(() => {
    setVolume(v => (v === 0 ? 1 : 0));
  }, []);

  // Only start playing when entering the site
  useEffect(() => {
    if (entered) {
      setIsPlaying(true);
    }
  }, [entered]);

  // Handle EnterScreen click
  const handleEnter = () => {
    setEntered(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white relative overflow-hidden">
      <RainEffect />
      <BackgroundVideo videoUrl="/your-video.mp4" />
      {entered && (
        <AudioPlayer
          isMuted={volume === 0}
          volume={volume}
          onMute={handleMute}
          onVolumeChange={setVolume}
        />
      )}

      {entered ? (
        <div className="flex flex-col items-center max-w-3xl w-full px-4">
          <TiltCard className="relative z-10 text-center p-8 border-2 border-[#00ff00]/50 rounded-lg bg-black/30 backdrop-blur-sm w-full mb-6">
            {/* Profile Section */}
            <div className="w-32 h-32 mx-auto mb-6 rounded-full border-2 border-[#00ff00] overflow-hidden glow">
              <img
                src="https://grabify.click/q52w52ry.png"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-4xl font-bold mb-2 text-[#00ff00] glow">Dez</h1>
            <p className="text-[#00ff00]/80 mb-6 text-lg italic">"Without music, life would be a mistake." — Friedrich Nietzsche</p>

            <div className="flex flex-col items-center justify-center gap-2 text-[#00ff00]/80 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Age: 19</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Germany</span>
              </div>
            </div>

            <SocialLinks />

            {/* Discord Presence integrated into profile card */}
            <div className="mt-6 border-t border-[#00ff00]/20 pt-6">
              <DiscordPresence />
            </div>
          </TiltCard>

          {/* Music Player below profile card */}
          <MusicPlayer
            song={songs[currentTrackIndex]}
            isPlaying={isPlaying}
            onPlayPause={togglePlay}
            onSkipBack={handleSkipBack}
            onSkipForward={handleSkipForward}
            progress={progress}
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />
        </div>
      ) : (
        <EnterScreen onEnter={handleEnter} />
      )}
    </div>
  );
};

export default Index;
