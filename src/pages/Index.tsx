import { useState, useEffect } from "react";
import BackgroundVideo from "@/components/BackgroundVideo";
import AudioPlayer from "@/components/AudioPlayer";
import SocialLinks from "@/components/SocialLinks";
import RainEffect from "@/components/RainEffect";
import useSparkleEffect from "@/hooks/useSparkleEffect";
import { MapPin, Calendar } from "lucide-react";
import EnterScreen from "@/components/EnterScreen";
import TiltCard from "@/components/TiltCard";
import DiscordPresence from "@/components/DiscordPresence";
import "../assets/cursor.css";

const Index = () => {
  useSparkleEffect();
  const [entered, setEntered] = useState(false);
  const [flickerIndex, setFlickerIndex] = useState<number | null>(null);
  
  useEffect(() => {
    document.body.classList.add("cursor-custom");
    
    const flickerInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * 3); // "Dez" has 3 letters
      setFlickerIndex(randomIndex);
      const flickerDuration = Math.random() * 500 + 100; // Randomize flicker duration between 100-600ms
      setTimeout(() => setFlickerIndex(null), flickerDuration);
    }, Math.random() * 2000 + 1000); // Randomize interval between 1-3 seconds
    
    return () => {
      document.body.classList.remove("cursor-custom");
      clearInterval(flickerInterval);
    };
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center text-white relative overflow-hidden">
      <RainEffect />
      <BackgroundVideo videoUrl="/your-video.mp4" />
      <AudioPlayer 
        audioUrl="https://Im-a.femboylover.com/54fplvig.mp3" 
        autoplay={entered} 
        isVisible={entered}
      />
      
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
            
            <h1 className="text-4xl font-bold mb-2 text-[#00ff00] neon-sign">
              {"Dez".split('').map((letter, index) => (
                <span 
                  key={index} 
                  className={`neon-letter ${index === flickerIndex ? 'flicker' : ''}`}
                >
                  {letter}
                </span>
              ))}
            </h1>
            
            <div className="flex flex-col items-center justify-center gap-2 text-[#00ff00]/80 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Germany</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Age: 19</span>
              </div>
            </div>

            <SocialLinks />
          </TiltCard>
          
          <DiscordPresence />
        </div>
      ) : (
        <EnterScreen onEnter={() => setEntered(true)} />
      )}
    </div>
  );
};

export default Index;
