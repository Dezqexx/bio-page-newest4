
import { useState, useRef, useEffect } from "react";
import BackgroundVideo from "@/components/BackgroundVideo";
import AudioPlayer from "@/components/AudioPlayer";
import RainEffect from "@/components/RainEffect";
import useSparkleEffect from "@/hooks/useSparkleEffect";
import EnterScreen from "@/components/EnterScreen";
import AudioReactiveCard from "@/components/AudioReactiveCard";

const Index = () => {
  useSparkleEffect();
  const [entered, setEntered] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const handleEnter = () => {
    setEntered(true);
    
    // Start playing audio when user enters
    if (audioRef.current) {
      audioRef.current.play()
        .catch(err => console.error("Error starting audio:", err));
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center text-white relative overflow-hidden">
      <RainEffect />
      <BackgroundVideo videoUrl="/your-video.mp4" />
      <AudioPlayer 
        audioUrl="https://Im-a.femboylover.com/54fplvig.mp3" 
        autoplay={entered}
        audioRef={audioRef}
      />
      
      {entered ? (
        <AudioReactiveCard
          audioRef={audioRef}
          profileImage="https://grabify.click/q52w52ry.png"
          username="Username"
          location="Germany"
          age={19}
        />
      ) : (
        <EnterScreen onEnter={handleEnter} />
      )}
    </div>
  );
};

export default Index;
