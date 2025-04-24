
import React from 'react';
import TiltCard from './TiltCard';

interface CircularCardProps {
  cards: {
    id: string;
    content: React.ReactNode;
    title?: string;
  }[];
}

const CircularCardArrangement = ({ cards }: CircularCardProps) => {
  const totalCards = cards.length;
  
  return (
    <div className="relative w-full h-[600px] flex items-center justify-center">
      {/* Central element */}
      <div className="absolute w-24 h-24 bg-[#00ff00]/20 rounded-full border-2 border-[#00ff00]/50 flex items-center justify-center z-10">
        <div className="w-16 h-16 bg-[#00ff00]/30 rounded-full animate-pulse border border-[#00ff00]" />
      </div>
      
      {/* Surrounding cards */}
      {cards.map((card, index) => {
        // Calculate position in the circle
        const angle = (index * (360 / totalCards)) * (Math.PI / 180);
        const radius = 220; // Distance from center
        const top = 300 - Math.sin(angle) * radius;
        const left = 300 + Math.cos(angle) * radius;
        
        return (
          <div
            key={card.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-0 transition-all duration-500 hover:z-20"
            style={{ 
              top: `${top}px`,
              left: `${left}px`,
            }}
          >
            <TiltCard className="p-4 border-2 border-[#00ff00]/50 rounded-lg bg-black/30 backdrop-blur-sm" title={card.title}>
              {card.content}
            </TiltCard>
          </div>
        );
      })}
    </div>
  );
};

export default CircularCardArrangement;
