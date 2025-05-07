import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BackgroundVideo from "@/components/BackgroundVideo";
import AudioPlayer from "@/components/AudioPlayer";
import RainEffect from "@/components/RainEffect";
import useSparkleEffect from "@/hooks/useSparkleEffect";
import TiltCard from "@/components/TiltCard";
import MusicPlayer from "@/components/MusicPlayer";
import Navigation from "@/components/Navigation";
import { useAudioContext } from "@/contexts/AudioContext";
import { Button } from "@/components/ui/button";

const About = () => {
  useSparkleEffect();
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

  return (
    <div className="min-h-screen flex items-center justify-center text-white relative overflow-hidden">
      <RainEffect />
      <BackgroundVideo videoUrl="/your-video.mp4" />
      <AudioPlayer
        isMuted={volume === 0}
        volume={volume}
        onMute={handleMute}
        onVolumeChange={setVolume}
      />
      <Navigation />
      
      <div className="flex flex-col items-center max-w-3xl w-full px-4">
        <TiltCard className="relative z-10 text-center p-8 border-2 border-[#00ff00]/50 rounded-lg bg-black/30 backdrop-blur-sm w-full mb-4">
          <h1 className="text-4xl font-bold mb-6 text-[#00ff00] glow">About Me</h1>
          
          <div className="space-y-4 text-[#00ff00]/90">
            <p>
              Hey there! I'm Dez, a 19-year-old developer from Germany with a passion for creating unique digital experiences.
            </p>
            <p>
              When I'm not coding, you can find me producing music, designing graphics, or exploring the latest tech trends.
              I believe in creating immersive digital spaces that blend aesthetics with functionality.
            </p>
            <p>
              This site reflects my love for the cyberpunk aesthetic and creative coding. Feel free to explore
              and connect with me through my social links on the home page.
            </p>
          </div>
          
          <div className="mt-6">
            <Link to="/">
              <Button className="border border-[#00ff00]/30 bg-black/40 text-[#00ff00] hover:bg-black/60 hover:border-[#00ff00]/50 backdrop-blur-sm">
                Back to Home
              </Button>
            </Link>
          </div>
        </TiltCard>

        {currentTrack && (
          <div className="w-full flex justify-center">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default About;
