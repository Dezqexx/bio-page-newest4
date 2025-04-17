
import React, { useRef, useEffect, useState } from 'react';
import VanillaTilt from 'vanilla-tilt';

// Add a type declaration for the HTMLDivElement with vanillaTilt property
interface TiltElement extends HTMLDivElement {
  vanillaTilt?: any;
}

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

const TiltCard = ({ children, className = "" }: TiltCardProps) => {
  const tiltRef = useRef<TiltElement>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  
  // Audio analyzer setup
  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let dataArray: Uint8Array | null = null;
    let animationFrameId: number | null = null;
    
    const setupAudioAnalyzer = async () => {
      try {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        
        // Only set up audio analyzer if audio is playing
        const audioElements = document.querySelectorAll('audio');
        if (audioElements.length > 0) {
          const audioElement = audioElements[0];
          
          if (audioElement.paused) {
            // If audio is paused, set up a listener for when it starts
            const onPlay = () => {
              const source = audioContext!.createMediaElementSource(audioElement);
              source.connect(analyser!);
              analyser!.connect(audioContext!.destination);
              
              const bufferLength = analyser!.frequencyBinCount;
              dataArray = new Uint8Array(bufferLength);
              
              startAnalyzing();
              audioElement.removeEventListener('play', onPlay);
            };
            
            audioElement.addEventListener('play', onPlay);
          } else {
            // Audio is already playing
            const source = audioContext.createMediaElementSource(audioElement);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            
            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
            
            startAnalyzing();
          }
        }
      } catch (error) {
        console.error("Error setting up audio analyzer:", error);
      }
    };
    
    const startAnalyzing = () => {
      const analyzeAudio = () => {
        if (!analyser || !dataArray) return;
        
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate average volume level
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        
        // Normalize to 0-1 range and update state
        setAudioLevel(avg / 255);
        
        animationFrameId = requestAnimationFrame(analyzeAudio);
      };
      
      analyzeAudio();
    };
    
    setupAudioAnalyzer();
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);
  
  useEffect(() => {
    if (tiltRef.current) {
      VanillaTilt.init(tiltRef.current, {
        max: 10,
        speed: 300,
        glare: true,
        'max-glare': 0.2,
        gyroscope: false
      });
    }
    
    return () => {
      if (tiltRef.current && tiltRef.current.vanillaTilt) {
        tiltRef.current.vanillaTilt.destroy();
      }
    };
  }, []);
  
  // Calculate border glow intensity based on audio level
  const borderStyle = {
    boxShadow: `0 0 ${10 + audioLevel * 20}px rgba(0, 255, 0, ${0.4 + audioLevel * 0.6}), 
                0 0 ${20 + audioLevel * 30}px rgba(0, 255, 0, ${0.2 + audioLevel * 0.3}), 
                inset 0 0 ${5 + audioLevel * 10}px rgba(0, 255, 0, ${0.1 + audioLevel * 0.2})`,
    transition: 'box-shadow 0.1s ease-out'
  };
  
  return (
    <div 
      ref={tiltRef} 
      className={`${className} border-2 border-[#00ff00]/80`}
      style={borderStyle}
    >
      {children}
    </div>
  );
};

export default TiltCard;
