
import { useState } from "react";
import BackgroundVideo from "@/components/BackgroundVideo";
import AudioPlayer from "@/components/AudioPlayer";
import SocialLinks from "@/components/SocialLinks";
import RainEffect from "@/components/RainEffect";
import useSparkleEffect from "@/hooks/useSparkleEffect";
import { MapPin } from "lucide-react";
import EnterScreen from "@/components/EnterScreen";

const Index = () => {
  useSparkleEffect();
  const [entered, setEntered] = useState(false);
  
  return (
    <div className="min-h-screen flex items-center justify-center text-white relative overflow-hidden cursor-custom">
      <RainEffect />
      <BackgroundVideo videoUrl="/your-video.mp4" />
      <AudioPlayer audioUrl="/your-audio.mp3" />
      
      {entered ? (
        <div className="relative z-10 text-center p-8 border-2 border-[#00ff00]/50 rounded-lg bg-black/30 backdrop-blur-sm">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full border-2 border-[#00ff00] overflow-hidden glow">
            <img
              src="/your-avatar.jpg"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          
          <h1 className="text-4xl font-bold mb-2 text-[#00ff00] glow">
            Username
          </h1>
          
          <div className="flex items-center justify-center gap-2 text-[#00ff00]/80 mb-6">
            <MapPin className="w-4 h-4" />
            <span>Location</span>
          </div>

          <SocialLinks />
        </div>
      ) : (
        <EnterScreen onEnter={() => setEntered(true)} />
      )}
    </div>
  );
};

export default Index;
