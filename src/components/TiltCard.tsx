
import React, { useRef, useEffect } from 'react';
import VanillaTilt from 'vanilla-tilt';

// Add a type declaration for the HTMLDivElement with vanillaTilt property
interface TiltElement extends HTMLDivElement {
  vanillaTilt?: any;
}

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string; // Add title prop to fix TS errors
}

const TiltCard = ({ children, className = "", title }: TiltCardProps) => {
  const tiltRef = useRef<TiltElement>(null);
  
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
  
  return (
    <div 
      ref={tiltRef} 
      className={`${className} tilt-card cursor-default max-w-[420px] w-full`}
      style={{ boxShadow: '0 0 15px 2px rgba(0, 255, 0, 0.3)' }}
    >
      {title && <h3 className="text-[#00ff00] font-bold mb-2">{title}</h3>}
      {children}
    </div>
  );
};

export default TiltCard;
