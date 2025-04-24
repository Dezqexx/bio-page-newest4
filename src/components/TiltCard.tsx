
import React, { useRef, useEffect, useState } from 'react';
import VanillaTilt from 'vanilla-tilt';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

// Add a type declaration for the HTMLDivElement with vanillaTilt property
interface TiltElement extends HTMLDivElement {
  vanillaTilt?: any;
}

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  title: string;
}

const TiltCard = ({ children, className = "", title }: TiltCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
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
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full p-4 flex justify-between items-center text-[#00ff00] hover:text-[#00ff00]/80 transition-colors">
          <h2 className="text-xl font-bold">{title}</h2>
          <ChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 pt-0">
          {children}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default TiltCard;
