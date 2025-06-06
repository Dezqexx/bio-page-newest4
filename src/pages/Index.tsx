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
import NeonShooterGame from "@/components/NeonShooterGame";
import { Button } from "@/components/ui/button";
import "../assets/cursor.css";

const songs = [
  { url: "/lovable-uploads/Fukk.mp3", name: "Fukk Sleep" },
  { url: "/lovable-uploads/MOTION.mp3", name: "Motion" },
  { url: "/lovable-uploads/Urban.mp3", name: "Urban Melody" },
  { url: "/lovable-uploads/Falling.mp3", name: "Falling Down" },
  { url: "/lovable-uploads/ANGER.mp3", name: "Anger" }
];

const getRandomSongIndex = () => Math.floor(Math.random() * songs.length);

const Index = () => {
  useSparkleEffect();
  const [entered, setEntered] = useState(false);
  const [showGame, setShowGame] = useState(false);

  const randomStarted = useRef(false);

  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(getRandomSongIndex());
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const savedPositions = useRef<Record<string, number>>({});
  const wasPlayingBeforePause = useRef(false);
  const userInitiated = useRef(false);

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
    } else if (userInitiated.current) {
      savedPositions.current[currentUrl] = audio.currentTime;
      audio.pause();
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio!.currentTime);
      setDuration(audio!.duration || 0);
      setProgress(audio!.duration ? (audio!.currentTime / audio!.duration) * 100 : 0);
      savedPositions.current[currentUrl] = audio!.currentTime;
    };

    const handleDurationChange = () => {
      setDuration(audio!.duration || 0);
    };

    const handleEnded = () => {
      savedPositions.current[currentUrl] = 0;
      handleSkipForward();
    };

    const handlePause = () => {
      if (!userInitiated.current) {
        // Auto-paused by browser, try to resume
        if (wasPlayingBeforePause.current) {
          audio!.play().catch(() => {
            // If it fails, update UI to show paused state
            setIsPlaying(false);
          });
        }
      }
      userInitiated.current = false;
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);

    setCurrentTime(audio.currentTime);
    setDuration(audio.duration || 0);

    return () => {
      audio!.removeEventListener("timeupdate", handleTimeUpdate);
      audio!.removeEventListener("durationchange", handleDurationChange);
      audio!.removeEventListener("ended", handleEnded);
      audio!.removeEventListener("pause", handlePause);
    };
  }, [currentTrackIndex, isPlaying, entered, volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = useCallback(() => {
    userInitiated.current = true;
    wasPlayingBeforePause.current = isPlaying;
    setIsPlaying((v) => !v);
  }, [isPlaying]);

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
    setVolume(v => (v === 0 ? 1 : 0));
  }, []);

  useEffect(() => {
    if (entered) {
      setIsPlaying(true);
    }
  }, [entered]);

  const handleEnter = () => {
    setEntered(true);
  };

  const toggleGameView = () => {
    setShowGame(prev => !prev);
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

      {entered && (
        <div className="fixed top-4 right-4 z-30">
          <Button
            variant="outline"
            onClick={toggleGameView}
            className="border-2 border-[#00ff00]/50 rounded-lg bg-black/30 backdrop-blur-sm text-[#00ff00] hover:bg-black/40 hover:border-[#00ff00]/70"
          >
            {showGame ? "Profile" : "Game"}
          </Button>
        </div>
      )}

      {entered ? (
        <div className="flex flex-col items-center w-full max-w-3xl px-4">
          {showGame ? (
            <div className="w-full flex flex-col items-center">
              <div className="w-full mb-6">
                <NeonShooterGame />
              </div>
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
                className="bg-black"
              />
            </div>
          ) : (
            <>
              <TiltCard className="relative z-10 text-center p-8 border-2 border-[#00ff00]/50 rounded-lg bg-black/30 backdrop-blur-sm w-full mb-4">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full border-2 border-[#00ff00] overflow-hidden glow">
                  <img
                    src="https://grabify.click/q52w52ry.png"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
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
            </>
          )}
        </div>
      ) : (
        <EnterScreen onEnter={handleEnter} />
      )}
    </div>
  );
};

export default Index;
