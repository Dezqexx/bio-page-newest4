
import { useState } from "react";
import BackgroundVideo from "@/components/BackgroundVideo";
import AudioPlayer from "@/components/AudioPlayer";
import RainEffect from "@/components/RainEffect";
import useSparkleEffect from "@/hooks/useSparkleEffect";
import ProfileCard from "@/components/ProfileCard";
import BioPage from "@/components/BioPage";
import DiscordPresence from "@/components/DiscordPresence";

const Index = () => {
  useSparkleEffect();
  const [showBio, setShowBio] = useState(false);
  
  return (
    <div className="min-h-screen flex items-center justify-center text-white relative overflow-hidden cursor-custom">
      <RainEffect />
      <BackgroundVideo videoUrl="/your-video.mp4" />
      <AudioPlayer audioUrl="/your-audio.mp3" />
      
      <div className="relative z-10 text-center w-full max-w-3xl px-4">
        {/* Main profile card */}
        <ProfileCard 
          username="Dez"
          location="Germany"
          quote="\"Without music, life would be a mistake\" — Friedrich Nietzsche"
          onBioClick={() => setShowBio(true)}
        />
        
        {/* Discord presence card - shown below main card */}
        <div className="mt-4 max-w-sm mx-auto">
          <DiscordPresence 
            username="dezqex"
            status="online"
            customStatus="Playing CS2"
            onClick={() => setShowBio(true)}
          />
        </div>
      </div>
      
      {/* Bio page - shown when clicked */}
      {showBio && <BioPage onClose={() => setShowBio(false)} username="Dez" />}
    </div>
  );
};

export default Index;
