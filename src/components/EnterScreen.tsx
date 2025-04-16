
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
      <div className="text-xl text-[#00ff00]/80">Click to enter</div>
    </div>
  );
};

export default EnterScreen;
