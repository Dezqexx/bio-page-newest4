
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
    
    // Start audio playback after a small delay to ensure DOM is ready
    setTimeout(() => {
      if (audioRef.current) {
        // Create audio context first to handle autoplay
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Set appropriate properties for playback
        audioRef.current.volume = 1;
        audioRef.current.muted = false;
        audioRef.current.crossOrigin = "anonymous";
        
        // Play audio with proper error handling
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => console.log("Audio playback started successfully"))
            .catch(err => {
              console.error("Error starting audio:", err);
              
              // Add a click listener to the document for user interaction
              document.addEventListener('click', function handleClick() {
                if (audioRef.current) {
                  audioRef.current.play()
                    .then(() => console.log("Audio started on user interaction"))
                    .catch(e => console.error("Still failed to play audio:", e));
                }
                document.removeEventListener('click', handleClick);
              }, { once: true });
            });
        }
      }
    }, 500);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center text-white relative overflow-hidden cursor-custom">
      <RainEffect />
      <BackgroundVideo videoUrl="/your-video.mp4" />
      
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
