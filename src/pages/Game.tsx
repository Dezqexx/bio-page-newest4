
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import TiltCard from "@/components/TiltCard";
import RainEffect from "@/components/RainEffect";

const Game = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    document.body.classList.add("cursor-custom");
    return () => {
      document.body.classList.remove("cursor-custom");
    };
  }, []);

  useEffect(() => {
    if (!gameActive) return;
    
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setGameActive(false);
    }
  }, [timeLeft, gameActive]);

  const moveTarget = useCallback(() => {
    if (!gameActive) return;
    
    const x = Math.floor(Math.random() * 80) + 10; // 10% to 90% of container width
    const y = Math.floor(Math.random() * 80) + 10; // 10% to 90% of container height
    setTargetPosition({ x, y });
    setScore(score + 1);
  }, [gameActive, score]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    
    // Initial target position
    const x = Math.floor(Math.random() * 80) + 10;
    const y = Math.floor(Math.random() * 80) + 10;
    setTargetPosition({ x, y });
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white relative overflow-hidden bg-black">
      <RainEffect />
      <div className="absolute top-4 left-4 z-30">
        <Button variant="outline" className="text-white border-[#00ff00] hover:bg-[#00ff00]/20">
          <Link to="/" state={{ fromPage: "game" }}>Home</Link>
        </Button>
      </div>
      
      <TiltCard className="relative z-10 text-center p-8 border-2 border-[#00ff00]/50 rounded-lg bg-black/30 backdrop-blur-sm w-full max-w-2xl mb-4">
        <h1 className="text-4xl font-bold mb-6 text-[#00ff00] glow">Target Click Game</h1>
        
        <div className="mb-4 flex justify-between">
          <div className="text-xl">Score: {score}</div>
          <div className="text-xl">Time: {timeLeft}s</div>
        </div>
        
        {!gameActive && timeLeft !== 30 && (
          <div className="mb-6 text-2xl">
            Game Over! Final Score: {score}
          </div>
        )}
        
        {gameActive ? (
          <div 
            className="relative w-full h-64 border border-[#00ff00]/50 rounded bg-black/50 mb-6"
          >
            <div
              className="absolute w-10 h-10 bg-[#00ff00] rounded-full cursor-pointer glow"
              style={{ 
                left: `${targetPosition.x}%`, 
                top: `${targetPosition.y}%`, 
                transform: 'translate(-50%, -50%)' 
              }}
              onClick={moveTarget}
            />
          </div>
        ) : (
          <div className="mb-6">
            <p className="mb-4">
              Click the green targets as quickly as possible! You have 30 seconds.
            </p>
            <Button 
              onClick={startGame}
              className="bg-[#00ff00] text-black hover:bg-[#00ff00]/80"
            >
              {timeLeft === 30 ? "Start Game" : "Play Again"}
            </Button>
          </div>
        )}
        
        <div className="mt-6">
          <Button variant="outline" className="text-white border-[#00ff00] hover:bg-[#00ff00]/20">
            <Link to="/" state={{ fromPage: "game" }}>Back to Home</Link>
          </Button>
        </div>
      </TiltCard>
    </div>
  );
};

export default Game;
