
import React from 'react';

interface EnterScreenProps {
  onEnter: () => void;
}

const EnterScreen = ({ onEnter }: EnterScreenProps) => {
  return (
    <div 
      className="relative z-10 flex flex-col items-center justify-center text-center p-4 cursor-pointer"
      onClick={onEnter}
    >
      <h1 className="text-5xl font-bold mb-2 text-[#00ff00] glow">Welcome</h1>
      <div className="text-xl text-[#00ff00]/80 cursor-inherit">Click to enter</div>
      <div className="w-12 h-12 border-2 border-[#00ff00]/50 rounded-full flex items-center justify-center animate-pulse mt-4">
        <div className="w-8 h-8 border-t-2 border-[#00ff00] rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default EnterScreen;
