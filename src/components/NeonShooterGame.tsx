
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

interface Target {
  id: number;
  x: number;
  y: number;
  size: number;
}

const NeonShooterGame = () => {
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState<Target[]>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Start game function
  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    setTargets([createTarget()]);
  };

  // Create a new target
  const createTarget = (): Target => {
    const gameArea = gameAreaRef.current;
    if (!gameArea) return { id: Date.now(), x: 50, y: 50, size: 30 };

    const maxX = gameArea.clientWidth - 50;
    const maxY = gameArea.clientHeight - 50;
    
    return {
      id: Date.now(),
      x: Math.floor(Math.random() * maxX),
      y: Math.floor(Math.random() * maxY),
      size: Math.floor(Math.random() * 20) + 20 // Random size between 20-40px
    };
  };

  // Handle clicking on a target
  const handleTargetClick = (id: number) => {
    setScore(prev => prev + 1);
    setTargets(prev => {
      const remaining = prev.filter(target => target.id !== id);
      return [...remaining, createTarget()];
    });
  };

  // Handle game timer
  useEffect(() => {
    if (!gameActive) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameActive]);

  return (
    <div className="flex flex-col items-center w-full gap-6 px-4">
      <div className="flex w-full justify-between mb-4">
        <div className="text-[#00ff00] text-2xl font-bold">
          Score: {score}
        </div>
        
        <div className="text-[#00ff00] text-2xl font-bold">
          Time: {timeLeft}s
        </div>
      </div>

      {/* Game instruction text */}
      <div className="text-center mb-4">
        <p className="text-[#00ff00] text-lg">
          Shoot as many balls as you can within 30 seconds! Click to start
        </p>
      </div>
      
      {/* Game area is always visible */}
      <div 
        ref={gameAreaRef}
        className="relative w-full h-[300px] border-2 border-[#00ff00]/50 rounded-lg backdrop-blur-sm bg-black/30 cursor-crosshair mb-4"
      >
        {gameActive ? (
          targets.map(target => (
            <div
              key={target.id}
              style={{
                position: 'absolute',
                left: `${target.x}px`,
                top: `${target.y}px`,
                width: `${target.size}px`,
                height: `${target.size}px`,
                borderRadius: '50%',
                backgroundColor: '#00ff00',
                boxShadow: '0 0 15px 5px rgba(0, 255, 0, 0.5)',
                cursor: 'pointer'
              }}
              onClick={() => handleTargetClick(target.id)}
            />
          ))
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button 
              onClick={startGame}
              className="bg-black/70 border border-[#00ff00] text-[#00ff00] hover:bg-black/90 hover:text-[#00ff00] hover:border-[#00ff00]/80 transition-all"
            >
              Click to Start
            </Button>
          </div>
        )}
      </div>
      
      {!gameActive && timeLeft === 0 && (
        <div className="text-center text-[#00ff00] mb-4">
          <p className="text-xl">Game Over! You scored {score} points.</p>
        </div>
      )}
    </div>
  );
};

export default NeonShooterGame;
