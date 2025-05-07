
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import RainEffect from "@/components/RainEffect";
import useSparkleEffect from "@/hooks/useSparkleEffect";
import TiltCard from "@/components/TiltCard";
import { HomeIcon } from "lucide-react";
import Navigation from "@/components/Navigation";
import AudioPlayer from "@/components/AudioPlayer";
import { useAudio } from "@/contexts/AudioContext";

const Game = () => {
  useSparkleEffect();
  const audio = useAudio();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    randomizePosition();
  };

  const randomizePosition = () => {
    if (!gameAreaRef.current) return;
    
    const gameArea = gameAreaRef.current.getBoundingClientRect();
    const circleSize = 48; // size of the circle (12px * 2) + some margin
    
    // Calculate valid boundaries
    const maxX = gameArea.width - circleSize;
    const maxY = gameArea.height - circleSize;
    
    setPosition({
      x: Math.max(circleSize, Math.floor(Math.random() * maxX)),
      y: Math.max(circleSize, Math.floor(Math.random() * maxY))
    });
  };

  const handleClick = () => {
    setScore(score + 1);
    randomizePosition();
  };

  useEffect(() => {
    if (!gameActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setGameActive(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white relative overflow-hidden">
      <RainEffect />
      <Navigation />
      <AudioPlayer
        isMuted={audio.volume === 0}
        volume={audio.volume}
        onMute={audio.handleMute}
        onVolumeChange={audio.setVolume}
      />

      <div className="flex flex-col items-center max-w-3xl w-full px-4">
        <TiltCard className="relative z-10 text-center p-8 border-2 border-[#00ff00]/50 rounded-lg bg-black/30 backdrop-blur-sm w-full">
          <h1 className="text-4xl font-bold mb-4 text-[#00ff00] glow">Click Game</h1>
          
          <div className="mb-8">
            <p className="text-[#00ff00]/90 text-lg mb-4">
              Click the green circle as many times as you can in 30 seconds!
            </p>
            
            {gameActive ? (
              <div className="flex justify-between mb-4">
                <p className="text-[#00ff00] font-bold">Score: {score}</p>
                <p className="text-[#00ff00] font-bold">Time: {timeLeft}s</p>
              </div>
            ) : (
              <button 
                onClick={startGame} 
                className="bg-black/50 border-2 border-[#00ff00]/50 text-[#00ff00] px-6 py-3 rounded-lg hover:bg-[#00ff00]/10 transition-all"
              >
                {score > 0 ? 'Play Again' : 'Start Game'}
              </button>
            )}
          </div>
          
          {gameActive && (
            <div 
              ref={gameAreaRef}
              className="relative h-[300px] w-full border border-[#00ff00]/30 bg-black/20 rounded-lg overflow-hidden mb-4"
            >
              <div 
                className="absolute w-12 h-12 bg-[#00ff00]/80 rounded-full cursor-pointer hover:bg-[#00ff00] transition-all glow"
                style={{
                  left: `${position.x}px`,
                  top: `${position.y}px`
                }}
                onClick={handleClick}
              />
            </div>
          )}
          
          {!gameActive && score > 0 && (
            <div className="mb-4 p-4 border border-[#00ff00]/30 bg-black/40 rounded-lg">
              <p className="text-[#00ff00] font-bold text-xl">Final Score: {score}</p>
              <p className="text-[#00ff00]/70">
                {score < 10 ? 'Keep practicing!' : score < 20 ? 'Good job!' : 'Amazing!'}
              </p>
            </div>
          )}

          <Link 
            to="/" 
            state={{ entered: true }}
            className="inline-flex items-center gap-2 bg-black/50 border-2 border-[#00ff00]/50 text-[#00ff00] px-6 py-3 rounded-lg hover:bg-[#00ff00]/10 transition-all"
          >
            <HomeIcon size={18} />
            Back to Home
          </Link>
        </TiltCard>
      </div>
    </div>
  );
};

export default Game;
