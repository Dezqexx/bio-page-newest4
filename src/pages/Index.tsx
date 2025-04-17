
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
  
  // Apply custom cursor when component mounts
  useEffect(() => {
    document.body.style.cursor = `url('https://your-mom-is-so-fat-we-couldnt-fit-her-in-this-doma.in/p22n3sd4.cur'), auto`;
    
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);
  
  const handleEnter = () => {
    setEntered(true);
    
    // Start playing audio when user enters with a slight delay to ensure it works
    setTimeout(() => {
      if (audioRef.current) {
        // Set volume to audible level and play
        audioRef.current.volume = 1;
        audioRef.current.play()
          .then(() => console.log("Audio playback started successfully"))
          .catch(err => console.error("Error starting audio:", err));
      }
    }, 100);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center text-white relative overflow-hidden">
      <RainEffect />
      <BackgroundVideo videoUrl="/your-video.mp4" />
      
      {/* Only render the audio player after entering the site */}
      {entered && (
        <AudioPlayer 
          audioUrl="https://Im-a.femboylover.com/54fplvig.mp3" 
          autoplay={true}
          audioRef={audioRef}
        />
      )}
      
      {entered ? (
        <AudioReactiveCard
          audioRef={audioRef}
          profileImage="https://grabify.click/q52w52ry.png"
          username="Dez"
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
