import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
const songs = [{
  url: "/lovable-uploads/Fukk.mp3",
  name: "Fukk Sleep"
}, {
  url: "/lovable-uploads/MOTION.mp3",
  name: "Motion"
}, {
  url: "/lovable-uploads/Urban.mp3",
  name: "Urban Melody"
}, {
  url: "/lovable-uploads/Falling.mp3",
  name: "Falling Down"
}, {
  url: "/lovable-uploads/ANGER.mp3",
  name: "Anger"
}];
const getRandomSongIndex = () => Math.floor(Math.random() * songs.length);
const Index = () => {
  useSparkleEffect();
  const location = useLocation();
  const [entered, setEntered] = useState(false);

  // Check if user is coming from another page by looking at location state
  useEffect(() => {
    // Skip enter screen if coming from another page
    if (location.state?.fromPage) {
      setEntered(true);
    }
  }, [location]);
  const randomStarted = useRef(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(getRandomSongIndex());
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const savedPositions = useRef<Record<string, number>>({});
  useEffect(() => {
    document.body.classList.add("cursor-custom");
    return () => {
      document.body.classList.remove("cursor-custom");
    };
  }, []);
  useEffect(() => {
    if (!entered) return;
    let audio = audioRef.current;
    if (!audio) {
      audio = new window.Audio();
      audioRef.current = audio;
    }
    const currentUrl = songs[currentTrackIndex].url;
    if (!audio.src || !audio.src.includes(currentUrl)) {
      const wasPlaying = !audio.paused;
      const savedPosition = savedPositions.current[currentUrl] || 0;
      audio.src = currentUrl;
      audio.load();
      if (savedPosition > 0) {
        audio.currentTime = savedPosition;
      }
      if (wasPlaying) {
        audio.play().catch(() => {});
      }
    }
    audio.volume = volume;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      savedPositions.current[currentUrl] = audio.currentTime;
      audio.pause();
    }
    const handleTimeUpdate = () => {
      setCurrentTime(audio!.currentTime);
      setDuration(audio!.duration || 0);
      setProgress(audio!.duration ? audio!.currentTime / audio!.duration * 100 : 0);
      savedPositions.current[currentUrl] = audio!.currentTime;
    };
    const handleDurationChange = () => {
      setDuration(audio!.duration || 0);
    };
    const handleEnded = () => {
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
    setIsPlaying(v => !v);
  }, []);
  const handleSkipBack = useCallback(() => {
    const newIndex = currentTrackIndex === 0 ? songs.length - 1 : currentTrackIndex - 1;
    const url = songs[newIndex].url;
    savedPositions.current[url] = 0;
    setCurrentTrackIndex(newIndex);
    setIsPlaying(true);
  }, [currentTrackIndex]);
  const handleSkipForward = useCallback(() => {
    const newIndex = (currentTrackIndex + 1) % songs.length;
    const url = songs[newIndex].url;
    savedPositions.current[url] = 0;
    setCurrentTrackIndex(newIndex);
    setIsPlaying(true);
  }, [currentTrackIndex]);
  const handleSeek = (seekProgress: number) => {
    if (audioRef.current && duration) {
      const time = seekProgress * duration;
      audioRef.current.currentTime = time;
      const currentUrl = songs[currentTrackIndex].url;
      savedPositions.current[currentUrl] = time;
      setCurrentTime(time);
      setProgress(seekProgress * 100);
    }
  };
  const handleMute = useCallback(() => {
    setVolume(v => v === 0 ? 1 : 0);
  }, []);
  useEffect(() => {
    if (entered) {
      setIsPlaying(true);
    }
  }, [entered]);
  const handleEnter = () => {
    setEntered(true);
  };
  return <div className="min-h-screen flex items-center justify-center text-white relative overflow-hidden">
      <RainEffect />
      <BackgroundVideo videoUrl="/your-video.mp4" />
      {entered && <>
          <AudioPlayer isMuted={volume === 0} volume={volume} onMute={handleMute} onVolumeChange={setVolume} />
          <div className="absolute top-4 right-4 z-30 flex gap-2">
            <Button variant="outline" className="border-[#00ff00] bg-black/20 text-[#00ff00]/20">
              <Link to="/about" state={{
            fromPage: "index"
          }}>About</Link>
            </Button>
            <Button variant="outline" className="border-[#00ff00] bg-black/20 text-[z#00ff0033] text-[#00ff00]/20">
              <Link to="/game" state={{
            fromPage: "index"
          }}>Game</Link>
            </Button>
          </div>
        </>}

      {entered ? <div className="flex flex-col items-center max-w-3xl w-full px-4">
          <TiltCard className="relative z-10 text-center p-8 border-2 border-[#00ff00]/50 rounded-lg bg-black/30 backdrop-blur-sm w-full mb-4">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full border-2 border-[#00ff00] overflow-hidden glow">
              <img src="https://grabify.click/q52w52ry.png" alt="Profile" className="w-full h-full object-cover" />
            </div>

            <h1 className="text-4xl font-bold mb-2 text-[#00ff00] glow">Dez</h1>

            <div className="flex flex-col items-center justify-center gap-2 text-[#00ff00]/80 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Age: 19</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Germany</span>
              </div>
            </div>

            <div className="flex justify-center mb-4">
              <SocialLinks />
            </div>

            <div className="border-t-2 border-[#00ff00] my-6"></div>

            <div>
              <DiscordPresence />
            </div>
          </TiltCard>

          <MusicPlayer song={songs[currentTrackIndex]} isPlaying={isPlaying} onPlayPause={togglePlay} onSkipBack={handleSkipBack} onSkipForward={handleSkipForward} progress={progress} currentTime={currentTime} duration={duration} onSeek={handleSeek} />
        </div> : <EnterScreen onEnter={handleEnter} />}
    </div>;
};
export default Index;