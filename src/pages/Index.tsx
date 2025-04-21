
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
  { url: "https://grabify.click/pd8d2gd4.mp3", name: "Fukk Sleep" },
  { url: "https://we-love.eboy.group/6vpxjt6v.mp3", name: "Motion" },
  { url: "https://we-love.eboy.group/ng47ic1q.mp3", name: "Urban Melody" },
  { url: "https://we-love.egirl.group/npp4bil2.mp3", name: "Falling Down" },
  { url: "https://Im-a.femboylover.com/54fplvig.mp3", name: "Anger" }
];

const Index = () => {
  useSparkleEffect();
  const [entered, setEntered] = useState(false);

  // Use a ref to prevent rerolling the song on every render after entering
  const randomStarted = useRef(false);

  // Track index state
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    if (!audio.src || !audio.src.includes(songs[currentTrackIndex].url)) {
      audio.src = songs[currentTrackIndex].url;
      audio.load(); // Reload with new source
    }
    audio.volume = volume;

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio!.currentTime);
      setDuration(audio!.duration || 0);
      setProgress(audio!.duration ? (audio!.currentTime / audio!.duration) * 100 : 0);
    };

    const handleDurationChange = () => {
      setDuration(audio!.duration || 0);
    };

    const handleEnded = () => {
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
  }, [currentTrackIndex, isPlaying, entered]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = useCallback(() => {
    setIsPlaying((v) => !v);
  }, []);

  const handleSkipBack = useCallback(() => {
    setCurrentTrackIndex(idx => (idx === 0 ? songs.length - 1 : idx - 1));
    setIsPlaying(true);
  }, []);

  const handleSkipForward = useCallback(() => {
    setCurrentTrackIndex(idx => (idx + 1) % songs.length);
    setIsPlaying(true);
  }, []);

  const handleSeek = (seekProgress: number) => {
    if (audioRef.current && duration) {
      const time = seekProgress * duration;
      audioRef.current.currentTime = time;
      setCurrentTime(time);
      setProgress(seekProgress * 100);
    }
  };

  const handleMute = useCallback(() => {
    setVolume(v => (v === 0 ? 1 : 0));
  }, []);

  // Only start playing when entering the site; pick a random song only once
  useEffect(() => {
    if (entered) {
      // Don't pick again on re-entry
      if (!randomStarted.current) {
        const rand = Math.floor(Math.random() * songs.length);
        setCurrentTrackIndex(rand);
        randomStarted.current = true;
      }
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
        <div className="flex flex-col items-center">
          <TiltCard className="relative z-10 text-center p-8 border-2 border-[#00ff00]/50 rounded-lg bg-black/30 backdrop-blur-sm max-w-[320px] w-full">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full border-2 border-[#00ff00] overflow-hidden glow">
              <img
                src="https://grabify.click/q52w52ry.png"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-4xl font-bold mb-2 text-[#00ff00] glow">Dez</h1>

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
          </TiltCard>

          <DiscordPresence />

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
