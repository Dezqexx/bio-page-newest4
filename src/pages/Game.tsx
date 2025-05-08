
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackgroundVideo from "@/components/BackgroundVideo";
import RainEffect from "@/components/RainEffect";
import MusicPlayer from "@/components/MusicPlayer";
import { useAudio } from "@/context/AudioContext";
import AudioPlayer from "@/components/AudioPlayer";

type Player = {
  name: string;
  score: number;
  date: string;
};

const Game = () => {
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [playerName, setPlayerName] = useState("");
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const targetsRef = useRef<HTMLDivElement[]>([]);
  const audio = useAudio();

  // Initialize leaderboard from localStorage
  useEffect(() => {
    const savedLeaderboard = localStorage.getItem("shootingGameLeaderboard");
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard));
    }
  }, []);

  // Game timer
  useEffect(() => {
    let timer: number;
    
    if (gameActive && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameActive) {
      endGame();
    }

    return () => {
      clearInterval(timer);
    };
  }, [gameActive, timeLeft]);

  // Target spawning
  useEffect(() => {
    let spawnInterval: number;
    
    if (gameActive) {
      spawnInterval = window.setInterval(() => {
        spawnTarget();
      }, 1000);
    }

    return () => {
      clearInterval(spawnInterval);
    };
  }, [gameActive]);

  const startGame = () => {
    setGameActive(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(60);
    targetsRef.current = [];
    toast("Game started! Shoot the green balls!");
  };

  const endGame = () => {
    setGameActive(false);
    setGameOver(true);
    toast(`Game over! Your score: ${score}`);
  };

  const spawnTarget = () => {
    if (!gameAreaRef.current) return;
    
    const gameArea = gameAreaRef.current;
    const target = document.createElement("div");
    
    const size = Math.floor(Math.random() * 30) + 30; // 30-60px
    const maxX = gameArea.clientWidth - size;
    const maxY = gameArea.clientHeight - size;
    
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    target.style.position = "absolute";
    target.style.left = `${randomX}px`;
    target.style.top = `${randomY}px`;
    target.style.width = `${size}px`;
    target.style.height = `${size}px`;
    target.style.borderRadius = "50%";
    target.style.background = "#00ff00";
    target.style.boxShadow = "0 0 10px #00ff00, 0 0 20px #00ff00";
    target.style.cursor = "pointer";
    target.style.zIndex = "10";
    target.style.transition = "transform 0.1s, opacity 0.1s";
    
    target.onclick = (e) => {
      e.stopPropagation();
      handleTargetHit(target);
    };
    
    gameArea.appendChild(target);
    targetsRef.current.push(target);
    
    // Remove target after some time if not clicked
    setTimeout(() => {
      if (gameArea.contains(target)) {
        gameArea.removeChild(target);
        targetsRef.current = targetsRef.current.filter(t => t !== target);
      }
    }, 2000);
  };

  const handleTargetHit = (target: HTMLDivElement) => {
    if (!gameAreaRef.current) return;
    
    setScore(prev => prev + 1);
    
    // Visual feedback
    target.style.transform = "scale(1.5)";
    target.style.opacity = "0";
    
    setTimeout(() => {
      if (gameAreaRef.current && gameAreaRef.current.contains(target)) {
        gameAreaRef.current.removeChild(target);
        targetsRef.current = targetsRef.current.filter(t => t !== target);
      }
    }, 100);
  };

  const saveScore = () => {
    if (!playerName.trim()) {
      toast.error("Please enter your name!");
      return;
    }
    
    const newPlayer: Player = {
      name: playerName,
      score: score,
      date: new Date().toLocaleDateString()
    };
    
    const updatedLeaderboard = [...leaderboard, newPlayer]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Keep only top 10
    
    setLeaderboard(updatedLeaderboard);
    localStorage.setItem("shootingGameLeaderboard", JSON.stringify(updatedLeaderboard));
    
    toast.success("Score saved to leaderboard!");
    setGameOver(false);
    setPlayerName("");
  };

  const handleGameAreaClick = () => {
    if (!gameActive && !gameOver) {
      startGame();
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-white relative overflow-hidden">
      <BackgroundVideo videoUrl="/your-video.mp4" />
      <RainEffect />
      
      <AudioPlayer
        isMuted={audio.volume === 0}
        volume={audio.volume}
        onMute={() => audio.setVolume(audio.volume === 0 ? 1 : 0)}
        onVolumeChange={audio.setVolume}
      />
      
      <div className="container mx-auto flex flex-col items-center justify-center py-8 z-10 relative">
        <h1 className="text-4xl font-bold mb-6 text-[#00ff00] glow">Neon Shooter</h1>
        
        <div className="w-full max-w-3xl">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg">
              <span className="text-[#00ff00]">Score: </span>
              <span>{score}</span>
            </div>
            <div className="text-lg">
              <span className="text-[#00ff00]">Time: </span>
              <span>{timeLeft}s</span>
            </div>
          </div>
          
          {!gameActive && !gameOver && (
            <div className="text-center mb-8">
              <Button 
                onClick={startGame} 
                className="bg-[#00ff00] hover:bg-[#00cc00] text-black text-xl px-8 py-6"
              >
                Start Game
              </Button>
              <p className="mt-4 text-sm opacity-80">Click on the green balls to score points! You have 60 seconds.</p>
            </div>
          )}
          
          {gameOver && (
            <div className="bg-black/60 backdrop-blur-sm p-6 rounded-lg border border-[#00ff00]/50 mb-6">
              <h2 className="text-2xl font-bold text-[#00ff00] mb-4">Game Over!</h2>
              <p className="text-xl mb-4">Your score: <span className="text-[#00ff00] font-bold">{score}</span></p>
              <div className="flex gap-2">
                <Input
                  className="border-[#00ff00]/50 bg-black/50"
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
                <Button 
                  onClick={saveScore}
                  className="bg-[#00ff00] hover:bg-[#00cc00] text-black"
                >
                  Save Score
                </Button>
              </div>
            </div>
          )}
          
          <div
            ref={gameAreaRef}
            onClick={handleGameAreaClick}
            className={`relative w-full h-[400px] border-2 ${
              gameActive ? "border-[#00ff00]" : "border-[#00ff00]/30"
            } rounded-lg overflow-hidden mb-6 ${
              gameActive ? "bg-black/40" : "bg-black/20"
            } backdrop-blur-sm cursor-pointer`}
          >
            {!gameActive && !gameOver && (
              <div className="absolute inset-0 flex items-center justify-center text-[#00ff00]/70 text-xl">
                Click Start to play
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-6 justify-between">
            <Card className="border-[#00ff00]/30 bg-black/40 backdrop-blur-sm flex-1 min-w-[320px]">
              <CardHeader>
                <CardTitle className="text-[#00ff00]">Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                {leaderboard.length > 0 ? (
                  <div className="space-y-2">
                    {leaderboard.map((player, index) => (
                      <div 
                        key={`${player.name}-${index}`}
                        className="flex justify-between items-center p-2 rounded-md bg-black/50 border border-[#00ff00]/20"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[#00ff00] font-bold">{index + 1}</span>
                          <span className="text-[#00ff00]">{player.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[#00ff00] font-bold">{player.score}</span>
                          <span className="text-xs text-[#00ff00]">{player.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-white/60">No scores yet. Be the first!</p>
                )}
              </CardContent>
            </Card>
            
            <Card className="border-[#00ff00]/30 bg-black/40 backdrop-blur-sm flex-1 min-w-[320px]">
              <CardHeader>
                <CardTitle className="text-[#00ff00]">Music Player</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <MusicPlayer
                  song={audio.song}
                  isPlaying={audio.isPlaying}
                  onPlayPause={audio.togglePlay}
                  onSkipBack={audio.handleSkipBack}
                  onSkipForward={audio.handleSkipForward}
                  progress={audio.progress}
                  currentTime={audio.currentTime}
                  duration={audio.duration}
                  onSeek={audio.handleSeek}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
