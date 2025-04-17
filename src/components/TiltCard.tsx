
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
  const [audioIntensity, setAudioIntensity] = useState(0);
  
  useEffect(() => {
    // Set up audio analysis if audio element exists
    const audioElement = document.querySelector('audio');
    if (audioElement) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      
      const audioSource = audioContext.createMediaElementSource(audioElement);
      audioSource.connect(analyser);
      analyser.connect(audioContext.destination);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const updateAudioVisuals = () => {
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate average intensity from frequency data
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const normalizedIntensity = average / 256; // Normalize to 0-1
        
        setAudioIntensity(normalizedIntensity);
        requestAnimationFrame(updateAudioVisuals);
      };
      
      updateAudioVisuals();
    }
    
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
  
  // Calculate the glow intensity based on audio
  const glowIntensity = 4 + (audioIntensity * 12); // Base glow of 3px + up to 12px based on audio
  const glowOpacity = 0.4 + (audioIntensity * 0.6); // Base opacity of 0.3 + up to 0.7 based on audio
  
  const glowStyle = {
    boxShadow: `0 0 ${glowIntensity}px ${glowOpacity * 2}px rgba(0, 255, 0, ${glowOpacity})`,
    transition: 'box-shadow 0.1s ease'
  };
  
  return (
    <div 
      ref={tiltRef} 
      className={className}
      style={glowStyle}
    >
      {children}
    </div>
  );
};

export default TiltCard;
