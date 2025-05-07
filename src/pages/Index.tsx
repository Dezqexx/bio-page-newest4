
import { useState, useEffect, useRef } from "react";
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
import Navigation from "@/components/Navigation";
import { useAudioContext } from "@/contexts/AudioContext";
import "../assets/cursor.css";

const Index = () => {
  useSparkleEffect();
  const [entered, setEntered] = useState(false);
  
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    handleSkipBack, 
    handleSkipForward, 
    progress,
    currentTime,
    duration,
    handleSeek,
    volume,
    handleMute,
    setVolume
  } = useAudioContext();

  useEffect(() => {
    document.body.classList.add("cursor-custom");
    return () => {
      document.body.classList.remove("cursor-custom");
    };
  }, []);

  useEffect(() => {
    if (entered && !isPlaying) {
      togglePlay();
    }
  }, [entered, isPlaying, togglePlay]);

  const handleEnter = () => {
    setEntered(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white relative overflow-hidden">
      <RainEffect />
      <BackgroundVideo videoUrl="/your-video.mp4" />
      {entered && (
        <>
          <AudioPlayer
            isMuted={volume === 0}
            volume={volume}
            onMute={handleMute}
            onVolumeChange={setVolume}
          />
          <Navigation />
        </>
      )}

      {entered ? (
        <div className="flex flex-col items-center max-w-3xl w-full px-4">
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

          {currentTrack && (
            <MusicPlayer
              song={currentTrack}
              isPlaying={isPlaying}
              onPlayPause={togglePlay}
              onSkipBack={handleSkipBack}
              onSkipForward={handleSkipForward}
              progress={progress}
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
            />
          )}
        </div>
      ) : (
        <EnterScreen onEnter={handleEnter} />
      )}
    </div>
  );
};

export default Index;
