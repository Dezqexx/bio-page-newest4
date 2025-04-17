
import React, { useRef, useState } from 'react';
import useAudioAnalyzer from '@/hooks/useAudioAnalyzer';
import { MapPin, Calendar } from 'lucide-react';
import SocialLinks from '@/components/SocialLinks';
import { cn } from '@/lib/utils';

interface AudioReactiveCardProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  profileImage: string;
  username: string;
  location: string;
  age: number;
}

const AudioReactiveCard: React.FC<AudioReactiveCardProps> = ({
  audioRef,
  profileImage,
  username,
  location,
  age
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { bassLevel } = useAudioAnalyzer({ audioRef });
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
    transition: 'transform 0.1s ease'
  });

  // Handle mouse movement for tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const tiltX = (y - centerY) / 10;
    const tiltY = -(x - centerX) / 10;
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
      transition: 'transform 0.1s ease'
    });
  };
  
  // Reset tilt when mouse leaves
  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
      transition: 'transform 0.5s ease'
    });
  };
  
  // Calculate border glow intensity based on bass level
  const glowIntensity = 3 + bassLevel * 12; // Range from 3px to 15px
  const glowOpacity = 0.5 + bassLevel * 0.5; // Range from 0.5 to 1.0
  
  return (
    <div 
      ref={cardRef}
      className="relative z-10 text-center p-8 rounded-lg bg-black/30 backdrop-blur-sm"
      style={{
        ...tiltStyle,
        boxShadow: `0 0 ${glowIntensity}px ${glowIntensity/2}px rgba(0, 255, 0, ${glowOpacity})`,
        border: `2px solid rgba(0, 255, 0, ${0.5 + bassLevel * 0.5})`,
        transition: 'box-shadow 0.1s ease, border 0.1s ease',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className={cn(
          "w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden",
          "border-2 border-[#00ff00]"
        )}
        style={{
          boxShadow: `0 0 ${glowIntensity}px rgba(0, 255, 0, ${glowOpacity})`,
        }}
      >
        <img
          src={profileImage}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
      
      <h1 className="text-4xl font-bold mb-2 text-[#00ff00] glow">
        {username}
      </h1>
      
      <div className="flex flex-col items-center justify-center gap-2 text-[#00ff00]/80 mb-6">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>Age: {age}</span>
        </div>
      </div>

      <SocialLinks />
    </div>
  );
};

export default AudioReactiveCard;
