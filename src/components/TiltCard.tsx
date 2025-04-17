
import React, { useRef, useEffect } from 'react';
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
    <div ref={tiltRef} className={className}>
      {children}
    </div>
  );
};

export default TiltCard;
